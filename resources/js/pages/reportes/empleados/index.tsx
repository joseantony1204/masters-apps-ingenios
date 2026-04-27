import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export default function Index({ reporte, empleados, estadosList, filtros }: any) {
    const [values, setValues] = useState({
        fecha_inicio: filtros.fecha_inicio || "",
        fecha_fin: filtros.fecha_fin || "",
        empleado_id: filtros.empleado_id || "",
        estado_cita_id: filtros.estado_cita_id || ""
    });

    const brandBlue = '#0095ff';
    const brandIndigo = '#4f46e5';

    // Preparar datos para la gráfica comparativa
    const chartData = useMemo(() => {
        return reporte.map((emp: any) => ({
            name: emp.nombre.split(' ')[0], // Solo primer nombre para la gráfica
            recaudo: emp.suma_recaudado,
            comision: emp.suma_comisiones,
            servicios: emp.total_servicios
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
                            <div className="col-md-4">
                                <div className="form-group mb-0">
                                    <label className="small fw-800 text-uppercase mb-2 text-primary">Periodo de Análisis</label>
                                    <div className="d-flex align-items-center bg-light px-3 py-2" style={{ borderRadius: '15px' }}>
                                        <input type="date" className="form-control border-0 bg-transparent p-0" value={values.fecha_inicio} onChange={e => setValues({...values, fecha_inicio: e.target.value})} />
                                        <span className="mx-2 text-muted">-</span>
                                        <input type="date" className="form-control border-0 bg-transparent p-0" value={values.fecha_fin} onChange={e => setValues({...values, fecha_fin: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <label className="small fw-800 text-uppercase mb-2 text-primary">Especialista</label>
                                <select className="form-select border-0 bg-light py-2" style={{ borderRadius: '12px' }} value={values.empleado_id} onChange={e => setValues({...values, empleado_id: e.target.value})}>
                                    <option value="">Cualquier Especialista</option>
                                    {empleados.map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <button onClick={handleFilter} className="btn btn-primary w-100 py-2 shadow-blue" style={{ borderRadius: '12px', background: `linear-gradient(135deg, ${brandBlue} 0%, ${brandIndigo} 100%)`, border: 'none', fontWeight: '700' }}>
                                <i className="ti ti-filter me-2"></i>REFRESCAR MÉTRICAS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN DE GRÁFICAS --- */}
                <div className="row mb-5">
                    {/* --- SECCIÓN DE ANALÍTICA AVANZADA --- */}
                    <div className="col-md-8">
                        <div className="card border-0 shadow-sm p-4  h-100" style={{ borderRadius: '24px', minHeight: '400px', background: '#fff' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h6 className="fw-900 text-dark mb-1">MÉTRICAS DE RENDIMIENTO</h6>
                                    <p className="text-muted small">Comparativa de ingresos generados vs. comisiones liquidadas</p>
                                </div>
                                {/* Leyenda Personalizada */}
                                <div className="d-flex gap-3">
                                    <div className="d-flex align-items-center">
                                        <div style={{ width: '12px', height: '12px', backgroundColor: brandBlue, borderRadius: '3px', marginRight: '6px' }}></div>
                                        <span className="small fw-bold text-muted">Recaudo</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div style={{ width: '12px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '3px', marginRight: '6px' }}></div>
                                        <span className="small fw-bold text-muted">Comisión</span>
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
                                    
                                    {/* Tooltip Pro: Muestra más detalles al pasar el mouse */}
                                    <Tooltip 
                                        cursor={{fill: '#f8fafc', radius: 10}} 
                                        content={({ active, payload }: any) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white p-3 shadow-lg border-0" style={{ borderRadius: '15px', minWidth: '180px' }}>
                                                        <p className="fw-900 text-dark mb-2 border-bottom pb-1">{payload[0].payload.name}</p>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span className="text-muted small">Servicios:</span>
                                                            <span className="fw-bold small">{payload[0].payload.servicios}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <span className="text-muted small">Recaudo:</span>
                                                            <span className="fw-bold text-primary small">${payload[0].value.toLocaleString()}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <span className="text-muted small">Comisión:</span>
                                                            <span className="fw-bold text-indigo small" style={{color: brandIndigo}}>${payload[1].value.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />

                                    {/* Barra de Recaudo con Label (Valor arriba) */}
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
                                            formatter: (val: any) => `$${(val/1000).toFixed(0)}k` 
                                        }}
                                    >
                                        {chartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-recaudo-${index}`} fillOpacity={0.9} />
                                        ))}
                                    </Bar>

                                    {/* Barra de Comisión (Para comparar) */}
                                    <Bar 
                                        dataKey="comision" 
                                        fill="#cbd5e1" 
                                        radius={[6, 6, 0, 0]} 
                                        barSize={35} 
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '24px', background: `linear-gradient(135deg, ${brandIndigo}, #312e81)` }}>
                            
                            <h6 className="fw-bold text-white-50 mb-1 small">LÍDER DEL PERIODO</h6>
                            {chartData.length > 0 && (
                                <>
                                    <h2 className="text-white fw-900 mb-4">
                                        {chartData.reduce((prev: any, current: any) => (prev.recaudo > current.recaudo) ? prev : current).name}
                                    </h2>
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between text-white-50 small mb-1">
                                            <span>Productividad Total</span>
                                            <span>100%</span>
                                        </div>
                                        <div className="progress bg-white bg-opacity-20" style={{ height: '8px', borderRadius: '10px' }}>
                                            <div className="progress-bar bg-white" style={{ width: '100%' }}></div>
                                        </div>
                                        <p className="text-white-50 small mt-3">Basado en el volumen de recaudo real en caja.</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Listado Estilo Dashboard Analytics */}
                <div className="row">
                    
                    {reporte.map((emp: any) => (
                        <div key={emp.id} className="col-12 mb-5">
                            <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '24px' }}>
                                <div className="row g-0">
                                    {/* Sidebar de la Card */}
                                <div className="col-md-3 p-4" style={{ background: '#ffffff', borderRight: '1px solid #f1f5f9' }}>
                                    <div className="text-center mb-4">
                                        <div className="mx-auto mb-3 shadow-sm d-flex align-items-center justify-content-center fw-bold" style={{ width: '80px', height: '80px', borderRadius: '22px', background: `linear-gradient(45deg, #f0f7ff, #ffffff)`, color: brandBlue, fontSize: '2rem', border: '2px solid #eef2ff' }}>
                                            {emp.nombre.charAt(0)}
                                        </div>
                                        <h5 className="fw-900 text-dark mb-0">{emp.nombre}</h5>
                                        <p className="small text-muted fw-bold">Especialista</p>
                                    </div>
                                    
                                    {/* RECAUDO TOTAL (100%) */}
                                    <div className="bg-light p-3 mb-3" style={{ borderRadius: '15px' }}>
                                        <div className="small text-muted fw-bold mb-1">TOTAL RECAUDADO</div>
                                        <h4 className="fw-900 mb-0" style={{ color: brandBlue }}>${emp.suma_recaudado.toLocaleString()}</h4>
                                    </div>

                                    {/* LIQUIDACIÓN EMPLEADO (Ej: 60%) */}
                                    <div className="bg-soft-indigo p-3 mb-2" style={{ borderRadius: '15px', backgroundColor: '#f5f3ff' }}>
                                        <div className="small fw-bold mb-1" style={{ color: brandIndigo }}>PARA EMPLEADO</div>
                                        <h4 className="fw-900 mb-0" style={{ color: brandIndigo }}>${emp.suma_comisiones.toLocaleString()}</h4>
                                    </div>

                                    {/* LO QUE LE QUEDA AL COMERCIO (Ej: 40%) */}
                                    <div className="p-3 mb-4" style={{ borderRadius: '15px', backgroundColor: '#ecfdf5', border: '1px solid #d1fae5' }}>
                                        <div className="small fw-bold mb-1" style={{ color: '#059669' }}>PARA COMERCIO</div>
                                        <h4 className="fw-900 mb-0" style={{ color: '#059669' }}>
                                            ${(emp.suma_recaudado - emp.suma_comisiones).toLocaleString()}
                                        </h4>
                                    </div>

                                    <button onClick={() => handleExportIndividual(emp)} className="btn btn-outline-light text-muted btn-sm w-100 border-dashed py-2" style={{ borderRadius: '12px', border: '1px dashed #ccc' }}>
                                        <i className="ti ti-file-spreadsheet me-1"></i> Reporte Individual
                                    </button>
                                </div>

                                    {/* Tabla Principal */}
                                    <div className="col-md-9 p-0 bg-white">
                                        <div className="table-responsive">
                                            <table className="table table-hover align-middle mb-0">
                                                <thead>
                                                    <tr style={{ background: '#f8fafc' }}>
                                                        <th className="ps-4 py-3 border-0 small fw-800 text-muted">SERVICIO</th>
                                                        <th className="border-0 small fw-800 text-muted">CLIENTE</th>
                                                        <th className="border-0 small fw-800 text-muted text-center">ESTADO</th>
                                                        <th className="border-0 small fw-800 text-muted text-end">RECAUDADO</th>
                                                        <th className="pe-4 py-3 border-0 small fw-800 text-muted text-end">COMISION</th>
                                                    </tr>
                                                </thead>

                                                // 2. En el cuerpo del return, reemplaza el mapeo de la tabla por este:
<tbody>
    {(() => {
        // Validación en cascada para evitar el error de undefined
        const serviciosRaw = emp.servicios || [];
        const serviciosArray = Array.isArray(serviciosRaw) ? serviciosRaw : Object.values(serviciosRaw);

        if (serviciosArray.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                        No se encontraron servicios realizados en este periodo.
                    </td>
                </tr>
            );
        }

        return serviciosArray.map((s: any) => (
            <tr key={s.id} className="border-bottom border-light">
                <td className="ps-4 py-3">
                    <div className="d-flex align-items-center">
                        <div className="bg-light text-center me-3" style={{ borderRadius: '10px', padding: '5px 10px', minWidth: '60px' }}>
                            <div className="fw-900" style={{ fontSize: '11px' }}>{s.hora}</div>
                            <div className="text-muted" style={{ fontSize: '9px' }}>{s.fecha}</div>
                        </div>
                        <div>
                            <div className="fw-bold text-dark">{s.servicio}</div>
                            <span className="text-muted" style={{ fontSize: '10px' }}>cita #{s.codigo}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div className="fw-bold text-dark">{s.cliente_nombre}</div>
                    <div className="small text-muted"><i className="ti ti-phone me-1"></i>{s.cliente_tel || 'N/A'}</div>
                </td>
                <td className="text-center">
                    <span className={`badge rounded-pill px-3 py-2 bg-light-${s.estado_color || 'primary'} text-${s.estado_color || 'primary'}`} style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                        {(s.estado_nombre || 'Asistida').toUpperCase()}
                    </span>
                </td>
                <td className="text-end fw-bold text-dark">
                    ${(s.total_pagado || 0).toLocaleString()}
                </td>
                <td className="pe-4 text-end">
                    <div className="fw-900" style={{ color: brandBlue }}>${(s.comision_valor || 0).toLocaleString()}</div>
                    <div className="text-muted" style={{ fontSize: '9px' }}>{s.comision_pactada || 0}% comisión</div>
                </td>
            </tr>
        ));
    })()}
</tbody>

                                                
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

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