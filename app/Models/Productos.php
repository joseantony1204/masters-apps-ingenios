<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Productos
 *
 * @property $id
 * @property $codigo
 * @property $codigobarra
 * @property $nombre
 * @property $descripcion
 * @property $minimostock
 * @property $precioingreso
 * @property $preciosalida
 * @property $acumulapuntos
 * @property $observacion
 * @property $padre
 * @property $tipo_id
 * @property $unidad_id
 * @property $ubicacion_id
 * @property $impuesto_id
 * @property $categoria_id
 * @property $marca_id
 * @property $estado_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Cfimpuesto $cfimpuesto
 * @property Cfmaestra $cfmaestra
 * @property Cfmaestra $cfmaestra
 * @property Ftdetalle[] $ftdetalles
 * @property Imagenesproducto[] $imagenesproductos
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Productos extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'nombre' => 'required',
			'precioingreso' => 'required',
			'preciosalida' => 'required',
			'tipo_id' => 'required',
			'estado_id' => 'required',
			'sede_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigo', 'codigobarra', 'nombre', 'duracion', 'descripcion', 'minimostock', 'precioingreso', 'preciosalida', 'acumulapuntos', 'observacion', 'padre', 'tipo_id', 'unidad_id', 'ubicacion_id', 'impuesto_id', 'categoria_id', 'marca_id', 'estado_id', 'sede_id', 'created_by', 'updated_by', 'deleted_by'];


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
    public function categoria()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'categoria_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function impuesto()
    {
        //return $this->belongsTo(\App\Models\Cfimpuesto::class, 'impuesto_id', 'id');
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
    public function unidad()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'unidad_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function sede()
    {
        return $this->belongsTo(\App\Models\Cfsedes::class, 'sede_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function ftdetalles()
    {
        //return $this->hasMany(\App\Models\Ftdetalle::class, 'id', 'producto_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function imagenesproductos()
    {
        //return $this->hasMany(\App\Models\Imagenesproducto::class, 'id', 'producto_id');
    }

    public function empleadosasignados() {
        // 1. Relación con el modelo Cfempleados
        // 2. Tabla pivote: cfempleadosservicios
        // 3. Llaves: servicio_id y empleado_id
        return $this->belongsToMany(Cfempleados::class, 'cfempleadosservicios', 'servicio_id', 'empleado_id')
        ->withPivot(
            'id', 
            'preciopersonalizado', 
            'comision', 
            'duracionpersonalizado', 
            'estado_id'
        )
        ->withTimestamps();
    }
    
}
