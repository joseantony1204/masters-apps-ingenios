<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Scsuscripciones
 *
 * @property $id
 * @property $fecha_inicio
 * @property $fecha_vencimiento
 * @property $ultimo_pago_id
 * @property $estado_id
 * @property $plan_id
 * @property $comercio_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Comercio $comercio
 * @property Cfmaestra $cfmaestra
 * @property Cfmaestra $cfmaestra
 * @property Scpago[] $scpagos
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Scsuscripciones extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'fecha_inicio' => 'required',
			'fecha_vencimiento' => 'required',
			'estado_id' => 'required',
			'plan_id' => 'required',
			'comercio_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['fecha_inicio', 'fecha_vencimiento', 'ultimo_pago_id', 'estado_id', 'plan_id', 'comercio_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function comercio()
    {
        return $this->belongsTo(\App\Models\Comercios::class, 'comercio_id', 'id');
    }
    
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
    public function plan()
    {
        return $this->belongsTo(\App\Models\Cfmaestras::class, 'plan_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pagos()
    {
        return $this->hasMany(\App\Models\Scpagos::class, 'suscripcion_id');
    }
    
}
