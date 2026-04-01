<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftturnos
 *
 * @property $id
 * @property $codigo
 * @property $descripcion
 * @property $observaciones
 * @property $baseinicial
 * @property $fecha
 * @property $fechanaapertura
 * @property $fechanacierre
 * @property $persona_id
 * @property $terminal_id
 * @property $estado_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Persona $persona
 * @property Ftterminale $ftterminale
 * @property Ftfactura[] $ftfacturas
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Ftturnos extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'baseinicial' => 'required',
			'fecha' => 'required',
			'fechaapertura' => 'required',
			'persona_id' => 'required',
			'terminal_id' => 'required',
			'estado_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigo', 'descripcion', 'observaciones', 'baseinicial', 'fecha', 'fechaapertura', 'fechacierre', 'persona_id', 'terminal_id', 'estado_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'estado_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function persona()
    {
        return $this->belongsTo(\App\Models\Personas::class, 'persona_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function terminal()
    {
        return $this->belongsTo(\App\Models\Ftterminales::class, 'terminal_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function facturas()
    {
        return $this->hasMany(\App\Models\Ftfacturas::class, 'id', 'turno_id');
    }
    
}
