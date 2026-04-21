<?php

namespace App\Jobs;

use App\Models\Adcitas;
use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendWhatsAppReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * El ID de la cita que procesaremos
     */
    protected $citaId;

    public function __construct($citaId)
    {
        $this->citaId = $citaId;
    }

    /**
     * Ejecutar el trabajo (el envío del WhatsApp)
     */
    public function handle(WhatsAppService $whatsAppService): void
    {
        // 1. Buscamos la cita fresca de la base de datos con sus relaciones
        $cita = Adcitas::with(['cliente.persona.personasnaturales'])->find($this->citaId);
        $detalle = $cita->detalle_con_empleadoservicio->first(); 

        // 2. Validación de seguridad: solo enviar si existe y está en estado pendiente (913)
        if (!$cita || $cita->estado_id != 913) {
            Log::info("Recordatorio omitido para cita #{$this->citaId}: Cancelada o inexistente.");
            return;
        }

        $cliente = $cita->cliente;
        $telefono = $cliente?->persona?->telefonomovil;

        if ($telefono) {
            $nombre = $cliente->persona->personasnaturales->nombreapellido ?? 'Cliente';
            $hora = Carbon::parse($cita->horainicio)->format('g:i A');

            // 3. Envío mediante el Service que ya tenemos
            $result = $whatsAppService->send($telefono, 'citaconfirmada', [
                $nombre, // {{1}}
                $hora,    // {{2}}
                $detalle->empleadoservicio->servicio->nombre ?? 'Servicio', // {{3}}
                $cita->codigo    // {{4}}
            ]);

            if ($result['success']) {
                Log::info("WhatsApp Recordatorio enviado con éxito a la cita #{$this->citaId}");
            } else {
                Log::error("Fallo al enviar recordatorio WA cita #{$this->citaId}: " . $result['error']);
            }
        }
    }
}