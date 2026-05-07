<?php

namespace App\Http\Controllers;

use App\Models\{Cfpersonascomercios,Personas, Comercios};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class CfpersonascomerciosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfpersonascomercios.index')->only(['index', 'show']);
        $this->middleware('permission:cfpersonascomercios.create')->only(['create', 'store']);
        $this->middleware('permission:cfpersonascomercios.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfpersonascomercios.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cfpersonascomercios = Personas::with(
            [
                'personasnaturales',
                'admincomercios.comercios',
                'user.perfil',
            ]
        )->whereNull('deleted_at')->get();
        $todosLosComercios = Comercios::all(['id', 'nombre']); 

        return Inertia::render('cfpersonascomercios/index', [
            'cfpersonascomercios' => $cfpersonascomercios,
            'todosLosComercios' => $todosLosComercios,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfpersonascomercios/create', [
            'cfpersonascomercios' => new Cfpersonascomercios(),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfpersonascomercios/show', [
            'cfpersonascomercios' => cfpersonascomercios::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfpersonascomercios/edit', [
            'cfpersonascomercios' => Cfpersonascomercios::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfpersonascomercios)
    {
        request()->validate(Cfpersonascomercios::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfpersonascomercios = Cfpersonascomercios::findOrFail($cfpersonascomercios);
            $cfpersonascomercios->update($request->all() + $audt);
            return redirect()->route('cfpersonascomercios.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cfpersonascomercios = Cfpersonascomercios::findOrFail($id);
        $cfpersonascomercios->deleted_by =  Auth::user()->id;
        $cfpersonascomercios->save();
        $cfpersonascomercios->delete();

        return redirect()->route('cfpersonascomercios.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'persona_id' => 'required|exists:personas,id',
            'comercio_id' => 'required|exists:comercios,id',
        ]);

        // 1. Evitar duplicados de vinculación (independiente de si está activo o no)
        $existe = Cfpersonascomercios::where('persona_id', $request->persona_id)
            ->where('comercio_id', $request->comercio_id)
            ->first();

        if ($existe) {
            return back()->with('error', 'Esta persona ya tiene un registro con este comercio.');
        }

        // 2. REGLA DE ORO: Desactivar cualquier otro comercio de esta persona antes de crear el nuevo activo
        Cfpersonascomercios::where('persona_id', $request->persona_id)
            ->update(['activo' => 0, 'updated_by' => Auth::id()]);

        // 3. Crear el nuevo registro como el único activo
        Cfpersonascomercios::create([
            'persona_id' => $request->persona_id,
            'comercio_id' => $request->comercio_id,
            'activo' => 1, // Se crea activo por defecto
            'created_by' => Auth::id(),
        ]);

        return back()->with('success', 'Comercio vinculado y activado como único acceso.');
    }

    public function toggle(Request $request, $id)
    {
        $acceso = Cfpersonascomercios::findOrFail($id);

        // Si el usuario intenta desactivar el que ya está activo, 
        // podrías permitirlo o exigir que siempre haya uno activo. 
        // Aquí simplemente lo invertimos:
        
        if ($acceso->activo == 0) {
            // REGLA DE ORO: Si vamos a activar este, desactivamos TODOS los demás de esta persona
            Cfpersonascomercios::where('persona_id', $acceso->persona_id)
                ->where('id', '!=', $id) // Excluimos el actual
                ->update(['activo' => 0, 'updated_by' => Auth::id()]);
                
            $acceso->activo = 1;
        } else {
            // Si ya está activo y lo tocan, lo desactivamos (opcional)
            $acceso->activo = 0;
        }

        $acceso->updated_by = Auth::id();
        $acceso->save();

        return back()->with('success', 'Acceso actualizado. Se ha respetado la regla de exclusividad.');
    }
}