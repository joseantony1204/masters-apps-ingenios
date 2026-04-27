<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\{Auth,DB};

/**
 * Class Cfempleados
 *
 * @property $id
 * @property $fechaingreso
 * @property $sede_id
 * @property $persona_id
 * @property $estado_id
 * @property $observaciones
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Persona $persona
 * @property Cfbloqueosagendas[] $bloqueosagendas
 * @property Cfempleadosservicio[] $cfempleadosservicios
 * @property Cfhorarios[] $cfhorarios
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfempleados extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'comercio_id' => 'required',
			'persona_id' => 'required',
			'estado_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['fechaingreso', 'comercio_id', 'persona_id', 'estado_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        // Para traer el nombre del estado (Activo/Inactivo) desde la maestra
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'estado_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function persona()
    {
         // Relación 1 a 1: un empleado tiene una persona base
        return $this->belongsTo(\App\Models\Personas::class, 'persona_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function bloqueos()
    {
        return $this->hasMany(\App\Models\Cfbloqueosagendas::class, 'empleado_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function empleadosservicios()
    {
        return $this->hasMany(\App\Models\Cfempleadosservicios::class, 'empleado_id');
    }

    public function serviciosAsignados() {
        // Relación con productos a través de la tabla pivote cfempleadosservicios
        return $this->belongsToMany(Productos::class, 'cfempleadosservicios', 'empleado_id', 'servicio_id')
                    ->withPivot('id','preciopersonalizado', 'comision', 'duracionpersonalizado', 'estado_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function horarios()
    {
        //return $this->hasMany(\App\Models\Cfhorarios::class,'id', 'empleado_id');
        return $this->hasMany(\App\Models\Cfhorarios::class, 'empleado_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function comercio()
    {
         // Relación 1 a 1: un empleado tiene una persona base
        return $this->belongsTo(\App\Models\Comercios::class, 'comercio_id', 'id');
    }


    public function detallescitas()
    {
        // Un empleado tiene muchos detalles de citas a través de sus servicios asignados
        return $this->hasManyThrough(
            \App\Models\Addetallescitas::class, 
            \App\Models\Cfempleadosservicios::class, 
            'empleado_id',    // FK en cfempleadosservicios
            'model_type_id', // FK en addetallescitas
            'id',             // Local key en cfempleados
            'id'              // Local key en cfempleadosservicios
        )->where('addetallescitas.model_type', 919);
    }

    public static function search($params){

        $empleados = Cfempleados::
        join("personas AS p","p.id","=","cfempleados.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'cfempleados.estado_id')
        ->select([
            'cfempleados.id',
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
            'cfempleados.fechaingreso',
            'm.observacion AS color_estado',
            'm.nombre AS estado',
        ])
        ->where('su.predeterminada',1)
        ->whereNull('cfempleados.deleted_at')
        ->where('cfempleados.comercio_id',Comercios::where('persona_id', Auth::user()->persona_id)->first()->id)
        ->whereIn('su.sede_id',(Cfsedesusers::select('sede_id')->where('usuario_id',Auth::user()->id)->get()))
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        return $empleados;
    }
    
}
