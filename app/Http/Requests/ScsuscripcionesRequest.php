<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ScsuscripcionesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
			'fecha_inicio' => 'required',
			'fecha_vencimiento' => 'required',
			'estado_id' => 'required',
			'plan_id' => 'required',
			'comercio_id' => 'required',
			'created_by' => 'required',
        ];
    }

    public function messages(){
        return [
            'xxxxx.required' => 'El campo xxxxx obligatorio.',
        ];
    }
}
