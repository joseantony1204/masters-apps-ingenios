<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfbloqueosagendas
 *
 * @property $id
 * @property $fecha
 * @property $horainicio
 * @property $horafinal
 * @property $empleado_id
 * @property $motivo_id
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
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfbloqueosagendas extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'fecha' => 'required',
			'horainicio' => 'required',
			'horafinal' => 'required',
			'empleado_id' => 'required',
			'motivo_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['fecha', 'horainicio', 'horafinal', 'empleado_id', 'motivo_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];


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
    public function motivo()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'motivo_id');
    }
    
}
