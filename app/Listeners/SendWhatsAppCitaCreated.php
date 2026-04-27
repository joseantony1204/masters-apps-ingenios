<?php
namespace App\Listeners;

use App\Events\AdcitasEvent;
use App\Services\WhatsAppService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SendWhatsAppCitaCreated
{
    public function __construct(protected WhatsAppService $whatsAppService) {}

    public function handle(AdcitasEvent $event)
    {
        $cita = $event->cita;
        $comercio = $event->comercio;
        $token = $comercio->token;

        // Aseguramos que cargamos las relaciones si no vienen (por si acaso)
        $cita->loadMissing(['detalle_con_empleadoservicio.empleadoservicio.empleado.persona.personasnaturales', 'cliente.persona.personasnaturales']);

        // 1. OBTENER DETALLE (Evitando el error de colección)
        // Usamos first() porque detalle_con_empleadoservicio es un HasMany (Colección)
        $detalle = $cita->detalle_con_empleadoservicio->first(); 

        if (!$detalle) {
            Log::error("Cita #{$cita->id} creada sin detalles. No se puede enviar WhatsApp.");
            return;
        }

        // 2. DATOS DEL EMPLEADO (Navegación segura con ?->)
        $personaEmpleado = $detalle->empleadoservicio?->empleado?->persona;
        $telefonoEmpleado = $personaEmpleado?->telefonomovil;

        // --- ACCESO A DATOS DEL CLIENTE ---
        $clienteNombre = $cita->cliente?->persona?->personasnaturales?->nombreapellido ?? 'Cliente';
        $telefonoCliente = $cita->cliente?->persona?->telefonomovil ?? null; // Ajusta según tu modelo
        $telefonoLimpio = preg_replace('/\D/', '', $telefonoCliente);
        $clienteConWhatsapp = "{$clienteNombre} - WhatsApp: +57{$telefonoLimpio}";
        $buttonParam = "appointments?empleado={$detalle?->empleadoservicio?->empleado?->id}&token={$token}";
        // 1. VALIDACIÓN Y LOGS PARA EL EMPLEADO
        if ($telefonoEmpleado) {
            try {
                $params = [
                    $personaEmpleado->personasnaturales->nombre ?? 'Empleado', // {{1}}
                    Carbon::parse($cita->fecha)->locale('es')->isoFormat('dddd D [de] MMMM'), // {{2}}
                    Carbon::parse($cita->horainicio)->format('g:i A'),  // {{3}}
                    $detalle->empleadoservicio->servicio->nombre ?? 'Servicio', // {{4}}
                    $clienteConWhatsapp, // {{5}}
                ];

                // IMPRIMIR EN LOG PARA VALIDAR
                Log::info("WhatsApp Prep - Empleado:", ['telefono' => $telefonoEmpleado, 'template' => 'proximacita','params' => $params, 'buttonParam' => $buttonParam]);
                // ENVIAR REALMENTE
                $this->whatsAppService->send($telefonoEmpleado, 'proximacita', $params, $buttonParam);
            } catch (\Exception $e) {
                // Logueamos el error pero NO relanzamos la excepción 
                // para que no rompa la transacción de la cita
                Log::error("Error enviando WhatsApp al empleado: " . $e->getMessage());
            }

        } else {
            Log::warning("No se pudo enviar WhatsApp al empleado: Datos incompletos o teléfono nulo.", ['cita_id' => $cita->id]);
        }

        // 2. VALIDACIÓN Y LOGS PARA EL CLIENTE
        if ($telefonoCliente) {
            $paramsCliente = [
                $clienteNombre, 
                $cita->fecha . ' ' . $cita->horainicio
            ];

            //Log::info("WhatsApp Prep - Cliente:", ['telefono' => $telefonoCliente,'params'   => $paramsCliente]);
            // Descomenta cuando estés listo
            // $this->whatsAppService->send($telefonoCliente, 'confirmacion_cita_cliente', $paramsCliente);
        }
    }
}
?>