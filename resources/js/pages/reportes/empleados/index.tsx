import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import LiquidacionModalResumen from '@/components/global/liquidacion-modal-resumen';
import { useLiquidacionEmpleados } from '@/hooks/use-liquidacion-empleados';
import axios from 'axios'; 

export default function Index({ reporte, empleados, estadosList, turnoActivo, filtros }: any) {
    // 1. Estado para los filtros (Ya lo tienes)
    const [values, setValues] = useState({
        fecha_inicio: filtros.fecha_inicio || new Date().toISOString().split('T')[0],
        fecha_fin: filtros.fecha_fin || new Date().toISOString().split('T')[0],
        empleado_id: filtros.empleado_id || "",
    });

    // 2. Estado local para los datos que se mostrarán en la modal de confirmación
    const [datosLiquidacion, setDatosLiquidacion] = useState<any[]>([]);
    const [loadingLiquidacion, setLoadingLiquidacion] = useState(false);

    const brandBlue = '#0095ff';
    const brandIndigo = '#4f46e5';

    // Preparar datos para la gráfica comparativa
    const chartData = useMemo(() => {
        return reporte.map((emp: any) => ({
            name: emp.nombre.split(' ')[0], // Solo primer nombre para la gráfica
            recaudo: emp.suma_recaudado,
            comision: emp.suma_comisiones,
            servicios: emp.total_servicios,
            propina: emp.suma_propinas
        }));
    }, [reporte]);

    const handleFilter = () => router.get(route('reportes.empleados'), values, { preserveState: true });

    // Función de exportación corregida (paso a paso para evitar el error de tipo void)
    const handleExportIndividual = (emp: any) => {
        // Si emp.servicios es null o undefined, usamos un array vacío
        const serviciosRaw = emp.servicios || [];
        const serviciosArray = Array.isArray(serviciosRaw) ? serviciosRaw : Object.values(serviciosRaw);

        if (serviciosArray.length === 0) {
            alert("No hay servicios para exportar");
            return;
        }

        const data = serviciosArray.map((s: any) => ({
            'Fecha': s.fecha, 
            'Hora': s.hora, 
            'Cliente': s.cliente_nombre,
            'Servicio': s.servicio, 
            'Estado': s.estado_nombre,
            'Pago Real': s.total_pagado, 
            'Comisión': s.comision_valor
        }));
        
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Mis Comisiones");
        XLSX.writeFile(wb, `Liquidacion_${emp.nombre.replace(/\s/g, '_')}.xlsx`);
    };

    const exportAllToExcel = () => {
        let fullData: any[] = [];
        reporte.forEach((emp: any) => {
            // Asegurar array aquí también
            const serviciosArray = Array.isArray(emp.servicios) ? emp.servicios : Object.values(emp.servicios);
            
            serviciosArray.forEach((s: any) => {
                fullData.push({
                    'Especialista': emp.nombre, 
                    // ... resto de los campos
                });
            });
        });
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(fullData);
        XLSX.utils.book_append_sheet(wb, ws, "General");
        XLSX.writeFile(wb, "Reporte_General_Vantify.xlsx");
    };

    // Componente de fila de tabla para mejor performance
    const ServicioRow = ({ s, brandBlue }: any) => {
        const tieneDescuento = (s.total_descuento || 0) > 0;
        return (
            <tr className="border-bottom border-light">
                <td className="ps-4 py-3">
                    <div className="d-flex align-items-center">
                        <div className="bg-light text-center me-3" style={{ borderRadius: '12px', padding: '6px 10px', minWidth: '65px', border: '1px solid #f1f5f9' }}>
                            <div className="fw-900 text-dark" style={{ fontSize: '11px' }}>{s.hora}</div>
                            <div className="text-muted" style={{ fontSize: '9px' }}>{s.fecha}</div>
                        </div>
                        <div>
                            <div className="fw-bold text-dark mb-0" style={{ lineHeight: '1.2' }}>{s.servicio}</div>
                            <div className="d-flex align-items-center gap-1">
                                <span className="text-muted" style={{ fontSize: '10px' }}>#{s.codigo}</span>
                                <span className={`text-${s.estado_color} fw-bold`} style={{ fontSize: '9px' }}>• {s.estado_nombre}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td>
                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{s.cliente_nombre}</div>
                    <div className="small text-muted" style={{ fontSize: '11px' }}>
                        <i className="ti ti-phone-call me-1"></i>{s.cliente_telefono || 'N/A'}
                    </div>
                </td>
                {/* COLUMNA COMPRIMIDA: PRECIO + DESCUENTO + NETO */}
                <td className="text-end">
                    {tieneDescuento && (
                        <div className="d-flex flex-column align-items-end mb-1" style={{ lineHeight: '1' }}>
                            <span className="text-muted text-decoration-line-through" style={{ fontSize: '11px' }}>
                                ${(s.precio_servicio || 0).toLocaleString()}
                            </span>
                            <span className="text-danger fw-bold" style={{ fontSize: '10px' }}>
                                <i className="ti ti-arrow-down-right"></i> ${(s.total_descuento || 0).toLocaleString()}
                            </span>
                        </div>
                    )}
                    <div className="fw-900 text-dark" style={{ fontSize: '15px' }}>
                        ${(s.total_pagado || 0).toLocaleString()}
                    </div>
                </td>
                <td className="pe-4 text-end">
                    <div className="fw-900" style={{ color: brandBlue, fontSize: '15px' }}>
                        ${(s.comision_valor || 0).toLocaleString()}
                    </div>
                    <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>
                        {s.comision_pactada}% <span className="fw-normal">Comisión</span>
                    </div>
                </td>
            </tr>
        );
    };

    // 3. Inicializar el Hook de liquidación
    const { loading, ejecutarLiquidacion, showModal, setShowModal } = useLiquidacionEmpleados(
        turnoActivo?.id, 
        () => {
            setShowModal(false);
            // Refrescamos la página para que los servicios liquidados desaparezcan de la tabla
            router.reload({ only: ['reporte'] });
        }
    );

    // 4. Función para consultar qué es lo que se va a pagar exactamente antes de abrir la modal
    const abrirResumenLiquidacion = async () => {
        setLoadingLiquidacion(true);
        try {
            const response = await axios.get(route('cfempleados.calcular-liquidacion'), {
                params: {
                    fecha_inicio: values.fecha_inicio,
                    fecha_fin: values.fecha_fin,
                    empleado_id: values.empleado_id || null,
                    liquidado: 0 // Solo queremos lo pendiente
                }
            });
            
            setDatosLiquidacion(response.data.reporte || []);
            setShowModal(true);
        } catch (error) {
            console.error("Error al obtener datos de liquidación", error);
        } finally {
            setLoadingLiquidacion(false);
        }
    };

    return (
        <AppMainLayout>
            <Head title="Vantify Intelligence - Dashboard" />

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb mb-3">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('reportes.index')}> Reportes</a></li>
                                <li className="breadcrumb-item" aria-current="page">Listado</li>
                            </ul>
                        </div>
                        {/* Alineación perfecta: Título a la izquierda, Link a la derecha */}
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-900 mb-0" style={{ color: '#1e293b' }}>
                                    Reporte de <span style={{ color: brandBlue }}>Productividad</span>
                                </h2>
                                <p className="text-muted fw-500">Analizando el rendimiento de {reporte.length} especialistas activos.</p>
                            </div>
                            
                            {/* Link sin bordes alineado a la derecha */}
                            <a 
                                href={route('reportes.index')} 
                                className="btn btn-link text-muted text-decoration-none d-flex align-items-center fw-800 p-0"
                                style={{ fontSize: '14px', transition: 'color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.color = brandBlue}
                                onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                            >
                                <i className="ti ti-chevron-left fs-4 me-1"></i>
                                Regresar a reportes
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="py-4 px-3" style={{ background: 'linear-gradient(180deg, #f8faff 0%, #f1f5f9 100%)', minHeight: '100vh' }}>

                {/* Filtros Inteligentes (Efecto Elevado) */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.8)' }}>
                    <div className="card-body p-4">
                        <div className="row g-4 align-items-end">
                            <div className="col-md-3">
                                <div className="form-group mb-0">
                                    <label className="small fw-800 text-uppercase mb-2 text-primary">Periodo de Análisis</label>
                                    <div className="d-flex align-items-center bg-light px-3 py-2" style={{ borderRadius: '15px' }}>
                                        <input type="date" className="form-control border-0 bg-transparent p-0" value={values.fecha_inicio} onChange={e => setValues({...values, fecha_inicio: e.target.value})} />
                                        <span className="mx-2 text-muted">-</span>
                                        <input type="date" className="form-control border-0 bg-transparent p-0" value={values.fecha_fin} onChange={e => setValues({...values, fecha_fin: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <label className="small fw-800 text-uppercase mb-2 text-primary">Especialista</label>
                                <select className="form-select border-0 bg-light py-2" style={{ borderRadius: '12px' }} value={values.empleado_id} onChange={e => setValues({...values, empleado_id: e.target.value})}>
                                    <option value="">Cualquier Especialista</option>
                                    {empleados.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <button onClick={handleFilter} className="btn btn-primary w-100 py-2 shadow-blue" style={{ borderRadius: '12px', background: `linear-gradient(135deg, ${brandBlue} 0%, ${brandIndigo} 100%)`, border: 'none', fontWeight: '700' }}>
                                <i className="ti ti-filter me-2"></i>REFRESCAR MÉTRICAS
                                </button>
                            </div>
                            {/* BOTÓN LIQUIDAR (EL QUE ESTAMOS IMPLEMENTANDO) */}
                            <div className="col-md-3">
                                <button 
                                    onClick={abrirResumenLiquidacion}
                                    disabled={loadingLiquidacion}
                                    className="btn btn-primary w-100 py-2 shadow-blue-deep" 
                                    style={{ 
                                        borderRadius: '12px', 
                                        background: `linear-gradient(135deg, ${brandIndigo} 0%, ${brandBlue} 100%)`, 
                                        border: 'none', 
                                        fontWeight: '700' 
                                    }}
                                >   
                                    {loadingLiquidacion ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        <i className="ti ti-wallet me-2 fs-4"></i>
                                    )}
                                    LIQUIDAR NÓMINA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN DE GRÁFICAS OPTIMIZADA CON PROPINAS --- */}
                <div className="row mb-5">
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '24px', minHeight: '400px', background: '#fff' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h6 className="fw-900 text-dark mb-1">MÉTRICAS DE RENDIMIENTO</h6>
                                    <p className="text-muted small">Comparativa de ingresos (Recaudo) vs. Ganancias del Especialista (Comisión + Propina)</p>
                                </div>
                                {/* Leyenda Personalizada */}
                                <div className="d-flex gap-3">
                                    <div className="d-flex align-items-center">
                                        <div style={{ width: '12px', height: '12px', backgroundColor: brandBlue, borderRadius: '3px', marginRight: '6px' }}></div>
                                        <span className="small fw-bold text-muted">Recaudo</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div style={{ width: '12px', height: '12px', backgroundColor: brandIndigo, borderRadius: '3px', marginRight: '6px' }}></div>
                                        <span className="small fw-bold text-muted">Ganancia Total</span>
                                    </div>
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart 
                                    data={chartData} 
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    barGap={8}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} 
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 11}} 
                                        tickFormatter={(value) => `$${value / 1000}k`} 
                                    />
                                    
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc', radius: 10}} 
                                        content={({ active, payload }: any) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-white p-3 shadow-lg border-0" style={{ borderRadius: '15px', minWidth: '200px' }}>
                                                        <p className="fw-900 text-dark mb-2 border-bottom pb-1">{data.name}</p>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span className="text-muted small">Recaudo:</span>
                                                            <span className="fw-bold text-dark small">${data.recaudo.toLocaleString()}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span className="text-muted small text-indigo">Comisión:</span>
                                                            <span className="fw-bold text-indigo small">${data.comision.toLocaleString()}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span className="text-muted small text-success">Propina:</span>
                                                            <span className="fw-bold text-success small">+${(data.propina || 0).toLocaleString()}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between pt-2 border-top">
                                                            <span className="fw-900 text-dark small">TOTAL GANADO:</span>
                                                            <span className="fw-900 text-primary small">${(data.comision + (data.propina || 0)).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />

                                    <Bar 
                                        dataKey="recaudo" 
                                        fill={brandBlue} 
                                        radius={[6, 6, 0, 0]} 
                                        barSize={35}
                                        label={{ 
                                            position: 'top', 
                                            fill: '#64748b', 
                                            fontSize: 10, 
                                            fontWeight: 700, 
                                            formatter: (val: any) => `$${(val/1000).toFixed(1)}k` 
                                        }}
                                    />

                                    {/* Barra de Comisión + Propina agrupada */}
                                    <Bar 
                                        dataKey={(data) => data.comision + (data.propina || 0)} 
                                        name="ganancia"
                                        fill={brandIndigo} 
                                        radius={[6, 6, 0, 0]} 
                                        barSize={35} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 h-100 d-flex flex-column" style={{ borderRadius: '24px', background: `linear-gradient(135deg, ${brandIndigo}, #312e81)` }}>
                            <h6 className="fw-bold text-white-50 mb-1 small">LÍDER DEL PERIODO</h6>
                            {chartData.length > 0 && (
                                <>
                                    <h2 className="text-white fw-900 mb-4">
                                        {chartData.reduce((prev: any, current: any) => (prev.recaudo > current.recaudo) ? prev : current).name}
                                    </h2>
                                    <div className="mt-auto">
                                        <div className="bg-white bg-opacity-10 p-3 rounded-4 mb-4">
                                            <span className="text-white-50 d-block small mb-1">Mayor Recaudo Individual</span>
                                            <h3 className="text-white fw-900 mb-0">
                                                ${Math.max(...chartData.map((d: any) => d.recaudo)).toLocaleString()}
                                            </h3>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between text-white-50 small mb-1">
                                            <span>Productividad Global</span>
                                            <span>{chartData.length} Especialistas</span>
                                        </div>
                                        <div className="progress bg-white bg-opacity-20" style={{ height: '8px', borderRadius: '10px' }}>
                                            <div className="progress-bar bg-white" style={{ width: '100%' }}></div>
                                        </div>
                                        <p className="text-white-50 small mt-3 italic opacity-75">
                                            * Los valores incluyen comisiones pactadas y propinas registradas en el sistema.
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Listado Estilo Dashboard Analytics */}
                <div className="row">
                    {reporte.map((emp: any) => {
                        const servicios = Array.isArray(emp.servicios) ? emp.servicios : Object.values(emp.servicios || {});
                        return (
                            <div key={emp.id} className="col-12 mb-5">
                                <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '24px', transition: 'transform 0.2s' }}>
                                    <div className="row g-0">
                                        {/* SIDEBAR: PANEL DE CONTROL FINANCIERO */}
                                        <div className="col-md-3 p-4" style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0' }}>
                                            <div className="text-center mb-4">
                                                <div className="mx-auto shadow-sm d-flex align-items-center justify-content-center fw-bold text-white mb-3" 
                                                    style={{ width: '64px', height: '64px', borderRadius: '20px', background: `linear-gradient(135deg, ${brandBlue}, ${brandIndigo})`, fontSize: '1.5rem' }}>
                                                    {emp.nombre.charAt(0)}
                                                </div>
                                                <h6 className="fw-900 text-dark mb-1">{emp.nombre}</h6>
                                                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3" style={{fontSize: '10px'}}>ESPECIALISTA</span>
                                            </div>

                                            

                                            <div className="vstack gap-3">
                                                {/* CARD: TOTAL FACTURADO (RECAUDO NETO) */}
                                                <div className="p-3 bg-white rounded-3 border border-light shadow-sm">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <span className="text-muted small fw-bold">RECAUDO TOTAL</span>
                                                        <i className="ti ti-chart-bar text-primary"></i>
                                                    </div>
                                                    <h3 className="fw-900 mb-0" style={{ color: '#1e293b' }}>${emp.suma_recaudado.toLocaleString()}</h3>
                                                </div>

                                                {/* DESGLOSE DE LIQUIDACIÓN */}
                                                <div className="p-3 rounded-3" style={{ backgroundColor: '#f5f3ff', border: '1px dashed #ddd6fe' }}>
                                                    <span className="text-muted d-block mb-2 fw-bold" style={{ fontSize: '10px' }}>LIQUIDACIÓN ESPECIALISTA</span>
                                                    
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <small className="text-muted">Comisiones:</small>
                                                        <small className="fw-bold">${emp.suma_comisiones.toLocaleString()}</small>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-white">
                                                        <small className="text-muted">Propinas:</small>
                                                        <small className="fw-bold text-success">+${emp.suma_propinas.toLocaleString()}</small>
                                                    </div>

                                                    {/* SECCIÓN DE VALES / ADELANTOS */}
                                                    {emp.suma_vales > 0 && (
                                                        <div className="d-flex justify-content-between mb-2 pb-2 border-bottom border-white">
                                                            <small className="text-danger fw-bold">Vales/Adelantos/Liquidaciones:</small>
                                                            <small className="fw-bold text-danger">-${emp.suma_vales.toLocaleString()}</small>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <span className="fw-900 text-primary small">NETO A PAGAR</span>
                                                        <h4 className="fw-900 mb-0 text-primary">${emp.total_ganado_empleado.toLocaleString()}</h4>
                                                    </div>
                                                </div>

                                                {/* TOOLTIP O MINI LISTA DE VALES (Opcional) */}
                                                {emp.detalle_vales.length > 0 && (
                                                    <div className="mt-2 px-2">
                                                        <details>
                                                            <summary className="text-muted" style={{fontSize: '10px', cursor: 'pointer'}}>Ver detalle de vales y liquidaciones ({emp.detalle_vales.length})</summary>
                                                            {emp.detalle_vales.map((v: any) => (
                                                                <div key={v.id} className="d-flex justify-content-between small opacity-75" style={{fontSize: '8px'}}>
                                                                    <span>{v.fecha}:{v.concepto}</span>
                                                                    <span>-${v.monto.toLocaleString()}</span>
                                                                </div>
                                                            ))}
                                                        </details>
                                                    </div>
                                                )}

                                                {/* UTILIDAD COMERCIO */}
                                                <div className="p-3 rounded-3 border border-success border-opacity-10" style={{ backgroundColor: '#f0fdfa' }}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <span className="text-muted d-block fw-bold" style={{ fontSize: '10px' }}>UTILIDAD LOCAL</span>
                                                            <h5 className="fw-900 mb-0 text-success">${(emp.suma_recaudado - emp.suma_comisiones).toLocaleString()}</h5>
                                                        </div>
                                                        <i className="ti ti-building-store fs-3 text-success opacity-50"></i>
                                                    </div>
                                                </div>

                                                <button onClick={() => handleExportIndividual(emp)} className="btn btn-link text-muted btn-sm text-decoration-none border-dashed py-2" style={{ borderRadius: '12px' }}>
                                                    <i className="ti ti-download me-1"></i> Descargar Detalle
                                                </button>
                                            </div>
                                        </div>

                                        {/* LISTADO DE ACTIVIDAD */}
                                        <div className="col-md-9 bg-white">
                                            <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top" style={{ zIndex: 10 }}>
                                                <h6 className="mb-0 fw-900 text-secondary">HISTORIAL DE ACTIVIDAD</h6>
                                                <div className="d-flex gap-2">
                                                    <span className="badge bg-light text-muted border">{servicios.length} servicios realizados</span>
                                                </div>
                                            </div>
                                            
                                            <div className="table-responsive" style={{ maxHeight: '550px' }}>
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead className="bg-light sticky-top" style={{ top: 0, zIndex: 5 }}>
                                                        <tr>
                                                            <th className="ps-4 py-3 border-0 small fw-bold text-muted">SERVICIO</th>
                                                            <th className="border-0 small fw-bold text-muted">CLIENTE</th>
                                                            <th className="border-0 small fw-bold text-muted text-end">VALOR VENTA</th>
                                                            <th className="pe-4 py-3 border-0 small fw-bold text-muted text-end">SU COMISIÓN</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="border-top-0">
                                                        {servicios.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={4} className="text-center py-5">
                                                                    <div className="text-muted opacity-50">
                                                                        <i className="ti ti-clipboard-x fs-1 d-block mb-2"></i>
                                                                        No hay registros en el periodo
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            servicios.map((s: any) => {
                                                                // La lógica se declara aquí, dentro del map pero antes del return
                                                                const tieneDescuento = (s.total_descuento || 0) > 0;

                                                                return (
                                                                    <tr key={s.id} className="align-middle">
                                                                        <td className="ps-4 py-3">
                                                                            <div className="d-flex align-items-center">
                                                                                {/* Fecha y Hora compacta */}
                                                                                <div className="bg-light text-center me-3" style={{ borderRadius: '12px', padding: '6px 10px', minWidth: '70px', border: '1px solid #f1f5f9' }}>
                                                                                    <div className="fw-900 text-dark" style={{ fontSize: '11px' }}>{s.hora}</div>
                                                                                    <div className="text-muted fw-bold" style={{ fontSize: '9px', textTransform: 'uppercase' }}>{s.fecha}</div>
                                                                                </div>

                                                                                {/* Icono de Categoría */}
                                                                                <div className="avtar avtar-s bg-light-primary text-primary me-2" style={{ width: '38px', height: '38px' }}>
                                                                                    <i className={`${s?.categoriaIcon || 'ti ti-scissors'} fs-5`}></i>
                                                                                </div>

                                                                                {/* Nombre del Servicio y Código */}
                                                                                <div>
                                                                                    <div className="fw-900 text-dark mb-0 f-14" style={{ lineHeight: '1.2' }}>
                                                                                        {s.servicio}
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center gap-2 mt-1">
                                                                                        <span className="badge bg-light text-muted border-0 p-0" style={{ fontSize: '10px' }}>#{s.codigo}</span>
                                                                                        <span className={`fw-bold text-${s.estado_color || 'success'}`} style={{ fontSize: '10px' }}>
                                                                                            <i className="ti ti-point-filled"></i> {s.estado_nombre}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </td>

                                                                        <td>
                                                                            <div className="fw-bold text-dark mb-0" style={{ fontSize: '13px' }}>{s.cliente_nombre}</div>
                                                                            <div className="text-muted d-flex align-items-center" style={{ fontSize: '11px' }}>
                                                                                <i className="ti ti-phone-call me-1 text-primary"></i>
                                                                                {s.cliente_telefono || 'N/A'}
                                                                            </div>
                                                                        </td>

                                                                        <td className="text-end">
                                                                            {/* Visualización de Precio con Descuento */}
                                                                            {tieneDescuento && (
                                                                                <div className="d-flex flex-column align-items-end mb-1" style={{ lineHeight: '1' }}>
                                                                                    <span className="text-muted text-decoration-line-through" style={{ fontSize: '11px' }}>
                                                                                        ${(s.precio_servicio || 0).toLocaleString()}
                                                                                    </span>
                                                                                    <span className="text-danger fw-bold" style={{ fontSize: '10px' }}>
                                                                                        <i className="ti ti-arrow-down-right"></i> ${(s.total_descuento || 0).toLocaleString()}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                            <div className="fw-900 text-dark" style={{ fontSize: '15px' }}>
                                                                                ${(s.total_pagado || 0).toLocaleString()}
                                                                            </div>
                                                                        </td>

                                                                        <td className="pe-4 text-end">
                                                                            {/* Liquidación del Especialista */}
                                                                            <div className="fw-900" style={{ color: brandBlue, fontSize: '15px' }}>
                                                                                ${(s.comision_valor || 0).toLocaleString()}
                                                                            </div>
                                                                            <div className="text-muted fw-bold" style={{ fontSize: '10px' }}>
                                                                                {s.comision_pactada}% <span className="fw-normal">Comisión</span>
                                                                            </div>
                                                                            {s.propina > 0 && (
                                                                                <div className="mt-1">
                                                                                    <span className="badge bg-light-success text-success border border-success border-opacity-10 fw-bold">
                                                                                        <i className="ti ti-gift me-1"></i> +${s.propina.toLocaleString()} Propina
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* MODAL DE RESUMEN DE LIQUIDACIÓN */}
            <LiquidacionModalResumen 
                show={showModal}
                loading={loading} // Viene del hook useLiquidacionEmpleados
                data={datosLiquidacion}
                fechas={{ inicio: values.fecha_inicio, fin: values.fecha_fin }}
                onClose={() => setShowModal(false)}
                onConfirm={() => ejecutarLiquidacion(datosLiquidacion, { inicio: values.fecha_inicio, fin: values.fecha_fin })}
            />

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
                .border-dashed { border: 2px dashed #e2e8f0 !important; }
                .shadow-blue { box-shadow: 0 10px 25px -5px rgba(0, 149, 255, 0.4); }
                .bg-light-success { background-color: #f0fff4; color: #22c55e; }
                .bg-light-primary { background-color: #f0f7ff; color: #0095ff; }
                .bg-light-danger { background-color: #fff1f2; color: #e11d48; }
                .text-success { color: #16a34a !important; }
                .text-danger { color: #e11d48 !important; }
            `}} />
        </AppMainLayout>
    );
}