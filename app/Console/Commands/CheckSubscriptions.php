<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\{Comercios};
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Log;

class CheckSubscriptions extends Command
{
    // Nombre del comando para el Cron
    protected $signature = 'check:subscriptions';
    protected $description = 'Valida vencimientos y gestiona suspensiones de servicio para todos los comercios';

    public function __construct(protected WhatsAppService $whatsapp)
    {
        parent::__construct();
    }

    public function handle()
    {
        $hoy = now()->startOfDay();
        $this->info("=== Iniciando Validación de Suscripciones: " . $hoy->toDateTimeString() . " ===");

        // Traemos todos los comercios con su suscripción más reciente
        $comercios = Comercios::with(['suscripcion'])->get();

        foreach ($comercios as $comercio) {
            $sub = $comercio->suscripcion;

            if (!$sub) {
                $this->line("[-] Comercio: {$comercio->nombre} - Sin suscripción registrada.");
                continue;
            }

            // Calculamos la diferencia de días (Negativo = Vencido)
            $vencimiento = \Carbon\Carbon::parse($sub->fecha_vencimiento)->startOfDay();
            $diasDiferencia = $hoy->diffInDays($vencimiento, false);

            $this->comment("[i] Procesando: {$comercio->nombre} (Vence en: {$diasDiferencia} días)");

            // --- CASO 1: NOTIFICACIÓN (5 días antes) ---
            if ($diasDiferencia === 5) {
                $this->info("    -> Enviando recordatorio de 5 días.");
                /*$this->whatsapp->send(
                    $comercio->telefonomovil, 
                    'recordatorio_vencimiento_comercio', 
                    [$comercio->nombre, $vencimiento->format('d/m/Y')]
                );*/
            }

            // --- CASO 2: DÍA DEL VENCIMIENTO (Hoy) ---
            if ($diasDiferencia === 0) {
                $this->warn("    -> Hoy vence la suscripción. Enviando alerta final.");
                /*$this->whatsapp->send(
                    $comercio->telefonomovil, 
                    'alerta_vencimiento_hoy', 
                    [$comercio->nombre]
                );*/
            }

            // --- CASO 3: SUSPENSIÓN (10 días de mora) ---
            if ($diasDiferencia <= -10 && $sub->estado_id !== 851) {
                $this->error("    -> APLICANDO SUSPENSIÓN: 10 días de mora alcanzados.");
                
                // Actualizar estado de la suscripción
                $sub->update(['estado_id' => 851]);
                
                // Bloquear el comercio para que no pueda usar el software
                //$comercio->update(['bloqueado' => true]);

                Log::alert("Software suspendido para el comercio: {$comercio->nombre} por falta de pago.");
                /*
                $this->whatsapp->send(
                    $comercio->telefonomovil, 
                    'suspension_servicio_mora', 
                    [$comercio->nombre]
                );*/
            }
        }

        $this->info("=== Proceso de validación finalizado ===");
    }
}