<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Productos,Comercios};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB};

class ProductosController extends Controller
{
    public function buscar(Request $request)
    {
        $term = $request->get('q');
        $user = Auth::user();
    
        // Si aún así da error, es porque el middleware no está actuando
        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $user = Auth::user();
        $comercio = Comercios::with('sedes')->where('persona_id', $user->persona_id)->first();

        $sedesIds = $comercio->sedes()
        ->pluck('cfsedes.id')
        ->toArray();

        $productos = Productos::select([
            'productos.id',
            'productos.nombre',
            'productos.preciosalida AS precio',
            't.nombre AS tipo',
        ])
        ->join('cfmaestras AS t', 't.id', '=', 'productos.tipo_id')
        ->where('estado_id', 858)
        ->whereIn('sede_id', $sedesIds);

        if($term){
            $productos->where(function($query) use ($term) {
                $query->where('productos.nombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('productos.descripcion','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('productos.codigobarra','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('productos.codigo','LIKE', explode(' ','%'.$term.'%'));
            });
        }

        $productosList = $productos->orderby('productos.nombre', 'ASC')
                      ->limit(10)
                      ->get();

        return response()->json($productosList);
    }
}