<?php

namespace App\Http\Controllers;

use App\Models\Sgrolesperfiles;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class SgrolesperfilesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:sgrolesperfiles.index')->only(['index', 'show']);
        $this->middleware('permission:sgrolesperfiles.create')->only(['create', 'store']);
        $this->middleware('permission:sgrolesperfiles.edit')->only(['edit', 'update']);
        $this->middleware('permission:sgrolesperfiles.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('sgrolesperfiles/index', [
            'sgrolesperfiles' => Sgrolesperfiles::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('sgrolesperfiles/create', [
            'sgrolesperfiles' => new Sgrolesperfiles(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Sgrolesperfiles::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $sgrolesperfiles = Sgrolesperfiles::create($request->all() + $audt);
            return redirect()->route('sgrolesperfiles.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('sgrolesperfiles/show', [
            'sgrolesperfiles' => sgrolesperfiles::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('sgrolesperfiles/edit', [
            'sgrolesperfiles' => Sgrolesperfiles::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $sgrolesperfiles)
    {
        request()->validate(Sgrolesperfiles::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $sgrolesperfiles = Sgrolesperfiles::findOrFail($sgrolesperfiles);
            $sgrolesperfiles->update($request->all() + $audt);
            return redirect()->route('sgrolesperfiles.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $sgrolesperfiles = Sgrolesperfiles::findOrFail($id);
        $sgrolesperfiles->deleted_by =  Auth::user()->id;
        $sgrolesperfiles->save();
        $sgrolesperfiles->delete();

        return redirect()->route('sgrolesperfiles.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}