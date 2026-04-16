<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * Class Comercios
 *
 * @property $id
 * @property $nombre
 * @property $objetocomercial
 * @property $persona_id
 * @property $observaciones
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Persona $persona
 * @property Cfsede[] $cfsedes
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Comercios extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'token' => 'required',
			'nombre' => 'required',
			'persona_id' => 'required',
			'created_by' => 'required',];
            
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['token', 'nombre', 'objetocomercial', 'persona_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function persona()
    {
        return $this->belongsTo(\App\Models\Personas::class, 'persona_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function sedes()
    {
        return $this->hasMany(\App\Models\Cfsedes::class, 'comercio_id')->where('estado', 1);
    }

    // En el modelo Comercios.php
    public function soportes()
    {
        return $this->hasMany(Soportes::class, 'model_type_id')->where('model_type', 965); // 965 es el identificador de tabla padre para Comercios
    }

    protected static function booted()
    {
        static::creating(function ($comercio) {
            $comercio->token = Str::uuid()->toString() . Str::random(32);
        });
    }

    public function promociones()
    {
        return $this->hasMany(\App\Models\Cfpromociones::class, 'comercio_id', 'id');
    }

    public function suscripcion()
    {
        // Trae la última suscripción creada para este comercio
        return $this->hasOne(Scsuscripciones::class, 'comercio_id')->latestOfMany();
    }
    
}
