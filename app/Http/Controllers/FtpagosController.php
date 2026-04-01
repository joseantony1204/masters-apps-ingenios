<?php

namespace App\Http\Controllers;

use App\Models\Ftpagos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class FtpagosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftpagos.index')->only(['index', 'show']);
        $this->middleware('permission:ftpagos.create')->only(['create', 'store']);
        $this->middleware('permission:ftpagos.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftpagos.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('ftpagos/index', [
            'ftpagos' => Ftpagos::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ftpagos/create', [
            'ftpagos' => new Ftpagos(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Ftpagos::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $ftpagos = Ftpagos::create($request->all() + $audt);
            return redirect()->route('ftpagos.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftpagos/show', [
            'ftpagos' => ftpagos::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('ftpagos/edit', [
            'ftpagos' => Ftpagos::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ftpagos)
    {
        request()->validate(Ftpagos::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftpagos = Ftpagos::findOrFail($ftpagos);
            $ftpagos->update($request->all() + $audt);
            return redirect()->route('ftpagos.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftpagos = Ftpagos::findOrFail($id);
        $ftpagos->deleted_by =  Auth::user()->id;
        $ftpagos->save();
        $ftpagos->delete();

        return redirect()->route('ftpagos.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}