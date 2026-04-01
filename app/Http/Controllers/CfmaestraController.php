<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Cfmaestra;
use Illuminate\Support\Facades\{DB,Auth};

class CfmaestraController extends Controller
{

    public function __construct(){
        $this->middleware('permission:cfmaestra.index')->only(['index', 'show']);
        $this->middleware('permission:cfmaestra.create')->only(['create', 'store']);
        $this->middleware('permission:cfmaestra.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfmaestra.destroy')->only(['destroy']);
    }

    public function index(Request $request)
    {
        return Inertia::render('cfmaestra/index', [
            'cfmaestras' => Cfmaestra::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return Inertia::render('cfmaestra/create', [
            'cfmaestra' => new Cfmaestra(),
            'tiposList' => Cfmaestra::getlistatipos('LIS_TIPOTABLAS'),
            'jerarquiaList' => array()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        request()->validate(Cfmaestra::$rules);
        $request["visible"] = (!$request->get('visible')) ? ($request["visible"] == '0') ? 1:0 : 1;
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfmaestra = Cfmaestra::create($request->all() + $audt);
            return redirect()->route('cfmaestra.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return Inertia::render('cfmaestra/show', [
            'cfmaestra' => Cfmaestra::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return Inertia::render('cfmaestra/edit', [
            'cfmaestra' => Cfmaestra::findOrFail($id),
            'tiposList' =>Cfmaestra::all()->sortBy('nombre')->pluck('nombre', 'id'),
            'jerarquiaList' => Cfmaestra::all()->sortBy('nombre')->pluck('nombre', 'id')
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  Cfmaestra $cfmaestras
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $cfmaestra)
    {
        request()->validate(Cfmaestra::$rules);
        $request["visible"] = (!$request->get('visible')) ? ($request["visible"] == '0') ? 1:0 : 1;

        try {                        
            // DB::transaction(function () use ($request, $cfmaestras){
                $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
                $cfmaestra = Cfmaestra::find($cfmaestra);
                $cfmaestra->update($request->all()+$audt);
            // });
            return redirect()->route('cfmaestra.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function destroy($id)
    {
        $cfmaestra = Cfmaestra::findOrFail($id);
        $cfmaestra->deleted_by =  Auth::user()->id; // registra el ID del usuario
        $cfmaestra->save(); // guarda antes de eliminar

        $cfmaestra->delete(); // esto marca el deleted_at

        return redirect()->route('cfmaestra.index')
            ->with('success', 'Cfmaestra eliminada correctamente');
    }

}
