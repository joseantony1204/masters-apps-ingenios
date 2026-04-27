<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftfacturas
 *
 * @property $id
 * @property $codigoseguridad
 * @property $numero
 * @property $fecha
 * @property $fechanavencimiento
 * @property $observaciones
 * @property $model_type
 * @property $model_type_id
 * @property $origen_id
 * @property $destino_id
 * @property $tipo_id
 * @property $turno_id
 * @property $estado_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Cfmaestra $cfmaestra
 * @property Ftturno $ftturno
 * @property Ftdetalle[] $ftdetalles
 * @property Ftimpuesto[] $ftimpuestos
 * @property Ftpago[] $ftpagos
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Ftfacturas extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'codigoseguridad' => 'required',
			'subtotal' => 'required',
			'total' => 'required',
			'fecha' => 'required',
			'fechanavencimiento' => 'required',
			'model_type' => 'required',
			'model_type_id' => 'required',
			'tipo_id' => 'required',
			'turno_id' => 'required',
			'estado_id' => 'required',];

    
    protected $appends = ['adestado','adtipo','adturno','adcupon','adpagos'];        
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigoseguridad', 'numero', 'subtotal', 'descuento', 'porcentajedescuento', 'impuesto', 'total', 'fecha', 'fechanavencimiento', 'observaciones', 'model_type', 'model_type_id', 'origen_id', 'destino_id', 'tipo_id', 'cupon_id', 'turno_id', 'estado_id', 'created_by', 'updated_by', 'deleted_by'];

    
    public function getAdestadoAttribute()
    {
        return $this->estado; // Esto invoca la relación definida abajo
    }

    public function getAdtipoAttribute()
    {
        return $this->tipo; // Esto invoca la relación definida abajo
    }

    public function getAdcuponAttribute()
    {
        return $this->cupon; // Esto invoca la relación definida abajo
    }

    public function getAdturnoAttribute()
    {
        return $this->turnos; // Esto invoca la relación definida abajo
    }

    public function getAdpagosAttribute()
    {
        return $this->pagos; // Esto invoca la relación definida abajo
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
    public function tipo()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'tipo_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function turnos()
    {
        return $this->belongsTo(\App\Models\Ftturnos::class, 'turno_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cupon()
    {
        return $this->belongsTo(\App\Models\Cfcupones::class, 'cupon_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */

    public function detalles()
    {
        return $this->hasMany(\App\Models\Ftdetalles::class, 'factura_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detalles_con_empleadoservicio()
    {
        return $this->hasMany(\App\Models\Ftdetalles::class, 'factura_id')->where('model_type', 919);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detalles_con_producto()
    {
        return $this->hasMany(\App\Models\Ftdetalles::class, 'factura_id')->where('model_type', 920);
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function impuestos()
    {
        return $this->hasMany(\App\Models\Ftimpuestos::class, 'id', 'factura_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function pagos()
    {
        return $this->hasMany(\App\Models\Ftpagos::class, 'factura_id');
    }

    // En App\Models\Venta.php
    public function cliente()
    {
        // Esto mapea model_type_id con el ID de la tabla correspondiente
        return $this->morphTo(__FUNCTION__, 'model_type', 'model_type_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cita()
    {
        return $this->belongsTo(\App\Models\Adcitas::class, 'model_type_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function persona()
    {
        return $this->belongsTo(\App\Models\Personas::class, 'model_type_id');
    }
    
}
