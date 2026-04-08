<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\{Cache,Log};

/**
 * Class Personas
 *
 * @property $id
 * @property $identificacion
 * @property $digitoverificacion
 * @property $lugarexpedicion
 * @property $fechaexpedicion
 * @property $telefono
 * @property $telefonomovil
 * @property $sendsms
 * @property $email
 * @property $sendemail
 * @property $foto
 * @property $firma
 * @property $direccion
 * @property $pais_id
 * @property $departamento_id
 * @property $ciudad_id
 * @property $barrio
 * @property $tipoidentificacion_id
 * @property $tiporegimen_id
 * @property $observaciones
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Personasjuridica[] $personasjuridicas
 * @property Personasnaturales[] $personasnaturales
 * @property User $user
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Personas extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'identificacion' => 'required|string',
			'telefonomovil' => 'string',
			'email' => 'string',
			'tipoidentificacion_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['identificacion', 'digitoverificacion', 'lugarexpedicion', 'fechaexpedicion', 'telefono', 'telefonomovil', 'codigo_sms', 'sendsms', 'email', 'sendemail', 'foto', 'firma', 'direccion', 'pais_id', 'departamento_id', 'ciudad_id', 'barrio', 'tipoidentificacion_id', 'tiporegimen_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function personasnaturales()
    {
        return $this->hasOne('App\Models\Personasnaturales', 'persona_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function empleados()
    {
        return $this->hasOne('App\Models\Cfempleados', 'persona_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function clientes()
    {
        return $this->hasOne('App\Models\Adclientes', 'persona_id', 'id');
    }

    public function comercios()
    {
        return $this->hasOne('App\Models\Comercios', 'persona_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function user()
    {
        //return $this->hasOne(\App\Models\User::class, 'id', 'persona_id');
        return $this->hasOne(\App\Models\User::class, 'persona_id', 'id');
    }

    public function generateAndSendOpt($identificacion,$telefono)
    {

        if (!$identificacion || !$telefono) {
            return;
        }
        $persona = Personas::where('identificacion', $identificacion)->first();
        // 1. Generar un código de 4 o 6 dígitos
        $codigo = str_pad(rand(1,999999), 6, "0", STR_PAD_LEFT);
        // 2. Guardar en caché usando el teléfono como llave (por 10 minutos)
        // Guardamos el código para validarlo después
        Cache::put('otp_' . $telefono, $codigo, now()->addMinutes(10));
        $persona->update(['telefonomovil' => $telefono, 'codigo_sms' => $codigo]); // Guardamos el OTP en la base de datos (opcional)
        // 3. ENVIAR SMS / WHATSAPP 
        // Aquí conectarías con Twilio, con un proveedor de WhatsApp, o simplemente
        // lo retornas en el JSON si estás en modo pruebas (Local).

        $message = "Hola: $codigo, es tu codigo de verificacion para reservar la cita";

        $auth_basic = base64_encode("marioquintero1130@gmail.com:qI4kR50UxOSDkDfcswCJNWBmwa0tO4S6");
        $curl = curl_init();
        $recipient = [['msisdn' => $telefono]];
        $postfields = [
            'message'   => $message,
            'tpoa'      => 'Sender',
            'recipient' => $recipient,
        ];

        curl_setopt_array($curl, [
            CURLOPT_URL => "https://api.labsmobile.com/json/send",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => json_encode($postfields),
            CURLOPT_HTTPHEADER => [
                "Authorization: Basic " . $auth_basic,
                "Cache-Control: no-cache",
                "Content-Type: application/json"
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);
        $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        Log::info('sendsms labsmobile response:', [
            'http_code' => $httpCode,
            'response'  => $response,
            'recipient'  => $recipient,
        ]);

        if ($err) {
            Log::error('sendsms curl error:', ['error' => $err]);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el SMS'
            ], 502);
        }

        $result = json_decode($response, true);

        if (!isset($result['code']) || $result['code'] !== '0') {
            Log::error('sendsms labsmobile error:', $result ?? []);
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el SMS: ' . ($result['message'] ?? 'Error desconocido')
            ], 502);
        }

        return response()->json([
            'success' => true,
            'message' => 'SMS enviado correctamente'
        ], 200);
    }
    
}
