<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\{WhatsAppService};

class WhatsAppController extends Controller
{
    protected $WhatsAppService;

    public function __construct(protected WhatsAppService $whatsapp) {
        $this->WhatsAppService = $whatsapp;
    }

    public function send(Request $request)
    {
        $request->validate([
            'telefono' => 'required|string',
            'template' => 'required|string',
            'params'   => 'nullable|array', // Para variables como {{1}}, {{2}}
        ]);

        $result = $this->WhatsAppService->send(
            $request->input('telefono'),
            $request->input('template'),
            $request->input('params', []),
            $request->input('phone_id')
        ); 
        
        // Si el service retorna success false, lo manejamos
        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['error'] ?? 'No se pudo enviar el mensaje',
            ], 422); // Código 422 para que Axios caiga en el bloque 'catch'
        }
    
        return response()->json([
            'success' => true,
            'message' => '¡Mensaje enviado con éxito!',
            'data' => $result
        ]);
    }
}
?>