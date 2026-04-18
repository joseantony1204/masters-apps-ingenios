<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    CfmaestraController,PersonasController,SgrolesperfilesController,
    ProductosController,CfimpuestosController,AdclientesController,
    CfempleadosController,AdcitasController,FtfacturasController,ComerciosController,
    FtresolucionesController,FtterminalesController,FtturnosController,
    FtdetallesController,FtpagosController,FtimpuestosController,
    CfbloqueosagendasController,AddetallescitasController,CfempleadosserviciosController,
    FtserialesController,CfsedesController,UsersController,
    CfhorariosController, CfpromocionesController, CfcuponesController,
    CfmaestrasController, ScsuscripcionesController, ScpagosController, ScplanesController};

use App\Http\Controllers\Public\{LandingController};
use App\Models\{Adclientes, User, Adcitas, Ftfacturas, Comercios, Cfmaestra, Ftturnos};
use Illuminate\Support\Facades\{Auth,DB,Hash};

Route::middleware(['auth', 'verified', 'check.comercio'])->group(function () {
    // Si entra a la raíz, lo mandamos al dashboard
    Route::get('/', function () {
        return redirect()->route('dashboard'); 
    })->name('home');
});

// Ruta pública para el QR
Route::get('/landing', [LandingController::class, 'index'])->name('public.landing');
Route::get('/confirmada', [LandingController::class, 'confirmada'])->name('public.confirmada');


Route::middleware(['auth', 'verified', 'check.comercio'])->group(function () {

    // --- MÓDULO: CONFIGURACIÓN Y MAESTRAS ---
    Route::resource('cfmaestra', CfmaestraController::class);
    Route::resource('cfmaestras', CfmaestrasController::class);
    Route::resource('cfimpuestos', CfimpuestosController::class);
    Route::resource('sgrolesperfiles', SgrolesperfilesController::class);
    Route::resource('cfsedes', CfsedesController::class);
    Route::resource('users', UsersController::class);

    // --- MÓDULO: ENTIDADES PRINCIPALES (CRM) ---
    Route::resource('personas', PersonasController::class);
    Route::resource('adclientes', AdclientesController::class);
    Route::resource('cfempleados', CfempleadosController::class);
    Route::resource('productos', ProductosController::class);

    // --- MÓDULO: AGENDA Y TURNOS ---
    Route::resource('adcitas', AdcitasController::class);
    Route::resource('addetallescitas', AddetallescitasController::class);
    Route::resource('cfbloqueosagendas', CfbloqueosagendasController::class);
    Route::resource('cfempleadosservicios', CfempleadosserviciosController::class);
    Route::resource('ftturnos', FtturnosController::class);
    Route::resource('cfhorarios', CfhorariosController::class);

    // --- MÓDULO: FACTURACIÓN Y CAJA ---
    Route::resource('ftfacturas', FtfacturasController::class);
    Route::resource('ftdetalles', FtdetallesController::class);
    Route::resource('ftpagos', FtpagosController::class);
    Route::resource('ftimpuestos', FtimpuestosController::class);
    Route::resource('ftresoluciones', FtresolucionesController::class);
    Route::resource('ftterminales', FtterminalesController::class);
    Route::resource('ftseriales', FtserialesController::class);
    Route::resource('cfpromociones', CfpromocionesController::class);
    Route::resource('cfcupones', CfcuponesController::class);
    //Route::resource('scsuscripciones', ScsuscripcionesController::class);
    Route::resource('scpagos', ScpagosController::class);

    Route::post('asignarServicio', [CfempleadosController::class, 'asignarServicio'])->name('cfempleados.asignarservicio');
    Route::put('cfempleados/{empleado}/servicios/{servicio}/estado', [CfempleadosController::class, 'updateEstadoServicio'])
    ->name('cfempleados.update-estado');
    Route::delete('cfempleados/{empleado}/servicios/{servicio}', [CfempleadosController::class, 'destroyServicio'])
        ->name('cfempleados.destroyservicio');
    Route::put('cfempleados/{empleado}/servicios/{servicio}', [CfempleadosController::class, 'editarServicio'])
        ->name('cfempleados.editarservicio');
    Route::put('cfempleados/{empleado}/sedes/{sede}/toggle-permiso', [CfempleadosController::class, 'toggleSedePermiso'])->name('cfempleados.toggle-permiso');
    Route::put('cfempleados/{empleado}/sedes/{sede}/set-default', [CfempleadosController::class, 'setSedePredeterminada'])->name('cfempleados.set-default');    
    Route::put('cfempleados/{empleado}/perfil', [CfempleadosController::class, 'updatePerfil'])
        ->name('cfempleados.updateperfil');
    Route::post('cfempleados/validar-disponibilidad', [CfempleadosController::class, 'validarDisponibilidad'])
        ->name('cfempleados.validar-disponibilidad');
    Route::put('cfempleados/{empleado}/horarios', [CfempleadosController::class, 'updateHorarios'])->name('cfempleados.update-horarios');
       

    Route::put('adclientes/{cliente}/perfil', [AdclientesController::class, 'updatePerfil'])->name('adclientes.updateperfil');
    Route::put('adclientes/{cliente}/sedes/{sede}/toggle-permiso', [AdclientesController::class, 'toggleSedePermiso'])->name('adclientes.toggle-permiso');
    Route::put('adclientes/{cliente}/sedes/{sede}/set-default', [AdclientesController::class, 'setSedePredeterminada'])->name('adclientes.set-default'); 

    Route::post('/citas/actualizardetallecita/{id}', [AdcitasController::class, 'actualizardetallecita'])->name('api.citas.actualizar');
    Route::put('adcitas/actualizar-estados/{id}', [AdcitasController::class, 'actualizarEstados'])->name('adcitas.cancelar');
    
    Route::patch('/cfsedes/{id}/estado', [CfsedesController::class, 'updateEstado'])->name('cfsedes.updateEstado');
    Route::patch('/ftresoluciones/{id}/estado', [FtresolucionesController::class, 'updateEstado'])->name('ftresoluciones.updateEstado');
    Route::patch('/ftterminales/{id}/estado', [FtterminalesController::class, 'updateEstado'])->name('ftterminales.updateEstado');
    
    // Ruta para obtener el JSON con el desglose de ventas (Pagos -> Facturas -> Turno)
    Route::get('/ftturnos/{id}/resumen', [FtturnosController::class, 'resumen'])->name('ftturnos.resumen');
    
    // Ruta para ejecutar el cierre definitivo del turno (cambio de estado y fecha de cierre)
    Route::patch('/ftturnos/{id}/cerrar', [FtturnosController::class, 'cerrar'])->name('ftturnos.cerrar');

    Route::patch('/cfpromociones/{cfpromocion}/toggle', [CfPromocionesController::class, 'toggle'])->name('cfpromociones.toggle');
    Route::post('/cfcupones/asignarVip', [CfcuponesController::class, 'asignarVip'])->name('cfcupones.asignarVip');
    Route::post('/cfcupones/storeLote', [CfcuponesController::class, 'storeLote'])->name('cfcupones.storeLote');
    Route::post('/cfcupones/validar', [CfcuponesController::class, 'validar'])->name('cfcupones.validar');
    Route::get('/cfpromociones/{promocion}/cupones', [CfPromocionesController::class, 'getCupones'])->name('cfpromociones.cupones');
    Route::post('/cfcupones/generar-cupones-masivos', [CfcuponesController::class, 'generarCuponesMasivos'])->name('cfcupones.generar-cupones-masivos');
    
    Route::prefix('comercios')->group(function () {
        // Vista Principal (Carga todo)
        Route::get('/', [ComerciosController::class, 'index'])->name('comercios.index');
        // Rutas para actualizaciones específicas (AJAX/Inertia)
        Route::post('/comercio', [ComerciosController::class, 'update'])->name('comercios.update');
    });
    
    Route::put('users/{user}/perfil', [UsersController::class, 'updatePerfil'])->name('users.updateperfil');
    Route::put('users/{user}/sedes/{sede}/toggle-permiso', [UsersController::class, 'toggleSedePermiso'])->name('users.toggle-permiso');
    Route::put('users/{user}/sedes/{sede}/set-default', [UsersController::class, 'setSedePredeterminada'])->name('users.set-default'); 
    Route::put('users/{user}/password', [UsersController::class, 'updatePassword'])->name('users.updatepassword');
    
    Route::put('setperfilrol', [App\Http\Controllers\SgrolesperfilesController::class, 'setperfilrol'])->name('sgrolesperfiles.setperfilrol');
    Route::put('updatepermiso', [App\Http\Controllers\SgrolesperfilesController::class, 'updatepermiso'])->name('sgrolesperfiles.updatepermiso');
    // Esta es la URL que el usuario puede refrescar sin errores
    Route::post('/scsuscripciones/checkout', [ScsuscripcionesController::class, 'checkout'])->name('scsuscripciones.checkout');
});

Route::resource('scplanes', ScplanesController::class);
Route::post('/scsuscripciones/gopay', [ScsuscripcionesController::class, 'gopay'])->name('scsuscripciones.gopay');
Route::get('/scsuscripciones/pay/{referencia}', [ScsuscripcionesController::class, 'pay'])->name('scsuscripciones.pay');
Route::get('/scsuscripciones', [ScsuscripcionesController::class, 'index'])->name('scsuscripciones.index');

Route::middleware(['auth', 'verified','check.comercio'])->group(function () {
    Route::get('dashboard', function () {

        $user = User::where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::with('suscripciones')->where('persona_id', $user->persona_id)->first();
        
        // Usamos first() para tener el objeto directamente
        $sedePredeterminada = $user->sedes()
        ->with(['terminal'])
        ->wherePivot('predeterminada', 1)
        ->first();

        //Consultar turnos abiertos filtrados por Sede y Comercio
        $turnosAbiertos = Ftturnos::with(['terminal.sede'])
        ->where('estado_id', 924) // 924 = ABIERTO
        ->whereHas('terminal', function ($query) use ($sedePredeterminada) {
            // Filtramos directamente por el ID de la sede que ya obtuvimos
            $query->where('sede_id', $sedePredeterminada->id);
        })
        ->whereHas('terminal.sede', function ($query) use ($comercio) {
            // Aseguramos que la sede pertenezca al comercio actual
            $query->where('comercio_id', $comercio->id);
        })
        ->orderBy('fechaapertura', 'DESC')
        ->get();
        //Definir el turno activo por defecto (el primero de la lista)
       $turnoActivo = $turnosAbiertos->first();

        // 1. Para las citas Iniciamos la Query (sin el get al final todavía)
        $adcitas = Adcitas::
        join("adclientes AS c","c.id","=","adcitas.cliente_id")
        ->join("personas AS p","p.id","=","c.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'adcitas.estado_id')
        ->with([
            'detalle_con_empleadoservicio.empleadoservicio.empleado.persona.personasnaturales',
            'detalle_con_empleadoservicio.empleadoservicio.servicio',
            // Aplicamos la restricción a producto y a su relación tipo
            'detalle_con_producto.producto.tipo' => function($query) {
                // Seleccionamos id, nombre y la FK tipo_id para poder cargar la siguiente relación
                $query->select('id', 'nombre'); 
            },
            'detalle_con_empleadoservicio.estado',
        ])
        ->select([
            'c.id as cliente_id',
            'p.id AS persona_id',
            'p.foto',
            'p.identificacion',
            DB::raw('CONCAT(YEAR(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " años ", MONTH(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " meses y ", DAY(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " dias") AS edad'),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'p.telefonomovil',
            'p.email',
            'adcitas.id',
            'adcitas.codigo',
            'adcitas.fecha',
            'adcitas.horainicio',
            'adcitas.horafinal',
            'm.observacion AS estado_observacion',
            'm.codigo AS estado_codigo',
            'm.nombre AS estado_nombre',
             // CÁLCULO DEL TOTAL MEDIANTE SUBCONSULTA (Elimina la necesidad del JOIN a addetallescitas)
             DB::raw("(SELECT SUM(preciofinal) FROM addetallescitas WHERE cita_id = adcitas.id AND deleted_at IS NULL) AS total")
        ])
        ->where('su.predeterminada', 1)
        // Usamos el ID del comercio del usuario autenticado
        ->where('c.comercio_id', function($q) use ($user) {
            $q->select('id')->from('comercios')->where('persona_id', $user->persona_id)->first();
        })
        ->whereIn('su.sede_id', function($q) use ($user) {
            $q->select('sede_id')->from('cfsedesusers')->where('usuario_id', $user->id);
        })
        ->whereNull('adcitas.deleted_at');

        // 3. FILTRO DE TIEMPO: Últimos 2 meses
        // Comparamos la fecha de la factura con la fecha actual menos 2 meses
        $adcitas->where('adcitas.fecha', '>=', now()->subMonths(6));

        // 4. EJECUTAMOS LA CONSULTA
        $citas = $adcitas->orderby('adcitas.fecha', 'DESC')
        ->orderby('adcitas.horainicio', 'DESC')
        ->get();

        // 0. Para las facturas Iniciamos la Query (sin el get al final todavía)
        $ftfacturas = Ftfacturas::with([
            'pagos',
            'cupon',
            'turnos.terminal.sede',
            'estado'
        ]);

        // 1. FILTRO DE TIEMPO: Últimos 6 meses
        // Comparamos la fecha de la factura con la fecha actual menos 6 meses
        $ftfacturas->where('ftfacturas.fecha', '>=', now()->subMonths(6));

        // 2. Filtro de seguridad por comercio
        $ftfacturas->whereHas('turnos.terminal.sede', function ($q) use ($comercio) {
            $q->where('comercio_id', $comercio->id);
        });

        // 3. Selección de campos con Lógica Condicional
        $ftfacturas->select([
            'ftfacturas.*',
            // Subconsulta para obtener el ID de la persona real dependiendo del tipo
            DB::raw("CASE 
                WHEN ftfacturas.model_type = 921 THEN (SELECT adclientes.persona_id FROM adcitas, adclientes WHERE adcitas.cliente_id = adclientes.id and adcitas.id = ftfacturas.model_type_id)
                ELSE ftfacturas.model_type_id 
            END as persona_real_id"),
            // Cálculo de total
            DB::raw("(SELECT SUM(total) FROM ftpagos WHERE factura_id = ftfacturas.id) as grand_total")
        ]);

        // 4. Joins dinámicos basados en la 'persona_real_id' calculada arriba
        $ftfacturas->leftJoin("personas AS p", function($join) {
            // Unimos usando la lógica del CASE para normalizar el origen
            $join->on("p.id", "=", DB::raw("CASE 
                WHEN ftfacturas.model_type = 921 THEN (SELECT adclientes.persona_id FROM adcitas, adclientes WHERE adcitas.cliente_id = adclientes.id and adcitas.id = ftfacturas.model_type_id)
                ELSE ftfacturas.model_type_id 
            END"));
        })
        ->leftJoin("personasnaturales AS pn", "p.id", "=", "pn.persona_id");

        // 5. Agregamos las columnas de identidad normalizadas
        $ftfacturas->addSelect([
            'p.identificacion',
            'p.telefonomovil',
            'p.email',
            DB::raw("CONCAT_WS('', UPPER(LEFT(pn.nombre,1)), UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos")
        ]);

        $facturas = $ftfacturas->orderBy('ftfacturas.fecha', 'DESC')->get();

        // En tu Controller de Laravel
        $hoy = now(); // Usa la fecha del sistema (configurada en America/Bogota)
        $cumpleanosHoy = Adclientes::obtenerCumpleanos($hoy);
        
        // 0. Total de clientes únicos
        $clientesHoy = Adclientes::whereDate('fechaingreso',now())->where('comercio_id', $comercio->id)->count();
        // 1. Total de clientes únicos
        $totalClientes = Adclientes::where('comercio_id', $comercio->id)->count();

        // 2. Clientes que han venido más de una vez (Recurrentes)
        $clientesRecurrentes = Adclientes::with(['citas'])->where('comercio_id', $comercio->id)
            ->whereHas('citas', function($q) {
                $q->where('estado_id', 915); // Solo citas pagadas/completadas
            }, '>=', 2) // Que tengan 2 o más
            ->count();

        // 3. Cálculo final
        $tasaRetencion = $totalClientes > 0 ? round(($clientesRecurrentes / $totalClientes) * 100, 1) : 0;

        return Inertia::render('dashboard/index', [
            'comercio' => $comercio,
            'citas' => $citas,
            'cumpleanosHoy' => $cumpleanosHoy,
            'facturas' => $facturas,
            'metodospagosList' => Cfmaestra::getlistatipos('LIS_METODOSPAGO'),
            'estadosList' => Cfmaestra::where('padre','=',Cfmaestra::select('id')->where('codigo','=',strtoupper('LIS_ESTADOSCITAS'))->first()->id)->whereIn('codigo',['CA','RE'])->get()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
            'clientesHoy' => $clientesHoy,
            'totalClientes' => $totalClientes,
            'clientesRecurrentes' => $clientesRecurrentes,
            'tasaRetencion' => $tasaRetencion,
            'turnoActivo' => $turnoActivo,
            'turnosList'  => $turnosAbiertos,
            'sedePredeterminada' => $sedePredeterminada,
        ]);
    })->name('dashboard');
});

Route::middleware(['auth', 'verified', 'check.comercio'])->group(function () {
    Route::get('dashboard/analytics', function () {

        $user = User::where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::where('persona_id', $user->persona_id)->first();
        
        // Usamos first() para tener el objeto directamente
        $sedePredeterminada = $user->sedes()
        ->with(['terminal'])
        ->wherePivot('predeterminada', 1)
        ->first();

        //Consultar turnos abiertos filtrados por Sede y Comercio
        $turnosAbiertos = Ftturnos::with(['terminal.sede'])
        ->where('estado_id', 924) // 924 = ABIERTO
        ->whereHas('terminal', function ($query) use ($sedePredeterminada) {
            // Filtramos directamente por el ID de la sede que ya obtuvimos
            $query->where('sede_id', $sedePredeterminada->id);
        })
        ->whereHas('terminal.sede', function ($query) use ($comercio) {
            // Aseguramos que la sede pertenezca al comercio actual
            $query->where('comercio_id', $comercio->id);
        })
        ->orderBy('fechaapertura', 'DESC')
        ->get();
        //Definir el turno activo por defecto (el primero de la lista)
       $turnoActivo = $turnosAbiertos->first();

        // 1. Para las citas Iniciamos la Query (sin el get al final todavía)
        $adcitas = Adcitas::
        join("adclientes AS c","c.id","=","adcitas.cliente_id")
        ->join("personas AS p","p.id","=","c.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'adcitas.estado_id')
        ->with([
            'detalle_con_empleadoservicio.empleadoservicio.empleado.persona.personasnaturales',
            'detalle_con_empleadoservicio.empleadoservicio.servicio',
            // Aplicamos la restricción a producto y a su relación tipo
            'detalle_con_producto.producto.tipo' => function($query) {
                // Seleccionamos id, nombre y la FK tipo_id para poder cargar la siguiente relación
                $query->select('id', 'nombre'); 
            },
            'detalle_con_empleadoservicio.estado',
        ])
        ->select([
            'c.id',
            'p.foto',
            'p.identificacion',
            DB::raw('CONCAT(YEAR(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " años ", MONTH(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " meses y ", DAY(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " dias") AS edad'),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'p.telefonomovil',
            'p.email',
            'adcitas.id',
            'adcitas.codigo',
            'adcitas.fecha',
            'adcitas.horainicio',
            'adcitas.horafinal',
            'm.observacion AS estado_observacion',
            'm.codigo AS estado_codigo',
            'm.nombre AS estado_nombre',
             // CÁLCULO DEL TOTAL MEDIANTE SUBCONSULTA (Elimina la necesidad del JOIN a addetallescitas)
             DB::raw("(SELECT SUM(preciofinal) FROM addetallescitas WHERE cita_id = adcitas.id AND deleted_at IS NULL) AS total")
        ])
        ->where('su.predeterminada', 1)
        // Usamos el ID del comercio del usuario autenticado
        ->where('c.comercio_id', function($q) use ($user) {
            $q->select('id')->from('comercios')->where('persona_id', $user->persona_id)->first();
        })
        ->whereIn('su.sede_id', function($q) use ($user) {
            $q->select('sede_id')->from('cfsedesusers')->where('usuario_id', $user->id);
        })
        ->whereNull('adcitas.deleted_at');

        // 3. FILTRO DE TIEMPO: Últimos 2 meses
        // Comparamos la fecha de la factura con la fecha actual menos 2 meses
        $adcitas->where('adcitas.fecha', '>=', now()->subMonths(6));

        // 4. EJECUTAMOS LA CONSULTA
        $citas = $adcitas->orderby('adcitas.fecha', 'DESC')
        ->orderby('adcitas.horainicio', 'DESC')
        ->get();

        // 0. Para las facturas Iniciamos la Query (sin el get al final todavía)
        $ftfacturas = Ftfacturas::with([
            'pagos',
            'turnos.terminal.sede',
            'estado'
        ]);

        // 1. FILTRO DE TIEMPO: Últimos 6 meses
        // Comparamos la fecha de la factura con la fecha actual menos 6 meses
        $ftfacturas->where('ftfacturas.fecha', '>=', now()->subMonths(6));

        // 2. Filtro de seguridad por comercio
        $ftfacturas->whereHas('turnos.terminal.sede', function ($q) use ($comercio) {
            $q->where('comercio_id', $comercio->id);
        });

        // 3. Selección de campos con Lógica Condicional
        $ftfacturas->select([
            'ftfacturas.*',
            // Subconsulta para obtener el ID de la persona real dependiendo del tipo
            DB::raw("CASE 
                WHEN ftfacturas.model_type = 921 THEN (SELECT adclientes.persona_id FROM adcitas, adclientes WHERE adcitas.cliente_id = adclientes.id and adcitas.id = ftfacturas.model_type_id)
                ELSE ftfacturas.model_type_id 
            END as persona_real_id"),
            // Cálculo de total
            DB::raw("(SELECT SUM(total) FROM ftpagos WHERE factura_id = ftfacturas.id) as grand_total")
        ]);

        // 4. Joins dinámicos basados en la 'persona_real_id' calculada arriba
        $ftfacturas->leftJoin("personas AS p", function($join) {
            // Unimos usando la lógica del CASE para normalizar el origen
            $join->on("p.id", "=", DB::raw("CASE 
                WHEN ftfacturas.model_type = 921 THEN (SELECT adclientes.persona_id FROM adcitas, adclientes WHERE adcitas.cliente_id = adclientes.id and adcitas.id = ftfacturas.model_type_id)
                ELSE ftfacturas.model_type_id 
            END"));
        })
        ->leftJoin("personasnaturales AS pn", "p.id", "=", "pn.persona_id");

        // 5. Agregamos las columnas de identidad normalizadas
        $ftfacturas->addSelect([
            'p.identificacion',
            'p.telefonomovil',
            'p.email',
            DB::raw("CONCAT_WS('', UPPER(LEFT(pn.nombre,1)), UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos")
        ]);

        $facturas = $ftfacturas->orderBy('ftfacturas.fecha', 'DESC')->get();

        
        return Inertia::render('dashboard/analytics', [
            'citas' => $citas,
            'facturas' => $facturas,
            'metodospagosList' => Cfmaestra::getlistatipos('LIS_METODOSPAGO'),
            'estadosList' => Cfmaestra::where('padre','=',Cfmaestra::select('id')->where('codigo','=',strtoupper('LIS_ESTADOSCITAS'))->first()->id)->whereIn('codigo',['CA','RE'])->get()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
            'turnoActivo' => $turnoActivo,
            'turnosList'  => $turnosAbiertos,
            'sedePredeterminada' => $sedePredeterminada,
        ]);
    })->name('dashboard.analytics');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

