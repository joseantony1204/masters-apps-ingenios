<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfcupones
 *
 * @property $id
 * @property $promocion_id
 * @property $codigo
 * @property $persona_id
 * @property $limite_uso_total
 * @property $limite_uso_por_persona
 * @property $usos_actuales
 * @property $es_automatico
 * @property $fechavence
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfpromocione $cfpromocione
 * @property CfcuponHistorial[] $cfcuponHistorials
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfcupones extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'promocion_id' => 'required',
			'codigo' => 'required',
			'limite_uso_total' => 'required',
			'limite_uso_por_persona' => 'required',
			'usos_actuales' => 'required',
			'es_automatico' => 'required',
			'created_by' => 'required',];

   
    protected $casts = [
        'fechavence' => 'datetime', // Esto hace la magia
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['promocion_id', 'codigo', 'persona_id', 'limite_uso_total', 'limite_uso_por_persona', 'usos_actuales', 'es_automatico', 'estado', 'fechavence', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function promociones()
    {
        return $this->belongsTo(\App\Models\Cfpromociones::class, 'promocion_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function personas()
    {
        return $this->belongsTo(\App\Models\Personas::class, 'persona_id', 'id');
    }

    public function facturas()
    {
        return $this->belongsTo(\App\Models\Ftfacturas::class, 'id', 'cupon_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cfcuponHistorials()
    {
        //return $this->hasMany(\App\Models\CfcuponHistorial::class, 'id', 'cupon_id');
    }
    
}
