<?php

namespace App\Http\Controllers;

use App\Models\{Personas, User,Comercios, Cfsedes, Ftresoluciones, Ftterminales, Ftturnos};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};
use App\Helpers\StorageHelper;

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
        // 1. Obtenemos el comercio del usuario con su persona
        $comercio = Comercios::with([
            'persona', 
            'soportes' => function($q) {
                $q->where('tipo_id', 1)->where('predeterminado', 1);
            }
        ])
        ->where('persona_id', Auth::user()->persona_id)
        ->first();

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
        $comercio = Comercios::findOrFail($request->id);

        // Obtenemos el ID de la persona para las excepciones de unique
        $personaId = $comercio->persona_id;

        $request->validate([
            'id' => 'required|exists:comercios,id',
            'nombre' => 'required|string|max:255',
            // Cambiamos 'nit' por 'required' y corregimos el unique
            'nit' => 'required|unique:personas,identificacion,' . $personaId,
            // En unique, el tercer parámetro es el ID de la fila que quieres ignorar
            'email' => 'required|email|unique:personas,email,' . $personaId,
            'telefonomovil' => 'required|string|unique:personas,telefonomovil,' . $personaId,
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
            'persona_id' => 'required|exists:personas,id',
        ], [
            'nombre.required' => 'El campo razón social es requerido',
            'nit.required' => 'El campo NIT es requerido',
            'nit.unique' => 'Este NIT ya está registrado',
            'email.required' => 'El campo email es requerido',
            'email.unique' => 'Este email ya está en uso',
            'nit.unique' => 'Este nit ya está en uso',
            'telefonomovil.required' => 'El campo teléfono es requerido',
            'telefonomovil.unique' => 'Este teléfono ya está en uso',
        ]);

        try {
            return DB::transaction(function () use ($request,$comercio) {
                // 1. Actualizar datos de Persona
                $comercio->persona->update([
                    'identificacion' => $request->nit,
                    'direccion' => $request->direccion,
                    'email' => $request->email,
                    'telefonomovil' => $request->telefonomovil,
                ]);

                // 2. Actualizar datos de Comercio
                $comercio->update([
                    'nombre' => $request->nombre,
                    'objetocomercial' => $request->objetocomercial,
                    'updated_by' => Auth::id(),
                ]);

                // 3. Lógica Polimórfica para el Soporte (Logo)
                // USAR EL HELPER PARA EL LOGO
                if ($request->hasFile('logo')) {
                    StorageHelper::save(
                        $request->file('logo'), 
                        'comercios/logos', 
                        923, // model_type
                        $comercio->id, // model_type_id
                        1 // Referencia a cfmaestras (Tipo Soporte)
                    );
                }

                return redirect()->back()->with('success', 'Comercio actualizado correctamente');
            });

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Error al actualizar: ' . $e->getMessage()]);
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