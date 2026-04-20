<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductosRequest;
use App\Models\{Productos,Cfmaestra,Cfimpuestos,Comercios};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth};

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