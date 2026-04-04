<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FtresolucionesRequest extends FormRequest
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
			'numero' => 'required',
			'fecha' => 'required',
			'prefijo' => 'required',
			'desde' => 'required',
			'hasta' => 'required',
			'comercio_id' => 'required',
        ];
    }

    public function messages(){
        return [
            'numero.required' => 'El campo numero obligatorio.',
            'fecha.required' => 'El campo fecha obligatorio.',
            'prefijo.required' => 'El campo prefijo obligatorio.',
            'desde.required' => 'El campo desde obligatorio.',
            'hasta.required' => 'El campo hasta obligatorio.',
            'actual.required' => 'El campo actual obligatorio.',
            'comercio_id.required' => 'El campo comercio obligatorio.',
        ];
    }
}
