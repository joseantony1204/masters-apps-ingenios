<?php

namespace App\Http\Controllers;

use App\Models\Adresenas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class AdresenasController extends Controller
{
    public function __construct(){
        $this->middleware('permission:adresenas.index')->only(['index', 'show']);
        $this->middleware('permission:adresenas.create')->only(['create', 'store']);
        $this->middleware('permission:adresenas.edit')->only(['edit', 'update']);
        $this->middleware('permission:adresenas.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('adresenas/index', [
            'adresenas' => Adresenas::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('adresenas/create', [
            'adresenas' => new Adresenas(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Adresenas::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $adresenas = Adresenas::create($request->all() + $audt);
            return redirect()->route('adresenas.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('adresenas/show', [
            'adresenas' => adresenas::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('adresenas/edit', [
            'adresenas' => Adresenas::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $adresenas)
    {
        request()->validate(Adresenas::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $adresenas = Adresenas::findOrFail($adresenas);
            $adresenas->update($request->all() + $audt);
            return redirect()->route('adresenas.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $adresenas = Adresenas::findOrFail($id);
        $adresenas->deleted_by =  Auth::user()->id;
        $adresenas->save();
        $adresenas->delete();

        return redirect()->route('adresenas.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}