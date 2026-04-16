<?php

namespace App\Http\Controllers;

use App\Models\{Cfmaestras, Sgrolesperfiles};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};

class CfmaestrasController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfmaestras.index')->only(['index', 'show']);
        $this->middleware('permission:cfmaestras.create')->only(['create', 'store']);
        $this->middleware('permission:cfmaestras.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfmaestras.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perfiles = Cfmaestras::where('padre','=',Cfmaestras::select('id')->where('codigo','=',strtoupper('LIS_PERFILES'))->first()->id)->whereNull('deleted_at')->get();

        return Inertia::render('cfmaestras/index', [
            'perfiles' => $perfiles
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfmaestras/create', [
            'cfmaestras' => new Cfmaestras(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfmaestras::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfmaestras = Cfmaestras::create($request->all() + $audt);
            return redirect()->route('cfmaestras.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    // En tu Controlador (ej: CfmaestrasController.php)

    public function show($id)
    {
        $perfil = Cfmaestras::findOrFail($id);
        
        // 1. Obtenemos el ID del padre para roles
        $padreId = Cfmaestras::where('codigo', strtoupper('LIS_ROLES'))->first()->id;

        // 2. Consultamos los roles y sus permisos específicos para este perfil
        $roles = Cfmaestras::where('padre', $padreId)
            ->select([
                'id',
                'nombre',
                // Estado del rol para este perfil
                DB::raw("(SELECT rp.estado FROM sgrolesperfiles rp 
                        WHERE cfmaestras.id = rp.rol_id 
                        AND rp.perfil_id = " . $perfil->id . " LIMIT 1) AS estado")
            ])
            ->whereNull('deleted_at')
            ->get()
            ->map(function ($rol) use ($perfil) {
                // 3. Por cada rol, buscamos sus vistas/permisos asociados al perfil
                // Esta es la parte que reemplaza al $sgrolesperfiles->getvitas de tu Blade
                $rol->vistas = DB::table('cfmaestras as v')
                    ->select([
                        'v.id as vista_id',
                        'v.nombre',
                        'p.id as permiso_id',
                        'p.estado'
                    ])
                    ->join('sgpermisos as p', 'p.vista_id', '=', 'v.id')
                    ->join('sgrolesperfiles as rp', 'rp.id', '=', 'p.rolperfil_id')
                    ->where('rp.rol_id', $rol->id)
                    ->where('rp.perfil_id', $perfil->id)
                    ->get();
                    
                return $rol;
            });

        return Inertia::render('cfmaestras/show', [
            'perfil' => $perfil,
            'roles' => $roles
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfmaestras/edit', [
            'cfmaestras' => Cfmaestras::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfmaestras)
    {
        request()->validate(Cfmaestras::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfmaestras = Cfmaestras::findOrFail($cfmaestras);
            $cfmaestras->update($request->all() + $audt);
            return redirect()->route('cfmaestras.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cfmaestras = Cfmaestras::findOrFail($id);
        $cfmaestras->deleted_by =  Auth::user()->id;
        $cfmaestras->save();
        $cfmaestras->delete();

        return redirect()->route('cfmaestras.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}