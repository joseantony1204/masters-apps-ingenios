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

    // 1. Normalizar filtros
    $fecha_inicio = $request->fecha_inicio ?? now()->startOfMonth()->format('Y-m-d');
    $fecha_fin = $request->fecha_fin ?? now()->format('Y-m-d');
    $empleado_id = $request->empleado_id;

    // 2. Consulta: Cargamos TODO para evitar que falten llaves foráneas (FK)
    $reporteRaw = Cfempleados::with([
        'persona.personasnaturales',
        'empleadosservicios.servicio',
        'empleadosservicios.detallesfactura' => function($q) use ($fecha_inicio, $fecha_fin) {
            // Filtramos detalles que tengan factura en el rango de fecha
            $q->whereHas('ftfactura', function($f) use ($fecha_inicio, $fecha_fin) {
                $f->whereDate('fecha', '>=', $fecha_inicio)
                  ->whereDate('fecha', '<=', $fecha_fin);
            });
        },
        'empleadosservicios.detallesfactura.factura_con_cita.cita.cliente.persona.personasnaturales',
        'empleadosservicios.detallesfactura.factura_sin_cita.persona.personasnaturales',
    ])
    ->where('comercio_id', $comercio->id)
    ->when($empleado_id, fn($q) => $q->where('id', $empleado_id))
    ->get();

    // 3. Mapeo para el Frontend (index.tsx)
    $reporteOptimizado = $reporteRaw->map(function($empleado) {
        $todosLosServicios = collect();
        
        // Usamos null coalescing ?? para que siempre sea una colección, nunca null
        $serviciosRelacion = $empleado->empleadosservicios ?? collect();

        foreach ($serviciosRelacion as $es) {
            $detalles = $es->detallesfactura ?? collect();
            $porcentajeComision = (float)($es->comision ?? 0);

            foreach ($detalles as $det) {
                $factura = $det->factura_con_cita ?? $det->factura_sin_cita;
                if (!$factura) continue;

                // Determinar Cliente
                $clienteNombre = "Venta Directa";
                if ($det->factura_con_cita && isset($det->factura_con_cita->cita->cliente->persona)) {
                    $clienteNombre = $det->factura_con_cita->cita->cliente->persona->personasnaturales->nombrecompleto ?? 'Cliente';
                } elseif ($det->factura_sin_cita && isset($det->factura_sin_cita->persona)) {
                    $clienteNombre = $det->factura_sin_cita->persona->personasnaturales->nombrecompleto ?? 'Cliente';
                }

                $totalItem = (float)$det->totalapagar;

                $todosLosServicios->push([
                    'id' => $det->id,
                    'fecha' => date('Y-m-d', strtotime($factura->fecha)),
                    'hora' => date('H:i', strtotime($factura->fecha)),
                    'servicio' => $es->servicio->nombre ?? 'Servicio',
                    'codigo' => $factura->numero ?? 'S/N',
                    'cliente_nombre' => $clienteNombre,
                    'total_pagado' => $totalItem,
                    'comision_pactada' => $porcentajeComision,
                    'comision_valor' => ($totalItem * $porcentajeComision) / 100,
                ]);
            }
        }

        return [
            'id' => $empleado->id,
            'nombre' => $empleado->persona->personasnaturales->nombrecompleto ?? 'Sin Nombre',
            'suma_recaudado' => (float)$todosLosServicios->sum('total_pagado'),
            'suma_comisiones' => (float)$todosLosServicios->sum('comision_valor'),
            'total_servicios' => $todosLosServicios->count(),
            'servicios' => $todosLosServicios->values()->all()
        ];
    });

    return Inertia::render('reportes/empleados/index', [
        'reporte' => $reporteOptimizado,
        'empleados' => Cfempleados::where('comercio_id', $comercio->id)
            ->with('persona.personasnaturales')->get()
            ->map(fn($e) => ['id' => $e->id, 'name' => $e->persona->personasnaturales->nombrecompleto]),
        'filtros' => [
            'fecha_inicio' => $fecha_inicio,
            'fecha_fin' => $fecha_fin,
            'empleado_id' => $empleado_id,
        ]
    ]);
}

    public function dempleados(Request $request)
    {
        $userAuth = Auth::user();
        $comercio = Comercios::where('persona_id', $userAuth->persona_id)->first();

        // Normalizar fechas
        $fecha_inicio = $request->fecha_inicio ?? now()->startOfMonth()->format('Y-m-d');
        $fecha_fin = $request->fecha_fin ?? now()->format('Y-m-d');
        $empleado_id = $request->empleado_id;
        $estado_cita_id = $request->estado_cita_id;

        $estadosCitas = Cfmaestra::where('padre', Cfmaestra::where('codigo', 'LIS_ESTADOSCITAS')->value('id'))
            ->orderBy('nombre')
            ->pluck('nombre', 'id')
            ->prepend('Todos los estados', '');

       return $reporteRaw = Cfempleados::with([
            'persona:id,identificacion,telefonomovil,email',
            'persona.personasnaturales:persona_id,nombre,apellido,segundonombre,segundoapellido,fechanacimiento',
            'empleadosservicios:id,empleado_id,servicio_id,comision',
            'empleadosservicios.servicio:id,nombre,tipo_id',
            'empleadosservicios.servicio.tipo:id,nombre',
            'empleadosservicios.detallesfactura:id,cantidad,preciofinal,descuento,porcentajedescuento,totalapagar,model_type_id,factura_id',
            
            'empleadosservicios.detallesfactura.factura_con_cita:id,fecha,numero,subtotal,descuento,porcentajedescuento,total,cupon_id,model_type_id',
            'empleadosservicios.detallesfactura.factura_con_cita.cita:id,fecha,cliente_id',
            'empleadosservicios.detallesfactura.factura_con_cita.cita.cliente.persona:id,identificacion,telefonomovil,email',
            'empleadosservicios.detallesfactura.factura_con_cita.cita.cliente.persona.personasnaturales:persona_id,nombre,apellido,segundonombre,segundoapellido,fechanacimiento:id,identificacion,telefonomovil,email',
            
            'empleadosservicios.detallesfactura.factura_sin_cita:id,fecha,numero,subtotal,descuento,porcentajedescuento,total,cupon_id,model_type_id',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona.personasnaturales',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona:id,identificacion,telefonomovil,email',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona.personasnaturales:persona_id,nombre,apellido,segundonombre,segundoapellido,fechanacimiento:id,identificacion,telefonomovil,email',
            
        ])
        ->where('comercio_id', $comercio->id)
        ->when($empleado_id, fn($q) => $q->where('id', $empleado_id))
        ->get();

        $reporteOptimizado = $reporteRaw->map(function($empleado) use ($fecha_inicio, $fecha_fin) {
            $todosLosServicios = collect();
            
            // 1. Validar que la relación exista y no sea null antes del foreach
            $serviciosEmpleado = $empleado->empleadoservicios ?? collect();
        
            foreach ($serviciosEmpleado as $es) {
                // 2. Asegurarse de que detallesfactura sea una colección (evita el error de tipo null)
                $detalles = $es->detallesfactura ?? collect();
        
                foreach ($detalles as $det) {
                    // Intentar obtener la factura de cualquiera de las dos relaciones
                    $factura = $det->factura_con_cita ?? $det->factura_sin_cita;
                    
                    if (!$factura) continue;
        
                    // Determinar nombre del cliente y teléfono
                   return  $cliente = "Venta Directa";
                    $telefono = "N/A";
                    $codigoCita = "N/A";
        
                    if ($det->factura_con_cita && $det->factura_con_cita->cita) {
                        $personaCita = $det->factura_con_cita->cita->cliente->persona ?? null;
                        if ($personaCita) {
                            $cliente = $personaCita->personasnaturales->nombrecompleto ?? 'Cliente Desconocido';
                            $telefono = $personaCita->telefonomovil ?? 'N/A';
                            $codigoCita = $det->factura_con_cita->cita->id; // O el código que uses
                        }
                    } elseif ($det->factura_sin_cita && $det->factura_sin_cita->persona) {
                        $personaFactura = $det->factura_sin_cita->persona;
                        $cliente = $personaFactura->personasnaturales->nombrecompleto ?? 'Cliente Desconocido';
                        $telefono = $personaFactura->telefonomovil ?? 'N/A';
                    }
        
                    $todosLosServicios->push([
                        'id' => $det->id,
                        'fecha' => date('Y-m-d', strtotime($factura->fecha)),
                        'hora' => date('H:i', strtotime($factura->fecha)),
                        'servicio' => $es->servicio->nombre ?? 'Servicio no especificado',
                        'codigo' => $factura->numero ?? 'S/N',
                        'cita_codigo' => $codigoCita,
                        'cliente_nombre' => $cliente,
                        'cliente_tel' => $telefono,
                        'total_pagado' => (float)$det->totalapagar,
                        'comision_pactada' => 60, // Ajustar según tu lógica de negocio
                        'comision_valor' => (float)$det->totalapagar * 0.6,
                        'estado_nombre' => 'Asistida',
                        'estado_color' => 'success'
                    ]);
                }
            }
        
        
            return [
                'id' => $empleado->id,
                'nombre' => $empleado->persona->personasnaturales->nombrecompleto ?? 'Sin Nombre',
                'suma_recaudado' => $todosLosServicios->sum('total_pagado'),
                'suma_comisiones' => $todosLosServicios->sum('comision_valor'),
                'total_servicios' => $todosLosServicios->count(),
                'servicios' => $todosLosServicios
            ];
        }); 

        return Inertia::render('reportes/empleados/index', [
            'reporte' => $reporteOptimizado,
            'empleados' => Cfempleados::where('comercio_id', $comercio->id)
                ->with('persona.personasnaturales')
                ->get()
                ->map(fn($e) => ['id' => $e->id, 'name' => $e->persona->personasnaturales->nombrecompleto]),
            'estadosList' => $estadosCitas,
            'filtros' => [
                'fecha_inicio' => $fecha_inicio,
                'fecha_fin' => $fecha_fin,
                'empleado_id' => $empleado_id,
                'estado_cita_id' => $estado_cita_id
            ]
        ]);
    }

    public function cempleados(Request $request)
    {
        $userAuth = Auth::user();
        $comercio = Comercios::where('persona_id', $userAuth->persona_id)->first();

        $fecha_inicio = $request->fecha_inicio ?? now()->startOfMonth()->format('Y-m-d');
        $fecha_fin = $request->fecha_fin ?? now()->format('Y-m-d');
        $empleado_id = $request->empleado_id;
        $estado_cita_id = $request->estado_cita_id;

        // 1. Obtener estados de una forma más eficiente
        $estadosCitas = Cfmaestra::where('padre', Cfmaestra::where('codigo', 'LIS_ESTADOSCITAS')->value('id'))
            ->orderBy('nombre')
            ->pluck('nombre', 'id')
            ->prepend('Todos los estados', '');

        return $reporte = Cfempleados::with([
            'persona:id,identificacion,telefonomovil,email',
            'persona.personasnaturales:persona_id,nombre,apellido,segundonombre,segundoapellido,fechanacimiento',
            'empleadosservicios:id,empleado_id,servicio_id',
            'empleadosservicios.servicio:id,nombre,tipo_id',
            'empleadosservicios.servicio.tipo:id,nombre',
            'empleadosservicios.detallesfactura:id,cantidad,preciofinal,descuento,porcentajedescuento,totalapagar,model_type_id,factura_id',
            
            'empleadosservicios.detallesfactura.factura_con_cita:id,fecha,numero,subtotal,descuento,porcentajedescuento,total,cupon_id,model_type_id',
            'empleadosservicios.detallesfactura.factura_con_cita.cita:id,fecha,cliente_id',
            'empleadosservicios.detallesfactura.factura_con_cita.cita.cliente.persona:id,identificacion,telefonomovil,email',
            'empleadosservicios.detallesfactura.factura_con_cita.cita.cliente.persona.personasnaturales:persona_id,nombre,apellido,segundonombre,segundoapellido,fechanacimiento:id,identificacion,telefonomovil,email',
            
            'empleadosservicios.detallesfactura.factura_sin_cita:id,fecha,numero,subtotal,descuento,porcentajedescuento,total,cupon_id,model_type_id',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona.personasnaturales',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona:id,identificacion,telefonomovil,email',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona.personasnaturales:persona_id,nombre,apellido,segundonombre,segundoapellido,fechanacimiento:id,identificacion,telefonomovil,email',
            
            
        ])
        ->where('comercio_id', $comercio->id)
        ->when($empleado_id, fn($q) => $q->where('id', $empleado_id))
        ->get();


        return Inertia::render('reportes/empleados/index', [
            'reporte' => $reporte,
            'empleados' => Cfempleados::where('comercio_id', $comercio->id)
                ->with('persona.personasnaturales')
                ->get()
                ->map(fn($e) => ['id' => $e->id, 'name' => $e->persona->personasnaturales->nombrecompleto]),
            'estadosList' => $estadosCitas,
            'filtros' => $request->all(['fecha_inicio', 'fecha_fin', 'empleado_id', 'estado_cita_id'])
        ]);
    }

    public function zempleados(Request $request)
    {
        $userAuth = Auth::user();
        $comercio = Comercios::where('persona_id', $userAuth->persona_id)->first();

        $fecha_inicio = $request->fecha_inicio ?? now()->startOfMonth()->format('Y-m-d');
        $fecha_fin = $request->fecha_fin ?? now()->format('Y-m-d');
        $empleado_id = $request->empleado_id;
        $estado_cita_id = $request->estado_cita_id;

        // 1. Obtener estados de una forma más eficiente
        $estadosCitas = Cfmaestra::where('padre', Cfmaestra::where('codigo', 'LIS_ESTADOSCITAS')->value('id'))
            ->orderBy('nombre')
            ->pluck('nombre', 'id')
            ->prepend('Todos los estados', '');

        return $reporte = Cfempleados::with([
            'persona.personasnaturales',
            'empleadosservicios.detallesfactura.factura_con_cita.cita',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona.personasnaturales',
            /*
            'detallescitas' => function($query) use ($fecha_inicio, $fecha_fin, $estado_cita_id) {
                $query->whereHas('cita', function($q) use ($fecha_inicio, $fecha_fin, $estado_cita_id) {
                    $q->whereBetween('fecha', [$fecha_inicio, $fecha_fin]);
                    if ($estado_cita_id) $q->where('estado_id', $estado_cita_id);
                })
                // CARGA CRÍTICA: Traemos toda la jerarquía de la factura para evitar consultas dentro del loop
                ->with([
                    'cita.cliente.persona.personasnaturales', 
                    'cita.estado', 
                    'cita.factura.detalles_con_empleadoservicio.empleadoservicio.servicio', 
                    'empleadoservicio.servicio'
                ]);
            },*/
        ])
        ->where('comercio_id', $comercio->id)
        ->when($empleado_id, fn($q) => $q->where('id', $empleado_id))
        ->get();

        $ve->map(function($empleado) {
            // Agrupamos por cita_id para procesar cada cita una sola vez
            $serviciosProcesados = $empleado->detallescitas->unique('cita_id')->map(function($det) {
                $cita = $det->cita;
                $factura = $cita->factura;
                
                $recaudadoCita = 0;
                $descuentoCita = 0;

                if ($factura && $factura->detalles) {
                    // Filtramos los detalles de la factura una sola vez en una variable
                    $detallesFiltrados = $factura->detalles->where('producto.tipo_id', 855);
                    
                    $descuentoCita = $detallesFiltrados->sum('descuento');
                    $recaudadoCita = $detallesFiltrados->sum('totalapagar');
                }

                $porcentajeComision = $det->empleadoservicio->comision ?? 0;
                $comisionCalculada = ($recaudadoCita * $porcentajeComision) / 100;

                return [
                    'id' => $det->id,
                    'codigo' => $cita->codigo,
                    'fecha' => $cita->fecha,
                    'hora' => $cita->horainicio,
                    'cliente_nombre' => $cita->cliente->persona->personasnaturales->nombrecompleto ?? 'N/A',
                    'cliente_tel' => $cita->cliente->persona->telefonomovil ?? '',
                    'servicio' => $det->empleadoservicio->servicio->nombre ?? 'Servicio',
                    'estado_nombre' => $cita->estado->nombre ?? '',
                    'estado_color' => $cita->estado->observacion ?? '', 
                    'valor_servicio' => $det->preciofinal,
                    'total_descuento' => $descuentoCita,
                    'total_pagado' => $recaudadoCita,
                    'comision_pactada' => $porcentajeComision,
                    'comision_valor' => $comisionCalculada
                ];
            });

            return [
                'id' => $empleado->id,
                'nombre' => $empleado->persona->personasnaturales->nombrecompleto,
                'total_servicios' => $serviciosProcesados->count(),
                'suma_recaudado' => $serviciosProcesados->sum('total_pagado'),
                'suma_comisiones' => $serviciosProcesados->sum('comision_valor'),
                'servicios' => $serviciosProcesados
            ];           
        });

        return Inertia::render('reportes/empleados/index', [
            'reporte' => $reporte,
            'empleados' => Cfempleados::where('comercio_id', $comercio->id)
                ->with('persona.personasnaturales')
                ->get()
                ->map(fn($e) => ['id' => $e->id, 'name' => $e->persona->personasnaturales->nombrecompleto]),
            'estadosList' => $estadosCitas,
            'filtros' => $request->all(['fecha_inicio', 'fecha_fin', 'empleado_id', 'estado_cita_id'])
        ]);
    }
    
    public function xempleados(Request $request)
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
                ->with(['cita.cliente.persona.personasnaturales', 'cita.estado', 'empleadoservicio.servicio']);
            },
        ])
        ->where('comercio_id', $comercio->id)
        ->when($empleado_id, fn($q) => $q->where('id', $empleado_id))
        ->get()

        ->map(function($empleado) {
            $citasUnicas = $empleado->detallescitas->unique('cita_id');
            $serviciosProcesados = $citasUnicas->map(function($det) {
                $cita = $det->cita;
                $factura = $cita->factura;

                // 2. Aquí ya tienes el cita_id único ($cita->id)
                // Ahora buscamos en la factura todos los detalles que pertenezcan a esta cita específica
                $recaudadoCita = 0;
                $descuentoCita = 0;
                if ($factura) {
                    $descuentoCita = collect($factura->detalles)
                    ->filter(function ($detalle) use ($det) {
                        // 1. Que sea un producto tipo 855
                        // 2. IMPORTANTE: Que el producto sea el mismo que el de la cita actual
                        return $detalle->producto && 
                               $detalle->producto->tipo_id == 855; 
                        })
                    ->sum('descuento');

                    $recaudadoCita = collect($factura->detalles)
                    ->filter(function ($detalle) use ($det) {
                        // 1. Que sea un producto tipo 855
                        // 2. IMPORTANTE: Que el producto sea el mismo que el de la cita actual
                        return $detalle->producto && 
                               $detalle->producto->tipo_id == 855; 
                        })
                    ->sum('totalapagar');
                }

                $porcentajeComision = $det->empleadoservicio->comision ?? 0;
                $comisionCalculada = ($recaudadoCita * $porcentajeComision) / 100;

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
                    'total_descuento' => $descuentoCita,
                    'total_pagado' => $recaudadoCita,
                    'comision_pactada' => $porcentajeComision,
                    'comision_valor' => $comisionCalculada
                ];

            });

            return [
                'id' => $empleado->id,
                'nombre' => $empleado->persona->personasnaturales->nombrecompleto,
                'total_servicios' => $serviciosProcesados->count(),
                'suma_recaudado' => $serviciosProcesados->sum('total_pagado'),
                'suma_comisiones' => $serviciosProcesados->sum('comision_valor'),
                'servicios' => $serviciosProcesados
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

    public function aempleados(Request $request)
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

        return $reporte = Cfempleados::with([
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
                //$totalPagado = $det->cita->factura ? (float) ($det->preciofinal ?? 0) : 0;
                $totalPagado = 0;

                if ($det->cita && $det->cita->factura) {
                    $totalPagado = collect($det->cita->factura->detalles)
                        ->filter(function ($facturaDetalle) use ($det) {
                            // Comparamos el producto_id del detalle de la cita 
                            // con el producto_id del detalle de la factura
                            return $facturaDetalle->producto_id == $det->model_type_id; 
                        })
                        ->sum('totalapagar');
                }

                //$totalPagado = $det->cita->factura ? collect($det->cita->factura->detalles)->sum('totalapagar') : 0;
                
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
}

?>