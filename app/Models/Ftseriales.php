<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Ftseriales
 *
 * @property $id
 * @property $serial
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
class Ftseriales extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'serial' => 'required',
			'detalle_id' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['serial', 'detalle_id', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function ftdetalle()
    {
        return $this->belongsTo(\App\Models\Ftdetalle::class, 'detalle_id', 'id');
    }
    
}
