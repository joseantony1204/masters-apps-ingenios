<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfempleadosservicios
 *
 * @property $id
 * @property $preciopersonalizado
 * @property $duracionpersonalizado
 * @property $fechacreado
 * @property $comision
 * @property $empleado_id
 * @property $servicio_id
 * @property $estado_id
 * @property $observaciones
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Empleado $empleado
 * @property Cfmaestra $cfmaestra
 * @property Producto $producto
 * @property Detallescita[] $detallescitas
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfempleadosservicios extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'preciopersonalizado' => 'required',
			'duracionpersonalizado' => 'required',
			'fechacreado' => 'required',
			'empleado_id' => 'required',
			'servicio_id' => 'required',
			'estado_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['preciopersonalizado', 'duracionpersonalizado', 'fechacreado', 'comision', 'empleado_id', 'servicio_id', 'estado_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function empleado()
    {
        return $this->belongsTo(\App\Models\Cfempleados::class, 'empleado_id', 'id');
    }
    
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
    public function servicio()
    {
        return $this->belongsTo(\App\Models\Productos::class, 'servicio_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detallescitas()
    {
        return $this->hasMany(\App\Models\Addetallescitas::class, 'id', 'model_type_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detallesfactura()
    {
        return $this->hasMany(\App\Models\Ftdetalles::class, 'model_type_id')->where('model_type', 919);
    }
    
}
