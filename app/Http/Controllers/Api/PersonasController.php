<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Personas};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB};

class PersonasController extends Controller
{
    public function buscar(Request $request)
    {
        $term = $request->get('term');

        $personas = Personas::join('personasnaturales AS pn', 'personas.id', '=', 'pn.persona_id')
        ->select([
            'personas.id',
            'personas.foto',
            'personas.identificacion',
            DB::raw("CONCAT_WS(' ',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'personas.direccion',
            'personas.telefonomovil',
            'personas.email'
        ])
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        if($term){
            $personas->where(function($query) use ($term) {
                $query->where('personas.identificacion','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('personas.email','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('personas.telefonomovil','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.nombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundonombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.apellido','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('pn.segundoapellido','LIKE', explode(' ','%'.$term.'%'));
            });
        }

        $persona = $personas->orderby('pn.nombre', 'ASC')
                      ->limit(10)
                      ->get();

        return response()->json($persona);
    }
}