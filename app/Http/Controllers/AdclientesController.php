<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdclientesRequest;
use App\Models\{Personas, Personasnaturales, Adclientes, Cfsedesusers, Cfmaestra, User, Comercios, Ftturnos};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB,Auth,Hash,Mail};

class AdclientesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:adclientes.index')->only(['index', 'show']);
        $this->middleware('permission:adclientes.create')->only(['create', 'store']);
        $this->middleware('permission:adclientes.edit')->only(['edit', 'update']);
        $this->middleware('permission:adclientes.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('adclientes/index', [
            'clientes' => Adclientes::search($request)->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('adclientes/create', [
            'clientes' => new Adclientes(),
            'personas' => new Personas(),
            'personasnaturales' => new Personasnaturales(),
            'tpidentificacionList' => Cfmaestra::getlistatipos('LIS_TIPOSIDENTIFICACIONES'),
            'sexosList' => Cfmaestra::getlistatipos('LIS_SEXOS'),
            'ocupacionesList' => Cfmaestra::getlistatipos('LIS_OCUPACIONES'),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOS'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AdclientesRequest $request) 
    {

        try {
            return DB::transaction(function () use ($request) {
               
                // 0. Obtener el comercio del usuario autenticado
                $userAuth = User::where('persona_id', Auth::user()->persona_id)->first();
                $comercio = Comercios::with('sedes')->where('persona_id', $userAuth->persona_id)->first();

                $audt = ['created_by' => Auth::user()->id, 'created_at' => now()]; 

                // 1. Buscamos o creamos la persona
                $persona = Personas::updateOrCreate(
                    ['identificacion' => $request->identificacion], // Condición de búsqueda
                    [
                        'telefonomovil' => $request->telefonomovil,
                        'email' => $request->email,
                        'tipoidentificacion_id' => $request->tipoidentificacion_id,
                    ] + $audt
                );

                // 2. Crear Persona Natural
                $persona->personasnaturales()->updateOrCreate(
                    ['persona_id' => $persona->id], // Condición de búsqueda
                    [
                        'nombre' => $request->nombre,
                        'segundonombre' => $request->segundonombre,
                        'apellido' => $request->apellido,
                        'segundoapellido' => $request->segundoapellido,
                        'fechanacimiento' => $request->fechanacimiento,
                        'sexo_id' => $request->sexo_id,
                        'ocupacion_id' => $request->ocupacion_id,
                    ] + $audt
                );

                // 3. Crear Cliente vinculado al comercio
                $persona->clientes()->updateOrCreate(
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
                        'created_by'    => Auth::id(),
                    ]
                );

                // 5. Asociar a sedes (Optimizado en una sola consulta)
                $sedesIds = $comercio->sedes->pluck('id');

                if ($sedesIds->isNotEmpty()) {
                    $authId = Auth::id();
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

                return redirect()->route('adclientes.index')
                    ->with('success', 'Cliente y datos adicionales creados correctamente.');
            });

        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Obtenemos el comercio del usuario autenticado (dueño/admin)
        $user = User::where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::with('sedes')->where('persona_id', $user->persona_id)->first();
        // Todas las sedes del comercio para la lista de la izquierda
        $sedesComercio = $comercio->sedes;

        // Cargamos el clientes con todas sus relaciones anidadas
        $cliente = Adclientes::with([
            'persona.personasnaturales', 
            'persona.user.perfil',
            // 1. Cargamos los cupones de la persona
            'persona.cupones' => function($query) use ($comercio) {
                // 2. Filtramos los cupones que tengan una promoción ligada a este comercio
                $query->whereHas('promociones', function($q) use ($comercio) {
                    $q->where('comercio_id', $comercio->id);
                })
                // 3. Cargamos la relación promociones ya filtrada
                ->with('promociones'); 
            },
            'estado',          
            'persona.user.sedes',
            'citas.estado',
            'citas.detalle_con_empleadoservicio.empleadoservicio.empleado.persona.personasnaturales',
            'citas.detalle_con_empleadoservicio.empleadoservicio.servicio',
            // Aplicamos la restricción a producto y a su relación tipo
            'citas.detalle_con_producto.producto.tipo' => function($query) {
                // Seleccionamos id, nombre y la FK tipo_id para poder cargar la siguiente relación
                $query->select('id', 'nombre'); 
            },
            'citas.detalle_con_empleadoservicio.estado',
        ])->findOrFail($id);

        // Dentro del método show
        $sedesIds = $cliente->persona->user->sedes()
        ->wherePivot('estado_id', 858) // Solo las que tienen estado activo
        ->where('comercio_id', $comercio->id) // Aseguramos que sean del mismo comercio
        ->pluck('cfsedes.id')
        ->toArray();

        // ID de la sede predeterminada actual
        $sedePredeterminada = $cliente->persona->user->sedes()
        ->where('comercio_id', $comercio->id) // Aseguramos que sea del mismo comercio
        ->wherePivot('predeterminada', 1)
        ->first()?->id;
        
        // Usamos first() para tener el objeto directamente
        $sedePredeterminadaPos = $user->sedes()
        ->with(['terminal'])
        ->wherePivot('predeterminada', 1)
        ->where('comercio_id', $comercio->id) // Aseguramos que sea del mismo comercio
        ->first();

        //Consultar turnos abiertos filtrados por Sede y Comercio
        $turnosAbiertos = Ftturnos::with(['terminal.sede'])
        ->where('estado_id', 924) // 924 = ABIERTO
        ->whereHas('terminal', function ($query) use ($sedePredeterminadaPos) {
            // Filtramos directamente por el ID de la sede que ya obtuvimos
            $query->where('sede_id', $sedePredeterminadaPos->id);
        })
        ->whereHas('terminal.sede', function ($query) use ($comercio) {
            // Aseguramos que la sede pertenezca al comercio actual
            $query->where('comercio_id', $comercio->id);
        })
        ->orderBy('fechaapertura', 'DESC')
        ->get();
        //Definir el turno activo por defecto (el primero de la lista)
       $turnoActivo = $turnosAbiertos->first();

        return Inertia::render('adclientes/show', [
            'cliente' => $cliente,
            'sedesComercio' => $sedesComercio,
            'sedesAsignadasIds' => $sedesIds,
            'sedePredeterminadaId' => $sedePredeterminada,
            'perfilesList' => Cfmaestra::getlistatipos('LIS_PERFILES'),

            'turnoActivo' => $turnoActivo,
            'turnosList'  => $turnosAbiertos,
            'sedePredeterminadaPos' => $sedePredeterminadaPos,
            'metodospagosList' => Cfmaestra::getlistatipos('LIS_METODOSPAGO'),
            'estadosList' => Cfmaestra::where('padre','=',Cfmaestra::select('id')->where('codigo','=',strtoupper('LIS_ESTADOSCITAS'))->first()->id)->whereIn('codigo',['CA','RE'])->get()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
        ]);
    }

    // Método para Vincular/Desvincular (Switch)
    public function toggleSedePermiso(Request $request, Adclientes $cliente, $sedeId)
    {
        $userCliente = $cliente->persona->user;
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
    public function setSedePredeterminada(Adclientes $cliente, $sedeId)
    {
        $userCliente = $cliente->persona->user;

        // 1. Validar que la sede esté habilitada primero
        if (!$userCliente->sedes->contains($sedeId)) {
            return back()->withErrors(['error' => 'Primero debes habilitar la sede para el usuario']);
        }

        // 2. Resetear todas a 0 y marcar la nueva como 1
        $userCliente->sedes()->updateExistingPivot($userCliente->sedes->pluck('id'), ['predeterminada' => 0]);
        $userCliente->sedes()->updateExistingPivot($sedeId, ['predeterminada' => 1]);

        return back();
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $clientes = Adclientes::findOrFail($id);
        return Inertia::render('adclientes/edit', [
            'clientes' => $clientes,
            'personas' => Personas::where('id',$clientes->persona_id)->first(),
            'personasnaturales' => Personasnaturales::where('persona_id',$clientes->persona_id)->first(),
            'tpidentificacionList' => Cfmaestra::getlistatipos('LIS_TIPOSIDENTIFICACIONES'),
            'sexosList' => Cfmaestra::getlistatipos('LIS_SEXOS'),
            'ocupacionesList' => Cfmaestra::getlistatipos('LIS_OCUPACIONES'),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOS'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $adclientes)
    {
        try {   
            return DB::transaction(function () use ($request, $adclientes) {                     
                $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
                $cliente = Adclientes::findOrFail($adclientes);
                // 1. Actualizar persona
                $persona = Personas::where('id',$cliente->persona_id)->first();
                $persona->update($request->only(['tipoidentificacion_id', 'identificacion', 'telefonomovil', 'email']) + $audt);
                
                // 2. Actualizar persona natural
                $persona->personasnaturales()->update($request->only([
                    'nombre', 'segundonombre', 'apellido', 'segundoapellido', 
                    'fechanacimiento', 'sexo_id', 'ocupacion_id'
                ]) + $audt);

                // 3. Actualizar empleado
                $persona->clientes()->update($request->only([
                    'fechaingreso', 'estado_id', 'referido_id'
                ]) + $audt);
                
                return redirect()->route('adclientes.index')->with('success', 'Elemento actualizado exitosamente.');
            });
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }  
    }

    public function updatePerfil(Request $request, Adclientes $cliente)
    {
        $request->validate([
            'username' => 'required|string',
            'email'          => 'nullable|email|unique:users,email,' . $cliente->persona->user->id,
            'telefonomovil'       => 'nullable|string|unique:users,telefonomovil,' . $cliente->persona->user->id,
            'perfil_id'            => 'required',
        ]);

        // 1. Actualizar Persona
        $cliente->persona->update([
            'email' => $request->email,
            'telefonomovil'       => $request->telefonomovil,
        ]);

        // 2. Actualizar Usuario (Email y Rol)
        $user = $cliente->persona->user;
        $user->update(['email' => $request->email]);
        $user->update(['telefonomovil' => $request->telefonomovil]);
        $user->update(['perfil_id' => $request->perfil_id]);

        return back()->with('success', 'Perfil actualizado con éxito');
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $adclientes = Adclientes::findOrFail($id);
        $adclientes->deleted_by =  Auth::user()->id;
        $adclientes->save();
        $adclientes->delete();

        return redirect()->route('adclientes.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }

    public function buscar(Request $request)
    {
        $term = $request->get('term');
        $user = Auth::user();
    
        // Si aún así da error, es porque el middleware no está actuando
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
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
            'pn.sexo_id',
            'pn.fechanacimiento',
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
                $query->where('p.identificacion','LIKE', $term.'%')
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
}