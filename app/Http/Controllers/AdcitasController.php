<?php

namespace App\Http\Controllers;

use App\Models\{Personas, Adcitas, Addetallescitas, Adclientes, User, Comercios, Cfmaestra, Productos, Cfempleados, Ftturnos};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB,Hash};
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Events\AdcitasEvent;
use App\Jobs\SendWhatsAppReminderJob;
use Illuminate\Support\Facades\Log;

class AdcitasController extends Controller
{
    public function __construct(){
        $this->middleware('permission:adcitas.index')->only(['index', 'show']);
        $this->middleware('permission:adcitas.create')->only(['create', 'store']);
        $this->middleware('permission:adcitas.edit')->only(['edit', 'update']);
        $this->middleware('permission:adcitas.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        $timezone = 'America/Bogota';
        $ahora = Carbon::now($timezone);
        //if(!$request->fecha) $request['fecha'] = $ahora;
        //return Auth::user()->comercio->id;

        // Obtenemos el comercio del usuario autenticado (dueño/admin)
        $user = User::where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::where('persona_id', $user->persona_id)->first();
        $padre = Cfmaestra::select('id')->where('codigo','=',strtoupper('LIS_ESTADOSCITAS'))->first();
        // 1. Iniciamos la Query (sin el get al final todavía)
        $query = Adcitas::
        join("adclientes AS c","c.id","=","adcitas.cliente_id")
        ->join("personas AS p","p.id","=","c.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'adcitas.estado_id')
        ->with([
            'detalle_con_empleadoservicio.empleadoservicio.empleado.persona.personasnaturales',
            'detalle_con_empleadoservicio.empleadoservicio.servicio',
            // Aplicamos la restricción a producto y a su relación tipo
            'detalle_con_producto.producto.tipo' => function($query) {
                // Seleccionamos id, nombre y la FK tipo_id para poder cargar la siguiente relación
                $query->select('id', 'nombre'); 
            },
            'detalle_con_empleadoservicio.estado',
        ])
        ->select([
            'c.id AS cliente_id',
            'p.foto',
            'p.identificacion',
            DB::raw('CONCAT(YEAR(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " años ", MONTH(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " meses y ", DAY(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " dias") AS edad'),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'p.telefonomovil',
            'p.email',
            'adcitas.id',
            'adcitas.codigo',
            'adcitas.fecha',
            'adcitas.horainicio',
            'adcitas.horafinal',
            'm.observacion AS estado_observacion',
            'm.codigo AS estado_codigo',
            'm.nombre AS estado_nombre',
             // CÁLCULO DEL TOTAL MEDIANTE SUBCONSULTA (Elimina la necesidad del JOIN a addetallescitas)
             DB::raw("(SELECT SUM(preciofinal) FROM addetallescitas WHERE cita_id = adcitas.id AND deleted_at IS NULL) AS total")
        ])
        ->where('su.predeterminada', 1)
        // Usamos el ID del comercio del usuario autenticado
        ->where('c.comercio_id', function($q) use ($user) {
            $q->select('id')->from('comercios')->where('persona_id', $user->persona_id)->first();
        })
        ->whereIn('su.sede_id', function($q) use ($user) {
            $q->select('sede_id')->from('cfsedesusers')->where('usuario_id', $user->id);
        })
        ->whereNull('adcitas.deleted_at');


        // 2. APLICAMOS LOS FILTROS (Antes del get)
        $query->when($request->fecha, function ($q) use ($request) {
            return $q->whereDate('adcitas.fecha', $request->fecha); // Usa whereDate para mayor precisión
        });

        $query->when($request->identificacion, function ($q) use ($request) {
            return $q->where('p.identificacion', 'LIKE', "%{$request->identificacion}%");
        });
        
        $query->when($request->nombre, function ($q) use ($request) {
            return $q->where('pn.nombre', 'LIKE', "%{$request->nombre}%");
        });

        $query->when($request->apellido, function ($q) use ($request) {
            return $q->where('pn.apellido', 'LIKE', "%{$request->apellido}%");
        });

        // Filtro por Servicio
        $query->when($request->servicio_id, function ($q) use ($request) {
            return $q->whereHas('detalle_con_empleadoservicio.empleadoservicio', function ($subq) use ($request) {
                $subq->where('servicio_id', $request->servicio_id);
            });
        });

        // Filtro por Empleado (requiere buscar en la relación de detalles)
        $query->when($request->empleado_id, function ($q) use ($request) {
            // Usamos whereHas para entrar en la relación de los detalles de la cita
            return $q->whereHas('detalle_con_empleadoservicio.empleadoservicio', function ($subq) use ($request) {
                // IMPORTANTE: Asegúrate de que en la tabla cfempleadosservicios 
                // la columna se llame 'empleado_id'
                $subq->where('empleado_id', $request->empleado_id);
            });
        });

        // Filtro por Estado (AC, CA, RE)
        $query->when($request->estado, function ($q) use ($request) {
            return $q->where('m.codigo', $request->estado);
        });

        // 3. EJECUTAMOS LA CONSULTA
        $citas = $query->orderby('adcitas.fecha', 'DESC')
        ->orderby('adcitas.horainicio', 'DESC')
        ->get();

        // 1. Obtener los IDs de las sedes del Comercio
        $sedesIds = $comercio->sedes->pluck('id')->toArray();
        // 2. Consultar productos disponibles en esas sedes 
        $serviciosDisponibles = Productos::whereIn('sede_id', $sedesIds)
        ->where('tipo_id', 855) // Solo servicios
        ->pluck('nombre', 'id'); 
      
        // 3. Consultar empleados disponibles en esas sedes 
        $empleadosDisponibles = Cfempleados::join('personas AS p', 'cfempleados.persona_id', '=', 'p.id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->whereIn('cfempleados.id', function($query) {
            $query->select('empleado_id')->from('cfempleadosservicios');
        })
        ->where('cfempleados.comercio_id', $comercio->id)
        ->select(
            'cfempleados.id', 
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.apellido) as nombre_completo")
        )
        ->get()
        ->pluck('nombre_completo', 'id'); // Pluck sobre la colección es más seguro con alias


        // Usamos first() para tener el objeto directamente
        $sedePredeterminada = $user->sedes()
        ->with(['terminal'])
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
       $turnoActivo = $turnosAbiertos->first();

        return Inertia::render('adcitas/index', [
            'comercio' => $comercio,
            'citas' => $citas,
            'estadosList' => Cfmaestra::where('padre','=',Cfmaestra::select('id')->where('codigo','=',strtoupper('LIS_ESTADOSCITAS'))->first()->id)->whereIn('codigo',['CA','RE'])->get()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
            'serviciosList' => $serviciosDisponibles,
            'empleadosList' => $empleadosDisponibles,
            // Pasamos los filtros actuales para que no se borren de los inputs al buscar
            'filtros' => $request->only(['fecha', 'servicio_id', 'identificacion', 'nombre', 'apellido', 'empleado_id', 'estado_id']),

            'turnoActivo' => $turnoActivo,
            'turnosList'  => $turnosAbiertos,
            'sedePredeterminada' => $sedePredeterminada,
            'metodospagosList' => Cfmaestra::getlistatipos('LIS_METODOSPAGO'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('adcitas/create', [
            'adcitas' => new Adcitas(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 1. Reglas básicas que siempre se cumplen
        $rules = [
            'fecha' => 'required|date',
            'servicioasignado_id' => 'required',
            'horainicio' => 'required',
            'horafinal' => 'required',
            'precio' => 'required',
            'cliente_nombre' => 'required|string',
            'cliente_id' => 'nullable',
        ];

        // 2. Validación Condicional: Solo si es un cliente NUEVO
        if (!$request->cliente_id) {
            $rules['cliente_identificacion'] = 'required';
            $rules['cliente_telefono'] = 'required|unique:users,telefonomovil';
        } else {
            // Si el cliente ya existe, solo pedimos que los campos estén pero sin el unique
            //$rules['cliente_identificacion'] = 'required';
            $rules['cliente_telefono'] = 'required';
        }

        $request->validate($rules);

        try {
            return DB::transaction(function () use ($request) {
                $userAuth = Auth::user();
                $audt = ['created_by' => $userAuth->id, 'created_at' => now()]; 
                // 1. Obtener Comercio y Sedes del Admin actual
                $comercio = Comercios::where('persona_id', $userAuth->persona_id)->first();
                
                // --- LÓGICA DE CLIENTE ---
                $clienteId = $request->cliente_id;
                if (!$clienteId) {

                    // 2. Crear o actualizar Persona
                    $persona = Personas::updateOrCreate(
                        ['identificacion' => $request->cliente_identificacion],
                        [
                            'telefonomovil' => $request->cliente_telefono,
                            'email' => $request->cliente_email,
                            'tipoidentificacion_id' => 1, // Por defecto cédula o el que manejes
                        ] + $audt
                    );

                    // 3. Crear Persona Natural (Dividimos el nombre si viene completo)
                    $nombres = explode(' ', $request->cliente_nombre, 2);
                    $persona->personasnaturales()->updateOrCreate(
                        ['persona_id' => $persona->id],
                        [
                            'nombre' => $nombres[0],
                            'apellido' => $nombres[1] ?? '',
                        ] + $audt
                    );

                    // 4. Crear el registro en Adclientes
                    $nuevoCliente = Adclientes::updateOrCreate(
                        ['persona_id' => $persona->id, 'comercio_id' => $comercio->id],
                        ['fechaingreso' =>now(), 'estado_id' => 850] + $audt // Activo
                    );

                    // 5. Crear Usuario para que el cliente pueda entrar a la App
                    $nuevoUsuario = $persona->user ?: User::updateOrCreate(
                        ['persona_id' => $persona->id],
                        [
                            'username'      => $persona->identificacion,
                            'password'      => Hash::make($persona->identificacion),
                            'email'         => $persona->email,
                            'telefonomovil' => $persona->telefonomovil,
                            'perfil_id'     => 911, // Cliente
                            'estado_id'     => 850,
                        ] + $audt
                    );

                    // 6. Asociar a sedes del comercio
                    $sedesIds = $comercio->sedes->pluck('id');
                    if ($sedesIds->isNotEmpty()) {
                        $dataSedes = $sedesIds->mapWithKeys(fn($id, $idx) => [$id => [
                            'predeterminada' => $idx === 0,
                            'estado_id' => 858,
                        ] + $audt])->toArray();
                        $nuevoUsuario->sedes()->syncWithoutDetaching($dataSedes);
                    }

                    $clienteId = $nuevoCliente->id;
                }else{

                    // EL CLIENTE YA EXISTE: Solo actualizamos datos de contacto
                    $cliente = Adclientes::findOrFail($clienteId);
                    $cliente->persona->update([
                        'email' => $request->cliente_email,
                        'telefonomovil' => $request->cliente_telefono,
                    ]);

                }

                // --- CREACIÓN DE LA CITA (Igual que antes) ---
                $cita = Adcitas::create([
                    'codigo' => $this->generarCodigo(),
                    'cliente_id' => $clienteId,
                    'fecha' => $request->fecha,
                    'horainicio' => $request->horainicio,
                    'horafinal' => $request->horafinal,
                    'descripcion' => $request->observaciones,
                    'device' => "AM -  us: " . $userAuth->id,
                    'estado_id' => 913,
                ] + $audt);

                Addetallescitas::create([
                    'cantidad' => 1,
                    'descuento' => 0,
                    'preciounitario' => $request->precio,
                    'preciofinal' => $request->precio,
                    'model_type' => 919, //TABLA empleadoservicios en maestras
                    'model_type_id' => $request->servicioasignado_id, //ID de empleadoservicios 
                    'cita_id' => $cita->id,
                    'observaciones' => $request->observaciones,
                    'estado_id' => 913,
                ] + $audt);

                if($cita)
                    event(new AdcitasEvent($cita,$comercio));
                    $fechaCita = Carbon::parse($cita->fecha . ' ' . $cita->horainicio);
                    $ahora = now();
                    $momentoEnvio = $fechaCita->copy()->subMinutes(30);
                    
                    // Si falta más de media hora para la cita, programamos el Job
                    if ($momentoEnvio->isAfter($ahora)) {
                        $segundosDeEspera = $ahora->diffInSeconds($momentoEnvio);
                    
                        SendWhatsAppReminderJob::dispatch($cita->id)
                            ->delay($segundosDeEspera);
                            
                        Log::info("Recordatorio programado para la cita #{$cita->id} en {$segundosDeEspera} segundos.");
                    }
                return back()->with('success', 'La cita fue creada con exitosamente.');

            });

        } catch (\Exception $e) {
            //return response()->json(['message' => $e->getMessage()]);
            return back()->withErrors(['error' => 'Error al crear la cita: ' . $e->getMessage()]);
        }
    }

    public function actualizardetallecita(Request $request, $id)
    {
        // 1. Validación mejorada
        //dd($request->all() );
        $request->validate([
            'observaciones' => 'nullable|string',
            'items' => 'array',
            'items.*.nombre' => 'required_if:items.*.es_nuevo,true|string',
            'items.*.cantidad' => 'required|numeric|min:1',
            'items.*.precio' => 'required|numeric',
            'items.*.descuento' => 'nullable|numeric|min:0|max:100',
            //'total' => 'required|numeric',
        ]);

        try {
            return DB::transaction(function () use ($request, $id) {
                $userAuth = User::where('persona_id', Auth::user()->persona_id)->first();
                $now = now();
                
                // 1. Cargar la cita y el comercio de una sola vez
                $cita = Adcitas::findOrFail($id);

                //2. Obtenemos la sede predeterminada del usuario
                $sedePredeterminada = $userAuth->sedes()
                    ->wherePivot('predeterminada', 1)
                    ->value('cfsedes.id');

                // 3. Actualizar la cita principal
                $cita->update([
                    'descripcion' => $request->observaciones,
                    'updated_by'  => $userAuth->id,
                    'updated_at'  => $now
                ]);

                // Si telefonomovil
                $cita->cliente->persona()->update([
                    'telefonomovil' => $request->telefonomovil
                ]);

                // Si fechanacimiento
                $cita->cliente->persona->personasnaturales()->update([
                    'fechanacimiento' => $request->fechanacimiento
                ]);

                // 4. Procesar ítems adicionales
                if ($request->has('items') && is_array($request->items)) {
                    
                    foreach ($request->items as $item) {
                        $productoId = $item['producto_id'] ?? null;
                        $tipoId = $item['tipo_id'] ?? 854;

                        // Si el item es marcado como nuevo, creamos el producto "al vuelo"
                        if (!empty($item['es_nuevo']) && is_null($productoId)) {
                            $nuevoProducto = Productos::create([
                                'nombre'        => $item['nombre'],
                                'precioingreso' => $item['precio'],
                                'preciosalida'  => $item['precio'],
                                'descripcion'   => 'ADICIONAL_RAPIDO',
                                'estado_id'     => 858, // Activo
                                'unidad_id'     => 863, // Unidad
                                'categoria_id'   => 955, // Producto
                                'impuesto_id'   => 1, // Excluido
                                'tipo_id'       => $tipoId, // Tipo producto
                                'sede_id'       => $sedePredeterminada,
                                'created_by'    => $userAuth->id,
                                'created_at'    => $now,
                            ]);
                            $productoId = $nuevoProducto->id;
                        }

                        // 5. Lógica de Precios (Cálculo corregido)
                        // Precio Final = (Precio Unitario * Cantidad) - Descuento
                        $descuentoFactor = 1 - (($item['descuento'] ?? 0) / 100);
                        $precioFinal = ($item['precio'] * $item['cantidad']) * $descuentoFactor;

                        // 6. Registro del detalle
                        // Usamos create en lugar de updateOrCreate si queremos permitir 
                        // agregar el mismo producto varias veces como filas distintas
                        Addetallescitas::create([
                            'cita_id'       => $cita->id,
                            'cantidad'      => $item['cantidad'],
                            'descuento'     => $item['descuento'] ?? 0,
                            'preciounitario'   => $item['precio'],
                            'preciofinal'   => $precioFinal,
                            'model_type' => match ($tipoId) {
                                854 => 920, // tipo productos ---> productos
                                855 => 919, // tipo servicios ---> cfempleadosservicios
                                default => null,
                            },
                            'model_type_id' => match ($tipoId) {
                                854 => $productoId, // tipo productos ---> productos
                                855 => $item['servicioasignado_id'], // tipo servicios ---> cfempleadosservicios
                                default => null,
                            },
                            'estado_id'     => 913,
                            'created_by'    => $userAuth->id,
                            'created_at'    => $now
                        ]);
                    }
                }

                return back()->with('success', 'La cuenta de la cita ha sido actualizada.');
            });

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('adcitas/show', [
            'adcitas' => adcitas::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('adcitas/edit', [
            'adcitas' => Adcitas::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $adcitas)
    {
        request()->validate(Adcitas::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $adcitas = Adcitas::findOrFail($adcitas);
            $adcitas->update($request->all() + $audt);
            return redirect()->route('adcitas.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * Update the specified resource in storage.
     */
    public function actualizarEstados(Request $request, $adcita)
    {
        $request->validate([
            'id' => 'required',
            'estado_id' => 'required|exists:cfmaestras,id',
            'motivo_cancelacion' => 'required|string|max:500',
        ]);
        try {                        
            $params = ['estado_id' => $request->estado_id, 'motivocancela' => $request->motivo_cancelacion, 'updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cita = Adcitas::findOrFail($adcita);
            $cita->update($params);

            $cita->detalle()->update([
                'estado_id' => $request->estado_id,
                'updated_by' => Auth::user()->id,
                'updated_at' => now()
            ]);

            return back()->with('success', 'La cita fue actualizada con exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $adcitas = Adcitas::findOrFail($id);
        $adcitas->deleted_by =  Auth::user()->id;
        $adcitas->save();
        $adcitas->delete();

        return redirect()->route('adcitas.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }

    /**
     * Genera un código de cita alfanumérico aleatorio.
     */
    private function generarCodigo()
    {
        // Genera una cadena aleatoria de 10 caracteres
        $codigo = Str::random(10);

        // Opcional: Validar que el código no exista ya en la base de datos (recursión)
        $existe = DB::table('adcitas')->where('codigo', $codigo)->exists();
        
        if ($existe) {
            return $this->generarCodigoCita();
        }

        return strtoupper($codigo); // Lo devolvemos en mayúsculas para que sea más legible
    }
}