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
    CfhorariosController};

use App\Http\Controllers\Public\{LandingController};

use App\Models\Adclientes;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Ruta pública para el QR
Route::get('/landing', [LandingController::class, 'index'])->name('public.landing');
Route::get('/confirmada', [LandingController::class, 'confirmada'])->name('public.confirmada');


Route::middleware(['auth', 'verified'])->group(function () {

    // --- MÓDULO: CONFIGURACIÓN Y MAESTRAS ---
    Route::resource('cfmaestra', CfmaestraController::class);
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
    Route::put('users/{user}/password', [UsersController::class, 'updatePassword'])
        ->name('users.updatepassword');   

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/clientes/buscar', [AdclientesController::class, 'buscar'])->name('api.clientes.buscar');
    });

    Route::put('adclientes/{cliente}/perfil', [AdclientesController::class, 'updatePerfil'])
        ->name('adclientes.updateperfil');
    Route::put('adclientes/{cliente}/sedes/{sede}/toggle-permiso', [AdclientesController::class, 'toggleSedePermiso'])->name('adclientes.toggle-permiso');
    Route::put('adclientes/{cliente}/sedes/{sede}/set-default', [AdclientesController::class, 'setSedePredeterminada'])->name('adclientes.set-default'); 

    Route::post('/citas/actualizardetallecita/{id}', [AdcitasController::class, 'actualizardetallecita'])->name('api.citas.actualizar');
    Route::put('adcitas/actualizar-estados/{id}', [AdcitasController::class, 'actualizarEstados'])->name('adcitas.cancelar');

    Route::patch('/cfsedes/{id}/estado', [CfsedesController::class, 'updateEstado'])->name('cfsedes.updateEstado');
    Route::patch('/ftresoluciones/{id}/estado', [FtresolucionesController::class, 'updateEstado'])->name('ftresoluciones.updateEstado');
    Route::patch('/ftterminales/{id}/estado', [FtterminalesController::class, 'updateEstado'])->name('ftterminales.updateEstado');

    // Ruta para obtener el JSON con el desglose de ventas (Pagos -> Facturas -> Turno)
    Route::get('/ftturnos/{id}/resumen', [FtturnosController::class, 'resumen'])
    ->name('ftturnos.resumen');

    // Ruta para ejecutar el cierre definitivo del turno (cambio de estado y fecha de cierre)
    Route::patch('/ftturnos/{id}/cerrar', [FtturnosController::class, 'cerrar'])
    ->name('ftturnos.cerrar');

    Route::prefix('comercios')->group(function () {
        // Vista Principal (Carga todo)
        Route::get('/', [ComerciosController::class, 'index'])->name('comercios.index');
        // Rutas para actualizaciones específicas (AJAX/Inertia)
        Route::post('/comercio', [ComerciosController::class, 'update'])->name('comercios.update');
    });

});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

