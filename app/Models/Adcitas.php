<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Adcitas
 *
 * @property $id
 * @property $codigo
 * @property $fecha
 * @property $horainicio
 * @property $horafinal
 * @property $descripcion
 * @property $cupon
 * @property $cliente_id
 * @property $estado_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Adcliente $adcliente
 * @property Cfmaestra $cfmaestra
 * @property Addetallescita[] $addetallescitas
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Adcitas extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'codigo' => 'required',
			'fecha' => 'required',
			'horainicio' => 'required',
			'horafinal' => 'required',
			'cliente_id' => 'required',
			'estado_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigo', 'fecha', 'horainicio', 'horafinal', 'descripcion', 'cupon_id', 'device', 'motivocancelar', 'cliente_id', 'estado_id', 'created_by', 'updated_by', 'deleted_by'];
    
    protected $appends = ['adcliente'];

    public function getAdclienteAttribute()
    {
        return $this->cliente; // Esto invoca la relación definida abajo
    }
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cliente()
    {
        return $this->belongsTo(\App\Models\Adclientes::class, 'cliente_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'estado_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detalle()
    {
        return $this->hasMany(\App\Models\Addetallescitas::class, 'cita_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detalle_con_empleadoservicio()
    {
        return $this->hasMany(\App\Models\Addetallescitas::class, 'cita_id')->where('model_type', 919);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detalle_con_producto()
    {
        return $this->hasMany(\App\Models\Addetallescitas::class, 'cita_id')->where('model_type', 920);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function factura()
    {
        return $this->hasOne(\App\Models\Ftfacturas::class, 'model_type_id');
    }
    
}
