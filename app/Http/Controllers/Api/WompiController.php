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
        $moneda = config('app.wompi_currency');
        
        // 3. Secreto de integridad
        $secreto = config('app.wompi_integrity_secret');

        // 4. CONCATENACIÓN (Importante: el monto debe ser string de número entero)
        // Orden: Referencia + MontoCentavos + Moneda + Secreto
        $cadenaConcatenada = $referencia . $montoEnCentavos . $moneda . $secreto;
        
        $firma = hash('sha256', $cadenaConcatenada);

        return response()->json([
            'publicKey' => config('app.wompi_public_key'),
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

        // 1. Log de entrada para verificar que la comunicación llega
        Log::info("Wompi Webhook Recibido", ['payload' => $payload]);
        
        // VALIDACIÓN DE ESTRUCTURA (Según tu log, los datos están en data -> transaction)
        if (!isset($payload['data']['transaction'])) {
            Log::error("Wompi Webhook: Estructura de datos no reconocida");
            return response()->json(['message' => 'Invalid structure'], 400);
        }

        $transaction = $payload['data']['transaction']; // <--- ESTO ES LO QUE FALTABA
        $timestamp = $payload['sent_at'];
        $secret = config('app.wompi_events_secret'); // Asegúrate que esté en config/app.php o usa env('WOMPI_EVENTS_SECRET')
        
        // 2. Validar Checksum (Firma de Eventos)
        // El orden oficial es: transaction.id + transaction.status + transaction.amount_in_cents + sent_at + secret
        $stringParaFirmar = $transaction['id'] . $transaction['status'] . $transaction['amount_in_cents'] . $timestamp . $secret;
        $hashLocal = hash('sha256', $stringParaFirmar);
        
        if ($hashLocal !== $payload['signature']['checksum']) {
            Log::error("Firma Inválida", [
                'local' => $hashLocal, 
                'wompi' => $payload['signature']['checksum']
            ]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // 3. Procesar solo si es APPROVED
        if ($transaction['status'] === 'APPROVED') {
            
            // Buscamos el pago usando la referencia que viene dentro de transaction
            $pagoId = $this->extraerIdDeReferencia($transaction['reference']);
            $pago = Scpagos::find($pagoId);

            if ($pago) {
                // Si el pago ya está marcado como aprobado, no hacemos nada más (evita duplicidad)
                if ($pago->estado_id == 974) {
                    return response()->json(['status' => 'already_processed'], 200);
                }

                // Actualizar Pago
                $pago->update([
                    'estado_id' => 974, // APROBADO
                    'fecha' => now(),
                    'metodo_id' => 933, // Wompi/Nequi
                    'transaccion_id' => $pago->suscripcion_id
                ]);

                // Actualizar Suscripción
                $sub = Scsuscripciones::with('comercio', 'plan')->find($pago->suscripcion_id);
                
                if ($sub) {
                    // Si la suscripción ya está activa, sumamos a la fecha actual, si no, desde hoy
                    $fechaBase = ($sub->fecha_vencimiento && $sub->fecha_vencimiento > now()) 
                                ? \Carbon\Carbon::parse($sub->fecha_vencimiento) 
                                : now();

                    $sub->update([
                        'estado_id' => 980, // ACTIVA
                        'fecha_inicio' => $sub->estado_id == 980 ? $sub->fecha_inicio : now(),
                        'fecha_vencimiento' => $fechaBase->addDays((int)$sub->plan->codigo)
                    ]);

                    Log::info("Wompi OK: Suscripción activada para: " . $sub->comercio->nombre);

                    // 4. ENVIAR NOTIFICACIÓN WHATSAPP (Descomenta cuando estés listo)
                    // $this->notificarPagoExitoso($sub, $pago);
                }
            } else {
                Log::warning("Wompi: No se encontró el registro de pago para la referencia: " . $transaction['reference']);
            }
        }

        return response()->json(['status' => 'success'], 200);
    }

    private function extraerIdDeReferencia($referencia)
    {
        // Si tu referencia es "PAY69E153416A2DE177", esto extrae lo que esté después de la "E" o limpia el prefijo
        // Suponiendo que usas un prefijo fijo como "PAY" + un hash + el ID real
        // Una forma común es usar un separador como un guion "PAY-HASH-ID"
        
        // Si simplemente concatenaste el ID al final, podrías usar una lógica de búsqueda:
        //if (preg_match('/(\d+)$/', $referencia, $matches)) {
        //    return $matches[1]; // Retorna el número encontrado al final
        //}

        return $referencia; // O retorna la ref tal cual si el ID es la misma referencia
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