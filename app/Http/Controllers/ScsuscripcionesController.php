<?php

namespace App\Http\Controllers;

use App\Models\{Cfmaestras,Scsuscripciones,Scpagos,Comercios};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class ScsuscripcionesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:scsuscripciones.index')->only(['index', 'show']);
        $this->middleware('permission:scsuscripciones.create')->only(['create', 'store']);
        $this->middleware('permission:scsuscripciones.edit')->only(['edit', 'update']);
        $this->middleware('permission:scsuscripciones.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Scsuscripciones::with([
            'comercio',
            'plan',
            'estado',
            'pagos.estado',
            'pagos.metodo'
        ])
        ->where('comercio_id', function($q) use ($user) {
            $q->select('id')->from('comercios')->where('persona_id', $user->persona_id)->first();
        })
        ->whereNull('deleted_at');
        $scsuscripciones = $query->get();

        return Inertia::render('scsuscripciones/index', [
            'suscripciones' => $scsuscripciones
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('scsuscripciones/create', [
            'scsuscripciones' => new Scsuscripciones(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Scsuscripciones::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $scsuscripciones = Scsuscripciones::create($request->all() + $audt);
            return redirect()->route('scsuscripciones.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('scsuscripciones/show', [
            'scsuscripciones' => scsuscripciones::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('scsuscripciones/edit', [
            'scsuscripciones' => Scsuscripciones::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $scsuscripciones)
    {
        request()->validate(Scsuscripciones::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $scsuscripciones = Scsuscripciones::findOrFail($scsuscripciones);
            $scsuscripciones->update($request->all() + $audt);
            return redirect()->route('scsuscripciones.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $scsuscripciones = Scsuscripciones::findOrFail($id);
        $scsuscripciones->deleted_by =  Auth::user()->id;
        $scsuscripciones->save();
        $scsuscripciones->delete();

        return redirect()->route('scsuscripciones.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }

    // 1. Método que CREA el registro (POST)
    public function checkout(Request $request) 
    {
        $request->validate(['plan_id' => 'required|exists:cfmaestras,id']);
        
        $plan = Cfmaestras::find($request->plan_id);
        $user = Auth::user();

        // 0. Buscar el comercio asociado a la persona (usuario)
        $comercio = Comercios::where('persona_id', $user->persona_id)->first();

        // 1. Gestionar la Suscripción (Buscamos si ya tiene una pendiente o creamos nueva)
        // Esto evita duplicar suscripciones si el usuario intenta pagar varias veces el mismo plan
        $suscripcion = Scsuscripciones::updateOrCreate(
            [
                'comercio_id' => $comercio->id,
                'estado_id' => 981 // Si ya hay una pendiente, la reutilizamos
            ],
            [
                'plan_id' => $plan->id,
                'fecha_inicio' => now(),
                'fecha_vencimiento' => now()->addDays((int)$plan->codigo),
            ]
        );

        // 2. Crear el registro del Intento de Pago vinculado a la Suscripción
        $pago = Scpagos::create([
            'suscripcion_id' => $suscripcion->id,
            'referencia_pasarela' => 'PAY' . strtoupper(uniqid() . time()), // Referencia interna 
            'valor' => (float)$plan->observacion,
            'estado_id' => 976,
            'metodo_id' => 933
        ]);

        // 3. Retornar a la vista de Checkout con toda la data
        return redirect()->route('scsuscripciones.pay', $pago->id);
    }

    public function gopay(Request $request) 
    {
        $request->validate([
            'plan_id' => 'required|exists:cfmaestras,id',
            'id' => 'required|exists:scsuscripciones,id'
        ]);
        
        $plan = Cfmaestras::find($request->plan_id);
        $suscripcion = Scsuscripciones::findOrFail($request->id);

        // 2. Crear el registro del Intento de Pago vinculado a la Suscripción
        $pago = Scpagos::create([
            'suscripcion_id' => $suscripcion->id,
            'referencia_pasarela' => 'PAY' . strtoupper(uniqid() . time()), // Referencia interna 
            'valor' => (float)$plan->observacion,
            'estado_id' => 976,
            'metodo_id' => 933
        ]);

        // 3. Retornar a la vista de Checkout con toda la data
        return redirect()->route('scsuscripciones.pay', $pago->id);
    }

    // 2. Método que MUESTRA la vista (GET)
    public function pay($referencia) 
    {
        $pago = Scpagos::where('id', $referencia)
                    ->with(['suscripcion.plan']) // Traemos las relaciones
                    ->firstOrFail();

        return inertia('scsuscripciones/pay', [
            'pago' => $pago,
            'plan' => $pago->suscripcion->plan,
        ]);
    }

    public function resultado(Request $request)
    {
        // Wompi envía el ID de la transacción por la URL (query string)
        $transactionId = $request->query('id');

        return inertia('scsuscripciones/resultado', [
            'transactionId' => $transactionId,
            'mensaje' => 'Tu transacción ha sido recibida con éxito. Estamos validando el estado con tu entidad financiera.'
        ]);
    }
}