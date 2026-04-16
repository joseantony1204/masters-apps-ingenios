<?php

namespace App\Http\Controllers;

use App\Models\Scpagos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class ScpagosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:scpagos.index')->only(['index', 'show']);
        $this->middleware('permission:scpagos.create')->only(['create', 'store']);
        $this->middleware('permission:scpagos.edit')->only(['edit', 'update']);
        $this->middleware('permission:scpagos.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('scpagos/index', [
            'scpagos' => Scpagos::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('scpagos/create', [
            'scpagos' => new Scpagos(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Scpagos::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $scpagos = Scpagos::create($request->all() + $audt);
            return redirect()->route('scpagos.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('scpagos/show', [
            'scpagos' => scpagos::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('scpagos/edit', [
            'scpagos' => Scpagos::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $scpagos)
    {
        request()->validate(Scpagos::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $scpagos = Scpagos::findOrFail($scpagos);
            $scpagos->update($request->all() + $audt);
            return redirect()->route('scpagos.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $scpagos = Scpagos::findOrFail($id);
        $scpagos->deleted_by =  Auth::user()->id;
        $scpagos->save();
        $scpagos->delete();

        return redirect()->route('scpagos.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}