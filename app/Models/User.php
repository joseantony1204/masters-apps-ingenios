<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\{Auth,DB,Hash};
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail 
{

    use HasApiTokens;
    use HasFactory;
    use Notifiable;

    static $rules = [
		'username' => 'required',
        'perfil_id' => 'required',
		'persona_id' => 'required',
		'telefonomovil' => 'required|unique:users,telefonomovil',
		'estado_id' => 'required',
    ];

    protected $with = ['personas.personasnaturales'];
    protected $appends = ['modulos', 'foto', 'nombreComercio', 'nombreCompleto'];
    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $perPage = 10000;
    public $timestamps = false;
    protected $fillable = ['username','telefonomovil','avatar','email', 'password','alias','perfil_id','persona_id','estado_id','updated_by'];

    public function perfil(){
        return $this->belongsTo('App\Models\Cfmaestra','perfil_id', 'id');
    }

    public function personas(){
        return $this->belongsTo('App\Models\Personas','persona_id', 'id');
    }

    public function estado(){
        return $this->belongsTo('App\Models\Cfmaestra','estado_id', 'id');
    }
    
    public function sedes()
    {
        return $this->belongsToMany('App\Models\Cfsedes', 'cfsedesusers', 'usuario_id', 'sede_id')->withPivot('predeterminada','orden','created_by');
    }

    // Relación "A través de" (Has One Through) o simple acceso
    public function comercio()
    {
        // Buscamos el comercio donde la persona_id sea la misma del usuario
        return $this->hasOne(Comercios::class, 'persona_id', 'persona_id');
    }

    // En el modelo Comercios.php
    public function soportes()
    {
        return $this->hasMany(Soportes::class, 'model_type_id')->where('model_type', 966); // 966 es el identificador de tabla padre para users
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public static function findByTelefonoMovil($telefonomovil){
        $data = User::select(['id', 'username','email'])
        ->where('telefonomovil',$telefonomovil)
        ->first();

        if (!$data) {
            return;
        }

        return $data->id;
    }

    public function check($route){
        return 'true';
        $sw = $this->getroute($route);
        if($sw===1)
            return true;
        else
            return false;
    }

    public function getroute($route){
        $var = explode('.',$route);
        //DB::enableQueryLog();
        try {
            $data = DB::table('cfmaestras AS v')
            ->select(['v.codigo','p.estado'])
            ->join('sgpermisos AS p', 'p.vista_id', '=', 'v.id')
            ->join('sgrolesperfiles AS rp', 'rp.id', '=' ,'p.rolperfil_id')
            ->join('cfmaestras AS pr', 'pr.id', '=', 'rp.perfil_id')
            ->join('cfmaestras AS r', 'r.id', '=', 'rp.rol_id')
            ->join('users AS u', 'pr.id', '=', 'u.perfil_id')
            ->where('v.codigo', $var[1])
            ->where('r.codigo', $var[0])
            ->where('u.id', Auth::user()->id)
            ->first();
            //dd(DB::getQueryLog());
            if($data->estado===1)
                $msg = 1;
            else
                $msg = 0;
        }catch (\Exception $e){
            $msg = 0;
        }
        return $msg;
    }

    public function modulosmenu($modulos = 2){       
        $defaultview = 'index';        
        $list = DB::table('cfmaestras AS m')
        ->select(['m.id', 'm.nombre', 'm.observacion AS icon'])
        ->join('cfmaestras AS r', 'r.jerarquia', '=', 'm.id')
        ->join('cfmaestras AS v', 'v.jerarquia', '=', 'r.id')
        ->join('sgpermisos AS pe', 'pe.vista_id', '=', 'v.id')
        ->join('sgrolesperfiles AS rp',  'rp.id', '=', 'pe.rolperfil_id')
        ->join('cfmaestras AS pr', 'pr.id', '=', 'rp.perfil_id')
        ->join('users AS u', 'pr.id', '=', 'u.perfil_id')
        ->where('m.padre', $modulos)
        ->where('m.visible', 1)
        ->where('v.codigo', $defaultview)
        ->where('pe.estado', 1)
        ->where('u.id', Auth::user()->id)
        ->orderBy('m.orden', 'ASC')
        ->groupBy(['m.id','m.nombre', 'icon'])
        
        ->get();
        return($list);
    }

    public function getFotoAttribute(){
        // 1. Definimos la relación 'soportes' correctamente (si no está definida abajo)
        // Usamos $this directamente porque estamos dentro de la clase User
        $soporte = $this->soportes()->where('tipo_id', 1)->where('predeterminado', 1)->first();

        if ($soporte && $soporte->ruta) {
            // 2. Retornamos la URL pública para que el navegador pueda cargarla
            return asset('storage/' . $soporte->ruta);
        }

        // 3. Opcional: Retornar null o una imagen por defecto
        // Si prefieres el avatar default de tus assets: asset('assets/images/user/default.png')
        return null;
    }

    public function getModulosAttribute(){
        return $this->modulosmenu();
    }

    public function getNombreCompletoAttribute()
    {
        $persona = $this->personas;

        if (!$persona) {
            return "Usuario Sistema";
        }

        return optional($persona->personasnaturales)->nombreApellido
            ?? optional($persona->comercios)->nombre 
            ?? "Nombre no definido";
    }

    public function getNombreComercioAttribute()
    {
        $persona = $this->personas;

        if (!$persona) {
            return "Usuario Sistema";
        }

        return optional($persona->comercios)->nombre ?? optional($persona->personasnaturales)->nombreCompleto ?? "Nombre no definido";
    }

    public function getroles($modulo,$roles = 3){ 
        $defaultview = 'index';        
        $list = DB::table('cfmaestras AS r')
        ->select(['r.id', 'r.codigo', 'r.nombre', 'v.codigo AS index', 'r.observacion AS icon'])
        ->join('cfmaestras AS v', 'v.jerarquia', '=', 'r.id')
        ->join('sgpermisos AS pe', 'pe.vista_id', '=', 'v.id')
        ->join('sgrolesperfiles AS rp',  'rp.id', '=', 'pe.rolperfil_id')
        ->join('cfmaestras AS pr', 'pr.id', '=', 'rp.perfil_id')
        ->join('users AS u', 'pr.id', '=', 'u.perfil_id')
        ->where('r.padre', $roles)
        ->where('r.jerarquia', $modulo)
        ->where('r.visible', 1)
        ->where('v.codigo', $defaultview)
        ->where('pe.estado', 1)
        ->where('u.id', Auth::user()->id)
        ->orderBy('r.orden', 'ASC')
        ->groupBy(['r.id', 'r.codigo', 'r.nombre', 'index', 'icon'])        
        ->get();
        return($list);    
    }

    public static function search($params){
        $users = User::
        join("personas AS p","p.id","=","users.persona_id")
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join("cfmaestras AS pr","pr.id","=","users.perfil_id")
        ->join("cfmaestras AS e","e.id","=","users.estado_id")
        ->join('cfsedesusers AS su', 'users.id', '=', 'su.usuario_id')
        ->where('su.predeterminada',1)
        ->whereIn('su.sede_id',(Cfsedesusers::select('sede_id')->where('usuario_id',Auth::user()->id)->get()))
        ->whereNull('users.deleted_at')
        ->select(
            'users.id',
            'users.username',
            'p.identificacion',
            DB::raw("CONCAT_WS(' ',p.email) AS email"),
            DB::raw("CONCAT_WS(' ',p.telefonomovil) AS telefonomovil"),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ',pn.nombre,pn.segundonombre,pn.apellido,pn.segundoapellido) AS persona"),
            'pr.nombre AS perfil',
            'e.nombre AS estado',
            );

            if ($params) {
                $users->where('p.identificacion','LIKE',explode(' ','%'.trim($params->get('identificacion')).'%'))
                ->where('pn.nombre','LIKE',explode(' ','%'.trim($params->get('nombre')).'%'))
                ->where('pn.apellido','LIKE',explode(' ','%'.trim($params->get('apellido')).'%'));
            }
            if ($params->get('segundonombre')) {
                $users->where('pn.segundonombre','LIKE',explode(' ','%'.trim($params->get('segundonombre')).'%'));
            }
            if ($params->get('segundoapellido')) {
                $users->where('pn.segundoapellido','LIKE',explode(' ','%'.trim($params->get('segundoapellido')).'%'));
            }

        return $users;
    }
}
