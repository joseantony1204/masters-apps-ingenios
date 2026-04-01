<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CfbloqueosagendasRequest extends FormRequest
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
			'empleado_id' => 'required',
            'fecha' => 'required|date',
            'horainicio' => 'required',
            'horafinal' => 'required|after:horainicio',
            'motivo_id' => 'required',
            'descripcion' => 'nullable|string'
        ];
    }

    public function messages(){
        return [
            'empleado_id.required' => 'El empleado es obligatorio.',
            'fecha.required' => 'La fecha es obligatorio.',
            'horainicio.required' => 'La hora de inicio es obligatorio.',
            'horafinal.required' => 'La hora final es obligatorio.',
            'horafinal.after' => 'La hora final debe ser mayor a la hora de inicio.',
        ];
    }
}
