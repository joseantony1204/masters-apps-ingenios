<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FtturnosRequest extends FormRequest
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
			'baseinicial' => 'required',
			'fecha' => 'required',
			'fechanaapertura' => 'required',
			'persona_id' => 'required',
			'terminal_id' => 'required',
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
