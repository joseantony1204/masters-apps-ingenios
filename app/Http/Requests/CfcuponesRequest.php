<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CfcuponesRequest extends FormRequest
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
			'promocion_id' => 'required',
			'codigo' => 'required',
			'limite_uso_total' => 'required',
			'limite_uso_por_persona' => 'required',
			'usos_actuales' => 'required',
			'es_automatico' => 'required',
			'created_by' => 'required',
        ];
    }

    public function messages(){
        return [
            'xxxxx.required' => 'El campo xxxxx obligatorio.',
        ];
    }
}
