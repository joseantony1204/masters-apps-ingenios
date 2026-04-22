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
        $this->defaultPhoneId = config('app.whatsapphonenumberid', '1065635596636262');//'1065635596636262'; // ID por defecto 

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

    public function send($number, $templateName, array $params = [], $buttonParam = null, $phoneId = null)
    {
        $phoneId = $phoneId ?? $this->defaultPhoneId;
        $formattedNumber = $this->formatNumber($number);

        // Firma para logs incluyendo el parámetro del botón
        $messageHash = md5($formattedNumber . $templateName . json_encode($params) . $buttonParam);

        // 1. Definimos los componentes básicos (Body)
        $components = [
            [
                "type" => "body",
                "parameters" => collect($params)->map(fn($v) => ["type" => "text", "text" => (string)$v])->toArray()
            ]
        ];

        // 2. Si hay un parámetro para el botón, lo añadimos al array de componentes
        if ($buttonParam) {
            $components[] = [
                "type" => "button",
                "sub_type" => "url",
                "index" => "0", // Asume que es el primer botón de URL configurado en Meta
                "parameters" => [
                    [
                        "type" => "text",
                        "text" => (string)$buttonParam // El sufijo que se pegará a la URL base
                    ]
                ]
            ];
        }

        $body = [
            "messaging_product" => "whatsapp",
            "to" => $formattedNumber,
            "type" => "template",
            "template" => [
                "name" => $templateName,
                "language" => ["code" => "es"],
                "components" => $components
            ]
        ];

        try {
            Log::channel('stack')->info("Iniciando envío WhatsApp [Hash: $messageHash] a $formattedNumber");

            $response = $this->client->post("{$phoneId}/messages", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->token,
                    'Content-Type' => 'application/json',
                ],
                'json' => $body
            ]);

            $result = json_decode($response->getBody()->getContents(), true);
            
            Log::info("WhatsApp enviado con éxito. WAID: " . ($result['messages'][0]['id'] ?? 'N/A'));

            return [
                'success' => true,
                'wa_id' => $result['messages'][0]['id'] ?? null,
                'data' => $result
            ];

        } catch (ClientException $e) {
            $responseBody = $e->getResponse()->getBody()->getContents();
            $error = json_decode($responseBody, true);
            Log::error("Error de Cliente Meta [$messageHash]: ", $error ?? [$responseBody]);
            return ['success' => false, 'error' => $error['error']['message'] ?? 'Error en la API de Meta'];
        } catch (\Exception $e) {
            Log::error("Excepción crítica WhatsApp [$messageHash]: " . $e->getMessage());
            return ['success' => false, 'error' => 'Error interno de servidor'];
        }
    }
}
?>