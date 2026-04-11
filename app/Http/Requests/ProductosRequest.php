<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductosRequest extends FormRequest
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
			'nombre' => 'required',
			'precioingreso' => 'required',
			'preciosalida' => 'required',
			'tipo_id' => 'required',
			'estado_id' => 'required',
			'sede_id' => 'required',
        ];
    }

    public function messages(){
        return [
            'nombre.required' => 'El campo nombre obligatorio.',
            'precioingreso.required' => 'El campo precio ingreso obligatorio.',
            'preciosalida.required' => 'El campo precio salida obligatorio.',
            'tipo_id.required' => 'El campo tipo obligatorio.',
            'estado_id.required' => 'El campo estado obligatorio.',
            'sede_id.required' => 'El campo sede obligatorio.',
        ];
    }
}
