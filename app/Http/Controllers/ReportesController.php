<?php

namespace App\Http\Controllers;

use App\Models\{Comercios, Cfempleados, Cfmaestra, Adcitas};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB,Auth};
use Carbon\Carbon;

class ReportesController extends Controller
{
    
    public function index(Request $request)
    {
        return Inertia::render('reportes/index');
    }

    public function empleados(Request $request)
    {
        $userAuth = Auth::user();
        $comercio = Comercios::where('persona_id', $userAuth->persona_id)->first();

        $fecha_inicio = $request->fecha_inicio ?? now()->startOfMonth()->format('Y-m-d');
        $fecha_fin = $request->fecha_fin ?? now()->format('Y-m-d');
        $empleado_id = $request->empleado_id;
        $estado_cita_id = $request->estado_cita_id;

        // 1. Filtro de estados para el Select
        $estadosCitas = Cfmaestra::where('padre', Cfmaestra::where('codigo', 'LIS_ESTADOSCITAS')->value('id'))
            ->orderBy('nombre')
            ->pluck('nombre', 'id')
            ->prepend('Todos los estados', '');

        $reporte = Cfempleados::with([
            'persona.personasnaturales',
            'detallescitas' => function($query) use ($fecha_inicio, $fecha_fin, $estado_cita_id) {
                $query->whereHas('cita', function($q) use ($fecha_inicio, $fecha_fin, $estado_cita_id) {
                    $q->whereBetween('fecha', [$fecha_inicio, $fecha_fin]);
                    if ($estado_cita_id) $q->where('estado_id', $estado_cita_id);
                })
                ->with(['cita.cliente.persona.personasnaturales', 'cita.estado', 'cita.factura.pagos', 'empleadoservicio.servicio']);
            }
        ])
        ->where('comercio_id', $comercio->id)
        ->when($empleado_id, fn($q) => $q->where('id', $empleado_id))
        ->get()
        ->map(function($empleado) {
            $detallesProcesados = $empleado->detallescitas->map(function($det) {
                $totalPagado = $det->cita->factura ? collect($det->cita->factura->pagos)->sum('total') : 0;
                $porcentajeComision = $det->empleadoservicio->comision ?? 0;
                $comisionCalculada = ($totalPagado * $porcentajeComision) / 100;

                return [
                    'id' => $det->id,
                    'codigo' => $det->cita->codigo,
                    'fecha' => $det->cita->fecha,
                    'hora' => $det->cita->horainicio, // Nueva columna: Hora
                    'cliente_nombre' => $det->cita->cliente->persona->personasnaturales->nombrecompleto,
                    'cliente_tel' => $det->cita->cliente->persona->telefonomovil, // Nueva columna: Datos cliente
                    'servicio' => $det->empleadoservicio->servicio->nombre,
                    'estado_nombre' => $det->cita->estado->nombre,
                    'estado_color' => $det->cita->estado->observacion, 
                    'valor_servicio' => $det->preciofinal,
                    'total_pagado' => $totalPagado,
                    'comision_pactada' => $porcentajeComision,
                    'comision_valor' => $comisionCalculada
                ];
            });

            return [
                'id' => $empleado->id,
                'nombre' => $empleado->persona->personasnaturales->nombrecompleto,
                'total_servicios' => $detallesProcesados->count(),
                'suma_recaudado' => $detallesProcesados->sum('total_pagado'),
                'suma_comisiones' => $detallesProcesados->sum('comision_valor'),
                'servicios' => $detallesProcesados
            ];
        });

        return Inertia::render('reportes/empleados/index', [
            'reporte' => $reporte,
            'empleados' => Cfempleados::where('comercio_id', $comercio->id)->get()->map(fn($e) => ['id' => $e->id, 'name' => $e->persona->personasnaturales->nombrecompleto]),
            'estadosList' => $estadosCitas,
            'filtros' => $request->all(['fecha_inicio', 'fecha_fin', 'empleado_id', 'estado_cita_id'])
        ]);
    }

    public function citas(Request $request)
    {
        $userAuth = Auth::user();
        $comercio = Comercios::where('persona_id', $userAuth->persona_id)->first();
        $comercio_id = $comercio->id;

        // Captura de filtros vía GET (con valores por defecto)
        $fecha_inicio = $request->input('fecha_inicio', now()->startOfMonth()->format('Y-m-d'));
        $fecha_fin = $request->input('fecha_fin', now()->format('Y-m-d'));

        // 1. Consulta de Citas filtrando por comercio_id en la relación Cliente
        // Se incluyen las relaciones necesarias para métricas y fidelización
        $citas = Adcitas::with(['estado', 'cliente.persona.personasnaturales', 'factura.pagos'])
            ->whereHas('cliente', function($query) use ($comercio_id) {
                $query->where('comercio_id', $comercio_id);
            })
            ->whereBetween('fecha', [$fecha_inicio, $fecha_fin])
            ->get();

        // 2. Métricas de Conversión
        $metricas = [
            'total' => $citas->count(),
            'efectivas' => $citas->where('estado.codigo', 'AS')->count(), // Asistidas
            'no_show' => $citas->where('estado.codigo', 'AC')->count(),    // No asistió
            'canceladas' => $citas->whereIn('estado.codigo', ['CA', 'RE'])->count(), // Canceladas/Pospuestas
        ];

        // 3. Origen basado en la columna 'device' (Lógica: TM*, QR* o NULL)
        $origenes = [
            'WhatsApp / Otros' => $citas->filter(fn($c) => is_null($c->device))->count(),
            'Manual (Terminal)' => $citas->filter(fn($c) => !is_null($c->device) && str_starts_with($c->device, 'AG'))->count(),
            'Código QR' => $citas->filter(fn($c) => !is_null($c->device) && str_starts_with($c->device, 'QR'))->count(),
        ];

        // 4. Clientes más Recurrentes (Top 5)
        $topClientes = $citas->where('estado.codigo', 'AS')
            ->groupBy('cliente_id')
            ->map(function($grupo) {
                $cliente = $grupo->first()->cliente;
                $persona = $cliente->persona;
                
                return [
                    'nombre' => $persona->personasnaturales->nombrecompleto ?? $persona->razonsocial ?? 'Cliente Sin Nombre',
                    'telefono' => $persona->telefonomovil ?? 'Sin Teléfono',
                    'visitas' => $grupo->count(),
                    'total_invertido' => $grupo->sum(function($cita) {
                        return $cita->factura ? collect($cita->factura->pagos)->sum('total') : 0;
                    })
                ];
            })
            ->sortByDesc('visitas')
            ->take(5)
            ->values();

        // 5. Generación de datos para el Heatmap
        $heatmapData = $this->generateHeatmapData($citas);

        return Inertia::render('reportes/citas/index', [
            'metricas' => $metricas,
            'origenes' => $origenes,
            'heatmapData' => $heatmapData,
            'topClientes' => $topClientes,
            'filtros' => [
                'fecha_inicio' => $fecha_inicio,
                'fecha_fin' => $fecha_fin
            ]
        ]);
    }

    private function generateHeatmapData($citas)
    {
        $heatmapData = [];
        $diasSemana = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
        
        foreach($diasSemana as $index => $dia) {
            for($h = 8; $h <= 20; $h++) { 
                $horaStr = str_pad($h, 2, "0", STR_PAD_LEFT) . ":00";
                
                $conteo = $citas->filter(function($cita) use ($index, $h) {
                    $fecha = Carbon::parse($cita->fecha);
                    $horaCita = intval(explode(':', $cita->horainicio)[0]);
                    // Ajuste de dayOfWeek (Carbon 0 es Domingo, lo pasamos a 6)
                    $diaIndex = $fecha->dayOfWeek == 0 ? 6 : $fecha->dayOfWeek - 1;
                    return $diaIndex == $index && $horaCita == $h;
                })->count();

                $heatmapData[] = [
                    'dia' => $dia,
                    'hora' => $horaStr,
                    'valor' => $conteo
                ];
            }
        }
        return $heatmapData;
    }
}

?>