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
        return Inertia::render('productos/index', [
            'productos' => Productos::whereNull('deleted_at')->get() 
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
        $padre = Cfmaestra::select('id')->where('codigo','=',strtoupper('LIS_UNIDADES'))->first();
       
        $items = Cfmaestra::where('padre', $padre->id)
            ->orderBy('codigo') // este campo debe indicar la categoría, como "Unidades", "Volúmenes"
            ->orderBy('nombre')
            ->get(['id', 'nombre', 'codigo']); // usa el nombre real del campo de agrupación
        
        $unidadesList = $items->groupBy('codigo')->map(function ($grupo) {
            return $grupo->pluck('nombre', 'id');
        })->toArray();
            //return Cfmaestra::where('padre','=',$padre->id)->get()->sortBy('nombre')->pluck('codigo','id')->prepend('', '');

        

        return Inertia::render('productos/create', [
            'productos' => new Productos(),
            'categoriasList' => Cfmaestra::getlistatipos('LIS_CATEGORIAS'),
            'unidadesList' => Cfmaestra::where('padre','=',$padre->id)->get()->sortBy('nombre')->pluck('nombre', 'id','codigo')->prepend('', ''),
             /*'unidadesList' => Cfmaestra::where('padre','=',$padre->id)->get(['id', 'nombre', 'codigo'])
            //->groupBy('codigo')
            
            ->map(function ($items) {
                return $items->pluck('nombre', 'id');
            })->toArray(),*/
            //'unidadesList' => $unidadesList,
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOSPRODUCTOS'),
            'tiposList' => Cfmaestra::getlistatipos('LIS_TIPOSPRODUCTOS'),
            'marcasList' => Cfmaestra::getlistatipos('LIS_MARCAS'),
            'ubicacionesList' => Cfmaestra::getlistatipos('LIS_UBICACIONES'),
            'impuestosList' => Cfimpuestos::all()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
            'sedesList' => $sedes,
          
            //$Unidades=Unidades::find()->andWhere(['IS NOT', 'UNID_FROMID',NULL])->all();
            //$listData=ArrayHelper::map($Unidades,'UNID_ID','UNID_NOMBRE','UNID_DESCRIPCION');
            //echo $form->field($model, 'PROD_UNIDADES')->dropDownList($listData, ['class' => 'custom-select form-control'])->label('Unidad de medida*');
								
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
        return Inertia::render('productos/edit', [
            'productos' => Productos::findOrFail($id),
            'categoriasList' => Cfmaestra::getlistatipos('LIS_CATEGORIAS'),
            'unidadesList' => Cfmaestra::getlistatipos('LIS_UNIDADES'),
            'estadosList' => Cfmaestra::getlistatipos('LIS_ESTADOSPRODUCTOS'),
            'tiposList' => Cfmaestra::getlistatipos('LIS_TIPOSPRODUCTOS'),
            'marcasList' => Cfmaestra::getlistatipos('LIS_MARCAS'),
            'ubicacionesList' => Cfmaestra::getlistatipos('LIS_UBICACIONES'),
            'impuestosList' => Cfimpuestos::all()->sortBy('nombre')->pluck('nombre', 'id')->prepend('', ''),
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