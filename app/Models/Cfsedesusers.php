<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfsedesusers
 *
 * @property $id
 * @property $orden
 * @property $predeterminada
 * @property $usuario_id
 * @property $sede_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfsede $cfsede
 * @property User $user
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfsedesusers extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'orden' => 'required',
			'predeterminada' => 'required',
			'usuario_id' => 'required',
			'sede_id' => 'required',
			'estado_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['orden', 'predeterminada', 'usuario_id', 'sede_id', 'estado_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cfsede()
    {
        return $this->belongsTo(\App\Models\Cfsedes::class, 'sede_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class, 'usuario_id', 'id');
    }
    
}
