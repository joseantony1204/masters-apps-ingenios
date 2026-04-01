<?php

namespace App\Http\Controllers;

use App\Models\{Personas, Comercios, Cfsedes, Ftresoluciones, Ftterminales, Ftturnos};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};

class ComerciosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:comercios.index')->only(['index', 'show']);
        $this->middleware('permission:comercios.create')->only(['create', 'store']);
        $this->middleware('permission:comercios.edit')->only(['edit', 'update']);
        $this->middleware('permission:comercios.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // 1. Obtenemos el comercio del usuario con su persona
        $comercio = Comercios::with('persona')->where('persona_id', $user->persona_id)->first();

        if (!$comercio) {
            abort(403, 'Usuario no vinculado a un comercio.');
        }

        // IDs de las sedes del comercio para filtrar rápidamente
        $sedeIds = Cfsedes::where('comercio_id', $comercio->id)->pluck('id');

        return Inertia::render('comercios/index', [
            'comercio' => $comercio,
            // Sedes del comercio
            'sedesInitial' => Cfsedes::where('comercio_id', $comercio->id)->get(),
            // Resoluciones del comercio
            'resolucionesInitial' => Ftresoluciones::where('comercio_id', $comercio->id)->get(),
            // Terminales de CUALQUIER sede del comercio
            'terminalesInitial' => Ftterminales::with(['sede', 'resolucion'])
                ->whereIn('sede_id', $sedeIds)
                ->get(), 
            // Turnos de CUALQUIER terminal que pertenezca a las sedes del comercio
            'turnosInitial' => Ftturnos::with(['terminal.sede', 'persona.personasnaturales', 'estado'])
                ->whereIn('terminal_id', function($query) use ($sedeIds) {
                    $query->select('id')->from('ftterminales')->whereIn('sede_id', $sedeIds);
                })
                ->orderBy('fechaapertura', 'desc')
                ->get(),
            
            // --- DATOS PARA SELECTS (Solo activos) ---
            'sedes' => Cfsedes::where('estado', 1)
                ->where('comercio_id', $comercio->id)
                ->select('id', 'nombre')
                ->get(),
            'resoluciones' => Ftresoluciones::where('estado', 1)
                ->where('comercio_id', $comercio->id)
                ->where('estado', 1)
                ->select('id', 'prefijo', 'numero')
                ->get(),
            'terminales' => Ftterminales::whereIn('sede_id', $sedeIds)
                ->select('id', 'nombre')
                ->where('estado', 1)
                ->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('comercios/create', [
            'comercios' => new Comercios(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Comercios::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $comercios = Comercios::create($request->all() + $audt);
            return redirect()->route('comercios.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('comercios/show', [
            'comercios' => comercios::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('comercios/edit', [
            'comercios' => Comercios::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'nit' => 'required',
            'email' => 'required',
            'telefonomovil' => 'required',
            'logo' => 'nullable|image|max:2048', // 2MB Max
            'persona_id' => 'required|exists:personas,id',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $comercio = Comercios::findOrFail($request->id);
                $data = $request->except('logo');
                if ($request->hasFile('logo')) {
                    // Lógica para guardar imagen y obtener ruta
                    $data['logo_path'] = $request->file('logo')->store('logos', 'public');
                    $comercio->update($data);
                }
                $comercio->persona->update([
                    'identificacion' => $request->nit,
                    'direccion' => $request->direccion,
                    'email' => $request->email,
                    'telefonomovil' => $request->telefonomovil,
                ]);

                $comercio->update([
                    'nombre' => $request->nombre,
                    'objetocomercial' => $request->objetocomercial,
                    'direccion' => $request->direccion,
                    'updated_by' => Auth::user()->id,
                    'updated_at' => now(),
                ]);
                return redirect()->back()->with('success', 'Comercio actualizado correctamente');

          });

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $comercios = Comercios::findOrFail($id);
        $comercios->deleted_by =  Auth::user()->id;
        $comercios->save();
        $comercios->delete();

        return redirect()->route('comercios.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}