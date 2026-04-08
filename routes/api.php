<?php
//namespace App\Http\Controllers\Api;
use Illuminate\Support\Facades\{Route};
use App\Http\Controllers\Api\{
    DisponibilidadController,AdclientesController,
    ProductosController, PersonasController,AdcitasController};

Route::get('/disponibilidad/{token}/buscar', [DisponibilidadController::class, 'generarTurnos'])->name('api.disponibilidad.turnos');
Route::get('/clientes/buscar', [AdclientesController::class, 'buscar'])->name('api.clientes.buscar');
Route::get('/servicios/buscar', [DisponibilidadController::class, 'servicios'])->name('api.servicios.buscar');
Route::get('/productos/buscar', [ProductosController::class, 'buscar'])->name('api.productos.buscar');
Route::get('/personas/buscar', [PersonasController::class, 'buscar'])->name('api.personas.buscar');
Route::post('/personas/store', [PersonasController::class, 'store'])->name('api.personas.store');
Route::post('/clientes/verificarcrear', [AdclientesController::class, 'verificarcrear'])->name('api.clientes.verificarcrear');
Route::post('/citas/store', [AdcitasController::class, 'store'])->name('api.citas.store');
Route::post('/personas/enviar', [PersonasController::class, 'sendOpt'])->name('api.otp.enviar');