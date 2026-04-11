<?php
namespace App\Observers;

use App\Models\{Ftfacturas, AdCitas, Adclientes, Personas}; 
use App\Services\CouponService;
use Carbon\Carbon;

class FtfacturasObserver
{
    protected $couponService;

    public function __construct(CouponService $service) {
        $this->couponService = $service;
    }

    public function created(Ftfacturas $factura)
    {
        $personaId = null;
        $comercioId = null;

        // --- 1. IDENTIFICAR PERSONA Y COMERCIO ---
        
        if ($factura->model_type == 921) {
            // Caso Cita: Cita -> Cliente -> Persona/Comercio
            $cita = AdCitas::with('cliente')->find($factura->model_type_id);
            if ($cita && $cita->cliente) {
                $personaId = $cita->cliente->persona_id;
                $comercioId = $cita->cliente->comercio_id;
            }
        } 
        else if ($factura->model_type == 922) {
            // Caso Persona Directa: Buscamos su registro como Cliente en este sistema
            $personaId = $factura->model_type_id;
            
            // Buscamos el registro en adclientes. 
            // Si una persona puede estar en varios comercios, el Ftfacturas debería 
            // tener un campo comercio_id, pero si no, lo buscamos por el registro de cliente.
            $cliente = Adclientes::where('persona_id', $personaId)->first();
            $comercioId = $cliente ? $cliente->comercio_id : null;
        }

        // Si no hay comercio o persona, no podemos procesar marketing
        if (!$personaId || !$comercioId) return;

        // --- 2. CONTEO DE VENTAS (Misma lógica potente anterior) ---
        
        $conteoVentas = Ftfacturas::where(function($query) use ($personaId) {
            $query->where(function($q) use ($personaId) {
                $q->where('model_type', 922)->where('model_type_id', $personaId);
            })
            ->orWhere(function($q) use ($personaId) {
                $q->where('model_type', 921)
                  ->whereIn('model_type_id', function($sub) use ($personaId) {
                      $sub->select('ac.id')
                          ->from('adcitas as ac')
                          ->join('adclientes as c', 'ac.cliente_id', '=', 'c.id')
                          ->where('c.persona_id', $personaId);
                  });
            });
        })->count();

        // --- 3. APLICAR LÓGICAS DE MARKETING ---

        // A. RECURRENTE (Cada 2 ventas)
        if ($conteoVentas > 0 && $conteoVentas % 2 == 0) {
            $cupon = $this->couponService->generateForPersona($personaId, 'recurrente', $comercioId);
            if ($cupon) {
                // Aquí dispararías tu Notificación (Mail/WhatsApp)
                // Notification::send($cliente, new CouponGeneratedNotification($cupon));
            }
        }

        // B. CUMPLEAÑOS (Reactivo al facturar)
        $persona = Personas::with('personasnaturales')->find($personaId);
        
        // Usamos la relación con personasnaturales (donde está la fecha)
        if ($persona && $persona->personasnaturales && $persona->personasnaturales->fechanacimiento) {
            $hoy = now()->format('m-d');
            $cumple = Carbon::parse($persona->personasnaturales->fechanacimiento)->format('m-d');

            if ($hoy === $cumple) {
                // El servicio generará el cupón solo si no se generó ya en el Command matutino
                $cupon = $this->couponService->generateForPersona($personaId, 'cumple', $comercioId);
                if ($cupon) {
                    // Aquí dispararías tu Notificación (Mail/WhatsApp)
                    // Notification::send($cliente, new CouponGeneratedNotification($cupon));
                }
            }
        }
    }
}