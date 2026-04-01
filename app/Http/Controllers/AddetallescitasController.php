<?php

namespace App\Http\Controllers;

use App\Models\Addetallescitas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class AddetallescitasController extends Controller
{
    public function __construct(){
        $this->middleware('permission:addetallescitas.index')->only(['index', 'show']);
        $this->middleware('permission:addetallescitas.create')->only(['create', 'store']);
        $this->middleware('permission:addetallescitas.edit')->only(['edit', 'update']);
        $this->middleware('permission:addetallescitas.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('addetallescitas/index', [
            'addetallescitas' => Addetallescitas::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('addetallescitas/create', [
            'addetallescitas' => new Addetallescitas(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Addetallescitas::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $addetallescitas = Addetallescitas::create($request->all() + $audt);
            return redirect()->route('addetallescitas.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('addetallescitas/show', [
            'addetallescitas' => addetallescitas::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('addetallescitas/edit', [
            'addetallescitas' => Addetallescitas::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $addetallescitas)
    {
        request()->validate(Addetallescitas::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $addetallescitas = Addetallescitas::findOrFail($addetallescitas);
            $addetallescitas->update($request->all() + $audt);
            return redirect()->route('addetallescitas.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $addetallescitas = Addetallescitas::findOrFail($id);
        $addetallescitas->deleted_by =  Auth::user()->id;
        $addetallescitas->save();
        $addetallescitas->delete();

        return redirect()->route('addetallescitas.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}