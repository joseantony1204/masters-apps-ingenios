<?php

namespace App\Http\Controllers;

use App\Models\{User,Cfmaestra,Comercios, Personas};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB,Auth,Hash,Mail};
use Illuminate\Validation\Rules\Password;
use App\Helpers\StorageHelper;

class UsersController extends Controller
{
    public function __construct(){
        $this->middleware('permission:users.index')->only(['index', 'show']);
        $this->middleware('permission:users.create')->only(['create', 'store']);
        $this->middleware('permission:users.edit')->only(['edit', 'update']);
        $this->middleware('permission:users.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $users = User::search($request)->get();

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('users/create', [
            'users' => new User(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(User::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $users = User::create($request->all() + $audt);
            return redirect()->route('users.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $userAuth = User::where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::with('sedes')->where('persona_id', $userAuth->persona_id)->first();
        // Todas las sedes del comercio para la lista de la izquierda
        $sedesComercio = $comercio->sedes;

        $user = User::with([
            'personas.personasnaturales', 
            'perfil',
            'estado',
            'soportes' => function($q) {
                $q->where('tipo_id', 1)->where('predeterminado', 1);
            }
        ])
        ->findOrFail($id);

        // Dentro del método show
        $sedesIds = $user->sedes()
            ->wherePivot('estado_id', 858) // Solo las que tienen estado activo
            ->where('comercio_id', $comercio->id) // Aseguramos que sean del mismo comercio
            ->pluck('cfsedes.id')
            ->toArray();

        // Usamos first() para tener el objeto directamente
        $sedePredeterminada = $user->sedes()
            ->wherePivot('predeterminada', 1)
            ->where('comercio_id', $comercio->id) // Aseguramos que sea del mismo comercio
            ->first()?->id;

        return Inertia::render('users/show', [
            'users' => $user,
            'sedesComercio' => $sedesComercio,
            'sedesAsignadasIds' => $sedesIds,
            'sedePredeterminadaId' => $sedePredeterminada,
            'perfilesList' => Cfmaestra::getlistatipos('LIS_PERFILES'),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOS'),
        ]);
    }

    /**$user$user$user
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('users/edit', [
            'users' => User::findOrFail($id),
            'perfilesList' => Cfmaestra::getlistatipos('LIS_PERFILES'),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOS'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $users)
    {
        request()->validate(User::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $users = User::findOrFail($users);
            $users->update($request->all() + $audt);
            return redirect()->route('users.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $users = User::findOrFail($id);
        $users->deleted_by =  Auth::user()->id;
        $users->save();
        $users->delete();

        return redirect()->route('users.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }

    /**
     * Actualizar la contraseña del usuario asociado al empleado.
     */
    public function updatePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'current_password' => ['required'], // Quitamos la regla automática aquí
            'password' => [
                'required', 
                'confirmed', 
                Password::min(8)->letters()->mixedCase()->numbers()->symbols()
            ],
        ], [
            'password.confirmed' => 'La confirmación de la contraseña no coincide.',
            'password.min' => 'La nueva contraseña debe tener al menos 8 caracteres.',
        ]);

        // VALIDACIÓN MANUAL: Comparamos la clave ingresada con la del usuario encontrado
        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors([
                'current_password' => 'La contraseña actual no coincide con los registros del usuario.'
            ]);
        }

        // Actualización
        $user->update([
            'password' => Hash::make($request->password)
        ]);
        return back()->with('success', 'Contraseña actualizada con éxito.');
    }

    public function updatePerfil(Request $request, User $user)
    {
        // Validamos usando el ID directo del usuario que recibimos por parámetro
        //dd($request->all(), $user->id);
        $request->validate([
            'username'      => 'required|string',
            'email'         => 'nullable|email|unique:users,email,' . $user->id,
            'telefonomovil' => 'nullable|string|unique:users,telefonomovil,' . $user->id,
            'perfil_id'     => 'required|exists:cfmaestras,id', // Recomendado validar que el perfil exista
            'estado_id'     => 'required|exists:cfmaestras,id', // Recomendado validar que el perfil exista
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', 
        ]);

        try {
            // 1. Actualizar la tabla Persona (si existe la relación)
            if ($user->personas) {
                $user->personas->update([
                    'email'         => $request->email,
                    'telefonomovil' => $request->telefonomovil,
                ]);
            }

            // 2. Actualizar el Usuario en una sola ejecución (más eficiente)
            $user->update([
                'email'         => $request->email,
                'telefonomovil' => $request->telefonomovil,
                'perfil_id'     => $request->perfil_id,
                'estado_id'     => $request->estado_id,
                // 'username'   => $request->username, // Descomenta si quieres permitir editar el username
            ]);

            // 3. Lógica Polimórfica para el Soporte (Logo)
            // USAR EL HELPER PARA EL LOGO
            if ($request->hasFile('logo')) {
                StorageHelper::save(
                    $request->file('logo'), 
                    'users/logos', 
                    966, // model_type
                    $user->id, // model_type_id
                    1 // Referencia a cfmaestras (Tipo Soporte)
                );
            }

            return back()->with('success', 'Perfil actualizado con éxito');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'No se pudo actualizar: ' . $e->getMessage()]);
        }
    }

    public function updatePerfils(Request $request, User $user)
    {
        $request->validate([
            'username' => 'required|string',
            'email'          => 'nullable|email|unique:users,email,' . $user->persona->user->id,
            'telefonomovil'       => 'nullable|string|unique:users,telefonomovil,' . $user->persona->user->id,
            'perfil_id'            => 'required',
        ]);

        // 1. Actualizar Persona
        $user->persona->update([
            'email' => $request->email,
            'telefonomovil'       => $request->telefonomovil,
        ]);

        // 2. Actualizar Usuario (Email y Rol)
        $user->update(['email' => $request->email]);
        $user->update(['telefonomovil' => $request->telefonomovil]);
        $user->update(['perfil_id' => $request->perfil_id]);

        return back()->with('success', 'Perfil actualizado con éxito');
    }

    // Método para Vincular/Desvincular (Switch)
    public function toggleSedePermiso(Request $request, User $user, $sedeId)
    {
        $userCliente = $user;
        $nuevoEstado = $request->activo ? 858 : 859; // 858 para Activo, 859 para Inactivo
        // Buscamos si ya existe la relación en la tabla pivote
        $existe = $userCliente->sedes()->where('cfsedes.id', $sedeId)->exists();

        if ($existe) {
            // Si existe, solo actualizamos el estado_id en la tabla pivote
            $userCliente->sedes()->updateExistingPivot($sedeId, [
                'estado_id' => $nuevoEstado
            ]);
        } else {
            // Si no existe y se está activando, se crea el registro
            if ($request->activo) {
                $userCliente->sedes()->attach($sedeId, [
                    'estado_id' => 858,
                    'predeterminada' => 0,
                    'created_by' => Auth::user()->id, 
                    'created_at' => now()
                ]);
            }
        }

        return back();
    }

    // Método para Sede Predeterminada (Radio)
    public function setSedePredeterminada(User $user, $sedeId)
    {
        $userCliente = $user;

        // 1. Validar que la sede esté habilitada primero
        if (!$userCliente->sedes->contains($sedeId)) {
            return back()->withErrors(['error' => 'Primero debes habilitar la sede para el usuario']);
        }

        // 2. Resetear todas a 0 y marcar la nueva como 1
        $userCliente->sedes()->updateExistingPivot($userCliente->sedes->pluck('id'), ['predeterminada' => 0]);
        $userCliente->sedes()->updateExistingPivot($sedeId, ['predeterminada' => 1]);

        return back();
    }
}