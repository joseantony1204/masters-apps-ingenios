<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Adresenas
 *
 * @property $id
 * @property $estrellas
 * @property $comentario
 * @property $token
 * @property $fecha
 * @property $detalle_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Ftdetalle $ftdetalle
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Adresenas extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'estrellas' => 'required',
			'persona_id' => 'required',
			'token' => 'required',
			'detalle_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['estrellas', 'comentario', 'token', 'fecha', 'persona_id', 'detalle_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function detalle()
    {
        return $this->belongsTo(\App\Models\Ftdetalles::class, 'detalle_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function persona()
    {
        return $this->belongsTo(\App\Models\Personas::class, 'persona_id', 'id');
    }
    
}
