<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\{Productos,Comercios,Cfempleados};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth,DB};

class ProductosController extends Controller
{
    public function buscars(Request $request)
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
        ->where('tipo_id', 854)
        ->whereIn('sede_id', $sedesIds);

        if($term){
            $productos->where(function($query) use ($term) {
                $query->where('productos.nombre','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('productos.descripcion','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('productos.codigobarra','LIKE', explode(' ','%'.$term.'%'))
                ->orWhere('productos.codigo','LIKE', explode(' ','%'.$term.'%'));
            });
        }

        //$empleado = Cfempleados::with(['serviciosasignados'])->findOrFail($id);

        $productosList = $productos->orderby('productos.nombre', 'ASC')->limit(10)->get();

        return response()->json($productosList);
    }

    public function buscar(Request $request)
    {
        $term = $request->get('q');
        $empleadoId = $request->get('empleado_id'); // El ID ahora viene opcionalmente en el request
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $comercio = Comercios::with('sedes')->where('persona_id', $user->persona_id)->first();
        $sedesIds = $comercio->sedes()->pluck('cfsedes.id')->toArray();

        // 1. Obtener los PRODUCTOS (Formato base)
        $productosQuery = Productos::select([
                'productos.id',
                'productos.nombre',
                'productos.preciosalida AS precio',
                't.id AS tipo_id',
                't.nombre AS tipo'
            ])
            ->join('cfmaestras AS t', 't.id', '=', 'productos.tipo_id')
            ->where('estado_id', 858)
            ->whereIn('sede_id', $sedesIds);

        if ($term) {
            $productosQuery->where('productos.nombre', 'LIKE', '%' . $term . '%');
        }

        if ($empleadoId) {
            $productosQuery->where('tipo_id', 854);
        }
        $productosList = $productosQuery->orderby('productos.nombre', 'ASC')->limit(15)->get();

        // 2. Obtener los SERVICIOS (Solo si viene empleado_id)
        $serviciosList = collect(); // Empezamos con una colección vacía

        if ($empleadoId) {
            $empleado = Cfempleados::with(['serviciosasignados' => function($query) use ($term) {
                $query->where('productos.estado_id', 858);
                if ($term) {
                    $query->where('productos.nombre', 'LIKE', '%' . $term . '%');
                }
            }])->find($empleadoId);

            if ($empleado) {
                $serviciosList = $empleado->serviciosasignados->map(function($servicio) {
                    return [
                        'id' => $servicio->pivot->id,
                        'nombre' => $servicio->nombre,
                        // Prioridad al precio personalizado del empleado
                        'precio' => $servicio->pivot->preciopersonalizado ?? $servicio->preciosalida,
                        'tipo_id' => $servicio->tipo_id,
                        'tipo' => 'SERVICIO'
                    ];
                });
            }
        }

        // 3. Unión y Orden Final
        $resultado = $productosList->concat($serviciosList)
            ->sortBy('nombre')
            ->values();

        return response()->json($resultado);
    }
}