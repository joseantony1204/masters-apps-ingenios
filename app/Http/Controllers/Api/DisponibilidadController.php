<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Cfempleados,Productos, Comercios};
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB};

class DisponibilidadController extends Controller
{
    public function generarTurnos($token, Request $request)
    {
        
        // 1. Validación obligatoria
        if (!$token) {
            abort(404, 'Token no proporcionado');
        }
        // 2. Tu lógica para buscar el comercio y los turnos
        $comercio = Comercios::with(['sedes'])->where('token', $token)->firstOrFail();
        if (!$comercio) {
            abort(404, 'Comercio no encontrado');
        }
        
        $servicioFiltroId = $request->get('servicio');
        $empleadoFiltroId = $request->get('empleado');
        $fechaFiltro = $request->get('fecha', Carbon::now('America/Bogota')->format('Y-m-d'));

        $timezone = 'America/Bogota';
        $ahora = Carbon::now($timezone);
        $fechaFin = Carbon::now($timezone)->addDays(7);

        if (!$empleadoFiltroId) {
            return response()->json(['error' => 'El parametro empleado es requerido'], 401);
        }
        
        // Disponibilidad de UN empleado específico
        $empleado = Cfempleados::with(['horarios', 'bloqueos', 'detallescitas.cita', 'serviciosasignados'])
            ->where('comercio_id', $comercio->id)
            ->findOrFail($empleadoFiltroId);
        
        // Filtramos los servicios que el empleado puede realizar
        $serviciosDisponibles = $empleado->serviciosasignados
            ->when($servicioFiltroId, function($query) use ($servicioFiltroId) {
                return $query->where('id', $servicioFiltroId);
            })
            ->map(function($es) {
                return [
                    'servicioasignado_id' => $es->pivot->id,
                    'id' => $es->id,
                    'nombre' => $es->nombre,
                    'duracion' => (int) ($es->pivot->duracionpersonalizado ?? 30),
                    'precio' => (int) ($es->pivot->preciopersonalizado ?? 0),
                ];
        });

        $disponibilidad = [];
        $periodo = CarbonPeriod::create($ahora->copy()->startOfDay(), $fechaFin->endOfDay());

        foreach ($periodo as $fecha) {
            $diaSemana = $this->mapearDia($fecha->dayOfWeek);
            $horarioDia = $empleado->horarios->where('dia_id', $diaSemana)->first();
            
            if (!$horarioDia || (int)$horarioDia->estado !== 1) continue;

            $turnosDelDia = [];
            $inicioJornada = Carbon::parse($fecha->format('Y-m-d') . ' ' . $horarioDia->horainicio, $timezone);
            $finJornada = Carbon::parse($fecha->format('Y-m-d') . ' ' . $horarioDia->horafinal, $timezone);

            $cursor = $inicioJornada->copy();
            
            // Si es hoy, empezamos desde "ahora" redondeado a los próximos 15 min
            if ($cursor->isToday() && $cursor->lt($ahora)) {
                $minutes = ceil($ahora->minute / 15) * 15;
                $cursor = $ahora->copy()->minute($minutes)->second(0);
                if ($minutes == 60) $cursor->addHour()->minute(0);
            }

            while ($cursor->copy()->addMinutes(15) <= $finJornada) {
                $opcionesEnEstePunto = [];

                foreach ($serviciosDisponibles as $servicio) {
                    $inicioPropuesto = $cursor->copy();
                    $finPropuesto = $cursor->copy()->addMinutes($servicio['duracion']);

                    // VALIDACIÓN CRÍTICA: ¿El bloque completo está libre?
                    if ($finPropuesto <= $finJornada && !$this->estaOcupado($empleado, $fecha->format('Y-m-d'), $inicioPropuesto, $finPropuesto, $timezone)) {
                        $opcionesEnEstePunto[] = [
                            'servicioasignado_id' => $servicio['servicioasignado_id'],
                            'servicio_id' => $servicio['id'],
                            'nombre' => $servicio['nombre'],
                            'duracion' => $servicio['duracion'],
                            'horainicio' => $inicioPropuesto->format('H:i'),
                            'horafinal' => $inicioPropuesto->addMinutes($servicio['duracion'])->format('H:i'),
                            'precio' => $servicio['precio'],
                        ];
                    }
                }

                if (!empty($opcionesEnEstePunto)) {
                    $turnosDelDia[] = [
                        'hora' => $cursor->format('H:i'),
                        'servicios_que_caben' => $opcionesEnEstePunto
                    ];
                }
                
                $cursor->addMinutes(15); 
            }

            if (!empty($turnosDelDia)) {
                $disponibilidad[$fecha->format('Y-m-d')] = $turnosDelDia;
            }
        }

        return response()->json($disponibilidad);
    }

    private function estaOcupado($empleado, $fecha, $inicio, $fin, $timezone)
    {
        // 1. Check Bloqueos
        if ($empleado->bloqueos) {
            foreach ($empleado->bloqueos as $bloqueo) {
                if ($bloqueo->fecha == $fecha) {
                    if ($this->hayTraslape($inicio, $fin, $bloqueo->horainicio, $bloqueo->horafinal, $timezone)) return true;
                }
            }
        }

        // 2. Check Citas (Validación de bloque completo)
        if ($empleado->detallescitas) {
            foreach ($empleado->detallescitas as $detalle) {
                if ($detalle->cita && $detalle->cita->fecha == $fecha) {

                    // --- AJUSTE AQUÍ ---
                    // Solo consideramos que el tiempo está ocupado si la cita NO está cancelada (916) 
                    // y NO está reprogramada (917).
                    $estadoId = $detalle->cita->estado->id;
                    if ($estadoId == 916 || $estadoId == 917) {
                        continue; // Ignoramos esta cita y pasamos a la siguiente
                    }

                    // Si el turno que queremos generar choca con cualquier parte de la cita existente
                    if ($this->hayTraslape($inicio, $fin, $detalle->cita->horainicio, $detalle->cita->horafinal, $timezone)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private function hayTraslape($inicioNuevo, $finNuevo, $inicioExistenteStr, $finExistenteStr, $timezone)
    {
        $inicioExistente = Carbon::parse($inicioNuevo->format('Y-m-d') . ' ' . $inicioExistenteStr, $timezone);
        $finExistente = Carbon::parse($inicioNuevo->format('Y-m-d') . ' ' . $finExistenteStr, $timezone);
        
        // Lógica de colisión: 
        // Un turno choca si empieza antes de que termine el otro Y termina después de que empiece el otro.
        return $inicioNuevo->lt($finExistente) && $finNuevo->gt($inicioExistente);
    }

    private function mapearDia($dayOfWeek) {
        $map = [1 => 896, 2 => 897, 3 => 898, 4 => 899, 5 => 900, 6 => 901, 0 => 902];
        return $map[$dayOfWeek];
    }

    public function servicios(Request $request)
    {
        $user = Auth::user();
        $comercio = Comercios::with('sedes')->where('persona_id', $user->persona_id)->first();

        $sedesIds = $comercio->sedes()
        ->pluck('cfsedes.id')
        ->toArray();

        $servicios = Productos::with(['empleadosasignados',])
        ->where('estado_id', 858)
        ->whereIn('sede_id', $sedesIds)
        ->whereHas('empleadosasignados', function($q) {
            $q->where('cfempleados.estado_id', 850); // Filtro: Empleado activo
        })  
        ->get()
        ->map(function($servicio) {
            return [
                'id' => $servicio->id,
                'nombre' => $servicio->nombre,
                'preciobase' => $servicio->preciosalida,
                'duracion' => $servicio->duracion,
                // Mapeamos los empleados para que el Front los pinte fácil
                'asignaciones' => $servicio->empleadosasignados->map(fn($emp) => [
                    'empleado_id' => $emp->id,
                    'nombre' => $emp->persona->personasnaturales->nombres . ' ' . $emp->persona->personasnaturales->apellidos,
                    'avatar' => $emp->persona->foto,
                    'preciopersonalizado' => $emp->pivot->preciopersonalizado ?: $servicio->duracion,
                    'duracionpersonalizado' => $emp->pivot->duracionpersonalizado ?: $servicio->duracion
                ])
            ];
        });

        return response()->json($servicios);
    }
}