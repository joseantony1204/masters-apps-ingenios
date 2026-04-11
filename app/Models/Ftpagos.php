<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftpagos
 *
 * @property $id
 * @property $numero
 * @property $fecha
 * @property $concepto
 * @property $total
 * @property $metodo_id
 * @property $factura_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Ftfactura $ftfactura
 * @property Cfmaestra $cfmaestra
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Ftpagos extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'fecha' => 'required',
			'total' => 'required',
			'metodo_id' => 'required',
			'factura_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['numero', 'fecha', 'concepto', 'total', 'metodo_id', 'factura_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ftfactura()
    {
        return $this->belongsTo(\App\Models\Ftfactura::class, 'factura_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function cfmaestra()
    {
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'metodo_id', 'id');
    }
    
}
