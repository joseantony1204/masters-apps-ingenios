<?php

namespace App\Http\Controllers;

use App\Models\Cfsedesusers;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

class CfsedesusersController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfsedesusers.index')->only(['index', 'show']);
        $this->middleware('permission:cfsedesusers.create')->only(['create', 'store']);
        $this->middleware('permission:cfsedesusers.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfsedesusers.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfsedesusers/index', [
            'cfsedesusers' => Cfsedesusers::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfsedesusers/create', [
            'cfsedesusers' => new Cfsedesusers(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfsedesusers::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfsedesusers = Cfsedesusers::create($request->all() + $audt);
            return redirect()->route('cfsedesusers.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfsedesusers/show', [
            'cfsedesusers' => cfsedesusers::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfsedesusers/edit', [
            'cfsedesusers' => Cfsedesusers::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfsedesusers)
    {
        request()->validate(Cfsedesusers::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfsedesusers = Cfsedesusers::findOrFail($cfsedesusers);
            $cfsedesusers->update($request->all() + $audt);
            return redirect()->route('cfsedesusers.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cfsedesusers = Cfsedesusers::findOrFail($id);
        $cfsedesusers->deleted_by =  Auth::user()->id;
        $cfsedesusers->save();
        $cfsedesusers->delete();

        return redirect()->route('cfsedesusers.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}