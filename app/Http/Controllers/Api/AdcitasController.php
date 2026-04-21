<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Adcitas,Comercios, Addetallescitas, Personas};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB,Hash};
use Illuminate\Support\Str;
use App\Events\AdcitasEvent;

class AdcitasController extends Controller
{

    public function store(Request $request) {
        // 1. Validación estricta de entrada
        $request->validate([
            'otp' => 'required',
            'identificacion' => 'required',
            'cliente_id' => 'required',
            'token' => 'required',
            'servicioasignado_id' => 'required',
            'fecha' => 'required',
            'horainicio' => 'required',
            'horafinal' => 'required',
            'precio' => 'required'
        ]);
        try {
            // 2. Verificar el OTP en Caché
         
            $persona = Personas::where('identificacion', $request->identificacion)->first();
            if ($persona->codigo_sms != $request->otp) {
                return response()->json(['message' => 'El código es incorrecto o ha expirado.'], 422);
            }

            return DB::transaction(function () use ($request,$persona) {
                // 3. Obtener el Comercio
                $comercio = Comercios::with('sedes')->where('token', $request->token)->first();
                $audt = ['created_by' => $comercio->id, 'created_at' => now()]; 

                // 4. Crear la Cita (Adcitas)
                $cita = Adcitas::create([
                    'codigo' => $this->generarCodigo(),
                    'cliente_id' => $request->cliente_id,
                    'fecha' => $request->fecha,
                    'horainicio' => $request->horainicio,
                    'horafinal' => $request->horafinal,
                    'descripcion' => $request->observaciones,
                    'cupon' => $request->cupon,
                    'estado_id' => 913,
                ] + $audt);

                // 5. Crear el Detalle (Addetallescitas)
                Addetallescitas::create([
                    'cantidad' => 1,
                    'descuento' => 0,
                    'preciounitario' => $request->precio,
                    'preciofinal' => $request->precio,
                    'model_type' => 919, //TABLA empleadoservicios en maestras
                    'model_type_id' => $request->servicioasignado_id, //ID de empleadoservicios 
                    'cita_id' => $cita->id,
                    'observaciones' => $request->observaciones,
                    'estado_id' => 913,
                ] + $audt);

                // 6. Limpiar el OTP para que no se pueda reutilizar
                $persona->update(['codigo_sms' => NULL]);
                if($cita)
                    event(new AdcitasEvent($cita));
                return response()->json([
                    'status' => 'success',
                    'message' => 'Reserva creada correctamente',
                    'data' => $cita
                ], 201);
                

            });

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al procesar la reserva: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Genera un código de cita alfanumérico aleatorio.
     */
    private function generarCodigo()
    {
        // Genera una cadena aleatoria de 10 caracteres
        $codigo = Str::random(10);

        // Opcional: Validar que el código no exista ya en la base de datos (recursión)
        $existe = DB::table('adcitas')->where('codigo', $codigo)->exists();
        
        if ($existe) {
            return $this->generarCodigoCita();
        }

        return strtoupper($codigo); // Lo devolvemos en mayúsculas para que sea más legible
    }
}