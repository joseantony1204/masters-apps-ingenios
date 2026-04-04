<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Soportes
 *
 * @property $id
 * @property $descripcion
 * @property $ruta
 * @property $predeterminado
 * @property $fecha
 * @property $estado
 * @property $model_type
 * @property $model_type_id
 * @property $tipo_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Soportes extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'ruta' => 'required',
			'fecha' => 'required',
			'model_type' => 'required',
			'model_type_id' => 'required',
			'tipo_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['descripcion', 'ruta', 'predeterminado', 'fecha', 'estado', 'model_type', 'model_type_id', 'tipo_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cfmaestra()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'tipo_id', 'id');
    }
    
}
