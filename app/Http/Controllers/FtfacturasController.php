<?php

namespace App\Http\Controllers;

use App\Models\{Ftfacturas, Productos, User, Ftturnos, Cfmaestra, Comercios, Adcitas, Ftpagos};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};
use Illuminate\Support\Str;

class FtfacturasController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftfacturas.index')->only(['index', 'show']);
        $this->middleware('permission:ftfacturas.create')->only(['create', 'store']);
        $this->middleware('permission:ftfacturas.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftfacturas.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // 1. Obtenemos el comercio del usuario
        $user = User::where('persona_id', Auth::user()->persona_id)->first();
        $comercio = Comercios::where('persona_id', $user->persona_id)->first();

        if (!$comercio) {
            return back()->with('error', 'No se encontró un comercio asociado a este usuario.');
        }

        // 2. Construimos la consulta base con relaciones
        $query = Ftfacturas::with([
            'turnos.terminal.sede',
            'estado'
        ]);

        // 2. Filtro de seguridad por comercio
        $query->whereHas('turnos.terminal.sede', function ($q) use ($comercio) {
            $q->where('comercio_id', $comercio->id);
        });

        // 3. Selección de campos con Lógica Condicional
        $query->select([
            'ftfacturas.*',
            // Subconsulta para obtener el ID de la persona real dependiendo del tipo
            DB::raw("CASE 
                WHEN ftfacturas.model_type = 921 THEN (SELECT adclientes.persona_id FROM adcitas, adclientes WHERE adcitas.cliente_id = adclientes.id and adcitas.id = ftfacturas.model_type_id)
                ELSE ftfacturas.model_type_id 
            END as persona_real_id"),
            // Cálculo de total
            DB::raw("(SELECT SUM(total) FROM ftpagos WHERE factura_id = ftfacturas.id) as grand_total")
        ]);

        // 4. Joins dinámicos basados en la 'persona_real_id' calculada arriba
        $query->leftJoin("personas AS p", function($join) {
            // Unimos usando la lógica del CASE para normalizar el origen
            $join->on("p.id", "=", DB::raw("CASE 
                WHEN ftfacturas.model_type = 921 THEN (SELECT adclientes.persona_id FROM adcitas, adclientes WHERE adcitas.cliente_id = adclientes.id and adcitas.id = ftfacturas.model_type_id)
                ELSE ftfacturas.model_type_id 
            END"));
        })
        ->leftJoin("personasnaturales AS pn", "p.id", "=", "pn.persona_id");

        // 5. Agregamos las columnas de identidad normalizadas
        $query->addSelect([
            'p.identificacion',
            'p.telefonomovil',
            'p.email',
            DB::raw("CONCAT_WS('', UPPER(LEFT(pn.nombre,1)), UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos")
        ]);

        // 6. Buscador optimizado
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ftfacturas.numero', 'LIKE', "%$search%")
                ->orWhere('p.identificacion', 'LIKE', "%$search%")
                ->orWhere('pn.nombre', 'LIKE', "%$search%")
                ->orWhere('pn.apellido', 'LIKE', "%$search%");
            });
        }

         $ftfacturas = $query->orderBy('ftfacturas.fecha', 'DESC')->get();

        return Inertia::render('ftfacturas/index', [
            'ftfacturas' => $ftfacturas,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        // 0. Obtenemos la sede de la sesión (asumiendo que la guardas al hacer login)
        $user = User::with('sedes')->where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::with('sedes', 'persona')->where('persona_id', $user->persona_id)->first();

        // 1. Obtenemos la sede predeterminada del usuario
        // Usamos first() para tener el objeto directamente
        $sedePredeterminada = $user->sedes()
        ->with(['terminal'])
        ->wherePivot('predeterminada', 1)
        ->first();

        // 2. Si no hay sede predeterminada, manejamos el error o asignamos vacío
        if (!$sedePredeterminada) {
        return back()->with('error', 'El usuario no tiene una sede predeterminada asignada.');
        }

        // 3. Consultar turnos abiertos filtrados por Sede y Comercio
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

        // 4. Definir el turno activo por defecto (el primero de la lista)
       $turnoActivo = $turnosAbiertos->first();

        //5. --- LÓGICA PARA CARGAR LA CITA ---
        $cita = null;
        if($request->has('cita')) {
            // Cargamos la cita con la persona (cliente) y sus servicios asociados
            $cita = Adcitas::with([
                'cliente.persona.personasnaturales',
                'detalle_con_empleadoservicio.empleadoservicio.servicio',
                'detalle_con_producto.producto',
            ])
            ->find($request->cita);
        }

        return Inertia::render('ftfacturas/create', [
            'comercio' => $comercio,
            'ftfacturas' => new Ftfacturas(),
            'turnoActivo' => $turnoActivo,
            'sedePredeterminada' => $sedePredeterminada,
            'turnosList'  => $turnosAbiertos, // Por si tiene más de uno
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOSFACTURAS'),
            'metodospagosList' => Cfmaestra::getlistatipos('LIS_METODOSPAGO'),
            'cita' => $cita, // Pasamos la cita encontrada (o null)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //dd($request->all() );
        // 1. Validación de datos
        $validated = $request->validate([
            'turno_id' => 'required|exists:ftturnos,id',
            'model_type' => 'required|int',
            'model_type_id' => 'required|int',
            'fecha' => 'required|date',
            'metodo_id' => 'required',
            'estado_id' => 'required',
            'items' => 'required|array|min:1',
        ],[
            'turno_id.required' => 'El turno es requerido',
            'model_type.required' => 'El tipo de factura es requerido',
            'model_type_id.required' => 'Por favor seleccione un cliente',
            'fecha.required' => 'La fecha es requeridoa.',
            'metodo_id.required' => 'El metodo de pago es requerido',
            'estado_id.required' => 'El estado de factura es requerido',
            'items.required' => 'Debe agregar al menos un ítem al detalle.',
        ]);
        
        try {
            return DB::transaction(function () use ($request) {
                $userAuth = User::where('persona_id', Auth::user()->persona_id)->first();
                $sedePredeterminada = $userAuth->sedes()
                    ->wherePivot('predeterminada', 1)
                    ->value('cfsedes.id');

                $estado = $request->estado_id == 938 ? 'Factura finalizada' : 'Factura guardada';
                // 2. Crear la Cabecera de la Factura
                $factura = Ftfacturas::create([
                    'codigoseguridad' => $this->generarCodigoseguridad(), 
                    'numero' => $this->obtenerYActualizarNumeroResolucion($request->turno_id), // Buscar en resolucion
                    'fecha' => $request->fecha,
                    'fechanavencimiento' => $request->fechanavencimiento,
                    'model_type' => $request->model_type,
                    'model_type_id' => $request->model_type_id,
                    'turno_id' => $request->turno_id,
                    'estado_id' => $request->estado_id,
                    'tipo_id' => 943, //Factura de venta
                    'observaciones' => $request->observaciones,
                    'created_by' => Auth::user()->id, 
                    'created_at' => now(),
                ]);

                // 3. Guardar los Items (Detalle)
                
                foreach ($request->items as $item) {
                    $productoId = $item['producto_id'] ?? null;
                    // Si no tiene ID, es que el usuario lo escribió manualmente en la tabla
                    if (is_null($productoId) && !empty($item['nombre'])) {
                        $nuevoProducto = Productos::create([
                            'nombre'        => $item['nombre'],
                            'precioingreso' => $item['precio'],
                            'preciosalida'  => $item['precio'],
                            'descripcion'   => 'ITEM_MANUAL_CITAS',
                            'estado_id'     => 858, // Activo
                            'unidad_id'     => 863, // Unidad
                            'impuesto_id'   => 1, // Excluido
                            'categoria_id'   => 955, // Producto
                            'tipo_id'       => 854, // Tipo producto
                            'sede_id'       => $sedePredeterminada,
                            'created_by'    => $userAuth->id,
                            'created_at'    => now(),
                        ]);
                        $productoId = $nuevoProducto->id;
                    }

                    $factura->detalles()->create([
                        'numero' => 1,
                        'cantidad' => $item['cantidad'],
                        'precioinicial' => $item['precio'],
                        'preciofinal' => $item['precio'],
                        'descuento' => 0,
                        'totalapagar' => $item['total'],
                        'fecha' => now(),
                        'factura_id' => $factura->id,
                        'producto_id' => $productoId,
                        'estado_id' => 858, //858 ACTIVO / 859 INACTIVO
                        'observaciones' => $item['descripcion'],
                    ]);

                }

                $factura->pagos()->create([
                    'numero' => 1,
                    'fecha' => now(),
                    'total' => $request->total,
                    'factura_id' => $factura->id,                       
                    'metodo_id' => $request->metodo_id, 
                    'created_by' => Auth::user()->id, 
                    'created_at' => now(),
                ]);

                if($request->model_type == 921) {
                    $cita = Adcitas::where('id', $request->model_type_id)->first();
                    $cita->update(['estado_id' => 915]);
                }

                if($request->redirect)
                    return redirect()->route('ftfacturas.index')->with('success', $estado.' '. 'exitosamente.');
                else
                    return back()->with('success', 'Factura generada exitosamente.');
            });
        } catch (\Exception $e) {
            //return back()->withErrors(['error' => 'Error al guardar: ' . $e->getMessage()]);
            return back()->with('error', 'Error al guardar la informacion en la factura' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftfacturas/show', [
            'ftfacturas' => ftfacturas::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // 0. Obtenemos la sede de la sesión (asumiendo que la guardas al hacer login)
        $user = User::with('sedes')->where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::with('sedes', 'persona')->where('persona_id', $user->persona_id)->first();

        // 1. Obtenemos la sede predeterminada del usuario
        // Usamos first() para tener el objeto directamente
        $sedePredeterminada = $user->sedes()
        ->with(['terminal'])
        ->wherePivot('predeterminada', 1)
        ->first();

        // 2. Si no hay sede predeterminada, manejamos el error o asignamos vacío
        if (!$sedePredeterminada) {
            return back()->with('error', 'El usuario no tiene una sede predeterminada asignada.');
        }
    
        // 3. Consultar turnos abiertos filtrados por Sede y Comercio
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

        // 4. Definir el turno activo por defecto (el primero de la lista)
        $turnoActivo = $turnosAbiertos->first();

        //5. --- LÓGICA PARA CARGAR LA FACTURA ---
        return $ftfactura = Ftfacturas::findOrFail($id)->load([
            'turnos.terminal.sede',
            'estado',
            'tipo',
            'detalles.producto',
        ]);

        //6. --- LÓGICA PARA CARGAR LA CITA ---
        $cita = null;
        if($ftfactura->model_type===921) {
            // Cargamos la cita con la persona (cliente) y sus servicios asociados
            $cita = Adcitas::with([
                'cliente.persona.personasnaturales',
                'detalle_con_empleadoservicio.empleadoservicio.servicio',
                'detalle_con_producto.producto',
            ])
            ->find($ftfactura->model_type_id);
        }
        
        return Inertia::render('ftfacturas/edit', [
            'comercio' => $comercio,
            'ftfactura' => $ftfactura,
            'turnoActivo' => $turnoActivo,
            'sedePredeterminada' => $sedePredeterminada,
            'turnosList'  => $turnosAbiertos, // Por si tiene más de uno
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOSFACTURAS'),
            'metodospagosList' => Cfmaestra::getlistatipos('LIS_METODOSPAGO'),
            'cita' => $cita, // Pasamos la cita encontrada (o null)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ftfacturas)
    {
        request()->validate(Ftfacturas::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftfacturas = Ftfacturas::findOrFail($ftfacturas);
            $ftfacturas->update($request->all() + $audt);
            return redirect()->route('ftfacturas.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftfacturas = Ftfacturas::findOrFail($id);
        $ftfacturas->deleted_by =  Auth::user()->id;
        $ftfacturas->save();
        $ftfacturas->delete();

        return redirect()->route('ftfacturas.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }

    private function generarCodigoseguridad()
    {
        // Genera una cadena aleatoria de 10 caracteres
        $codigoseguridad = Str::random(20);

        // Opcional: Validar que el código no exista ya en la base de datos (recursión)
        $existe = DB::table('ftfacturas')->where('codigoseguridad', $codigoseguridad)->exists();
        
        if ($existe) {
            return $this->generarCodigoCita();
        }

        return strtoupper($codigoseguridad); // Lo devolvemos en mayúsculas para que sea más legible
    }

    private function obtenerYActualizarNumeroResolucion($turno_id)
    {
        // 1. Navegar por la relación según tu diagrama: turno -> terminal -> resolucion
        // Se asume que los modelos tienen las relaciones definidas (belongsTo)
        $turno = Ftturnos::with('terminal.resolucion')->findOrFail($turno_id);
        $resolucion = $turno->terminal->resolucion;

        if (!$resolucion || $resolucion->estado != 1) {
            throw new \Exception("No existe una resolución activa para esta terminal.");
        }

        // 2. Obtener el número actual y el prefijo de la tabla resoluciones
        $numeroActual = $resolucion->actual;
        $prefijo = $resolucion->prefijo;

        // 3. Formatear el número concatenado (Ej: SETT-1)
        $numeroFacturaCompleto = $prefijo . ' - ' . $numeroActual;

        // 4. Incrementar el campo 'actual' en la base de datos para la próxima factura
        $resolucion->increment('actual');

        return $numeroFacturaCompleto;
    }
}