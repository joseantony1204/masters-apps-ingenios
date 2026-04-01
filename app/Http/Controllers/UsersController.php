<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB,Auth,Hash,Mail};
use Illuminate\Validation\Rules\Password;

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
        return Inertia::render('users/index', [
            'users' => User::whereNull('deleted_at')->get() 
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
        return Inertia::render('users/show', [
            'users' => user::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('users/edit', [
            'users' => User::findOrFail($id),
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
}