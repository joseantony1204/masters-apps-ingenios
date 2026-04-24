<?php

namespace App\Http\Controllers;

use App\Models\Movimientosproductos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class MovimientosproductosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:movimientosproductos.index')->only(['index', 'show']);
        $this->middleware('permission:movimientosproductos.create')->only(['create', 'store']);
        $this->middleware('permission:movimientosproductos.edit')->only(['edit', 'update']);
        $this->middleware('permission:movimientosproductos.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('movimientosproductos/index', [
            'movimientosproductos' => Movimientosproductos::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('movimientosproductos/create', [
            'movimientosproductos' => new Movimientosproductos(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Movimientosproductos::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $movimientosproductos = Movimientosproductos::create($request->all() + $audt);
            return redirect()->route('movimientosproductos.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('movimientosproductos/show', [
            'movimientosproductos' => movimientosproductos::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('movimientosproductos/edit', [
            'movimientosproductos' => Movimientosproductos::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $movimientosproductos)
    {
        request()->validate(Movimientosproductos::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $movimientosproductos = Movimientosproductos::findOrFail($movimientosproductos);
            $movimientosproductos->update($request->all() + $audt);
            return redirect()->route('movimientosproductos.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $movimientosproductos = Movimientosproductos::findOrFail($id);
        $movimientosproductos->deleted_by =  Auth::user()->id;
        $movimientosproductos->save();
        $movimientosproductos->delete();

        return redirect()->route('movimientosproductos.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}