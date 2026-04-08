<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\{Auth,DB};

/**
 * Class Adclientes
 *
 * @property $id
 * @property $fechaingreso
 * @property $personas_id
 * @property $referido_id
 * @property $estado_id
 * @property $comercio_id
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Persona $persona
 * @property Persona $persona
 * @property Adcita[] $adcitas
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Adclientes extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'persona_id' => 'required',
			'estado_id' => 'required',
			'comercio_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['fechaingreso', 'persona_id', 'referido_id', 'estado_id', 'comercio_id', 'created_by', 'updated_by', 'deleted_by'];


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
    public function persona()
    {
        return $this->belongsTo(\App\Models\Personas::class, 'persona_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function citas()
    {
        return $this->hasMany(\App\Models\Adcitas::class, 'cliente_id')->orderby('fecha', 'DESC');
    }

    public static function search($params){

        $clientes = Adclientes::
        join("personas AS p","p.id","=","adclientes.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'adclientes.estado_id')
        ->select([
            'adclientes.id',
            'pn.sexo_id',
            DB::raw('CONCAT(YEAR(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " años ", MONTH(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " meses y ", DAY(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " dias") AS edad'),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            'p.foto',
            'p.identificacion',
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'pn.fechanacimiento',
            'p.telefono',
            'p.telefonomovil',
            'p.email',
            'p.direccion',
            'adclientes.fechaingreso',
            'm.observacion AS color_estado',
            'm.nombre AS estado',
        ])
        ->where('su.predeterminada',1)
        ->whereNull('adclientes.deleted_at')
        ->where('adclientes.comercio_id',Comercios::where('persona_id', Auth::user()->persona_id)->first()->id)
        ->whereIn('su.sede_id',(Cfsedesusers::select('sede_id')->where('usuario_id',Auth::user()->id)->get()))
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        return $clientes;
    }
    
}
