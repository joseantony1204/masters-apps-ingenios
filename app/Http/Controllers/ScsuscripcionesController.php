<?php

namespace App\Http\Controllers;

use App\Models\Scsuscripciones;
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
        return Inertia::render('scsuscripciones/index', [
            'scsuscripciones' => Scsuscripciones::whereNull('deleted_at')->get() 
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
}