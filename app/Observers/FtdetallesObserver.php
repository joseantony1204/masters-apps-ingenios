<?php
namespace App\Observers;

use App\Models\{Comercios, Ftdetalles, Adresenas, Adcitas, Adclientes, Personas};
use App\Services\WhatsAppService;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class FtdetallesObserver
{
    protected $whatsAppService;

    public function __construct(WhatsAppService $whatsAppService) {
        $this->whatsAppService = $whatsAppService;
    }

    public function saved(Ftdetalles $detalle)
    {
        // 1. Filtrar SOLO si es un servicio prestado (919)
        if ((int)$detalle->model_type !== 919) return;

        // Cargamos la factura madre y el empleadoservicio
        $detalle->loadMissing(['ftfactura', 'empleadoservicio.empleado.persona.personasnaturales']);
        $factura = $detalle->ftfactura;
        //dd($factura);

        if (!$factura) return;

        // 2. Identificar Cliente (Reutilizando tu lógica)
        $personaId = null;
        $comercioId = null;
        $telefonoCliente = null;
        $nombreCliente = 'Cliente';

        if ($factura->model_type == 921) {
            $cita = Adcitas::with('cliente.persona.personasnaturales')->find($factura->model_type_id);
            if ($cita && $cita->cliente) {
                $personaId = $cita->cliente->persona_id;
                $comercioId = $cita->cliente->comercio_id;
                $telefonoCliente = $cita->cliente->persona->telefonomovil;
                $nombreCliente = $cita->cliente->persona->personasnaturales->nombres ?? 'Cliente';
            }
        } 
        else if ($factura->model_type == 922) {
            $personaId = $factura->model_type_id;
            $persona = Personas::with('personasnaturales')->find($personaId);
            if ($persona) {
                $telefonoCliente = $persona->telefonomovil;
                $nombreCliente = $persona->personasnaturales->nombres ?? 'Cliente';
            }
            $cliente = Adclientes::where('persona_id', $personaId)->first();
            $comercioId = $cliente ? $cliente->comercio_id : null;
        }

        if (!$telefonoCliente) return;
        $comercio = Comercios::where('id', $comercioId)->firstOrFail();

        // 3. Procesar Empleado y envío
        $empleado = $detalle->empleadoservicio?->empleado;
        if ($empleado) {
            
            // --- Control para evitar duplicados en la misma factura/servicio ---
            $existe = Adresenas::where('detalle_id', $detalle->id)->exists();
                
            if ($existe) return;

            $nombreEmpleado = $empleado->persona?->personasnaturales?->nombres ?? 'nuestro especialista';
            $nombreServicio = $detalle->empleadoservicio->servicio->nombre ?? 'su servicio';
            $tokenCalificacion = Str::random(40);

            Adresenas::create([
                'detalle_id' => $detalle->id,
                'persona_id' => $personaId,
                'estrellas' => 0, // Pendiente
                'token' => $tokenCalificacion
            ]);
            
            $buttonParam = "qualify?service={$tokenCalificacion}";
            $paramsWhatsApp = [Str::trim(Str::upper($comercio->nombre)), Str::trim(Str::upper($nombreCliente)), Str::trim(Str::upper($nombreServicio)), Str::trim(Str::upper($nombreEmpleado))];

            try {
                $this->whatsAppService->send($telefonoCliente, 'valoracioncita', $paramsWhatsApp, $buttonParam);
                Log::info("Datos para WhatsApp:", ['telefono' => $telefonoCliente, 'template' => 'valoracioncita', 'params' => $paramsWhatsApp, 'buttonParam' => $buttonParam]);
            } catch (\Exception $e) {
                Log::error("Error en WhatsApp de calificación: " . $e->getMessage());
            }
        }
    }
}