<?php

namespace App\Http\Controllers;

use App\Models\{Cfbloqueosagendas,Cfempleados};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};
use App\Http\Requests\CfbloqueosagendasRequest;

class CfbloqueosagendasController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfbloqueosagendas.index')->only(['index', 'show']);
        $this->middleware('permission:cfbloqueosagendas.create')->only(['create', 'store']);
        $this->middleware('permission:cfbloqueosagendas.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfbloqueosagendas.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfbloqueosagendas/index', [
            'bloqueosagendas' => Cfbloqueosagendas::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfbloqueosagendas/create', [
            'bloqueosagendas' => new Cfbloqueosagendas(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CfbloqueosagendasRequest $request)
    {
        // Lógica para crear el bloqueo (asumiendo que tienes la relación en Empleado)
        $empleado = Cfempleados::findOrFail($request->empleado_id);
        $empleado->bloqueos()->create($request->all());

        return back()->with('success', 'Espacio bloqueado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfbloqueosagendas/show', [
            'bloqueosagendas' => Cfbloqueosagendas::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfbloqueosagendas/edit', [
            'bloqueosagendas' => Cfbloqueosagendas::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $bloqueosagendas)
    {
        request()->validate(Cfbloqueosagendas::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $bloqueosagendas = Cfbloqueosagendas::findOrFail($bloqueosagendas);
            $bloqueosagendas->update($request->all() + $audt);
            return redirect()->route('cfbloqueosagendas.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $bloqueo = Cfbloqueosagendas::findOrFail($id);
        $bloqueo->delete();
        return back()->with('success', 'Bloqueo eliminado.');
    }
}