<?php

namespace App\Http\Controllers;

use App\Models\Ftturnos;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth, DB};

class FtturnosController extends Controller
{
    public function __construct(){
        $this->middleware('permission:ftturnos.index')->only(['index', 'show']);
        $this->middleware('permission:ftturnos.create')->only(['create', 'store']);
        $this->middleware('permission:ftturnos.edit')->only(['edit', 'update']);
        $this->middleware('permission:ftturnos.destroy')->only(['destroy']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('ftturnos/index', [
            'ftturnos' => Ftturnos::whereNull('deleted_at')->get() 
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('ftturnos/create', [
            'ftturnos' => new Ftturnos(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'codigo' => 'required',
            'terminal_id' => 'required',
            'baseinicial' => 'required',
        ],[
            'codigo.required' => 'Escriba un codigo para el turno.',
            'terminal_id.required' => 'Seleccione una terminal para el turno.',
            'baseinicial.required' => 'Escriba una base inicial para el turno.',
        ]);

        try { 
            Ftturnos::create([
                'codigo' => $request->codigo,
                'descripcion' => $request->descripcion,
                'baseinicial' => $request->baseinicial,
                'fecha' => now()->format('Y-m-d'),
                'fechaapertura' => now(), // DateTime de este instante
                'persona_id' => Auth::user()->persona_id, // Seguridad total
                'terminal_id' => $request->terminal_id,
                'estado_id' => 924, // ID para 'ACTIVO',
                'created_by' => Auth::user()->id, 
                'created_at' => now()
            ]);
            return redirect()->back()->with('success', 'Turno creada correctamente');

        }catch (\Exception $e){
            //return response()->json(['message' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Error al crear el turno');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Inertia::render('ftturnos/show', [
            'ftturnos' => ftturnos::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return Inertia::render('ftturnos/edit', [
            'ftturnos' => Ftturnos::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $ftturnos)
    {
        $request->validate([
            'codigo' => 'required',
            'terminal_id' => 'required',
            'baseinicial' => 'required',
        ],[
            'codigo.required' => 'Escriba un codigo para el turno.',
            'terminal_id.required' => 'Seleccione una terminal para el turno.',
            'baseinicial.required' => 'Escriba una base inicial para el turno.',
        ]);
        try {                        
            $audt = ['updated_by' => Auth::user()->id, 'updated_at' => now()];
            $ftturnos = Ftturnos::findOrFail($ftturnos);
            $ftturnos->update($request->all() + $audt);
            return redirect()->back()->with('success', 'Turno actualizado correctamente');

        }catch (\Exception $e){
            //return response()->json(['message' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Error al crear el turno');
        }  
    }

    public function resumen(Request $request)
    {
        $turnoId = $request->id;
        $turno = Ftturnos::where('id', $turnoId)->with('persona.personasnaturales')->firstOrFail();

        // 1. VENTAS POR MÉTODO DE PAGO
        $pagosVentas = DB::table('ftpagos')
            ->join('ftfacturas', 'ftpagos.factura_id', '=', 'ftfacturas.id')
            ->join('cfmaestras', 'ftpagos.metodo_id', '=', 'cfmaestras.id')
            ->where('ftfacturas.turno_id', $turnoId)
            ->where('ftfacturas.tipo_id', 943) // Facturas de venta
            ->where('ftfacturas.estado_id', 938) // Solo facturas pagadas/válidas
            ->select('cfmaestras.nombre', DB::raw('SUM(ftpagos.total) as total'))
            ->groupBy('cfmaestras.nombre')
            ->get();

        $totalVentas = $pagosVentas->sum('total');

        // 2. EXTRAER PROPINAS (Importante para el arqueo)
        $totalPropinas = DB::table('ftfacturas')
            ->where('turno_id', $turnoId)
            ->where('tipo_id', 943)
            ->where('estado_id', 938)
            ->whereNull('deleted_at')
            ->sum('propina'); // Sumamos la columna propina

        // 3. GASTOS Y AVANCES
        $totalGastos = DB::table('ftfacturas')
            ->where('turno_id', $turnoId)
            ->whereIn('tipo_id', [942, 944])
            ->whereNull('deleted_at')
            ->sum('total');

        // 4. NÓMINA
        $totalNomina = DB::table('ftfacturas')
            ->where('turno_id', $turnoId)
            ->where('tipo_id', 1063)
            ->whereNull('deleted_at')
            ->sum('total');

        // CÁLCULO FINAL: (Base + Ventas + Propinas) - (Gastos + Nómina)
        $totalEfectivoEsperado = ($turno->baseinicial + $totalVentas) - ($totalGastos + $totalNomina);

        return response()->json([
            'base_inicial'   => $turno->baseinicial,
            'ventas_detalle' => $pagosVentas,
            'solo_ventas'    => $totalVentas,
            'propinas'       => $totalPropinas,
            'gastos'         => $totalGastos,
            'nomina'         => $totalNomina,
            'total_sistema'  => $totalEfectivoEsperado, 
            'fecha_apertura' => $turno->fechaapertura,
            'cajero'         => $turno->persona->personasnaturales->nombre ?? 'Cajero Desconocido'
        ]);
    }

    public function cerrar(Request $request, $id)
    {
        $turno = Ftturnos::findOrFail($id);

        // Validamos que no esté cerrado previamente (ID 927 según tu lógica)
        if ($turno->estado_id == 927) {
            return redirect()->back()->with('error', 'El turno ya se encuentra cerrado.');
        }
        
        $turno->update([
            'fechacierre' => now(),
            'efectivoreal' => $request->efectivo_real, // Nuevo campo en tu DB
            'diferencia' => $request->diferencia,      // Nuevo campo en tu DB
            'estado_id' => 927, // ID del estado "Cerrado"
            'observaciones' => $turno->observaciones . "\n-- CIERRE AUTOMÁTICO REALIZADO EL " . now(),
            'updated_by' => Auth::user()->id,
        ]);

        return redirect()->back()->with('success', 'Turno finalizado y terminal bloqueada con éxito.');
    }

    /**
     * destroy the specified resource in storage.
     */
    public function destroy($id)
    {
        $ftturnos = Ftturnos::findOrFail($id);
        $ftturnos->deleted_by =  Auth::user()->id;
        $ftturnos->save();
        $ftturnos->delete();

        return redirect()->back()->with('success', 'Turno eliminado correctamente');
    }
}