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
			'fecha' => 'required',
			'fechanavencimiento' => 'required',
			'model_type' => 'required',
			'model_type_id' => 'required',
			'tipo_id' => 'required',
			'turno_id' => 'required',
			'estado_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigoseguridad', 'numero', 'fecha', 'fechanavencimiento', 'observaciones', 'model_type', 'model_type_id', 'origen_id', 'destino_id', 'tipo_id', 'turno_id', 'estado_id', 'created_by', 'updated_by', 'deleted_by'];


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
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function detalles()
    {
        return $this->hasMany(\App\Models\Ftdetalles::class, 'id', 'factura_id');
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
        return $this->hasMany(\App\Models\Ftpagos::class, 'id', 'factura_id');
    }
    
}
