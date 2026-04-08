<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CfempleadosRequest extends FormRequest
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
            // Reglas para la tabla PERSONAS
            'tipoidentificacion_id' => 'required',
            'identificacion' => 'required|string|max:20',
            'telefonomovil' => 'required',
            'telefonomovil' => 'required|unique:users,telefonomovil',
            'email' => 'required',

            // Reglas para la tabla PERSONASNATURALES
            'nombre' => 'required',
            'apellido' => 'required',
            'fechanacimiento' => 'required|date|before:today',
            'sexo_id' => 'required',

            // Reglas para la tabla EMPLEADOS
            'fechaingreso' => 'required|date',
            'estado_id' => 'required',
        ];
    }

    public function messages(){
        return [
            'tipoidentificacion_id.required' => 'El campo tipo identificación es requerido.',
            'identificacion.required' => 'El campo identificación es requerido.',
            'email.required' => 'El correo electrónico es obligatorio para el empleado.',
            'fechanacimiento.required' => 'El campo fecha de nacimiento es requerido.',
            'nombre.required' => 'El campo nombre es requerido.',
            'apellido.required' => 'El campo apellido es requerido.',
            'sexo_id.required' => 'El campo sexo es requerido.',
            'telefonomovil.required' => 'El campo telefonomovil es requerido.',
            'email.required' => 'El campo email es requerido.',
            'fechanacimiento.before' => 'La fecha de nacimiento no puede ser futura.',
            'estado_id.required' => 'El campo estado obligatorio.',
            'fechaingreso.required' => 'El campo fecha ingreso obligatorio.',
        ];
    }
}
