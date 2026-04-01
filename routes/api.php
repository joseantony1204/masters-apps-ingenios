<?php
//namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\{Route};
use App\Http\Controllers\Api\{
    DisponibilidadController,AdclientesController,
    ProductosController, PersonasController};

Route::get('/disponibilidad/buscar', [DisponibilidadController::class, 'generarTurnos'])->name('api.disponibilidad.turnos');
Route::get('/clientes/buscar', [AdclientesController::class, 'buscar'])->name('api.clientes.buscar');
Route::get('/servicios/buscar', [DisponibilidadController::class, 'servicios'])->name('api.servicios.buscar');
Route::get('/productos/buscar', [ProductosController::class, 'buscar'])->name('api.productos.buscar');
Route::get('/personas/buscar', [PersonasController::class, 'buscar'])->name('api.personas.buscar');