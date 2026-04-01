<?php

namespace App\Http\Controllers;

use App\Models\{Ftterminales, Comercios};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class FtterminalesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftterminales.index')->only(['index', 'show']);
        $this->middleware('permission:ftterminales.create')->only(['create', 'store']);
        $this->middleware('permission:ftterminales.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftterminales.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('ftterminales/index', [
            'ftterminales' => Ftterminales::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ftterminales/create', [
            'ftterminales' => new Ftterminales(),
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
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $ftterminales = Ftterminales::create($request->all() + $audt);
            return redirect()->back()->with('success', 'Terminal creada correctamente');

        }catch (\Exception $e){
            //return response()->json(['message' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Ocurrio un error al guardar los datos');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftterminales/show', [
            'ftterminales' => ftterminales::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('ftterminales/edit', [
            'ftterminales' => Ftterminales::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ftterminales)
    {
        request()->validate(Ftterminales::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftterminales = Ftterminales::findOrFail($ftterminales);
            $ftterminales->update($request->all() + $audt);
            return redirect()->back()->with('success', 'Terminal actualizado correctamente');
        }catch (\Exception $e){
            //return response()->json(['message' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Ocurrio un error al guardar los datos');
        }   
    }

    public function updateEstado(Request $request, $id)
    {
        $terminal = Ftterminales::findOrFail($id);
        
        // Lógica de alternancia: Si es 1 pasa a 0, y viceversa
        // Ajusta los IDs según tu tabla 'estados'
        $nuevoEstado = ($terminal->estado == 1) ? 0 : 1;
        
        $terminal->update(['estado' => $nuevoEstado]);

        return redirect()->back()->with('success', 'Estado actualizado');
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftterminales = Ftterminales::findOrFail($id);
        $ftterminales->deleted_by =  Auth::user()->id;
        $ftterminales->save();
        $ftterminales->delete();

        return redirect()->back()->with('success', 'Terminal eliminada correctamente');
    }
}