<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Adclientes,Comercios, Personas, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB,Hash};

class AdclientesController extends Controller
{
    public function buscar(Request $request)
    {
        $term = $request->get('term');
        $user = Auth::user();
    
        // Si aún así da error, es porque el middleware no está actuando
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $adclientes = Adclientes::
        join("personas AS p","p.id","=","adclientes.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'adclientes.estado_id')
        ->select([
            'adclientes.id',
            'p.foto',
            'p.identificacion',
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            
         
            'p.telefonomovil',
            'p.email'
        ])
        ->where('su.predeterminada', 1)
        // Usamos el ID del comercio del usuario autenticado
        ->where('adclientes.comercio_id', function($q) use ($user) {
            $q->select('id')->from('comercios')->where('persona_id', $user->persona_id)->first();
        })
        ->whereIn('su.sede_id', function($q) use ($user) {
            $q->select('sede_id')->from('cfsedesusers')->where('usuario_id', $user->id);
        })
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        if($term){
            $adclientes->where(function($query) use ($term) {
                $query->where('p.identificacion','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.nombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundonombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.apellido','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundoapellido','LIKE', explode(' ','%'.$term.'%'));
            });
        }

        $clientes = $adclientes->orderby('pn.nombre', 'ASC')
                      ->limit(10)
                      ->get();

        return response()->json($clientes);
    }

    public function verificarcrear(Request $request) {
        // 1. Buscamos la persona primero
        $personaExistente = Personas::where('identificacion', $request->identificacion)->first();
        
        // 2. Definimos las reglas de validación dinámicamente
        // Si la persona existe, ignoramos su propio ID en la regla 'unique' para permitir la actualización
        $personaId = $personaExistente ? $personaExistente->id : 'NULL';
        
        // Para el usuario (telefonomovil), necesitamos el ID del usuario vinculado a esa persona si existe
        $usuarioId = ($personaExistente && $personaExistente->user) ? $personaExistente->user->id : 'NULL';

        $request->validate([
            'identificacion' => "required|unique:personas,identificacion,{$personaId}",
            'telefonomovil' => "required|unique:users,telefonomovil,{$usuarioId}",
            'nombre' => 'required',
            'apellido' => 'required',
        ], [
            'identificacion.required' => 'La identificación es requerida',
            'identificacion.unique' => 'Esta identificación ya está registrada',
            'telefonomovil.required' => 'El telefonomovil es requerido',
            'telefonomovil.unique' => 'El telefono movil ya esta tomado por otra persona',
            'nombre.required' => 'El nombre es requerido',
            'apellido.required' => 'El apellido es requerido',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $comercio = Comercios::with('sedes')->where('token', $request->token)->first();
                $audt = ['created_by' => $request->telefonomovil, 'created_at' => now()]; 

                // 1. Buscamos o creamos la persona
                $persona = Personas::updateOrCreate(
                    ['identificacion' => $request->identificacion], // Condición de búsqueda
                    [
                        'identificacion' => $request->identificacion,
                        'telefonomovil' => $request->telefonomovil,
                        'tipoidentificacion_id' => 10,
                    ] + $audt
                );

                // 2. Crear Persona Natural
                $persona->personasnaturales()->updateOrCreate(
                    ['persona_id' => $persona->id], // Condición de búsqueda
                    [
                        'nombre' => $request->nombre,
                        'apellido' => $request->apellido,
                        'fechanacimiento' => '1990-01-01',
                        'sexo_id' => 48,
                    ] + $audt
                );

                // 3. Crear Cliente vinculado al comercio
                $cliente = $persona->clientes()->updateOrCreate(
                    ['persona_id' => $persona->id], // Condición de búsqueda
                    [
                        'fechaingreso' => now(),
                        'estado_id' => 850, // Activo
                        'comercio_id' => $comercio->id,
                    ] + $audt
                );

                // 4. Obtener o crear el usuario de forma segura
                // Buscamos por persona_id para evitar duplicados si la identificación cambió
                $nuevoUsuario = $persona->user ?: User::updateOrCreate(
                    ['persona_id' => $persona->id],
                    [
                        'username'      => trim($persona->identificacion),
                        'password'      => Hash::make($persona->identificacion),
                        'email'         => $persona->email,
                        'telefonomovil' => $persona->telefonomovil,
                        'perfil_id'     => 911, // Perfil Cliente
                        'estado_id'     => 850, // Activo
                        'created_by'    => $request->telefonomovil,
                    ]
                );

                // 5. Asociar a sedes (Optimizado en una sola consulta)
                $sedesIds = $comercio->sedes->pluck('id');

                if ($sedesIds->isNotEmpty()) {
                    $authId = $request->telefonomovil;
                    $timestamp = now();

                    // Preparamos el array para el sync: [id_sede => [datos_pivote]]
                    $dataSedes = $sedesIds->mapWithKeys(function ($id, $index) use ($authId, $timestamp) {
                        return [$id => [
                            'predeterminada' => $index === 0, // La primera será true, las demás false
                            'estado_id'      => 858,          // Activo
                            'created_by'     => $authId,
                            'created_at'     => $timestamp
                        ]];
                    })->toArray();

                    // Sincroniza todo de golpe (inserta nuevos, actualiza existentes, elimina no presentes)
                    //$nuevoUsuario->sedes()->sync($dataSedes);
                    /**
                     * IMPORTANTE: syncWithoutDetaching
                     * Esto agrega las nuevas sedes o actualiza las existentes en este comercio,
                     * pero NO toca los registros de sedes de otros comercios.
                     */
                    $nuevoUsuario->sedes()->syncWithoutDetaching($dataSedes);
                }

                // 6. Estructurar la respuesta para el Frontend
                // Este objeto debe tener los mismos campos que espera tu buscador de clientes
                $persona->generateAndSendOpt($persona->identificacion, $persona->telefonomovil);
                $dataCliente = [
                    'id' => $cliente->id,
                    'nombre' => $request->nombre,
                    'apellido' => $request->apellido,
                    'telefonomovil' => $request->telefonomovil,
                ];
                return response()->json($dataCliente,201);
            });

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al crear el cliente',
                'message' => 'Error al crear el cliente: ' . $e->getMessage()
            ], 500);
        }
    }
}