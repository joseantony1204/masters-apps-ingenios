<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfpromociones
 *
 * @property $id
 * @property $nombre
 * @property $descripcion
 * @property $tipo_descuento
 * @property $valor
 * @property $compra_minima
 * @property $fecha_inicio
 * @property $fecha_fin
 * @property $estado
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfcupone[] $cfcupones
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfpromociones extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'nombre' => 'required',
			'tipo_descuento' => 'required',
			'valor' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'descripcion', 'tipo_descuento', 'valor', 'compra_minima', 'categoria', 'fecha_inicio', 'fecha_fin', 'estado', 'comercio_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cupones()
    {
        return $this->hasMany(\App\Models\Cfcupones::class, 'promocion_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function comercios()
    {
        return $this->belongsTo(\App\Models\Comercios::class, 'comercio_id', 'id');
    }
    
}
