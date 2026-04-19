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

    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        Log::info("Wompi Webhook Recibido", ['payload' => $payload]);

        // 1. Extraer los datos necesarios del payload
        $data = $payload['data'];
        $properties = $payload['signature']['properties'];
        $timestamp = $payload['timestamp']; // <--- REQUERIDO: Es el entero UNIX (ej: 1776598574)
        $checksumRecibido = $payload['signature']['checksum'];
        $secret = config('app.wompi_events_secret');

        // 2. PASO 1: Concatenar dinámicamente según 'properties'
        $cadenaConcatenada = "";
        foreach ($properties as $property) {
            // Buscamos dentro de data.transaction usando la ruta del property
            // Por ejemplo: 'transaction.id' -> data['transaction']['id']
            $path = explode('.', $property);
            $value = $data;
            foreach ($path as $segment) {
                $value = $value[$segment] ?? '';
            }
            $cadenaConcatenada .= $value;
        }

        // 3. PASO 2: Concatena el campo timestamp (el entero)
        $cadenaConcatenada .= $timestamp;

        // 4. PASO 3: Concatena tu secreto de eventos
        $cadenaConcatenada .= $secret;

        // 5. PASO 4: Generar el hash SHA256
        $hashLocal = hash('sha256', $cadenaConcatenada);

        // 6. PASO 5: Comparar
        if ($hashLocal !== $checksumRecibido) {
            Log::error("Firma Inválida Webhook", [
                'cadena_construida' => $cadenaConcatenada,
                'local' => $hashLocal,
                'wompi' => $checksumRecibido
            ]);
            return response()->json(['message' => 'Invalid signature'], 403);
        }

        // --- SI LLEGA AQUÍ, LA FIRMA ES VÁLIDA ---

        // 3. Procesar solo si es APPROVED
        $transaction = $data['transaction'];
        if ($transaction['status'] === 'APPROVED') {
            
            // Buscamos el pago usando la referencia que viene dentro de transaction
            $pago = Scpagos::where('referencia_pasarela', $transaction['reference'])->first();

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
                    'suscripcion_id' => $pago->suscripcion_id
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