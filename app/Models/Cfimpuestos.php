<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfimpuestos
 *
 * @property $id
 * @property $codigo
 * @property $nombre
 * @property $descripcion
 * @property $valor
 * @property $activo
 * @property $tipo_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Ftimpuesto[] $ftimpuestos
 * @property Producto[] $productos
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfimpuestos extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'codigo' => 'string',
			'nombre' => 'required|string',
			'descripcion' => 'string',
			'valor' => 'required',
			'activo' => 'required',
			'tipo_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigo', 'nombre', 'descripcion', 'valor', 'activo', 'tipo_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cfmaestra()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'tipo_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ftimpuestos()
    {
        return $this->hasMany(\App\Models\Ftimpuestos::class, 'id', 'impuesto_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function productos()
    {
        return $this->hasMany(\App\Models\Productos::class, 'id', 'impuesto_id');
    }
    
}
