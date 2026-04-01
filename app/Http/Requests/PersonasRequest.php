<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PersonasRequest extends FormRequest
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
			'identificacion' => 'required|string',
			'telefonomovil' => 'required|string',
			'email' => 'required|string',
			'tipoidentificacion_id' => 'required',
			
        ];
    }

    public function messages(){
        return [
            'identificacion.required' => 'El campo identificaciones obligatorio',
            'email.required' => 'El campo email es obligatorio',
            'telefonomovil.required' => 'El campo telefono movil es obligatorio',
            'tipoidentificacion_id.required' => 'El campo tipo de identificación es obligatorio',
           
        ];
    }
}
