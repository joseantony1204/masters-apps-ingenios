<?php
//namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\{Route};
use App\Http\Controllers\Api\{
    DisponibilidadController,AdclientesController,
    ProductosController, PersonasController,AdcitasController,
    WhatsAppController, ScsuscripcionesController,WompiController};

Route::get('/disponibilidad/{token}/buscar', [DisponibilidadController::class, 'generarTurnos'])->name('api.disponibilidad.turnos');
Route::get('/clientes/buscar', [AdclientesController::class, 'buscar'])->name('api.clientes.buscar');
Route::get('/servicios/buscar', [DisponibilidadController::class, 'servicios'])->name('api.servicios.buscar');
Route::get('/productos/buscar', [ProductosController::class, 'buscar'])->name('api.productos.buscar');
Route::get('/personas/buscar', [PersonasController::class, 'buscar'])->name('api.personas.buscar');
Route::post('/personas/store', [PersonasController::class, 'store'])->name('api.personas.store');
Route::post('/clientes/verificarcrear', [AdclientesController::class, 'verificarcrear'])->name('api.clientes.verificarcrear');
Route::post('/citas/store', [AdcitasController::class, 'store'])->name('api.citas.store');
Route::post('/personas/enviar', [PersonasController::class, 'sendOpt'])->name('api.otp.enviar');


Route::post('/whatsapp/send', [WhatsAppController::class, 'send'])->name('api.whatsapp.send'); //->middleware(['auth']); // Solo usuarios logueados pueden enviar mensajes
// Esta es la URL que pondrás en el dashboard de ePayco
Route::post('/scsuscripciones/webhook-epayco', [ScsuscripcionesController::class, 'webhookWompi'])->name('api.scsuscripciones.webhook');

Route::get('/wompi/prepare/{suscripcionId}/pagoId/{pagoId}', [WompiController::class, 'preparePayment'])->middleware(['auth'])->name('api.wompi.prepare');; // Protegido pero accesible
Route::get('/wompi/resultado', [WompiController::class, 'resultado'])->name('api.wompi.resultado');; // Protegido pero accesible
Route::post('/wompi/webhook', [WompiController::class, 'handleWebhook']);