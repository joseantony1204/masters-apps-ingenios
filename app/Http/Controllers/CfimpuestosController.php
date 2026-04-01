<?php

namespace App\Http\Controllers;

use App\Models\Cfimpuestos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class CfimpuestosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfimpuestos.index')->only(['index', 'show']);
        $this->middleware('permission:cfimpuestos.create')->only(['create', 'store']);
        $this->middleware('permission:cfimpuestos.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfimpuestos.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfimpuestos/index', [
            'cfimpuestos' => Cfimpuestos::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfimpuestos/create', [
            'cfimpuestos' => new Cfimpuestos(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfimpuestos::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfimpuestos = Cfimpuestos::create($request->all() + $audt);
            return redirect()->route('cfimpuestos.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfimpuestos/show', [
            'cfimpuestos' => cfimpuestos::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfimpuestos/edit', [
            'cfimpuestos' => Cfimpuestos::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfimpuestos)
    {
        request()->validate(Cfimpuestos::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfimpuestos = Cfimpuestos::findOrFail($cfimpuestos);
            $cfimpuestos->update($request->all() + $audt);
            return redirect()->route('cfimpuestos.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cfimpuestos = Cfimpuestos::findOrFail($id);
        $cfimpuestos->deleted_by =  Auth::user()->id;
        $cfimpuestos->save();
        $cfimpuestos->delete();

        return redirect()->route('cfimpuestos.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}