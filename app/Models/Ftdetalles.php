<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftdetalles
 *
 * @property $id
 * @property $cantidad
 * @property $numero
 * @property $precioinicial
 * @property $preciofinal
 * @property $descuento
 * @property $totalapagar
 * @property $fecha
 * @property $observaciones
 * @property $producto_id
 * @property $factura_id
 * @property $estado_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Ftfactura $ftfactura
 * @property Producto $producto
 * @property Ftseriale[] $ftseriales
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Ftdetalles extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'cantidad' => 'required',
			'precioinicial' => 'required',
			'preciofinal' => 'required',
			'descuento' => 'required',
			'totalapagar' => 'required',
			'fecha' => 'required',
			'factura_id' => 'required',
			'estado_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['cantidad', 'numero', 'precioinicial', 'preciofinal', 'descuento', 'porcentajedescuento', 'totalapagar', 'fecha', 'observaciones', 'model_type', 'model_type_id', 'factura_id', 'estado_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cfmaestra()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'estado_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ftfactura()
    {
        return $this->belongsTo(\App\Models\Ftfacturas::class, 'factura_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function producto()
    {
        return $this->belongsTo(\App\Models\Productos::class, 'model_type_id', 'id');
    }

    public function empleadoservicio()
    {
        return $this->belongsTo(\App\Models\Cfempleadosservicios::class, 'model_type_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ftseriales()
    {
        return $this->hasMany(\App\Models\Ftseriales::class, 'id', 'detalle_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function factura_con_cita()
    {
        return $this->belongsTo(\App\Models\Ftfacturas::class, 'factura_id')->where('model_type', 921);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function factura_sin_cita()
    {
        return $this->belongsTo(\App\Models\Ftfacturas::class, 'factura_id')->where('model_type', 922);
    }
    
}
