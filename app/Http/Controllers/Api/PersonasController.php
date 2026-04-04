<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Personas,Personasnaturales,User,Comercios};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB,Auth,Hash,Mail};

class PersonasController extends Controller
{
    public function buscar(Request $request)
    {
        $term = $request->get('term');

        $personas = Personas::join('personasnaturales AS pn', 'personas.id', '=', 'pn.persona_id')
        ->select([
            'personas.id',
            'personas.foto',
            'personas.identificacion',
            DB::raw("CONCAT_WS(' ',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'personas.direccion',
            'personas.telefonomovil',
            'personas.email'
        ])
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        if($term){
            $personas->where(function($query) use ($term) {
                $query->where('personas.identificacion','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('personas.email','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('personas.telefonomovil','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.nombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundonombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.apellido','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundoapellido','LIKE', explode(' ','%'.$term.'%'));
            });
        }

        $persona = $personas->orderby('pn.nombre', 'ASC')
                      ->limit(10)
                      ->get();

        return response()->json($persona);
    }

    public function store(Request $request) 
    {
        // 1. Validación (Importante: nombres de campos que vienen del JS)
        $request->validate([
            'identificacion' => 'required|unique:personas,identificacion',
            'telefonomovil' => 'required',
            'nombre' => 'required',
            'apellido' => 'required',
            'fechanacimiento' => 'required|date',
        ], [
            'identificacion.required' => 'La identificación es requerida',
            'identificacion.unique' => 'Esta identificación ya está registrada',
            'telefonomovil.required' => 'El telefonomovil es requerido',
            'nombre.required' => 'El nombre es requerido',
            'apellido.required' => 'El apellido es requerido',
            'fechanacimiento.required' => 'El fecha nacimiento es requerido',
        ]);

        try {
            return DB::transaction(function () use ($request) {
            
                // 0. Obtener el comercio del usuario autenticado
                $userAuth = Auth::user();
                $comercio = Comercios::with('sedes')->where('persona_id', $userAuth->persona_id)->first();

                $audt = ['created_by' => $userAuth->id, 'created_at' => now()]; 
                
                // 1. Crear Persona
                $persona = Personas::create($request->only([
                    'tipoidentificacion_id', 'identificacion', 'telefonomovil', 'email'
                ]) + $audt);

                // 2. Crear Persona Natural
                $persona->personasnaturales()->create([
                    'nombre' => $request->nombre,
                    'apellido' => $request->apellido,
                    'fechanacimiento' => $request->fechanacimiento,
                    'sexo_id' => $request->sexo_id ?? 48, // Valor por defecto si no viene
                ] + $audt);

                // 3. Crear Cliente vinculado al comercio
                $persona->clientes()->create([
                    'fechaingreso' => now(),
                    'estado_id' => 850, // Activo
                    'comercio_id' => $comercio->id,
                ] + $audt);

                // 4. Crear Usuario para el cliente (opcional, según tu lógica de negocio)
                $nuevoUsuario = $persona->user()->create([
                    'username'    => trim($persona->identificacion),
                    'password'    => Hash::make($persona->identificacion),
                    'email'       => $persona->email,
                    'telefonomovil' => $persona->telefonomovil,
                    'perfil_id'   => 910, // Perfil Cliente/Empleado
                    'estado_id'   => 850, // Activo
                    'persona_id'  => $persona->id,
                ] + $audt);

                // 5. Asociar a sedes (cfsedesusers)
                $sedesIds = $comercio->sedes->pluck('id')->toArray();

                if (!empty($sedesIds)) {
                    // Sincronizamos todas las sedes con estado activo (858)
                    $nuevoUsuario->sedes()->syncWithPivotValues($sedesIds, [
                        'predeterminada' => false,
                        'estado_id'      => 858,
                        'created_by'     => Auth::user()->id,
                        'created_at'     => now()
                    ]);

                    // Marcamos la primera sede como predeterminada
                    $nuevoUsuario->sedes()->updateExistingPivot($sedesIds[0], [
                        'predeterminada' => true
                    ]);
                }

                // 6. Estructurar la respuesta para el Frontend
                // Este objeto debe tener los mismos campos que espera tu buscador de clientes
                $resultado = [
                    'id' => $persona->id,
                    'nombres' => $request->nombre,
                    'apellidos' => $request->apellido,
                    'identificacion' => $persona->identificacion,
                    'email' => $persona->email,
                    'telefonomovil' => $persona->telefonomovil,
                    'round' => strtoupper(substr($request->nombre, 0, 1)), // Inicial para el avatar
                ];

                // IMPORTANTE: Devolvemos JSON para que Axios lo capture
                return response()->json([
                    'success' => 'Cliente creado correctamente',
                    'message' => 'Cliente creado correctamente',
                    'data_created' => $resultado
                ], 201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el cliente',
                'message' => 'Error al crear el cliente: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function stores(Request $request) 
    {
        $validated = $request->validate([
            'identificacion' => 'required',
            'telefonomovil' => 'required',
            'nombre' => 'required',
            'apellido' => 'required',
            'fechanacimiento' => 'required',
        ],[
            'identificacion.required' => 'El identificacion es requerido',
            'telefonomovil.required' => 'El telefonomovil es requerido',
            'nombre.required' => 'El nombre es requerido',
            'apellido.required' => 'El apellido es requerido',
            'fechanacimiento.required' => 'El fecha nacimiento es requerido',
        ]);

        try {
            return DB::transaction(function () use ($request) {
               
                // 0. Obtener el comercio del usuario autenticado
                //$userAuth = User::where('persona_id', Auth::user()->persona_id)->first();
                $comercio = Comercios::with('sedes')->where('persona_id', 1)->first();

                $audt = ['created_by' => 1, 'created_at' => now()]; 
                
                // 1. Crear Persona
                $persona = Personas::create($request->only([
                    'tipoidentificacion_id', 'identificacion', 'telefonomovil', 'email'
                ]) + $audt);

                // 2. Crear Persona Natural
                $persona->personasnaturales()->create($request->only([
                    'nombre', 'segundonombre', 'apellido', 'segundoapellido', 
                    'fechanacimiento', 'sexo_id',
                ]) + $audt);

                // 3. Crear Cliente
                $persona->clientes()->create([
                    'fechaingreso' => now(),
                    'estado_id' => 850, // Activo
                    'comercio_id' => 1, //////////OJO
                    'created_by'  => 1,
                    'created_at'  => now()
                ]);

                // 4. Crear el Usuario para el Empleado
                // Usamos una variable distinta ($nuevoUsuario) para no confundir con el de sesión
                $nuevoUsuario = $persona->user()->create([
                    'username'    => trim($persona->identificacion),
                    'password'    => Hash::make($persona->identificacion),
                    'email'       => $persona->email,
                    'telefonomovil' => $persona->telefonomovil,
                    'perfil_id'   => 910, // Perfil Empleado
                    'estado_id'   => 850, // Activo
                    'persona_id'  => $persona->id,
                    'created_by'  => 1,
                    'created_at'  => now()
                ]);

                // 5. Asociar a sedes (cfsedesusers)
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

                $personaCreada = Personas::where('id', $persona->id)->first();
                $personaNaturalCreada = Personasnaturales::where('persona_id', $persona->id)->first();

                // Agregamos manualmente los campos calculados que usas en tu lista (round, etc)
                $resultado = [
                    'id' => $personaCreada->id,
                    'nombres' => $personaNaturalCreada->nombre,
                    'apellidos' => $personaNaturalCreada->apellido,
                    'identificacion' => $personaCreada->identificacion,
                    'email' => $personaCreada->email,
                    'telefonomovil' => $personaCreada->telefonomovil,
                    'round' => substr($personaNaturalCreada->nombre, 0, 1),
                ];


                return response()->json([
                    'success' => 'Cliente creado correctamente',
                    'message' =>  $resultado ,
                ]);
            });

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ocurrio un error',
                'message' =>  $e->getMessage() ,
            ]);
            
        }
    }
}