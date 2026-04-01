<?php

namespace App\Http\Controllers;

use App\Models\Ftimpuestos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class FtimpuestosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftimpuestos.index')->only(['index', 'show']);
        $this->middleware('permission:ftimpuestos.create')->only(['create', 'store']);
        $this->middleware('permission:ftimpuestos.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftimpuestos.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('ftimpuestos/index', [
            'ftimpuestos' => Ftimpuestos::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ftimpuestos/create', [
            'ftimpuestos' => new Ftimpuestos(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Ftimpuestos::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $ftimpuestos = Ftimpuestos::create($request->all() + $audt);
            return redirect()->route('ftimpuestos.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftimpuestos/show', [
            'ftimpuestos' => ftimpuestos::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('ftimpuestos/edit', [
            'ftimpuestos' => Ftimpuestos::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ftimpuestos)
    {
        request()->validate(Ftimpuestos::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftimpuestos = Ftimpuestos::findOrFail($ftimpuestos);
            $ftimpuestos->update($request->all() + $audt);
            return redirect()->route('ftimpuestos.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftimpuestos = Ftimpuestos::findOrFail($id);
        $ftimpuestos->deleted_by =  Auth::user()->id;
        $ftimpuestos->save();
        $ftimpuestos->delete();

        return redirect()->route('ftimpuestos.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}