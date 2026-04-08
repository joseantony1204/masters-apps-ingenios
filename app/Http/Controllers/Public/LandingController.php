<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\{Comercios, Productos, Adcitas};
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingController extends Controller
{
    public function index(Request $request)
    {
        $token = $request->query('token');

        if (!$token) abort(404, 'Enlace no válido');

        // 1. Buscamos el comercio y sus sedes
        $comercio = Comercios::with(['sedes'])->where('token', $token)->firstOrFail();

        $sedesIds = $comercio->sedes->pluck('id')->toArray();

        // 2. Cargamos los servicios con la lógica de empleados asignados que ya tienes
        // Nota: He cambiado 'Productos' por el modelo que uses para servicios, asumiendo que es el mismo
        $servicios = Productos::with([
                'categoria', 
                'empleadosasignados.persona.personasnaturales'
            ])
            ->where('estado_id', 858) // Activo
            ->where('tipo_id', '<>', 854) // No es producto/bebida
            ->whereIn('sede_id', $sedesIds)
            ->whereHas('empleadosasignados', function($q) {
                $q->where('cfempleados.estado_id', 850); // Empleado activo
            })
            ->get()
            ->map(function($servicio) {
                return [
                    'id' => $servicio->id,
                    'nombre' => $servicio->nombre,
                    'preciobase' => $servicio->preciosalida,
                    'duracion' => $servicio->duracion,
                    'categoria_id' => $servicio->categoria_id,
                    'categoria' => $servicio->categoria,
                    // Mapeamos los empleados asignados a este servicio específico
                    'empleados' => $servicio->empleadosasignados->map(fn($emp) => [
                        'id' => $emp->id,
                        'nombre' => $emp->persona->personasnaturales->nombres . ' ' . $emp->persona->personasnaturales->apellidos,
                        'avatar' => $emp->persona->foto,
                        'precio' => $emp->pivot->preciopersonalizado ?: $servicio->preciosalida,
                        'duracion' => $emp->pivot->duracionpersonalizado ?: $servicio->duracion
                    ])
                ];
            });

        return Inertia::render('landing', [
            'comercio' => $comercio,
            'servicios' => $servicios,
        ]);
    }
    public function confirmada(Request $request)
    {
        $token = $request->query('token');
        // 0. Buscamos el comercio y sus sedes
        $comercio = Comercios::with(['sedes'])->where('token', $token)->firstOrFail();

        // 1. Cargamos la cita con la estructura exacta que mostraste en el JSON
        $cita = Adcitas::with([
            'detalle_con_empleadoservicio.empleadoservicio.empleado.persona.personasnaturales',
            'detalle_con_empleadoservicio.empleadoservicio.servicio.sede', // Asumiendo que existe relación con el nombre del servicio
        ])->where('codigo',$request->codigo)->first();

        // 2. Extraemos el primer detalle para sacar la info del empleado
        $primerDetalle = $cita->detalle_con_empleadoservicio->first();
        $personaEmpleado = $primerDetalle->empleadoservicio->empleado->persona->personasnaturales ?? null;

        // 3. Formateamos el resumen para React
        $resumen = [
            'id' => $cita->id,
            'codigo' => $cita->codigo,
            'fecha' => \Carbon\Carbon::parse($cita->fecha)->locale('es')->isoFormat('dddd D [de] MMMM'),
            'hora' => \Carbon\Carbon::parse($cita->horainicio)->format('h:i A'),
            'duracion' => $cita->detalle_con_empleadoservicio->sum(fn($d) => (int)$d->empleadoservicio->duracionpersonalizado),
            'total' => '$' . number_format($cita->detalle_con_empleadoservicio->sum('preciofinal'), 0, ',', '.'),
            
            'empleado' => [
                'nombre' => $personaEmpleado ? $personaEmpleado->nombreapellido : 'Especialista',
                'avatar_url' => $primerDetalle->empleadoservicio->empleado->persona->foto ?? null
            ],
            'servicio' => $cita->detalle_con_empleadoservicio->map(fn($d) => [
                'id' => $d->id,
                'nombre' => $d->empleadoservicio->servicio->nombre, 
                'duracion' => $d->empleadoservicio->duracionpersonalizado,
                'precio' => '$' . number_format($d->preciofinal, 0, ',', '.'),
            ]),
            'sede' => $cita->detalle_con_empleadoservicio->map(fn($d) => [
                'nombre' => $d->empleadoservicio->servicio->sede->nombre, 
                'direccion' => $d->empleadoservicio->servicio->sede->direccion, 
                'ciudad' => $d->empleadoservicio->servicio->sede->ciudad, 
            ])
        ];

        return Inertia::render('confirmation', [
            'comercio' => $comercio,
            'cita' => $resumen
        ]);
       
    }
}
?>