<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftterminales
 *
 * @property $id
 * @property $nombre
 * @property $resolucion_id
 * @property $estado_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Ftresolucione $ftresolucione
 * @property Ftturno[] $ftturnos
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Ftterminales extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'nombre' => 'required',
			'resolucion_id' => 'required',
			'sede_id' => 'required',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigo', 'nombre', 'resolucion_id', 'sede_id', 'estado', 'created_by', 'updated_by', 'deleted_by'];

    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function resolucion()
    {
        return $this->belongsTo(\App\Models\Ftresoluciones::class, 'resolucion_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function sede()
    {
        return $this->belongsTo(\App\Models\Cfsedes::class, 'sede_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function turnos()
    {
        return $this->hasMany(\App\Models\Ftturnos::class, 'id', 'terminal_id');
    }
    
}
