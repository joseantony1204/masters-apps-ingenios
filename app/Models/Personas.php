<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Personas
 *
 * @property $id
 * @property $identificacion
 * @property $digitoverificacion
 * @property $lugarexpedicion
 * @property $fechaexpedicion
 * @property $telefono
 * @property $telefonomovil
 * @property $sendsms
 * @property $email
 * @property $sendemail
 * @property $foto
 * @property $firma
 * @property $direccion
 * @property $pais_id
 * @property $departamento_id
 * @property $ciudad_id
 * @property $barrio
 * @property $tipoidentificacion_id
 * @property $tiporegimen_id
 * @property $observaciones
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Personasjuridica[] $personasjuridicas
 * @property Personasnaturales[] $personasnaturales
 * @property User $user
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Personas extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'identificacion' => 'required|string',
			'telefonomovil' => 'string',
			'email' => 'string',
			'tipoidentificacion_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['identificacion', 'digitoverificacion', 'lugarexpedicion', 'fechaexpedicion', 'telefono', 'telefonomovil', 'sendsms', 'email', 'sendemail', 'foto', 'firma', 'direccion', 'pais_id', 'departamento_id', 'ciudad_id', 'barrio', 'tipoidentificacion_id', 'tiporegimen_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function personasnaturales()
    {
        return $this->hasOne('App\Models\Personasnaturales', 'persona_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function empleados()
    {
        return $this->hasOne('App\Models\Cfempleados', 'persona_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function clientes()
    {
        return $this->hasOne('App\Models\Adclientes', 'persona_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function user()
    {
        //return $this->hasOne(\App\Models\User::class, 'id', 'persona_id');
        return $this->hasOne(\App\Models\User::class, 'persona_id', 'id');
    }
    
}
