<?php

namespace App\Http\Controllers;

use App\Models\Personas;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class PersonasController extends Controller
{
    public function __construct(){
        $this->middleware('permission:personas.index')->only(['index', 'show']);
        $this->middleware('permission:personas.create')->only(['create', 'store']);
        $this->middleware('permission:personas.edit')->only(['edit', 'update']);
        $this->middleware('permission:personas.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('personas/index', [
            'personas' => Personas::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('personas/create', [
            'personas' => new Personas(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Personas::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $personas = Personas::create($request->all() + $audt);
            return redirect()->route('personas.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('personas/show', [
            'personas' => personas::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('personas/edit', [
            'personas' => Personas::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $personas)
    {
        request()->validate(Personas::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $personas = Personas::findOrFail($personas);
            $personas->update($request->all() + $audt);
            return redirect()->route('personas.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $personas = Personas::findOrFail($id);
        $personas->deleted_by =  Auth::user()->id;
        $personas->save();
        $personas->delete();

        return redirect()->route('personas.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}