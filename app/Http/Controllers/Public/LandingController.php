<?php
namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\{Comercios, Productos, Adcitas, Adresenas, Cfempleados};
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
                'empleadosasignados.persona.personasnaturales',
                'empleadosasignados.persona.soportes' => function($q) {
                    $q->where('tipo_id', 1)->where('predeterminado', 1);
                },
                'empleadosasignados' => function($query) {
                    $query->where('cfempleados.estado_id', 850) // Empleado activo
                        // Usamos una subconsulta manual para calcular el promedio exacto pasando por toda la cadena
                        ->select('cfempleados.*') // Aseguramos traer los campos del empleado
                        ->selectRaw('(
                            SELECT ROUND(AVG(r.estrellas),2)
                            FROM adresenas r
                            INNER JOIN ftdetalles d ON d.id = r.detalle_id
                            INNER JOIN cfempleadosservicios es ON es.id = d.model_type_id
                            WHERE es.empleado_id = cfempleados.id
                            AND r.fecha IS NOT NULL
                        ) as promedio_estrellas');
                },
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
                        'servicioasignado_id' => $emp->pivot->id,
                        'id' => $emp->id,
                        'nombre' => $emp->persona->personasnaturales->nombres . ' ' . $emp->persona->personasnaturales->apellidos,
                        'avatar' => $emp->persona->soportes->first()->ruta ?? null, // Foto del empleado
                        'calificacion' => $emp->promedio_estrellas ? number_format($emp->promedio_estrellas, 1, '.', '') : '0.0',
                        'precio' => $emp->pivot->preciopersonalizado ?: $servicio->preciosalida,
                        'duracion' => $emp->pivot->duracionpersonalizado ?: $servicio->duracion,
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

    public function appointments(Request $request)
    {
        $token = $request->query('token');
        $empleado = $request->query('empleado');
        // 0. Buscamos el comercio y sus sedes
        $comercio = Comercios::with(['sedes'])->where('token', $token)->firstOrFail();

        // Cargamos el empleado con todas sus relaciones anidadas
        $cfempleados = Cfempleados::with([
            'persona.personasnaturales', 
            // Cargamos los servicios con sus datos de la tabla pivote
          
            'detallescitas.cita.cliente.persona.personasnaturales', // Para el nombre del cliente'
            'detallescitas.cita' => function($query) {
                // Traemos la relación 'estado' dentro de citas para obtener el nombre
                $query->with('estado')->orderBy('estado_id', 'asc');
            },
            'detallescitas.empleadoservicio.servicio', // Para el nombre del servicio
        ])->findOrFail($empleado);

        return Inertia::render('appointments', [
            'comercio' => $comercio,
            'citas' => $cfempleados
        ]);
    }

    public function facturations(Request $request)
    {
        $token = $request->query('token');
        $empleado = $request->query('empleado');
        $request['empleado_id'] = $empleado;
        $request['token'] = $token;
        // Si no vienen fechas, le asignamos "hoy" por defecto antes de consultar
        $fechaHoy = now()->format('Y-m-d');
        $request->merge([
            'fecha_inicio' => $request->query('fecha_inicio', $fechaHoy),
            'fecha_fin' => $request->query('fecha_fin', $fechaHoy),
            'empleado_id' => $empleado
        ]);

        // 0. Buscamos el comercio y sus sedes
        $comercio = Comercios::with(['sedes'])->where('token', $token)->firstOrFail();
        $data = Cfempleados::productividad($request);

        return Inertia::render('facturations', [
            'reporte' => $data['reporte'],
            'comercio' => $comercio,
            'filtros' => [
                'fecha_inicio' => $request->fecha_inicio,
                'fecha_fin' => $request->fecha_fin,
            ]
        ]);
    }

    public function qualify(Request $request)
    {
        // 1. Obtener el token de la URL
        $token = $request->query('service');
        
        if (!$token) {
            abort(404, 'Enlace no válido');
        }

        // 2. Buscar la calificación con sus relaciones
        $calificacion = Adresenas::with([
            'detalle.empleadoservicio.servicio',
            'detalle.empleadoservicio.empleado.persona.personasnaturales',
            'detalle.empleadoservicio.empleado.persona.soportes' => function($q) {
                $q->where('tipo_id', 1)->where('predeterminado', 1);
            },
        ])
        ->where('token', $token)
        ->first();

        if (!$calificacion) {
            abort(404, 'Enlace no válido');
        }

        // --- LOGICA DE PROTECCIÓN CORREGIDA ---
        // Si no existe, es un error inmediato.
        // Si ya tiene fecha, PERO en la sesión NO hay un mensaje de "success" (recién guardado), entonces expiró.
        if (!$calificacion || ($calificacion->fecha !== null && !session('success'))) {
            
            $comercioId = $calificacion->detalle?->empleadoservicio?->empleado?->comercio_id ?? null;
            $comercio = $comercioId 
                ? Comercios::with(['sedes'])->find($comercioId) 
                : null; 

            return Inertia::render('qualify', [
                'comercio' => $comercio, 
                'error' => 'Este enlace de calificación ya expiró, no es válido o ya fue utilizado.'
            ]);
        }

        // 3. Obtener el comercio de forma segura
        $comercioId = $calificacion->detalle?->empleadoservicio?->empleado?->comercio_id;
        if (!$comercioId) {
            abort(404, 'Comercio no asociado a este servicio.');
        }
        
        $comercio = Comercios::with(['sedes'])->findOrFail($comercioId);

        // 5. Retornar a la vista (si session('success') existe, React activará "wasSuccessful")
        return Inertia::render('qualify', [
            'calificacion' => $calificacion,
            'comercio' => $comercio,
        ]);
    }

    public function saveQualify(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'estrellas' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500'
        ]);

        $calificacion = Adresenas::where('token', $request->token)
            ->whereNull('fecha')
            ->firstOrFail();

        // Actualizamos el registro con los datos reales enviados por el cliente
        $calificacion->update([
            'estrellas' => $request->estrellas,
            'comentario' => $request->comentario,
            'fecha' => now()
        ]);

        // Redirige correctamente usando el parámetro 'service' que espera tu GET
        return redirect()->route('public.qualify', ['service' => $request->token])
            ->with('success', '¡Muchas gracias! Tu opinión nos ayuda a mejorar.');
    }
}
?>