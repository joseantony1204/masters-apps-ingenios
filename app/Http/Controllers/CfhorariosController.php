<?php

namespace App\Http\Controllers;

use App\Models\Cfhorarios;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class CfhorariosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfhorarios.index')->only(['index', 'show']);
        $this->middleware('permission:cfhorarios.create')->only(['create', 'store']);
        $this->middleware('permission:cfhorarios.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfhorarios.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfhorarios/index', [
            'cfhorarios' => Cfhorarios::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfhorarios/create', [
            'cfhorarios' => new Cfhorarios(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfhorarios::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfhorarios = Cfhorarios::create($request->all() + $audt);
            return redirect()->route('cfhorarios.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfhorarios/show', [
            'cfhorarios' => cfhorarios::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfhorarios/edit', [
            'cfhorarios' => Cfhorarios::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfhorarios)
    {
        request()->validate(Cfhorarios::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfhorarios = Cfhorarios::findOrFail($cfhorarios);
            $cfhorarios->update($request->all() + $audt);
            return redirect()->route('cfhorarios.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cfhorarios = Cfhorarios::findOrFail($id);
        $cfhorarios->deleted_by =  Auth::user()->id;
        $cfhorarios->save();
        $cfhorarios->delete();

        return redirect()->route('cfhorarios.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}