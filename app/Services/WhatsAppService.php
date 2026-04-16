<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    private $client;
    private $token;
    private $version;
    private $defaultPhoneId;

    public function __construct()
    {
        $this->token = config('app.whatsapptoken'); // Asegúrate de tenerlo en config/app.php
        $this->version = config('app.whatsappversion', 'v25.0');
        $this->defaultPhoneId = '985728251299871'; // ID por defecto 

        $this->client = new Client([
            'base_uri' => "https://graph.facebook.com/{$this->version}/", // Solo la raíz
            'timeout'  => 5.0,
        ]);
    }

    /**
     * Normaliza el número al formato internacional exigido por Meta
     */
    private function formatNumber($number)
    {
        $number = preg_replace('/\D/', '', $number); // Elimina todo lo que no sea número
        if (str_starts_with($number, 'whatsapp')) {
            $number = str_replace('whatsapp', '', $number);
        }
        return str_starts_with($number, '57') ? $number : '57' . $number;
    }

    /**
     * MÉTODO CORE: Envío de cualquier plantilla
     * * @param string $number Teléfono del cliente
     * @param string $templateName Nombre de la plantilla en Meta
     * @param array $params Parámetros del body {{1}}, {{2}}, etc.
     * @param string|null $phoneId ID del número emisor (opcional)
     */
    public function send($number, $templateName, array $params = [], $phoneId = null)
    {
        $phoneId = $phoneId ?? $this->defaultPhoneId;
        $formattedNumber = $this->formatNumber($number);

        // Generar una firma única para este mensaje para evitar duplicados en logs (Idempotencia visual)
        $messageHash = md5($formattedNumber . $templateName . json_encode($params));

        $body = [
            "messaging_product" => "whatsapp",
            "to" => $formattedNumber,
            "type" => "template",
            "template" => [
                "name" => $templateName,
                "language" => ["code" => "en_US"],
                "components" => [
                    [
                        "type" => "body",
                        "parameters" => collect($params)->map(fn($v) => ["type" => "text", "text" => (string)$v])->toArray()
                    ]
                ]
            ]
        ];

        try {
            // Log previo al envío (Cacheo de intención)
            Log::channel('stack')->info("Iniciando envío WhatsApp [Hash: $messageHash] a $formattedNumber");

            $response = $this->client->post("{$phoneId}/messages", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                ],
                'json' => $body
            ]);

            $result = json_decode($response->getBody()->getContents(), true);
            
            // Log de éxito
            Log::info("WhatsApp enviado con éxito. WAID: " . ($result['messages'][0]['id'] ?? 'N/A'));

            return [
                'success' => true,
                'wa_id' => $result['messages'][0]['id'] ?? null,
                'data' => $result
            ];

        } catch (ClientException $e) {
            $error = json_decode($e->getResponse()->getBody()->getContents(), true);
            // Capturamos errores específicos de Meta (ej: fuera de ventana de 24h)
            Log::error("Error de Cliente Meta [$messageHash]: ", $error);
            return ['success' => false, 'error' => $error['error']['message'] ?? 'Error en la API de Meta'];
        } catch (\Exception $e) {
            Log::error("Excepción crítica WhatsApp [$messageHash]: " . $e->getMessage());
            return ['success' => false, 'error' => 'Error interno de servidor'];
        }
    }
}
?>