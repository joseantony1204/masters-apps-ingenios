<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftimpuestos
 *
 * @property $id
 * @property $base
 * @property $valor
 * @property $detalle_id
 * @property $impuesto_id
 * @property $factura_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Ftfactura $ftfactura
 * @property Cfimpuesto $cfimpuesto
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Ftimpuestos extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'base' => 'required',
			'valor' => 'required',
			'impuesto_id' => 'required',
			'factura_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['base', 'valor', 'detalle_id', 'impuesto_id', 'factura_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ftfactura()
    {
        return $this->belongsTo(\App\Models\Ftfacturas::class, 'factura_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cfimpuesto()
    {
        return $this->belongsTo(\App\Models\Cfimpuestos::class, 'impuesto_id', 'id');
    }
    
}
