<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Scsuscripciones,Scpagos};
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Services\WhatsAppService; 

class WompiController extends Controller
{
    public function __construct(protected WhatsAppService $whatsapp) {}

    public function preparePayment($suscripcionId, $pagoId)
    {
        $sub = Scsuscripciones::with('plan')->findOrFail($suscripcionId);
        $pago = Scpagos::findOrFail($pagoId);

        // 1. Forzar entero (Wompi no acepta decimales en el monto)
        $montoEnCentavos = (int) round($pago->valor * 100); 
        
        // 2. Referencia
        $referencia = $pago->referencia_pasarela;
        $moneda = env('WOMPI_CURRENCY', 'COP'); // Usa el del ENV directamente
        
        // 3. Secreto de integridad
        $secreto = env('WOMPI_INTEGRITY_SECRET');

        // 4. CONCATENACIÓN (Importante: el monto debe ser string de número entero)
        // Orden: Referencia + MontoCentavos + Moneda + Secreto
        $cadenaConcatenada = $referencia . $montoEnCentavos . $moneda . $secreto;
        
        $firma = hash('sha256', $cadenaConcatenada);

        return response()->json([
            'publicKey' => env('WOMPI_PUBLIC_KEY'),
            'currency' => $moneda,
            'amountInCents' => $montoEnCentavos,
            'reference' => $referencia,
            'signature' => $firma,
        ]);
    }

    public function resultado(Request $request)
    {
        // Wompi envía el id de la transacción en la URL como 'id'
        $transactionId = $request->query('id');

        return Inertia::render('scsuscripciones/resultado', [
            'transactionId' => $transactionId,
            'mensaje' => 'Estamos procesando tu pago. En unos minutos tu plan estará activo.'
        ]);
    }

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        
        // 1. Validar Checksum de Wompi
        // Estructura del JSON según tu envío: data es el objeto principal
        $data = $payload['data']; 
        $timestamp = $payload['sent_at'];
        $secret = env('WOMPI_EVENTS_SECRET');
        
        // Concatenación oficial para eventos: id + status + amount_in_cents + sent_at + secret
        $stringParaFirmar = $data['id'] . $data['status'] . $data['amount_in_cents'] . $timestamp . $secret;
        $hashLocal = hash('sha256', $stringParaFirmar);
        
        if ($hashLocal !== $payload['signature']['checksum']) {
            Log::error("Webhook Wompi: Firma inválida. Referencia: " . ($data['reference'] ?? 'N/A'));
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 2. Procesar solo si es APPROVED
        if ($data['status'] === 'APPROVED') {
            
            // Tu referencia es: PAY69E153416A2DE1776374593
            // Si estás guardando la referencia de Wompi en tu tabla Scpagos, búscala así:
            $pago = Scpagos::where('id', $this->extraerIdDeReferencia($data['reference']))->first();

            if ($pago) {
                // Actualizar Pago
                $pago->update([
                    'estado_id' => 974, // APROBADO
                    'fecha' => now(),
                    'metodo_id' => 933, // Wompi/Nequi
                    'transaccion_id' => $data['id'] // Guardamos el ID de Wompi por seguridad
                ]);

                // Actualizar Suscripción
                $sub = Scsuscripciones::with('comercio', 'plan')->find($pago->suscripcion_id);
                
                if ($sub) {
                    $sub->update([
                        'estado_id' => 980, // ACTIVA
                        'fecha_inicio' => now(),
                        'fecha_vencimiento' => now()->addDays($sub->plan->codigo)
                    ]);

                    Log::info("Wompi: Pago procesado y suscripción activa para: " . $sub->comercio->nombre);

                    // 3. ENVIAR NOTIFICACIÓN WHATSAPP
                    //$this->notificarPagoExitoso($sub, $pago);
                }
            }
        }

        return response()->json(['status' => 'success'], 200);
    }

    private function extraerIdDeReferencia($referencia) {
        // Ajusta esto según como estés construyendo la referencia en el método 'preparePayment'
        // Si tu referencia es "PAY_IDPAGO_TIMESTAMP", entonces:
        $parts = explode('_', $referencia);
        return $parts[1] ?? null; 
    }

    private function notificarPagoExitoso($sub, $pago)
    {
        try {
            $telefono = $sub->comercio->telefonomovil;
            $nombreComercio = $sub->comercio->nombre;
            $monto = number_format($pago->valor, 0, ',', '.');
            $plan = $sub->plan->nombre;

            // Enviar mensaje al comercio
            $this->whatsapp->send(
                $telefono, 
                'pago_exitoso_cliente', // Nombre de tu plantilla en Meta/Wompi
                [
                    $nombreComercio, 
                    $monto, 
                    $plan,
                    $sub->fecha_vencimiento->format('d/m/Y')
                ]
            );

            // Opcional: Notificarte a ti mismo (administrador)
            /*
            $this->whatsapp->send(
                '573002945168', 
                'nuevo_pago_recibido', 
                [$nombreComercio, $monto]
            );
            */
        } catch (\Exception $e) {
            Log::error("Error enviando WhatsApp de confirmación: " . $e->getMessage());
        }
    }
}
?>