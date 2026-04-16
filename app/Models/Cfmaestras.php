<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Cfmaestras
 *
 * @property $id
 * @property $codigo
 * @property $nombre
 * @property $padre
 * @property $jerarquia
 * @property $orden
 * @property $visible
 * @property $observacion
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Adcita[] $adcitas
 * @property Adcliente[] $adclientes
 * @property Addetallescita[] $addetallescitas
 * @property Cfbloqueosagenda[] $cfbloqueosagendas
 * @property Cfempleado[] $cfempleados
 * @property Cfempleadosservicio[] $cfempleadosservicios
 * @property Cfhorario[] $cfhorarios
 * @property Cfimpuesto[] $cfimpuestos
 * @property Cfsedesuser[] $cfsedesusers
 * @property Ftdetalle[] $ftdetalles
 * @property Ftfactura[] $ftfacturas
 * @property Ftfactura[] $ftfacturas
 * @property Ftpago[] $ftpagos
 * @property Ftturno[] $ftturnos
 * @property Producto[] $productos
 * @property Producto[] $productos
 * @property Producto[] $productos
 * @property Sgpermiso[] $sgpermisos
 * @property Sgrolesperfile[] $sgrolesperfiles
 * @property Sgrolesperfile[] $sgrolesperfiles
 * @property Soporte[] $soportes
 * @property User[] $users
 * @property User[] $users
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfmaestras extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'nombre' => 'required',
			'visible' => 'required',
			'created_by' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['codigo', 'nombre', 'padre', 'jerarquia', 'orden', 'visible', 'observacion', 'created_by', 'updated_by', 'deleted_by'];
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(\App\Models\User::class, 'id', 'perfil_id');
    }
    
}
