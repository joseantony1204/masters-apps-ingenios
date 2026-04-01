<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personasnaturales extends Model
{

    protected $fillable = ['fechanacimiento','nombre','segundonombre','apellido','segundoapellido','persona_id','zona_id','sexo_id','estadocivil_id','niveleducacion_id','religion_id','etnia_id','tiposangre_id','rh_id','ocupacion_id','estrato_id','discapacidad_id','observaciones','created_by','updated_by','deleted_by'];
    
    protected $appends = ['nombres','apellidos','nombreapellido','nombrecompleto'];

    static $rules = [
        'fechanacimiento' => 'required',
        'nombre' => 'required',
        'apellido' => 'required',
        'persona_id' => 'required',
        'sexo_id' => 'required',];

    public function getNombreApellidoAttribute()
    {
        return "{$this->nombre} {$this->apellido}";
    }

    public function getNombresAttribute()
    {
        return "{$this->nombre} {$this->segundonombre}";
    }

    public function getNombreCompletoAttribute()
    {
        return "{$this->nombre} {$this->segundonombre} {$this->apellido} {$this->segundoapellido}";
    }

    public function getApellidosAttribute()
    {
        return "{$this->apellido} {$this->segundoapellido}";
    }

    public function personas(){
        return $this->belongsTo('App\Models\Personas','persona_id', 'id');
    }

    
}
