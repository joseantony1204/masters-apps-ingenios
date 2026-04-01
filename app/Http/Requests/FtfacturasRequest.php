<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FtfacturasRequest extends FormRequest
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
			'codigoseguridad' => 'required',
			'fecha' => 'required',
			'fechanavencimiento' => 'required',
			'model_type' => 'required',
			'model_type_id' => 'required',
			'tipo_id' => 'required',
			'turno_id' => 'required',
			'estado_id' => 'required',
			'created_by' => 'required',
        ];
    }

    public function messages(){
        return [
            'xxxxx.required' => 'El campo xxxxx obligatorio.',
        ];
    }
}
