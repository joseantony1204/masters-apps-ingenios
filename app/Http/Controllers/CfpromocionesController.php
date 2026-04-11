<?php

namespace App\Http\Controllers;

use App\Models\{Cfpromociones,User,Comercios};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class CfpromocionesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfpromociones.index')->only(['index', 'show']);
        $this->middleware('permission:cfpromociones.create')->only(['create', 'store']);
        $this->middleware('permission:cfpromociones.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfpromociones.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = User::where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::where('persona_id', $user->persona_id)->first(); 

        $cfpromociones = Cfpromociones::with('cupones')->where('comercio_id',$comercio->id)->whereNull('deleted_at')->get();

        return Inertia::render('cfpromociones/index', [
            'promociones' => $cfpromociones
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfpromociones/create', [
            'cfpromociones' => new Cfpromociones(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfpromociones::$rules);
        try {    
            $user = User::where('persona_id',Auth::user()->persona_id)->first();
            $comercio = Comercios::where('persona_id', $user->persona_id)->first(); 

            $audt = ['comercio_id' => $comercio->id, 'created_by' => Auth::user()->id, 'created_at' => now()]; 
            $cfpromociones = Cfpromociones::create($request->all() + $audt);
            return redirect()->route('cfpromociones.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfpromociones/show', [
            'cfpromociones' => cfpromociones::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfpromociones/edit', [
            'cfpromociones' => Cfpromociones::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfpromociones)
    {
        request()->validate(Cfpromociones::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfpromociones = Cfpromociones::findOrFail($cfpromociones);
            $cfpromociones->update($request->all() + $audt);
            return redirect()->route('cfpromociones.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cfpromociones = Cfpromociones::findOrFail($id);
        $cfpromociones->deleted_by =  Auth::user()->id;
        $cfpromociones->save();
        $cfpromociones->delete();

        return redirect()->route('cfpromociones.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }

    public function toggle(CfPromociones $cfpromocion)
    {
        // Invertimos el estado actual
        $cfpromocion->update([
            'estado' => !$cfpromocion->estado
        ]);

        return back()->with('success', 'Estado de la campaña actualizado');
    }

    public function getCupones(CfPromociones $promocion)
    {
        return $promocion->cupones()->with([
            'personas' => function($query) {
                // Importante: seleccionar 'id' para que la relación hija pueda conectarse
                $query->select('id', 'identificacion'); 
            },
            'personas.personasnaturales' => function($query) {
                // Importante: seleccionar 'persona_id' para que Eloquent haga el match
                $query->select('persona_id', 'nombre', 'apellido'); 
            },
        ])->latest()->get();
    }

}