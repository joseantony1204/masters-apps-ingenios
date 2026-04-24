<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductosRequest;
use App\Models\{Productos,Cfmaestra,Cfimpuestos,Comercios, Movimientosproductos};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};

class ProductosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:productos.index')->only(['index', 'show']);
        $this->middleware('permission:productos.create')->only(['create', 'store']);
        $this->middleware('permission:productos.edit')->only(['edit', 'update']);
        $this->middleware('permission:productos.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $comercio = Comercios::where('persona_id', Auth::user()->persona_id)->firstOrFail();

        $query = Productos::with([
            'categoria:id,nombre,observacion',
            'unidad:id,nombre',
            'estado:id,nombre',
            'tipo:id,nombre',
            'sede'
        ]);

        $query->whereHas('sede', function ($q) use ($comercio) {
            $q->where('comercio_id', $comercio->id);
        });

        $productos = $query->whereNull('deleted_at')->get();

        return Inertia::render('productos/index', [
            'productos' => $productos
        ]);
    }

    /**
     * Muestra el historial detallado (Kardex) de un producto específico
     */
    public function kardex($id)
    {
        $producto = Productos::findOrFail($id);

        $movimientos = Movimientosproductos::with('usuario')// 'usuario' es la relación con created_by
            ->where('producto_id', $id)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('productos/partials/kardex', [
            'producto'    => $producto,
            'movimientos' => $movimientos
        ]);
    }

    /**
     * Registra un movimiento (Entrada, Salida, Ajuste) y actualiza el stock
     */
    public function storeMovimiento(Request $request)
    {
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'tipo' => 'required|in:entrada,salida,ajuste,venta',
            'cantidad' => 'required|integer|min:1',
            'motivo' => 'required|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $producto = Productos::findOrFail($request->producto_id);
            $stockAnterior = $producto->stock ?? 0;

            // Lógica de cálculo de stock resultante
            if ($request->tipo === 'entrada') {
                $nuevoStock = $stockAnterior + $request->cantidad;
            } else {
                // Para salida, ajuste o venta
                $nuevoStock = $stockAnterior - $request->cantidad;
            }

            // 1. Crear el registro en el Kardex (Historial)
            Movimientosproductos::create([
                'producto_id'      => $request->producto_id,
                'tipo'             => $request->tipo,
                'cantidad'         => $request->cantidad,
                'stock_resultante' => $nuevoStock,
                'motivo'           => $request->motivo,
                'created_by'       => Auth::id(),
            ]);

            // 2. Actualizar el stock físicamente en la tabla de productos
            $producto->update([
                'stock' => $nuevoStock
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Movimiento registrado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error al procesar el movimiento: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
     
        // Obtenemos el comercio del usuario autenticado
        $comercio = Comercios::where('persona_id', Auth::user()->persona_id)->firstOrFail();
        // Obtenemos las sedes vinculadas a ese comercio
        $sedes = $comercio->sedes()->pluck('nombre', 'id');
      
        return Inertia::render('productos/create', [
            'productos' => new Productos(),
            'categoriasList' => Cfmaestra::getlistatipos('LIS_CATEGORIASPRODUCTOS'),
            'unidadesList' => Cfmaestra::unidades(),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOSPRODUCTOS'),
            'tiposList' => Cfmaestra::getlistatipos('LIS_TIPOSPRODUCTOS'),
            'marcasList' => Cfmaestra::getlistatipos('LIS_MARCAS'),
            'ubicacionesList' => Cfmaestra::getlistatipos('LIS_UBICACIONES'),
            'impuestosList' => Cfimpuestos::all()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
            'sedesList' => $sedes,			
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProductosRequest $request)
    {
        request()->validate(Productos::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $productos = Productos::create($request->all() + $audt);
            return redirect()->route('productos.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('productos/show', [
            'productos' => productos::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Obtenemos el comercio del usuario autenticado
        $comercio = Comercios::where('persona_id', Auth::user()->persona_id)->firstOrFail();
        // Obtenemos las sedes vinculadas a ese comercio
        $sedes = $comercio->sedes()->pluck('nombre', 'id');

        return Inertia::render('productos/edit', [
            'productos' => Productos::findOrFail($id),
            'categoriasList' => Cfmaestra::getlistatipos('LIS_CATEGORIASPRODUCTOS'),
            'unidadesList' => Cfmaestra::unidades(),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOSPRODUCTOS'),
            'tiposList' => Cfmaestra::getlistatipos('LIS_TIPOSPRODUCTOS'),
            'marcasList' => Cfmaestra::getlistatipos('LIS_MARCAS'),
            'ubicacionesList' => Cfmaestra::getlistatipos('LIS_UBICACIONES'),
            'impuestosList' => Cfimpuestos::all()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
            'sedesList' => $sedes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $productos)
    {
        request()->validate(Productos::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $productos = Productos::findOrFail($productos);
            $productos->update($request->all() + $audt);
            return redirect()->route('productos.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $productos = Productos::findOrFail($id);
        $productos->deleted_by =  Auth::user()->id;
        $productos->save();
        $productos->delete();

        return redirect()->route('productos.index')
            ->with('success', 'Elemento eliminado correctamente.');
    }
}