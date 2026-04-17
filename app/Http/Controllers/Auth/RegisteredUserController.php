<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\{Personas, User};
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB};
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Carbon\Carbon;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.Personas::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ],[
            'first_name.required' => 'El campo nombre es requerido',
            'last_name.required' => 'El campo apellido es requerido',
            'name.required' => 'El campo comercio es requerido',
            'email.required' => 'El campo email es requerido',
            'email.unique' => 'El correo elestrónico ya esta en uso.',
        ]);

        try {
            return DB::transaction(function () use ($request) {
            
                $audt = ['created_by' => 0, 'created_at' => now()]; 
                
                // 1. Crear Persona
                $persona = Personas::create([
                    'tipoidentificacion_id' => 11,
                    'identificacion' => $this->generarCodigoseguridad(),
                    'telefonomovil' => $this->generarCodigoseguridad(),
                    'email' => $request->email,
                ] + $audt);

                // 2. Crear Persona Natural
                $persona->personasnaturales()->create([
                    'nombre' => $request->first_name,
                    'apellido' => $request->last_name,
                    'fechanacimiento' => '1990-01-01',
                    'sexo_id' => 48, // Valor por defecto si no viene
                ] + $audt);

                // 3. Crear comercio
               $comercio = $persona->comercios()->create([
                    'token' => $this->generarToken(),
                    'nombre' => $request->name,
                ] + $audt);

                // 4. Crear Usuario para el cliente (opcional, según tu lógica de negocio)
                $nuevoUsuario = $persona->user()->create([
                    'username'    => trim($persona->email),
                    'password'    => Hash::make($request->password),
                    'email'       => $persona->email,
                    'telefonomovil' => $persona->telefonomovil,
                    'perfil_id'   => 7, // Perfil Cliente/Empleado
                    'estado_id'   => 850, // Activo
                    'persona_id'  => $persona->id,
                ] + $audt);

                // --- LÓGICA DE DATOS POR DEFECTO ---

                // 4. Crear Sede por defecto
                $sede = DB::table('cfsedes')->insertGetId([
                    'nombre' => 'SEDE PRINCIPAL',
                    'ciudad' => 'CIUDAD', // Según tu dataSedes
                    'telefono'=>'000 000 0000', 
                    'direccion' => 'CALLE 1',
                    'comercio_id' => $comercio->id,
                ] + $audt);

                // 5. Crear Resolución por defecto (para facturación)
                $resolucionId = DB::table('ftresoluciones')->insertGetId([
                    'numero' => '123456789',
                    'fecha' => '2000-01-01',
                    'prefijo' => 'SETT',
                    'desde' => '1',
                    'hasta' => '500',
                    'advertirescacez' => '1',
                    'comercio_id' => $comercio->id,
                ] + $audt);

                // 6. Crear Terminal (Caja) por defecto
                DB::table('ftterminales')->insert([
                    'nombre' => 'Caja 1',
                    'sede_id' => $sede,
                    'resolucion_id' => $resolucionId,
                ] + $audt);

                // 7. Asociar a sedes (cfsedesusers)
                $sedesIds = $comercio->sedes->pluck('id')->toArray();

                if (!empty($sedesIds)) {
                    // Sincronizamos todas las sedes con estado activo (858)
                    $nuevoUsuario->sedes()->syncWithPivotValues($sedesIds, [
                        'predeterminada' => false,
                        'estado_id'      => 858,
                        'created_by'     => 1,
                        'created_at'     => now()
                    ]);

                    // Marcamos la primera sede como predeterminada
                    $nuevoUsuario->sedes()->updateExistingPivot($sedesIds[0], [
                        'predeterminada' => true
                    ]);
                }

                // 8. Crear Suscripcion por defecto
                $suscripcionId = DB::table('scsuscripciones')->insertGetId([
                        'fecha_inicio'=>Carbon::now()->format('Y/m/d'), 
                        'fecha_vencimiento'=>Carbon::now()->addDays(15)->format('Y/m/d'), 
                        'estado_id' => 980, 
                        'plan_id' => 968, 
                        'comercio_id' => $comercio->id,
                ] + $audt);

                // 9. Crear pago por defecto
                DB::table('scpagos')->insert([
                        'valor'=>0, 
                        'fecha'=>Carbon::now(), 
                        'estado_id' => 974, 
                        'metodo_id' => 933, 
                        'suscripcion_id' =>$suscripcionId,  
                ] + $audt);

                event(new Registered($nuevoUsuario));
                Auth::login($nuevoUsuario);
                return redirect()->intended(route('dashboard'));
                
            });

        } catch (\Exception $e) {
            return redirect()->route('register')->withErrors([
                'error' => $e->getMessage()
            ]); 
        }
    }

    private function generarCodigoseguridad()
    {
        // Genera una cadena aleatoria de 10 caracteres
        $identificacion = Str::random(10);

        // Opcional: Validar que el código no exista ya en la base de datos (recursión)
        $existe = DB::table('personas')->where('identificacion', $identificacion)->exists();
        
        if ($existe) {
            return $this->generarCodigoCita();
        }
        return strtoupper($identificacion); // Lo devolvemos en mayúsculas para que sea más legible
    }

    private function generarToken()
    {
        // Genera una cadena aleatoria de 10 caracteres
        $token = Str::uuid()->toString() . Str::random(32);

        // Opcional: Validar que el código no exista ya en la base de datos (recursión)
        $existe = DB::table('comercios')->where('token', $token)->exists();
        
        if ($existe) {
            return $this->generarToken();
        }

        return strtoupper($token); // Lo devolvemos en mayúsculas para que sea más legible
    }
}
