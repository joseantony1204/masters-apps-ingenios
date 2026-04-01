<?php

namespace App\Http\Controllers;

use App\Models\Cfempleadosservicios;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class CfempleadosserviciosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfempleadosservicios.index')->only(['index', 'show']);
        $this->middleware('permission:cfempleadosservicios.create')->only(['create', 'store']);
        $this->middleware('permission:cfempleadosservicios.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfempleadosservicios.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfempleadosservicios/index', [
            'empleadosservicios' => Cfempleadosservicios::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfempleadosservicios/create', [
            'empleadosservicios' => new Cfempleadosservicios(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfempleadosservicios::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $empleadosservicios = Cfempleadosservicios::create($request->all() + $audt);
            return redirect()->route('cfempleadosservicios.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfempleadosservicios/show', [
            'empleadosservicios' => Cfempleadosservicios::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfempleadosservicios/edit', [
            'empleadosservicios' => Cfempleadosservicios::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfempleadosservicios)
    {
        request()->validate(Cfempleadosservicios::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $empleadosservicios = Cfempleadosservicios::findOrFail($cfempleadosservicios);
            $empleadosservicios->update($request->all() + $audt);
            return redirect()->route('cfempleadosservicios.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $empleadosservicios = Cfempleadosservicios::findOrFail($id);
        $empleadosservicios->deleted_by =  Auth::user()->id;
        $empleadosservicios->save();
        $empleadosservicios->delete();

        return redirect()->route('cfempleadosservicios.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}