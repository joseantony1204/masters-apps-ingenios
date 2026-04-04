<?php

namespace App\Http\Controllers;

use App\Models\{Cfsedes, Comercios};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};
use App\Http\Requests\CfsedesRequest;

class CfsedesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfsedes.index')->only(['index', 'show']);
        $this->middleware('permission:cfsedes.create')->only(['create', 'store']);
        $this->middleware('permission:cfsedes.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfsedes.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfsedes/index', [
            'cfsedes' => Cfsedes::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfsedes/create', [
            'cfsedes' => new Cfsedes(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required',
            'ciudad' => 'required',
            'direccion' => 'required',
            'telefono' => 'required',
        ],[
            'nombre.required' => 'El nombre es requerido',
            'ciudad.required' => 'La ciudad de factura es requerido',
            'direccion.required' => 'La direccion de factura es requerido',
            'telefono.required' => 'El telefono de factura es requerido',
        ]);

        $user = Auth::user();
        $comercio = Comercios::with('persona')->where('persona_id', $user->persona_id)->first();
        $request['comercio_id'] = $comercio->id;
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfsedes = Cfsedes::create($request->all() + $audt);
            return redirect()->back()->with('success', 'Sede creada correctamente');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfsedes/show', [
            'cfsedes' => cfsedes::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfsedes/edit', [
            'cfsedes' => Cfsedes::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CfsedesRequest $request, $cfsedes)
    {
        $validated = $request->validate([
            'nombre' => 'required',
            'ciudad' => 'required',
            'direccion' => 'required',
            'telefono' => 'required',
        ],[
            'nombre.required' => 'El nombre es requerido',
            'ciudad.required' => 'La ciudad de factura es requerido',
            'direccion.required' => 'La direccion de factura es requerido',
            'telefono.required' => 'El telefono de factura es requerido',
        ]);
        
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfsedes = Cfsedes::findOrFail($cfsedes);
            $cfsedes->update($request->all() + $audt);
            return redirect()->back()->with('success', 'Sede actualizada correctamente');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    public function updateEstado(Request $request, $id)
    {
        $sede = Cfsedes::findOrFail($id);
        
        // Lógica de alternancia: Si es 1 pasa a 0, y viceversa
        // Ajusta los IDs según tu tabla 'estados'
        $nuevoEstado = ($sede->estado == 1) ? 0 : 1;
        
        $sede->update(['estado' => $nuevoEstado]);

        return redirect()->back()->with('success', 'Estado actualizado');
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cfsedes = Cfsedes::findOrFail($id);
        $cfsedes->deleted_by =  Auth::user()->id;
        $cfsedes->save();
        $cfsedes->delete();

        return redirect()->back()->with('success', 'Sede eliminada correctamente');
    }
}