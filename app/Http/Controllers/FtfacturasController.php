<?php

namespace App\Http\Controllers;

use App\Models\{Ftfacturas, User, Ftturnos, Cfmaestra, Comercios, Adcitas};
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

        // 3. FILTRO CRÍTICO: Solo facturas que pertenecen a sedes de MI comercio
        $query->whereHas('turnos.terminal.sede', function ($q) use ($comercio) {
            $q->where('comercio_id', $comercio->id);
        });

        // 4. Agregamos los datos del cliente (Persona Natural)
        // Usamos leftJoin para no perder facturas si algo falla en la relación
        $query->select([
            'ftfacturas.*', 
            'p.identificacion',
            'p.telefonomovil',
            'p.email',
            'p.direccion',
            // Calculamos el total sumando los items de la factura
            DB::raw("(SELECT SUM(totalapagar) FROM ftdetalles WHERE factura_id = ftfacturas.id) as grand_total"),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"), 
            ])
            ->leftJoin("personas AS p", function($join) {
                $join->on("p.id", "=", "ftfacturas.model_type_id");
            })
            ->leftJoin("personasnaturales AS pn", "p.id", "=", "pn.persona_id");

        // 5. Filtros adicionales opcionales (por si quieres buscar por número o fecha)
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ftfacturas.numero', 'LIKE', "%$search%")
                ->orwhere('p.identificacion','LIKE', explode(' ','%'.$search.'%'))
                ->orWhere('pn.nombre','LIKE', explode(' ','%'.$search.'%'))
                ->orWhere('pn.segundonombre','LIKE', explode(' ','%'.$search.'%'))
                ->orWhere('pn.apellido','LIKE', explode(' ','%'.$search.'%'))
                ->orWhere('pn.segundoapellido','LIKE', explode(' ','%'.$search.'%'));
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
    public function stores(Request $request)
    {
        dd($request->all() );

        request()->validate(Ftfacturas::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $ftfacturas = Ftfacturas::create($request->all() + $audt);
            return redirect()->route('ftfacturas.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

  

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
                $estado = $request->estado_id == 938 ? 'Factura finalizada' : 'Factura guardada';
                // 2. Crear la Cabecera de la Factura
                $factura = Ftfacturas::create([
                    'codigoseguridad' => $this->generarCodigoseguridad(), 
                    'numero' => 0, // Buscar en resolucion
                    'fecha' => $request->fecha,
                    'fechanavencimiento' => $request->fechanavencimiento,
                    'model_type' => $request->model_type,
                    'model_type_id' => $request->model_type_id,
                    'turno_id' => $request->turno_id,
                    'estado_id' => $request->estado_id,
                    'tipo_id' => 943, //Factura de venta
                    //'metodo_id' => $request->metodo_id,
                    //'subtotal' => $request->subtotal,
                    //'discount_amount' => $request->discount_amount,
                    //'tax_amount' => $request->tax_amount,
                    //'grand_total' => $request->grand_total,
                    'observaciones' => $request->observaciones,
                    'created_by' => Auth::user()->id, 
                    'created_at' => now(),
                ]);

                // 3. Guardar los Items (Detalle)
                foreach ($request->items as $item) {
                    $factura->detalles()->create([
                        'numero' => 1,
                        'cantidad' => $item['qty'],
                        'precioinicial' => $item['price'],
                        'preciofinal' => $item['price'],
                        'descuento' => 0,
                        'totalapagar' => $item['total'],
                        'fecha' => now(),
                        'factura_id' => $factura->id,
                        'producto_id' => $item['id'],
                        'estado_id' => 858, //858 ACTIVO / 859 INACTIVO
                        'observaciones' => $item['description'],
                    ]);
                }

                return redirect()->route('ftfacturas.index')->with('success', $estado.' '. 'exitosamente.');
            });
        } catch (\Exception $e) {
            //return back()->withErrors(['error' => 'Error al guardar: ' . $e->getMessage()]);
            return back()->with('error', 'Error al guardar la informacion en la factura');
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
        return Inertia::render('ftfacturas/edit', [
            'ftfacturas' => Ftfacturas::findOrFail($id),
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
}