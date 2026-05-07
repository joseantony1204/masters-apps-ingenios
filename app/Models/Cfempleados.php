<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\{Auth,DB};

/**
 * Class Cfempleados
 *
 * @property $id
 * @property $fechaingreso
 * @property $sede_id
 * @property $persona_id
 * @property $estado_id
 * @property $observaciones
 * @property $created_at
 * @property $created_by
 * @property $updated_at
 * @property $updated_by
 * @property $deleted_at
 * @property $deleted_by
 *
 * @property Cfmaestra $cfmaestra
 * @property Persona $persona
 * @property Cfbloqueosagendas[] $bloqueosagendas
 * @property Cfempleadosservicio[] $cfempleadosservicios
 * @property Cfhorarios[] $cfhorarios
 * @package App
 * @mixin \Illuminate\Database\Eloquent\Builder
 */
class Cfempleados extends Model
{
    use SoftDeletes;

    protected $perPage = 20;
    static $rules = [
			'comercio_id' => 'required',
			'persona_id' => 'required',
			'estado_id' => 'required',];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['fechaingreso', 'comercio_id', 'persona_id', 'estado_id', 'observaciones', 'created_by', 'updated_by', 'deleted_by'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function estado()
    {
        // Para traer el nombre del estado (Activo/Inactivo) desde la maestra
        return $this->belongsTo(\App\Models\Cfmaestra::class, 'estado_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function persona()
    {
         // Relación 1 a 1: un empleado tiene una persona base
        return $this->belongsTo(\App\Models\Personas::class, 'persona_id', 'id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function bloqueos()
    {
        return $this->hasMany(\App\Models\Cfbloqueosagendas::class, 'empleado_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function empleadosservicios()
    {
        return $this->hasMany(\App\Models\Cfempleadosservicios::class, 'empleado_id');
    }

    public function serviciosAsignados() {
        // Relación con productos a través de la tabla pivote cfempleadosservicios
        return $this->belongsToMany(Productos::class, 'cfempleadosservicios', 'empleado_id', 'servicio_id')
                    ->withPivot('id','preciopersonalizado', 'comision', 'duracionpersonalizado', 'estado_id');
    }
    
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function horarios()
    {
        //return $this->hasMany(\App\Models\Cfhorarios::class,'id', 'empleado_id');
        return $this->hasMany(\App\Models\Cfhorarios::class, 'empleado_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function comercio()
    {
         // Relación 1 a 1: un empleado tiene una persona base
        return $this->belongsTo(\App\Models\Comercios::class, 'comercio_id', 'id');
    }


    public function detallescitas()
    {
        // Un empleado tiene muchos detalles de citas a través de sus servicios asignados
        return $this->hasManyThrough(
            \App\Models\Addetallescitas::class, 
            \App\Models\Cfempleadosservicios::class, 
            'empleado_id',    // FK en cfempleadosservicios
            'model_type_id', // FK en addetallescitas
            'id',             // Local key en cfempleados
            'id'              // Local key en cfempleadosservicios
        )->where('addetallescitas.model_type', 919);
    }

    public function vales()
    {
        return $this->hasMany(\App\Models\Ftfacturas::class, 'model_type_id')->where('model_type', 1064); //->where('tipo_id', 944);
    }

    public function liquidaciones()
    {
        return $this->hasMany(\App\Models\Ftfacturas::class, 'model_type_id')->where('model_type', 1064)->where('tipo_id', 1063);
    }

    public static function search($params){

        $empleados = Cfempleados::
        join("personas AS p","p.id","=","cfempleados.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'cfempleados.estado_id')
        ->select([
            'cfempleados.id',
            'pn.sexo_id',
            DB::raw('CONCAT(YEAR(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " años ", MONTH(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " meses y ", DAY(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " dias") AS edad'),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            DB::raw("(SELECT s.ruta FROM soportes s WHERE p.id = s.model_type_id AND s.tipo_id = 1 AND s.predeterminado = 1) AS foto"),
            'p.identificacion',
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'pn.fechanacimiento',
            'p.telefono',
            'p.telefonomovil',
            'p.email',
            'p.direccion',
            'cfempleados.fechaingreso',
            'm.observacion AS color_estado',
            'm.nombre AS estado',
        ])
        ->where('su.predeterminada',1)
        ->whereNull('cfempleados.deleted_at')
        ->where('cfempleados.comercio_id',Auth::user()->comercio->id)
        ->whereIn('su.sede_id', function($q) {
            $q->select('us.sede_id')
                ->from('cfsedesusers AS us')
                ->join('cfsedes AS s', 's.id', '=', 'us.sede_id')
                ->where('us.usuario_id', Auth::id())
                ->where('s.comercio_id', Auth::user()->comercio->id)
                ->whereNull('us.deleted_at');
        })
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        return $empleados;
    }

    public static function listar($params){

        $empleados = Cfempleados::
        join("personas AS p","p.id","=","cfempleados.persona_id")
        ->join('users AS u', 'p.id', '=', 'u.persona_id')
        ->join('personasnaturales AS pn', 'p.id', '=', 'pn.persona_id')
        ->join('cfsedesusers AS su', 'u.id', '=', 'su.usuario_id')
        ->join('cfmaestras AS m', 'm.id', '=', 'cfempleados.estado_id')
        ->select([
            'cfempleados.id',
            DB::raw('CONCAT(YEAR(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " años ", MONTH(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " meses y ", DAY(FROM_DAYS(DATEDIFF(NOW(), pn.fechanacimiento))), " dias") AS edad'),
            DB::raw("CONCAT_WS('',UPPER(LEFT(pn.nombre,1)),UPPER(LEFT(pn.apellido,1))) AS round"),
            'p.foto',
            'p.identificacion',
            DB::raw("CONCAT_WS(' ', pn.nombre, pn.segundonombre) AS nombres"),
            DB::raw("CONCAT_WS(' ', pn.apellido, pn.segundoapellido) AS apellidos"),
            'pn.fechanacimiento',
            'p.telefono',
            'p.telefonomovil',
            'p.email',
            'p.direccion',
            'm.nombre AS estado',
        ])
        ->where('su.predeterminada',1)
        ->whereNull('cfempleados.deleted_at')
        ->where('cfempleados.comercio_id',Auth::user()->comercio->id)
        ->whereIn('su.sede_id', function($q) {
            $q->select('us.sede_id')
                ->from('cfsedesusers AS us')
                ->join('cfsedes AS s', 's.id', '=', 'us.sede_id')
                ->where('us.usuario_id', Auth::id())
                ->where('s.comercio_id', Auth::user()->comercio->id)
                ->whereNull('us.deleted_at');
        })
        ->orderby('pn.nombre', 'ASC')
        ->orderby('pn.apellido', 'ASC');

        return $empleados;
    }

    public static function productividad($request)
    {
        $comercio = null;
        if($request->token){
            $comercio = Comercios::where('token', $request->token)->first();
        } else {
            $comercio = Auth::user()->comercio;
        }
        // 1. Normalizar filtros
        $fecha_inicio = $request->fecha_inicio ?? now()->startOfMonth()->format('Y-m-d');
        $fecha_fin = $request->fecha_fin ?? now()->format('Y-m-d');
        $empleado_id = $request->empleado_id;
        $liquidado = $request->liquidado;

        // 2. Consulta: Cargamos TODO para evitar que falten llaves foráneas (FK)
        $reporteRaw = Cfempleados::with([
            'persona:id,identificacion,telefonomovil,email',
            'persona.personasnaturales:persona_id,nombre,apellido,segundonombre,segundoapellido,fechanacimiento',
            //'empleadosservicios.servicio',
            'empleadosservicios:id,empleado_id,servicio_id,comision',
            'empleadosservicios.servicio:id,nombre,tipo_id,categoria_id',
            'empleadosservicios.servicio.tipo:id,nombre',
            'empleadosservicios.servicio.categoria:id,nombre,observacion',
            'empleadosservicios.detallesfactura' => function($q) use ($fecha_inicio, $fecha_fin, $liquidado) {

                // 1. Filtramos por la relación de la factura (fecha)
                $q->whereHas('ftfactura', function($f) use ($fecha_inicio, $fecha_fin) {
                    $f->whereDate('fecha', '>=', $fecha_inicio)
                    ->whereDate('fecha', '<=', $fecha_fin);
                })
                // 2. Filtro dinámico para liquidado (solo si no es nulo)
                ->when(isset($liquidado), function($query) use ($liquidado) {
                    $query->where('liquidado', $liquidado);
                });         
            },
            'empleadosservicios.detallesfactura.factura_con_cita.cita.cliente.persona.personasnaturales',
            'empleadosservicios.detallesfactura.factura_sin_cita.persona.personasnaturales',
            // OPTIMIZACIÓN DE VALES: Seleccionamos solo lo vital
            'vales' => function($q) use ($fecha_inicio, $fecha_fin, $liquidado) {
                $q->select('ftfacturas.*')
                ->whereDate('fecha', '>=', $fecha_inicio)
                ->whereDate('fecha', '<=', $fecha_fin)
                ->orderby('fecha', 'DESC')
                
                // Filtro dinámico en los detalles de los vales (adelantos)
                ->whereHas('detalles', function($query) use ($liquidado) {
                    $query->when(isset($liquidado), function($sq) use ($liquidado) {
                        $sq->where('liquidado', $liquidado);
                    });
                })
                ->with(['detalles', 'estado:id,nombre', 'tipo:id,nombre']);
            },
        ])
        ->where('comercio_id', $comercio->id)
        ->when($empleado_id, fn($q) => $q->where('id', $empleado_id))
        ->get();

        // 3. Mapeo para el Frontend (index.tsx)
        $reporteOptimizado = $reporteRaw->map(function($empleado) {
            $todosLosServicios = collect();
            
            // Usamos null coalescing ?? para que siempre sea una colección, nunca null
            $serviciosRelacion = $empleado->empleadosservicios ?? collect();

            foreach ($serviciosRelacion as $es) {
                $detalles = $es->detallesfactura ?? collect();
                $porcentajeComision = (float)($es->comision ?? 0);

                foreach ($detalles as $det) {
                    $factura = $det->factura_con_cita ?? $det->factura_sin_cita;
                    if (!$factura) continue;

                    // Determinar Cliente
                    $clienteNombre = "Cliente";
                    $clienteTelefono = "Telefono";
                    $codigoCita = NULL;
                    if ($det->factura_con_cita && isset($det->factura_con_cita->cita->cliente->persona)) {
                        $clienteNombre = $det->factura_con_cita->cita->cliente->persona->personasnaturales->nombrecompleto ?? 'Cliente';
                        $clienteTelefono = $det->factura_con_cita->cita->cliente->persona->telefonomovil ?? 'N/A';
                        $codigoCita = $det->factura_con_cita->cita->codigo; 
                    } elseif ($det->factura_sin_cita && isset($det->factura_sin_cita->persona)) {
                        $clienteNombre = $det->factura_sin_cita->persona->personasnaturales->nombrecompleto ?? 'Cliente';
                        $clienteTelefono = $det->factura_sin_cita->persona->telefonomovil ?? 'N/A';
                    }

                    $valorItem = (float)$det->preciofinal*$det->cantidad;
                    $descuentoItem = (float)$det->descuento;
                    $totalItem = (float)$det->totalapagar;
                    $valorComisionServicio = ($totalItem * $porcentajeComision) / 100;

                    $todosLosServicios->push([
                        'id' => $det->id,
                        'factura_id' => $factura->id, // Importante para el unique()
                        'fecha' => date('Y-m-d', strtotime($factura->fecha)),
                        'hora' => date('H:i', strtotime($factura->fecha)),
                        'categoriaIcon' => $es->servicio->categoria->observacion ?? 'ti ti-scissors',
                        'servicio' => $es->servicio->nombre ?? 'Servicio',
                        'codigo' => $codigoCita ? $codigoCita : $factura->numero,
                        'cliente_nombre' => $clienteNombre,
                        'cliente_telefono' => $clienteTelefono,
                        'precio_servicio' => $valorItem,
                        'total_descuento' => $descuentoItem,
                        'total_pagado' => $totalItem,
                        'comision_pactada' => $porcentajeComision,
                        'comision_valor' => $valorComisionServicio,
                        'propina' => (float)($factura->propina ?? 0),
                        'estado_nombre' => $det->liquidado ? 'Pagado' : 'Pendiente de liquidación',
                        'estado_color' => $det->liquidado ? 'success' : 'warning',
                    ]);
                }
            }

            // Filtramos los vales que están pagados y dentro del rango si es necesario
            $totalVales = collect($empleado->vales)->sum('total');

            // Mapear detalle de vales para mostrar en el front si lo deseas
            $listaVales = collect($empleado->vales)->map(function($v) {
                return [
                    'id' => $v->id,
                    'fecha' => date('Y-m-d', strtotime($v->fecha)),
                    'concepto' => $v->observaciones ?? 'Adelanto de nómina',
                    'monto' => (float)$v->total
                ];
            });

            // 3. Cálculos Finales
            $totalPropinasUnicas = $todosLosServicios->unique('factura_id')->sum('propina');
            $sumaComisionesServicios = $todosLosServicios->sum('comision_valor');
            
            // Bruto ganado antes de deudas
            $subtotalEmpleado = $sumaComisionesServicios + $totalPropinasUnicas;
            return [
                'id' => $empleado->id,
                'nombre' => $empleado->persona->personasnaturales->nombrecompleto ?? 'Sin Nombre',
                'total_servicios' => $todosLosServicios->count(),
                'suma_servicios' => (float)$todosLosServicios->sum('precio_servicio'),
                'suma_descuentos' => (float)$todosLosServicios->sum('total_descuento'),
                'suma_recaudado' => (float)$todosLosServicios->sum('total_pagado'),
                'suma_comisiones' => (float)$sumaComisionesServicios,
                'suma_propinas' => (float)$totalPropinasUnicas, // <-- CAMPO NUEVO
                'suma_vales' => (float)$totalVales, // <-- NUEVO: Total de adelantos
                'total_ganado_empleado' => (float)($subtotalEmpleado - $totalVales), // <-- NETO REAL
                'servicios' => $todosLosServicios->values()->all(),
                'detalle_vales' => $listaVales // <-- Para mostrar en el desglose
            ];
        });

        return [
            'reporte' => $reporteOptimizado,
        ];
    }
    
}
