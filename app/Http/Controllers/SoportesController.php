<?php

namespace App\Http\Controllers;

use App\Models\Soportes;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class SoportesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:soportes.index')->only(['index', 'show']);
        $this->middleware('permission:soportes.create')->only(['create', 'store']);
        $this->middleware('permission:soportes.edit')->only(['edit', 'update']);
        $this->middleware('permission:soportes.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('soportes/index', [
            'soportes' => Soportes::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('soportes/create', [
            'soportes' => new Soportes(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Soportes::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $soportes = Soportes::create($request->all() + $audt);
            return redirect()->route('soportes.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('soportes/show', [
            'soportes' => soportes::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('soportes/edit', [
            'soportes' => Soportes::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $soportes)
    {
        request()->validate(Soportes::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $soportes = Soportes::findOrFail($soportes);
            $soportes->update($request->all() + $audt);
            return redirect()->route('soportes.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $soportes = Soportes::findOrFail($id);
        $soportes->deleted_by =  Auth::user()->id;
        $soportes->save();
        $soportes->delete();

        return redirect()->route('soportes.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}