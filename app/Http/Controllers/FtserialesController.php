<?php

namespace App\Http\Controllers;

use App\Models\Ftseriales;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class FtserialesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftseriales.index')->only(['index', 'show']);
        $this->middleware('permission:ftseriales.create')->only(['create', 'store']);
        $this->middleware('permission:ftseriales.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftseriales.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('ftseriales/index', [
            'ftseriales' => Ftseriales::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ftseriales/create', [
            'ftseriales' => new Ftseriales(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Ftseriales::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $ftseriales = Ftseriales::create($request->all() + $audt);
            return redirect()->route('ftseriales.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftseriales/show', [
            'ftseriales' => ftseriales::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('ftseriales/edit', [
            'ftseriales' => Ftseriales::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ftseriales)
    {
        request()->validate(Ftseriales::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftseriales = Ftseriales::findOrFail($ftseriales);
            $ftseriales->update($request->all() + $audt);
            return redirect()->route('ftseriales.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftseriales = Ftseriales::findOrFail($id);
        $ftseriales->deleted_by =  Auth::user()->id;
        $ftseriales->save();
        $ftseriales->delete();

        return redirect()->route('ftseriales.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}