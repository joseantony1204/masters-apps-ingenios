<?php

namespace App\Http\Controllers;

use App\Models\{Ftresoluciones, Comercios};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};
use App\Http\Requests\FtresolucionesRequest;

class FtresolucionesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftresoluciones.index')->only(['index', 'show']);
        $this->middleware('permission:ftresoluciones.create')->only(['create', 'store']);
        $this->middleware('permission:ftresoluciones.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftresoluciones.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('ftresoluciones/index', [
            'ftresoluciones' => Ftresoluciones::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ftresoluciones/create', [
            'ftresoluciones' => new Ftresoluciones(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        $comercio = Comercios::with('persona')->where('persona_id', $user->persona_id)->first();
        $request['comercio_id'] = $comercio->id;
        //dd($request->all());
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $ftresoluciones = Ftresoluciones::create($request->all() + $audt);
            return redirect()->back()->with('success', 'Resolucion creada correctamente');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftresoluciones/show', [
            'ftresoluciones' => ftresoluciones::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('ftresoluciones/edit', [
            'ftresoluciones' => Ftresoluciones::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FtresolucionesRequest $request, $ftresoluciones)
    {
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftresoluciones = Ftresoluciones::findOrFail($ftresoluciones);
            $ftresoluciones->update($request->all() + $audt);
            return redirect()->back()->with('success', 'Resolucion actualizado correctamente');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    public function updateEstado(Request $request, $id)
    {
        $resolucion = Ftresoluciones::findOrFail($id);
        
        // Lógica de alternancia: Si es 1 pasa a 0, y viceversa
        // Ajusta los IDs según tu tabla 'estados'
        $nuevoEstado = ($resolucion->estado == 1) ? 0 : 1;
        
        $resolucion->update(['estado' => $nuevoEstado]);

        return redirect()->back()->with('success', 'Estado actualizado');
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftresoluciones = Ftresoluciones::findOrFail($id);
        $ftresoluciones->deleted_by =  Auth::user()->id;
        $ftresoluciones->save();
        $ftresoluciones->delete();

        return redirect()->back()->with('success', 'Resolucion eliminada correctamente');
    }
}