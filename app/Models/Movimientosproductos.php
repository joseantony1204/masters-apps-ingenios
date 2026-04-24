<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Movimientosproductos
 *
 * @property $id
 * @property $tipo
 * @property $cantidad
 * @property $stock_resultante
 * @property $motivo
 * @property $producto_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Producto $producto
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Movimientosproductos extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'tipo' => 'required',
			'cantidad' => 'required',
			'stock_resultante' => 'required',
			'producto_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['tipo', 'cantidad', 'stock_resultante', 'motivo', 'producto_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function producto()
    {
        return $this->belongsTo(\App\Models\Productos::class, 'producto_id', 'id');
    }

    public function usuario() {
        return $this->belongsTo(User::class, 'created_by');
    }
    
}
