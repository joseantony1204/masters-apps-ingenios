<?php

namespace App\Http\Controllers;

use App\Models\Ftdetalles;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class FtdetallesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftdetalles.index')->only(['index', 'show']);
        $this->middleware('permission:ftdetalles.create')->only(['create', 'store']);
        $this->middleware('permission:ftdetalles.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftdetalles.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('ftdetalles/index', [
            'ftdetalles' => Ftdetalles::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ftdetalles/create', [
            'ftdetalles' => new Ftdetalles(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Ftdetalles::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $ftdetalles = Ftdetalles::create($request->all() + $audt);
            return redirect()->route('ftdetalles.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftdetalles/show', [
            'ftdetalles' => ftdetalles::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('ftdetalles/edit', [
            'ftdetalles' => Ftdetalles::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ftdetalles)
    {
        request()->validate(Ftdetalles::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftdetalles = Ftdetalles::findOrFail($ftdetalles);
            $ftdetalles->update($request->all() + $audt);
            return redirect()->route('ftdetalles.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftdetalles = Ftdetalles::findOrFail($id);
        $ftdetalles->deleted_by =  Auth::user()->id;
        $ftdetalles->save();
        $ftdetalles->delete();

        return redirect()->route('ftdetalles.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}