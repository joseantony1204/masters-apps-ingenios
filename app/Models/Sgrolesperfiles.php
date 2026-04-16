<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use App\Models\{Cfmaestras};

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


    public static function findRoles($perfil,$codigo='LIS_ROLES'){
        $data = Cfmaestras::where('padre', '=', (Cfmaestras::select('id')
                                                ->where('codigo','=', $codigo)
                                                ->first())
                                                ->id)
        
        ->select(['cfmaestras.id','cfmaestras.nombre',
        DB::raw("(select rp.estado FROM sgrolesperfiles rp WHERE cfmaestras.id = rp.rol_id AND rp.perfil_id = ".$perfil.") AS estado")
        ])
        ->get();

        return  $data;
    }

    // En el modelo Comercios.php
    public function vistas()
    {
        return $this->hasMany(Cfmaestras::class, 'padre_id', 'id');
    }

    public static function setperfilrol($request)
    {
        try {                        
            $data = DB::table('sgrolesperfiles AS t')
                ->where('rol_id', $request->get('rol'))
                ->where('perfil_id', $request->get('perfil'))
                ->first();

            if ($data) {
                // Calculamos el nuevo estado (si era 1 pasa a 0, si era 0 pasa a 1)
                $nuevoEstado = ($data->estado === 1) ? 0 : 1;
                
                DB::table('sgrolesperfiles')->where('id', $data->id)->update(['estado' => $nuevoEstado]);
                DB::table('sgpermisos')->where('rolperfil_id', $data->id)->update(['estado' => $nuevoEstado]);
                
                return response()->json(['info' => 'success', 'message' => $nuevoEstado]);
            } else {
                // Si no existe, lo creamos e insertamos las vistas por defecto
                $rolperfil_id = DB::table('sgrolesperfiles')->insertGetId([
                    'perfil_id' => $request->get('perfil'),
                    'rol_id' => $request->get('rol'),
                    'estado' => 1
                ]);
                
                $vistas = DB::table('cfmaestras')
                    ->where('jerarquia', $request->get('rol'))
                    ->get();
                
                foreach ($vistas as $vista) {
                    DB::table('sgpermisos')->insert([
                        'rolperfil_id' => $rolperfil_id,
                        'vista_id' => $vista->id,
                        'estado' => 1
                    ]);
                }
                return response()->json(['info' => 'success', 'message' => 1]);
            }
        } catch (\Exception $e) {
            return response()->json(['info' => 'error', 'message' => $e->getMessage()]);            
        } 
    }

    public static function updatepermiso($request)
    {
        try {                        
            $data = DB::table('sgpermisos AS t')
            ->select(['t.*'])
            ->where('t.id', $request->get('permiso'))
            ->first();
            if($data){
                $nuevoEstado = ($data->estado === 1) ? 0 : 1;
                DB::table('sgpermisos')->where('id', $request->get('permiso'))->update(['estado' => $nuevoEstado]);
                
                return ['info' => 'success', 'message' => $nuevoEstado]; // Devolver Array
            }
            return ['info' => 'error', 'message' => 'No encontrado'];
        }catch (\Exception $e){
            $msg = response()->json(['info' =>'error', 'message' => $e->getMessage()]);            
        } 
        return $msg;
    }
    
    
}
