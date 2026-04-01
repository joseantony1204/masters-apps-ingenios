<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfhorarios
 *
 * @property $id
 * @property $horainicio
 * @property $horafinal
 * @property $empleado_id
 * @property $dia_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Cfempleado $cfempleado
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfhorarios extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'horainicio' => 'required',
			'horafinal' => 'required',
			'empleado_id' => 'required',
			'dia_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['horainicio', 'horafinal', 'empleado_id', 'dia_id', 'estado', 'created_by', 'updated_by', 'deleted_by'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cfempleado()
    {
        return $this->belongsTo(\App\Models\Cfempleados::class, 'empleado_id', 'id');
    }

    public function empleado()
    {
        return $this->belongsTo(Cfempleados::class, 'empleado_id');
    }

    public function dias()
    {
        // Cada registro de horario pertenece a un día (relación con la tabla 'dias')
        return $this->belongsTo(Cfmaestra::class, 'dia_id');
    }
    
}
