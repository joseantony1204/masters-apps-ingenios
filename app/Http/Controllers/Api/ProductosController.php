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
        $empleadoId = $request->get('empleado_id');
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $comercio = Comercios::with('sedes')->where('persona_id', $user->persona_id)->first();
        $sedesIds = $comercio->sedes()->pluck('cfsedes.id')->toArray();

        // 1. Obtener los PRODUCTOS (Venta directa, sin empleado asignado)
        $productosQuery = Productos::select([
                'productos.id',
                DB::raw("null AS servicioasignado_id"),
                'productos.nombre',
                'productos.preciosalida AS precio',
                't.id AS tipo_id',
                't.nombre AS tipo'
            ])
            ->join('cfmaestras AS t', 't.id', '=', 'productos.tipo_id')
            ->where('estado_id', 858)
            ->where('tipo_id', 854)
            ->whereIn('sede_id', $sedesIds);

        // Filtro por término de búsqueda en Productos
        if ($term) {
            $productosQuery->where('productos.nombre', 'LIKE', '%' . $term . '%');
        }

        $productosList = $productosQuery->orderby('productos.nombre', 'ASC')->limit(15)->get();

        // 2. Obtener los SERVICIOS (Con empleado asignado)
        $serviciosQuery = Productos::with([
            'empleadosasignados' => function($q) use ($empleadoId) {
                $q->where('cfempleados.estado_id', 850)
                ->when($empleadoId, function($query) use ($empleadoId) {
                    $query->where('cfempleados.id', $empleadoId);
                })
                ->with('persona.personasnaturales');
            }, 
            'categoria', 
            'tipo'
        ])
        ->where('estado_id', 858)
        ->whereIn('sede_id', $sedesIds)
        ->whereHas('empleadosasignados', function($q) use ($empleadoId) {
            $q->where('cfempleados.estado_id', 850)
            ->when($empleadoId, function($query) use ($empleadoId) {
                $query->where('cfempleados.id', $empleadoId);
            });
        });

        // Filtro por término de búsqueda en Servicios
        if ($term) {
            $serviciosQuery->where('productos.nombre', 'LIKE', '%' . $term . '%');
        }

        $serviciosList = $serviciosQuery->get()
            ->flatMap(function($servicio) {
                return $servicio->empleadosasignados->map(function($emp) use ($servicio) {
                    $nombreEmpleado = $emp->persona->personasnaturales->nombres . ' ' . $emp->persona->personasnaturales->apellidos;
                    
                    return [
                        'id' => $servicio->id,
                        'servicioasignado_id' => $emp->pivot->id,
                        'nombre' => "{$servicio->nombre} - [{$nombreEmpleado}]",
                        'precio' => $emp->pivot->preciopersonalizado ?: $servicio->preciosalida,
                        'tipo_id' => $servicio->tipo->id,
                        'tipo' => $servicio->tipo->nombre
                    ];
                });
            })
            ->values();

        // 3. Unión y Orden Final
        $resultado = $productosList->concat($serviciosList)
            ->sortBy('nombre')
            ->values();

        return response()->json($resultado);
    }
}