<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\{Adclientes, Comercios}; 
use App\Services\CouponService;
use Illuminate\Support\Facades\DB;

class BirthdayCouponCommand extends Command
{
    protected $signature = 'coupons:birthday';
    protected $description = 'Genera cupones automáticos para los cumpleañeros de cada comercio';

    public function handle(CouponService $couponService)
    {
        $hoy = now();
        $this->info("Iniciando generación de cupones de cumpleaños: " . $hoy->toDateTimeString());

        // 1. Obtenemos todos los comercios que tienen la promoción de cumpleaños ACTIVA
        // Esto optimiza el comando para no procesar comercios que no usan el módulo.
        $comercios = Comercios::whereHas('promociones', function($q) {
            $q->where('categoria', 'auto')->where('estado', 1); // Ajusta según tu tabla de promos
        })->get();

        foreach ($comercios as $comercio) {
            $this->comment("Procesando comercio: {$comercio->nombre}");

            // 2. Buscamos los clientes de ESTE comercio que cumplen años hoy
            $clientes = Adclientes::join("personas AS p", "p.id", "=", "adclientes.persona_id")
                ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
                ->select([
                    'p.id',
                    'pn.fechanacimiento',
                    DB::raw("CONCAT(pn.nombre, ' ', pn.apellido) AS nombrecompleto"),
                ])
                ->where('adclientes.comercio_id', $comercio->id) // Filtro directo por comercio
                ->whereRaw("MONTH(pn.fechanacimiento) = ?", [$hoy->month])
                ->whereRaw("DAY(pn.fechanacimiento) = ?", [$hoy->day])
                ->get();

            foreach ($clientes as $cliente) {
                // Pasamos el ID del comercio al servicio para que sepa qué promo aplicar
                $cupon = $couponService->generateForPersona(
                    $cliente->id, 
                    'cumple', // Tu categoría del JSON era 'auto' para cumple
                    $comercio->id
                );
                
                if ($cupon) {
                    $this->info(" -> Cupón generado para: {$cliente->nombrecompleto}");
                    // Aquí disparas el WhatsApp/Email usando el ID del comercio para personalizar el mensaje
                }
            }
        }
        $this->info("Proceso finalizado correctamente.");
    }
}