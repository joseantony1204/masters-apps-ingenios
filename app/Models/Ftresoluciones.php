<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftresoluciones
 *
 * @property $id
 * @property $numero
 * @property $fecha
 * @property $prefijo
 * @property $desde
 * @property $hasta
 * @property $actual
 * @property $advertirescacez
 * @property $descripcion
 * @property $fechafinal
 * @property $comercio_id
 * @property $estado
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Comercio $comercio
 * @property Ftterminale[] $ftterminales
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Ftresoluciones extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'numero' => 'required',
			'fecha' => 'required',
			'prefijo' => 'required',
			'desde' => 'required',
			'hasta' => 'required',
			'actual' => 'required',
			'advertirescacez' => 'required',
			'comercio_id' => 'required',
			'estado' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['numero', 'fecha', 'prefijo', 'desde', 'hasta', 'actual', 'advertirescacez', 'descripcion', 'fechafinal', 'comercio_id', 'estado', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function comercio()
    {
        return $this->belongsTo(\App\Models\Comercios::class, 'comercio_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function terminales()
    {
        return $this->hasMany(\App\Models\Ftterminales::class, 'id', 'resolucion_id');
    }
    
}
