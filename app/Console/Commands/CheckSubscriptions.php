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

        // Cargamos los comercios con sus suscripciones
        $comercios = Comercios::with(['suscripciones.plan'])->get();

        foreach ($comercios as $comercio) {
            
            // FORZAMOS UNA COLECCIÓN: 
            // Si suscripciones es un solo objeto, lo metemos en un array. Si ya es colección, la deja igual.
            $todasLasSubs = collect($comercio->suscripciones);

            // Ahora filter() SIEMPRE funcionará
            $subsInteres = $todasLasSubs->filter(function ($sub) {
                return in_array($sub->estado_id, [980, 981]);
            });

            if ($subsInteres->isEmpty()) {
                $this->line("[-] {$comercio->nombre}: Sin suscripciones para evaluar.");
                continue;
            }

            $tieneDerechoAServicio = false;

            foreach ($subsInteres as $sub) {
                $info = $this->evaluarYNotificar($comercio, $sub, $hoy);
                
                // Si la suscripción que estamos viendo le da permiso de trabajar:
                if ($sub->estado_id == 980 && $info['dias_vencimiento'] >= 0) {
                    $tieneDerechoAServicio = true;
                }
                
                if ($sub->estado_id == 981 && $info['dias_inicio'] <= 3) {
                    $tieneDerechoAServicio = true;
                }
            }

            if (!$tieneDerechoAServicio) {
                $this->aplicarSuspensionGeneral($comercio);
            }
        }

        $this->info("=== Proceso de validación finalizado ===");
    }

    private function evaluarYNotificar($comercio, $sub, $hoy)
    {
        $vencimiento = \Carbon\Carbon::parse($sub->fecha_vencimiento)->startOfDay();
        $inicioPlan = \Carbon\Carbon::parse($sub->fecha_inicio)->startOfDay();
        
        $diasDiferenciaVencimiento = $hoy->diffInDays($vencimiento, false);
        $diasDesdeInicio = $inicioPlan->diffInDays($hoy, false);

        $nombrePlan = $sub->plan->nombre ?? 'Plan';
    
        // Log dinámico según el estado
        if ($sub->estado_id == 980) {
            $this->comment("[i] Evaluando {$nombrePlan} (ACTIVO) para: {$comercio->nombre} | Quedan: {$diasDiferenciaVencimiento} días");
        } else {
            $this->comment("[i] Evaluando {$nombrePlan} (PENDIENTE) para: {$comercio->nombre} | Iniciado hace: {$diasDesdeInicio} días");
        }

        // --- NOTIFICACIONES ---
        if ($diasDiferenciaVencimiento === 5) {
            $this->info("    -> Enviando recordatorio de 5 días.");
        }
        if ($diasDiferenciaVencimiento === 0) {
            $this->warn("    -> Hoy vence la suscripción. Alerta enviada.");
        }
        
        // --- LÓGICA DE SUSPENSIÓN INDIVIDUAL ---
        $debeSuspender = false;

        // Caso A: Activa con mora de 10 días
        // Caso A: Está activa (980) pero ya pasaron 10 días desde que venció (Mora larga)
        if ($sub->estado_id == 980 && $diasDiferenciaVencimiento <= -10) {
            $debeSuspender = true;
            $this->error("    -> SUSPENSIÓN: 10 días de mora en plan activo.");
        }

        // Caso B: Pendiente con más de 3 días desde el inicio
        // Caso B: Está pendiente (981) y ya pasaron 3 días desde que inició (Tu nueva regla)
        if ($sub->estado_id == 981 && $diasDesdeInicio > 3) {
            $debeSuspender = true;
            $this->error("    -> MOTIVO: Superó los 3 días de gracia (Lleva {$diasDesdeInicio} días).");
        }

        if ($debeSuspender && $sub->estado_id !== 982) {
            try {
                $sub->update(['estado_id' => 982]);
                $this->error("    -> ESTADO ACTUALIZADO A SUSPENDIDO (982)");
                $this->error("    -> Suscripción {$sub->id} del comercio {$comercio->nombre} suspendida por falta de pago.");
                /*
                $this->whatsapp->send(
                    $comercio->telefonomovil, 
                    'suspension_servicio_mora', 
                    [$comercio->nombre]
                );*/
            } catch (\Exception $e) {
                $this->error("    -> Error al actualizar BD: " . $e->getMessage());
            }
        }

        // Retornamos un array con la info para que el handle decida si bloquea el comercio completo
        return [
            'dias_vencimiento' => $diasDiferenciaVencimiento,
            'dias_inicio' => $diasDesdeInicio
        ];
    }

    private function aplicarSuspensionGeneral($comercio)
    {
        $this->error("    !!! BLOQUEO TOTAL !!!: El comercio {$comercio->nombre} ha perdido acceso al software.");
        
        try {
            // Aquí bloqueas la entrada al sistema
            // $comercio->update(['bloqueado' => true]); 
            
            Log::warning("Comercio suspendido por falta de pago: {$comercio->nombre}");
        } catch (\Exception $e) {
            $this->error("Error al suspender: " . $e->getMessage());
        }
    }

    /*$this->whatsapp->send(
        $comercio->telefonomovil, 
        'recordatorio_vencimiento_comercio', 
        [$comercio->nombre, $vencimiento->format('d/m/Y')]
    );*/
}