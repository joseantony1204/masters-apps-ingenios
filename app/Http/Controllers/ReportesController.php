<?php

namespace App\Http\Controllers;

use App\Models\{Comercios, Cfempleados, Cfmaestra, Adcitas, User, Ftturnos};
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
        $comercio = Auth::user()->comercio;
        
        $user = User::where('persona_id',Auth::user()->persona_id)->first();
        // Usamos first() para tener el objeto directamente
        $sedePredeterminada = $user->sedes()
        ->with(['terminal'])
        ->where('comercio_id', $comercio->id)
        ->wherePivot('predeterminada', 1)
        ->first();

        //Consultar turnos abiertos filtrados por Sede y Comercio
        $turnosAbiertos = Ftturnos::with(['terminal.sede'])
        ->where('estado_id', 924) // 924 = ABIERTO
        ->whereHas('terminal', function ($query) use ($sedePredeterminada) {
            // Filtramos directamente por el ID de la sede que ya obtuvimos
            $query->where('sede_id', $sedePredeterminada->id);
        })
        ->whereHas('terminal.sede', function ($query) use ($comercio) {
            // Aseguramos que la sede pertenezca al comercio actual
            $query->where('comercio_id', $comercio->id);
        })
        ->orderBy('fechaapertura', 'DESC')
        ->get();
        //Definir el turno activo por defecto (el primero de la lista)
       $turnoActivo = $turnosAbiertos->where('persona_id', $user->persona_id)->first();
        
        // Llamamos al método del modelo
        $data = Cfempleados::productividad($request);

        // Si la petición viene de un filtro o API (espera JSON)
        if ($request->wantsJson()) {
            return response()->json($data);
        }

        // Si es la carga inicial de la página (Inertia)
        return Inertia::render('reportes/empleados/index', [
            'reporte' => $data['reporte'],
            'turnoActivo' => $turnoActivo,
            'filtros' => [
                'fecha_inicio' => $request->fecha_inicio,
                'fecha_fin' => $request->fecha_fin,
                'empleado_id' => $request->empleado_id,
            ],
            'empleados' => Cfempleados::where('comercio_id', $comercio->id)
                ->with('persona.personasnaturales')->get()
                ->map(fn($e) => ['id' => $e->id, 'name' => $e->persona->personasnaturales->nombrecompleto]),
        ]);
    }

    public function citas(Request $request)
    {
        $comercio = Auth::user()->comercio;
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
            'Manual (Terminal)' => $citas->filter(fn($c) => !is_null($c->device) && str_starts_with($c->device, 'AM'))->count(),
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