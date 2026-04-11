<?php

namespace App\Http\Controllers;

use App\Models\Cfcupones;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};
use Illuminate\Support\Str;

class CfcuponesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfcupones.index')->only(['index', 'show']);
        $this->middleware('permission:cfcupones.create')->only(['create', 'store']);
        $this->middleware('permission:cfcupones.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfcupones.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfcupones/index', [
            'cfcupones' => Cfcupones::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfcupones/create', [
            'cfcupones' => new Cfcupones(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfcupones::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfcupones = Cfcupones::create($request->all() + $audt);
            return redirect()->route('cfcupones.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfcupones/show', [
            'cfcupones' => cfcupones::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfcupones/edit', [
            'cfcupones' => Cfcupones::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfcupones)
    {
        request()->validate(Cfcupones::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfcupones = Cfcupones::findOrFail($cfcupones);
            $cfcupones->update($request->all() + $audt);
            return redirect()->route('cfcupones.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cupon = \App\Models\Cfcupones::findOrFail($id);

        // Validación de seguridad: No eliminar si ya tiene usos
        if ($cupon->usos_actuales > 0) {
            return response()->json([
                'message' => 'No se puede eliminar un cupón ya utilizado.'
            ], 422);
        }

        $cupon::destroy($id);

        return response()->json(['success' => true]);
    }

    public function asignarVip(Request $request)
    {
        $audt = ['created_by' => Auth::user()->id, 'created_at' => now()]; 
        $request->validate([
            'promocion_id' => 'required|exists:cfpromociones,id',
            'persona_id' => 'required|exists:personas,id',
        ]);

        // Generamos un código único para ese cliente
        $codigo = 'VIP-' . strtoupper(Str::random(6));

        CfCupones::create([
            'promocion_id' => $request->promocion_id,
            'persona_id' => $request->persona_id,
            'codigo' => $codigo,
            'limite_uso_total' => 1,
            'estado' => true,
            'fechavence' => now()->addMonths(6), // Beneficio VIP por 6 meses
        ] + $audt);

        return back()->with('success', "Beneficio VIP asignado. Código: $codigo");
    }

    public function storeLote(Request $request)
    {
        $request->validate([
            'promocion_id' => 'required|exists:cfpromociones,id',
            'cantidad' => 'required|integer|min:1|max:500',
            'prefijo' => 'nullable|string|max:10',
            'fechavence' => 'nullable|date|after_or_equal:today',
        ]);

        DB::transaction(function () use ($request) {
            for ($i = 0; $i < $request->cantidad; $i++) {
                // Generamos un código único aleatorio
                $codigo = ($request->prefijo ?? '') . strtoupper(Str::random(8));
                
                // Verificamos que no exista (raro, pero posible)
                while (CfCupones::where('codigo', $codigo)->exists()) {
                    $codigo = ($request->prefijo ?? '') . strtoupper(Str::random(8));
                }

                CfCupones::create([
                    'promocion_id' => $request->promocion_id,
                    'codigo' => $codigo,
                    'limite_uso_total' => 1, // Cada cupón del lote es de un solo uso
                    'estado' => true,
                    'fechavence' => $request->fechavence,
                ]);
            }
        });

        return back()->with('success', "Se han generado {$request->cantidad} cupones exitosamente.");
    }
}