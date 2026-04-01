<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Adclientes};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB};

class AdclientesController extends Controller
{
    public function buscar(Request $request)
    {
        $term = $request->get('term');
        $user = Auth::user();
    /*
        // Si aún así da error, es porque el middleware no está actuando
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }*/

        $adclientes = Adclientes::
        join("personas AS p","p.id","=","adclientes.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'adclientes.estado_id')
        ->select([
            'adclientes.id',
            'p.foto',
            'p.identificacion',
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            
         
            'p.telefonomovil',
            'p.email'
        ])
        ->where('su.predeterminada', 1)
        // Usamos el ID del comercio del usuario autenticado
        ->where('adclientes.comercio_id', function($q) use ($user) {
            $q->select('id')->from('comercios')->where('persona_id', $user->persona_id)->first();
        })
        ->whereIn('su.sede_id', function($q) use ($user) {
            $q->select('sede_id')->from('cfsedesusers')->where('usuario_id', $user->id);
        })
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        if($term){
            $adclientes->where(function($query) use ($term) {
                $query->where('p.identificacion','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.nombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundonombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.apellido','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundoapellido','LIKE', explode(' ','%'.$term.'%'));
            });
        }

        $clientes = $adclientes->orderby('pn.nombre', 'ASC')
                      ->limit(10)
                      ->get();

        return response()->json($clientes);
    }
}