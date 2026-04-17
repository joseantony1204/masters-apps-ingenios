<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\{Scpagos,Scsuscripciones};
use App\Http\Controllers\Controller;

class ScsuscripcionesController extends Controller
{

    public function webhookWompi(Request $request)
    {
        // ePayco envía los datos por POST o GET dependiendo de la config
        // x_ref_payco es el ID de ePayco, x_id_invoice es TU referencia (PAY-...)
        $referencia = $request->x_id_invoice;
        $estado_epayco = $request->x_transaction_state; // 'Aceptada', 'Rechazada', 'Pendiente'
        $cod_respuesta = (int)$request->x_cod_response; // 1 = Aceptada

        $pago = Scpagos::where('referencia_pasarela', $referencia)->first();

        if (!$pago) {
            Log::error("Webhook ePayco: Pago no encontrado. Referencia: $referencia");
            return response()->json(['message' => 'Pago no encontrado'], 404);
        }

        // Evitar procesar un pago que ya fue aprobado antes
        if ($pago->estado_pago === 'aprobado') {
            return response()->json(['message' => 'Pago ya procesado']);
        }

        if ($cod_respuesta === 1 && $estado_epayco === 'Aceptada') {
            
            // 1. Actualizar el registro del Pago
            $pago->update([
                'estado_pago' => 'aprobado',
                'metodo_pago' => $request->x_payment_mode ?? 'tarjeta/pse',
                'fecha_pago' => now(),
            ]);

            // 2. Activar la Suscripción vinculada
            $suscripcion = $pago->suscripcion;
            $suscripcion->update([
                'estado' => 'activa',
                'fecha_inicio' => now(),
                // La fecha de vencimiento ya la calculamos en el storeCheckout
            ]);

            // 3. Desbloquear el Comercio
            $suscripcion->comercio->update(['bloqueado' => false]);

            Log::info("Suscripción activada con éxito para el comercio: " . $suscripcion->comercio->nombre);
            
            return response()->json(['message' => 'Suscripción activada']);
        }

        // Si el pago fue rechazado o fallido
        $pago->update(['estado_pago' => 'fallido']);
        return response()->json(['message' => 'Pago rechazado']);
    }
}