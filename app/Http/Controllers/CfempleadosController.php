<?php

namespace App\Http\Controllers;

use App\Http\Requests\CfempleadosRequest;
use App\Models\{Personas, Personasnaturales, Cfempleados, Cfmaestra, User, Comercios, Productos};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB,Auth,Hash,Mail};

class CfempleadosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfempleados.index')->only(['index', 'show']);
        $this->middleware('permission:cfempleados.create')->only(['create', 'store']);
        $this->middleware('permission:cfempleados.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfempleados.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfempleados/index', [
            'empleados' => Cfempleados::search($request)->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfempleados/create', [
            'personas' => new Personas(),
            'personasnaturales' => new Personasnaturales(),
            'empleados' => new Cfempleados(),
            'tpidentificacionList' => Cfmaestra::getlistatipos('LIS_TIPOSIDENTIFICACIONES'),
            'sexosList' => Cfmaestra::getlistatipos('LIS_SEXOS'),
            'ocupacionesList' => Cfmaestra::getlistatipos('LIS_OCUPACIONES'),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOS'),
        ]);
    }

    public function store(CfempleadosRequest $request) 
    {

        try {
            return DB::transaction(function () use ($request) {
               
                // 0. Obtener el comercio del usuario autenticado
                $userAuth = User::where('persona_id', Auth::user()->persona_id)->first();
                $comercio = Comercios::with('sedes')->where('persona_id', $userAuth->persona_id)->first();

                $audt = ['created_by' => Auth::user()->id, 'created_at' => now()]; 
                
                // 1. Crear Persona
                $persona = Personas::create($request->only([
                    'tipoidentificacion_id', 'identificacion', 'telefonomovil', 'email'
                ]) + $audt);

                // 2. Crear Persona Natural
                $persona->personasnaturales()->create($request->only([
                    'nombre', 'segundonombre', 'apellido', 'segundoapellido', 
                    'fechanacimiento', 'sexo_id', 'ocupacion_id'
                ]) + $audt);

                // 3. Crear Empleado
                $persona->empleados()->create($request->only([
                    'fechaingreso', 'estado_id', 'observaciones'
                ]) + 
                [
                    'comercio_id' => $comercio->id, 
                ] + $audt);

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
                    'created_by'  => Auth::user()->id,
                    'created_at'  => now()
                ]);

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

                return redirect()->route('cfempleados.index')
                    ->with('success', 'Empleado y datos personales creados correctamente.');
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

        // Cargamos el empleado con todas sus relaciones anidadas
        $empleado = Cfempleados::with([
            'persona.personasnaturales', 
            'persona.user.perfil',
            'horarios' => function($query) {
                // Traemos la relación 'dias' dentro de horarios para obtener el nombre
                $query->with('dias')->orderBy('dia_id', 'asc');
            },
            'estado',          
            'persona.user.sedes',
            'bloqueos' => function($query) {
                // Traemos la relación 'dias' dentro de horarios para obtener el nombre
                $query->with('motivo')->orderBy('motivo_id', 'asc');
            },
            // Cargamos los servicios con sus datos de la tabla pivote
            'serviciosasignados' => function($query) {
                $query->with('sede'); 
            },
            'detallescitas.cita.cliente.persona.personasnaturales', // Para el nombre del cliente'
            'detallescitas.cita' => function($query) {
                // Traemos la relación 'estado' dentro de citas para obtener el nombre
                $query->with('estado')->orderBy('estado_id', 'asc');
            },
            'detallescitas.empleadoservicio.servicio', // Para el nombre del servicio
        ])->findOrFail($id);

        // 1. Obtener los IDs de servicios que YA tiene asociados para excluirlos
        $serviciosActualesIds = $empleado->serviciosAsignados()->pluck('productos.id');
        // 2. Obtener los IDs de las sedes vinculadas al usuario del empleado
        // Relación: cfempleados -> personas -> usuarios -> usuarios_sedes -> sedes
        //$sedesIds = $empleado->persona->user->sedes()->pluck('cfsedes.id');
        // Dentro del método show
        $sedesIds = $empleado->persona->user->sedes()
        ->wherePivot('estado_id', 858) // Solo las que tienen estado activo
        ->pluck('cfsedes.id')
        ->toArray();

        // ID de la sede predeterminada actual
        $sedePredeterminada = $empleado->persona->user->sedes()
        ->wherePivot('predeterminada', 1)
        ->first()?->id;

        // 3. Consultar productos disponibles en esas sedes que NO estén asignados ya
        $serviciosDisponibles = Productos::with('sede')
        ->whereIn('sede_id', $sedesIds)
        ->where('tipo_id', '<>' ,854) // Solo servicios y combos
        ->whereNotIn('id', $serviciosActualesIds)
        ->where('estado_id', 858) // Opcional: solo activos
        ->get(['id', 'nombre', 'preciosalida', 'duracion','sede_id']); // Traer solo lo necesario para la modal


        return Inertia::render('cfempleados/show', [
            'empleado' => $empleado,
            'sedesComercio' => $sedesComercio,
            'sedesAsignadasIds' => $sedesIds,
            'sedePredeterminadaId' => $sedePredeterminada,
            'perfilesList' => Cfmaestra::getlistatipos('LIS_PERFILES'),
            'motivosList' => Cfmaestra::getlistatipos('LIS_MOTIVOSBLOQEOSAGENDA'),
            'serviciosList' => $serviciosDisponibles,
        ]);
    }

    // Método para Vincular/Desvincular (Switch)
    public function toggleSedePermiso(Request $request, Cfempleados $empleado, $sedeId)
    {
        $userEmpleado = $empleado->persona->user;
        $nuevoEstado = $request->activo ? 858 : 859; // 858 para Activo, 859 para Inactivo
        // Buscamos si ya existe la relación en la tabla pivote
        $existe = $userEmpleado->sedes()->where('cfsedes.id', $sedeId)->exists();

        if ($existe) {
            // Si existe, solo actualizamos el estado_id en la tabla pivote
            $userEmpleado->sedes()->updateExistingPivot($sedeId, [
                'estado_id' => $nuevoEstado
            ]);
        } else {
            // Si no existe y se está activando, se crea el registro
            if ($request->activo) {
                $userEmpleado->sedes()->attach($sedeId, [
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
    public function setSedePredeterminada(Cfempleados $empleado, $sedeId)
    {
        $userEmpleado = $empleado->persona->user;

        // 1. Validar que la sede esté habilitada primero
        if (!$userEmpleado->sedes->contains($sedeId)) {
            return back()->withErrors(['error' => 'Primero debes habilitar la sede para el usuario']);
        }

        // 2. Resetear todas a 0 y marcar la nueva como 1
        $userEmpleado->sedes()->updateExistingPivot($userEmpleado->sedes->pluck('id'), ['predeterminada' => 0]);
        $userEmpleado->sedes()->updateExistingPivot($sedeId, ['predeterminada' => 1]);

        return back();
    }

    public function asignarServicio(Request $request)
    {
        try {
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];
            $request->validate([
                'empleado_id' => 'required|exists:cfempleados,id',
                'servicio_id' => 'required|exists:productos,id',
                'preciopersonalizado' => 'required|numeric',
                'duracionpersonalizado' => 'required|integer',
                'comision' => 'nullable|numeric',
            ]);

            $empleado = CfEmpleados::findOrFail($request->empleado_id);

            // Guardar en la tabla 'cfempleadosservicios'
            $empleado->serviciosAsignados()->attach($request->servicio_id, [
                'preciopersonalizado' => $request->preciopersonalizado,
                'duracionpersonalizado' => $request->duracionpersonalizado,
                'fechacreado' => now(),
                'comision' => $request->comision,
                'estado_id' => 858, // Activo por defecto
                'observaciones' => $request->observaciones,
            ] + $audt);
            return back()->with('success', 'Servicio asignado correctamente al empleado.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        } 
    }

    public function editarServicio(Request $request, Cfempleados $empleado, $servicioId)
    {
        $validated = $request->validate([
            'preciopersonalizado'    => 'required|numeric|min:0',
            'duracionpersonalizado' => 'required|integer|min:1',
            'comision'               => 'nullable|numeric|min:0|max:100',
        ]);

        // Actualizamos los datos en la tabla pivote 'cfempleadosservicios'
        $empleado->serviciosAsignados()->updateExistingPivot($servicioId, [
            'preciopersonalizado'    => $validated['preciopersonalizado'],
            'duracionpersonalizado' => $validated['duracionpersonalizado'],
            'comision'               => $validated['comision'] ?? 0,
            'observaciones' => $request->observaciones,
        ]);

        return back()->with('success', 'Servicio actualizado correctamente.');
    }

    public function updateEstadoServicio(Request $request, Cfempleados $empleado, $servicioId)
    {
        // Buscamos la relación en la tabla pivote y actualizamos el estado_id
        // Asumiendo: 858 = Activo, 859 = Inactivo (ajusta según tus IDs de estados)
        $nuevoEstado = $request->activo ? 858 : 859;

        $empleado->serviciosAsignados()->updateExistingPivot($servicioId, [
            'estado_id' => $nuevoEstado
        ]);

        return back()->with('success', 'Estado del servicio actualizado.');
    }

    public function destroyServicio(Cfempleados $empleado, $servicioId)
    {
        // Desvincular de la tabla pivote
        $empleado->serviciosAsignados()->detach($servicioId);
        
        return back()->with('success', 'Servicio desvinculado con éxito.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $empleado = CfEmpleados::findOrFail($id);

        return Inertia::render('cfempleados/edit', [
            'empleados' => $empleado,
            'personas' => Personas::where('id',$empleado->persona_id)->first(),
            'personasnaturales' => Personasnaturales::where('persona_id',$empleado->persona_id)->first(),
            'tpidentificacionList' => Cfmaestra::getlistatipos('LIS_TIPOSIDENTIFICACIONES'),
            'sexosList' => Cfmaestra::getlistatipos('LIS_SEXOS'),
            'ocupacionesList' => Cfmaestra::getlistatipos('LIS_OCUPACIONES'),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOS'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfempleados)
    {
        
        try {   
            return DB::transaction(function () use ($request, $cfempleados) {                     
                $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
                $empleado = Cfempleados::findOrFail($cfempleados);
                // 1. Actualizar persona
                $persona = Personas::where('id',$empleado->persona_id)->first();
                $persona->update($request->only(['tipoidentificacion_id', 'identificacion', 'telefonomovil', 'email']) + $audt);
                
                // 2. Actualizar persona natural
                $persona->personasnaturales()->update($request->only([
                    'nombre', 'segundonombre', 'apellido', 'segundoapellido', 
                    'fechanacimiento', 'sexo_id', 'ocupacion_id'
                ]) + $audt);

                // 3. Actualizar empleado
                $persona->empleados()->update($request->only([
                    'fechaingreso', 'estado_id', 'observaciones'
                ]) + $audt);
                
                return redirect()->route('cfempleados.index')->with('success', 'Elemento actualizado exitosamente.');
            });
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    public function updatePerfil(Request $request, Cfempleados $empleado)
    {
        $request->validate([
            'username' => 'required|string',
            'email'          => 'nullable|email|unique:users,email,' . $empleado->persona->user->id,
            'telefonomovil'       => 'nullable|string|unique:users,telefonomovil,' . $empleado->persona->user->id,
            'perfil_id'            => 'required',
        ]);

        // 1. Actualizar Persona
        $empleado->persona->update([
            'email' => $request->email,
            'telefonomovil'       => $request->telefonomovil,
        ]);

        // 2. Actualizar Usuario (Email y Rol)
        $user = $empleado->persona->user;
        $user->update(['email' => $request->email]);
        $user->update(['telefonomovil' => $request->telefonomovil]);
        $user->update(['perfil_id' => $request->perfil_id]);

        return back()->with('success', 'Perfil actualizado con éxito');
    }

    public function updateHorarios(Request $request, $id)
    {
        $empleado = Cfempleados::findOrFail($id);

        foreach ($request->horarios as $h) {
            // Actualizamos o creamos el registro del horario para cada día
            $empleado->horarios()->updateOrCreate(
                ['dia_id' => $h['dia_id']], // Condición de búsqueda
                [
                    'horainicio' => $h['horainicio'],
                    'horafinal'  => $h['horafinal'],
                    'estado'     => $h['estado'] ? 1 : 0,
                    'created_by' => Auth::user()->id
                ]
            );
        }

        return back()->with('success', 'Horarios actualizados correctamente.');
    }

    public function validarDisponibilidad(Request $request)
    {
        $field = $request->field;
        $value = $request->value;
        $excludeId = $request->exclude_id;

        if ($field === 'email') {
            $exists = User::where('email', $value)
                        ->where('persona_id', '!=', $excludeId)
                        ->exists();
            if ($exists) {
                return back()->withErrors(['email' => 'Este correo ya está registrado por otro usuario.']);
            }
        }

        if ($field === 'telefonomovil') {
            $exists = Personas::where('telefonomovil', $value)
                            ->where('id', '!=', $excludeId)
                            ->exists();
            if ($exists) {
                return back()->withErrors(['telefonomovil' => 'Este teléfono ya está asignado a otra persona.']);
            }
        }

        return back();
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $empleados = Cfempleados::findOrFail($id);
        $empleados->deleted_by =  Auth::user()->id;
        $empleados->save();
        $empleados->delete();

        return redirect()->route('cfempleados.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}