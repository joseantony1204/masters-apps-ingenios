<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Addetallescitas
 *
 * @property $id
 * @property $descuento
 * @property $preciofinal
 * @property $fechacreado
 * @property $empleadoservicio_id
 * @property $cita_id
 * @property $estado_id
 * @property $observaciones
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Adcita $adcita
 * @property Cfempleadosservicio $cfempleadosservicio
 * @property Cfmaestra $cfmaestra
 * @property Adreseña[] $adreseñas
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Addetallescitas extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'cantidad' => 'required',
			'descuento' => 'required',
			'preciofinal' => 'required',
			'fechacreado' => 'required',
			'model_type' => 'required',
			'model_type_id' => 'required',
			'cita_id' => 'required',
			'estado_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['cantidad', 'descuento', 'preciofinal', 'fechacreado', 'model_type', 'model_type_id', 'cita_id', 'estado_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cita()
    {
        return $this->belongsTo(\App\Models\Adcitas::class, 'cita_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function empleadoservicio()
    {
        return $this->belongsTo(Cfempleadosservicios::class, 'model_type_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function producto()
    {
        return $this->hasMany(Productos::class, 'id', 'model_type_id');
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
    public function resenas()
    {
        //return $this->hasMany(\App\Models\Adresenas::class, 'id', 'detallecita_id');
    }
    
}
