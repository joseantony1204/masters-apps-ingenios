<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfsedes
 *
 * @property $id
 * @property $nombre
 * @property $direccion
 * @property $email
 * @property $telefono
 * @property $comercio_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Comercio $comercio
 * @property Cfsedesuser[] $cfsedesusers
 * @property Ftresolucione[] $ftresoluciones
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfsedes extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'nombre' => 'required',
			'direccion' => 'required',
			'comercio_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['nombre', 'ciudad', 'direccion', 'email', 'telefono', 'comercio_id', 'estado', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function comercio()
    {
        return $this->belongsTo(\App\Models\Comercios::class, 'comercio_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function cfsedesusers()
    {
        return $this->hasMany(\App\Models\Cfsedesusers::class, 'id', 'sede_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ftresoluciones()
    {
        return $this->hasMany(\App\Models\Ftresoluciones::class, 'id', 'sede_id');
    }
    
}
