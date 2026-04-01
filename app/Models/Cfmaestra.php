<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Cfmaestra extends Model
{
    use SoftDeletes;

    static $rules = [
		'nombre' => 'required',
    ];

    protected $perPage = 10000;
	//protected $primaryKey = '';
	//protected $table = '';
	public $timestamps = false;

    /**
     * Attributes that should be mass-assignable.
     *
     * @var array
     */
    protected $fillable = ['codigo','nombre','padre','jerarquia', 'orden', 'visible', 'observacion','created_by','updated_by','deleted_by'];

    public function jerarquia(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany('App\Models\Cfmaestra','padre' , 'id')
            ->orderBy('orden');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function getPadres()
    {
        return $this->where('padre', 1)->get();
    }

    /**
     * metodo para devolver lista de tipos
     * Recibe como parametro el codigo de la lista de tipos que desea
     * consultar
     */
    public static function getlistatipos($codigo)
    {
        $padre = Cfmaestra::select('id')->where('codigo','=',strtoupper($codigo))->first();
        if (!$padre) {
            return false;
        }

        $list = Cfmaestra::where('padre', '=',$padre->id)
        ->get()->sortBy('nombre')
        ->pluck('nombre', 'id')
        ->prepend('', '');
        return $list;
    }
}
