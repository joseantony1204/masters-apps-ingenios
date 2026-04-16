<?php

namespace App\Http\Controllers;

use App\Models\{Cfcupones, Comercios, User, Cfpromociones, Adclientes};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth,DB};
use Illuminate\Support\Str;

class CfcuponesController extends Controller
{
    public function __construct(){
        $this->middleware('permission:cfcupones.index')->only(['index', 'show']);
        $this->middleware('permission:cfcupones.create')->only(['create', 'store']);
        $this->middleware('permission:cfcupones.edit')->only(['edit', 'update']);
        $this->middleware('permission:cfcupones.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('cfcupones/index', [
            'cfcupones' => Cfcupones::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('cfcupones/create', [
            'cfcupones' => new Cfcupones(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate(Cfcupones::$rules);
        try {    
            $audt = ['created_by' => Auth::user()->id, 'created_at' => now()];    
            $cfcupones = Cfcupones::create($request->all() + $audt);
            return redirect()->route('cfcupones.index')->with('success', 'Elemento creado correctamente.');

        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('cfcupones/show', [
            'cfcupones' => cfcupones::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('cfcupones/edit', [
            'cfcupones' => Cfcupones::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $cfcupones)
    {
        request()->validate(Cfcupones::$rules);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $cfcupones = Cfcupones::findOrFail($cfcupones);
            $cfcupones->update($request->all() + $audt);
            return redirect()->route('cfcupones.index')->with('success', 'Elemento actualizado exitosamente.');
        }catch (\Exception $e){
            return response()->json(['message' => $e->getMessage()]);
        }   
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $cupon = \App\Models\Cfcupones::findOrFail($id);

        // Validación de seguridad: No eliminar si ya tiene usos
        if ($cupon->usos_actuales > 0) {
            return response()->json([
                'message' => 'No se puede eliminar un cupón ya utilizado.'
            ], 422);
        }

        $cupon::destroy($id);

        return response()->json(['success' => true]);
    }

    public function asignarVip(Request $request)
    {
        $audt = ['created_by' => Auth::user()->id, 'created_at' => now()]; 
        $request->validate([
            'promocion_id' => 'required|exists:cfpromociones,id',
            'persona_id' => 'required|exists:personas,id',
        ]);

        // Generamos un código único para ese cliente
        $codigo = 'VIP-' . strtoupper(Str::random(6));

        CfCupones::create([
            'promocion_id' => $request->promocion_id,
            'persona_id' => $request->persona_id,
            'codigo' => $codigo,
            'limite_uso_total' => 1,
            'estado' => true,
            'fechavence' => now()->addMonths(6), // Beneficio VIP por 6 meses
        ] + $audt);

        return back()->with('success', "Beneficio VIP asignado. Código: $codigo");
    }

    public function storeLote(Request $request)
    {
        $request->validate([
            'promocion_id' => 'required|exists:cfpromociones,id',
            'cantidad' => 'required|integer|min:1|max:500',
            'prefijo' => 'nullable|string|max:10',
            'fechavence' => 'nullable|date|after_or_equal:today',
        ]);

        DB::transaction(function () use ($request) {
            for ($i = 0; $i < $request->cantidad; $i++) {
                // Generamos un código único aleatorio
                $codigo = ($request->prefijo ?? '') . strtoupper(Str::random(8));
                
                // Verificamos que no exista (raro, pero posible)
                while (CfCupones::where('codigo', $codigo)->exists()) {
                    $codigo = ($request->prefijo ?? '') . strtoupper(Str::random(8));
                }

                CfCupones::create([
                    'promocion_id' => $request->promocion_id,
                    'codigo' => $codigo,
                    'limite_uso_total' => 1, // Cada cupón del lote es de un solo uso
                    'estado' => true,
                    'fechavence' => $request->fechavence,
                ]);
            }
        });

        return back()->with('success', "Se han generado {$request->cantidad} cupones exitosamente.");
    }

    public function validar(Request $request)
    {
        // 1. Obtención de datos del comercio (Optimizado en una sola consulta)
        $comercio = Comercios::where('persona_id', Auth::user()->persona_id)->first();

        if (!$comercio) {
            return response()->json(['valido' => false, 'mensaje' => 'Comercio no encontrado'], 404);
        }

        // 2. Búsqueda del cupón con su relación de promoción
        $cupon = Cfcupones::with('promociones')
            ->where('codigo', $request->codigo)
            ->whereHas('promociones', function($q) use($comercio) {
                $q->where('comercio_id', $comercio->id);
            })
            ->first();

        if (!$cupon) {
            return response()->json(['valido' => false, 'mensaje' => 'Cupón no encontrado'], 404);
        }

        // 3. Verificar si el cupón ya está asignado a ESTA factura (Modo Edición)
        $usoEnEstaFactura = false;
        if ($request->factura_id) {
            $usoEnEstaFactura = DB::table('ftfacturas')
                ->where('id', $request->factura_id)
                ->where('cupon_id', $cupon->id)
                ->exists();
        }

        // 4. Validar Estado
        // Si el estado es 0 (usado/desactivado) y NO es el cupón que ya tiene esta factura, es inválido.
        if (!$cupon->estado && !$usoEnEstaFactura) {
            return response()->json(['valido' => false, 'mensaje' => 'Este cupón ya ha sido utilizado o está desactivado'], 422);
        }

        // 5. Validar Expiración
        if ($cupon->fechavence && \Carbon\Carbon::parse($cupon->fechavence)->isPast()) {
            return response()->json(['valido' => false, 'mensaje' => 'Este cupón ha expirado'], 422);
        }

        // 6. Validar Límites de Uso (Total y Por Persona)
        // Agrupamos el conteo en consultas eficientes ignorando la factura actual
        $queryBase = DB::table('ftfacturas')
            ->where('cupon_id', $cupon->id)
            ->where('estado_id', '!=', 939) // Ignorar anuladas
            ->when($request->factura_id, function ($q) use ($request) {
                return $q->where('id', '!=', $request->factura_id);
            });

        // Validar límite TOTAL
        $usosTotales = (clone $queryBase)->count();
        if ($usosTotales >= $cupon->limite_uso_total) {
            return response()->json(['valido' => false, 'mensaje' => 'El límite de usos total de este cupón se ha agotado'], 422);
        }

        // 7. Validar Cliente Específico
        if ($cupon->persona_id && $cupon->persona_id != $request->persona_id) {
            return response()->json(['valido' => false, 'mensaje' => 'Este cupón es exclusivo para otro cliente'], 403);
        }

        /* Validar límite POR PERSONA
        if ($cupon->limite_uso_por_persona) {
            $usosPersona = $queryBase->where('persona_id', $request->persona_id)->count();
            if ($usosPersona >= $cupon->limite_uso_por_persona) {
                return response()->json(['valido' => false, 'mensaje' => 'Ya has alcanzado el límite de usos permitido para este cliente'], 422);
            }
        }*/

        return response()->json([
            'valido' => true,
            'cupon' => $cupon
        ]);
    }

    public function generarCuponesMasivos(Request $request) {
        $user = User::where('persona_id',Auth::user()->persona_id)->first();
        $comercio = Comercios::with('sedes')->where('persona_id', $user->persona_id)->first();
        $comercioId = $comercio->id;
        $categoria = $request->categoria;

        // 0. Buscamos la promoción activa de esa categoría
        $promo = Cfpromociones::where('categoria', $categoria)
                               ->where('comercio_id', $comercioId)
                               ->where('estado', 1)
                               ->first();
        if (!$promo) return null;

        // 2. Obtienes los clientes que cumplen hoy y NO tienen cupón aún para este año
        $personas = Adclientes::obtenerCumpleanos($request->fecha);
    
        // 3. generamos los cupones para cada cliente que cumple hoy y no tiene cupón asignado
        foreach($personas as $persona) {
            if(!$persona->cupon) {
                //¿Se le generó ya un cupón de esta promo HOY? (independientemente de si lo usó)
                $existe = Cfcupones::where('persona_id', $persona->persona_id)
                ->where('promocion_id', $promo->id)
                ->whereDate('created_at', now()->today())
                ->exists();

                if ($existe) return null;

                Cfcupones::create([
                    'promocion_id' => $promo->id,
                    'persona_id'   => $persona->persona_id,
                    'codigo'       => 'HBD-' . strtoupper(Str::random(6)), // Ejemplo: HBD-XJ82P
                    'limite_uso_total' => 1,
                    'limite_uso_por_persona' => 1,
                    'usos_actuales' => 0,
                    'es_automatico' => 1,
                    'fechavence'    => now()->addDays(30), // Vence en un mes
                ]);
            }
        }
    
        return back()->with('success', 'Cupones generados exitosamente.');
    }
}