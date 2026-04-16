<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Scpagos
 *
 * @property $id
 * @property $valor
 * @property $fecha
 * @property $referencia_pasarela
 * @property $estado_id
 * @property $metodo_id
 * @property $suscripcion_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Cfmaestra $cfmaestra
 * @property Scsuscripcione $scsuscripcione
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Scpagos extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'valor' => 'required',
			'fecha' => 'required',
			'estado_id' => 'required',
			'metodo_id' => 'required',
			'suscripcion_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['valor', 'fecha', 'referencia_pasarela', 'estado_id', 'metodo_id', 'suscripcion_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        return $this->belongsTo(\App\Models\Cfmaestras::class, 'estado_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function metodo()
    {
        return $this->belongsTo(\App\Models\Cfmaestras::class, 'metodo_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function suscripcion()
    {
        return $this->belongsTo(\App\Models\Scsuscripciones::class, 'suscripcion_id', 'id');
    }
    
}
