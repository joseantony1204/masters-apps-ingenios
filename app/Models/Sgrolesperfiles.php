<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Sgrolesperfiles
 *
 * @property $id
 * @property $perfil_id
 * @property $rol_id
 * @property $estado
 * @property $observacion
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Cfmaestra $cfmaestra
 * @property Sgpermiso[] $sgpermisos
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Sgrolesperfiles extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'perfil_id' => 'required',
			'rol_id' => 'required',
			'estado' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['perfil_id', 'rol_id', 'estado', 'observacion', 'created_by', 'updated_by', 'deleted_by'];


    
    
}
