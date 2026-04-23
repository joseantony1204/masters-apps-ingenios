import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router } from '@inertiajs/react'; // Importamos router
import { useState } from 'react'; // Importamos useState
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as ReTooltip } from 'recharts';

export default function Index({ metricas, origenes, heatmapData, topClientes, filtros }: any) {
    const brandBlue = '#0095ff';
    const COLORS = [brandBlue, '#10b981', '#f59e0b', '#ef4444'];

    // --- Lógica de Filtros ---
    const [values, setValues] = useState({
        fecha_inicio: filtros.fecha_inicio || "",
        fecha_fin: filtros.fecha_fin || "",
    });

    const handleFilter = () => {
        router.get(route('reportes.citas'), values, { 
            preserveState: true,
            replace: true 
        });
    };

    // Función para determinar el color del mapa de calor
    const getHeatColor = (valor: number) => {
        if (valor === 0) return '#f8fafc';
        if (valor < 2) return '#d0eaff';
        if (valor < 4) return '#70c1ff';
        return brandBlue;
    };

    const pieData = [
        { name: 'Efectivas', value: metricas.efectivas },
        { name: 'Activas', value: metricas.no_show },
        { name: 'Canceladas', value: metricas.canceladas },
    ];

    return (
        <AppMainLayout>
            <Head title="Agenda e Inteligencia - Vantify" />

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
                                    Agenda & <span style={{ color: brandBlue }}>Conversión</span>
                                </h2>
                                <p className="text-muted fw-500 mb-0">Análisis de ocupación y fidelización de clientes.</p>
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
            
            <div className="container-fluid py-4" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>

                {/* --- CARD DE FILTROS --- */}
                <div className="card border-0 shadow-sm mb-5" style={{ borderRadius: '20px', padding: '10px' }}>
                    <div className="card-body">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-4">
                                <label className="form-label small fw-800 text-muted ms-2">FECHA INICIAL</label>
                                <input 
                                    type="date" 
                                    className="form-control border-0 bg-light" 
                                    style={{ borderRadius: '12px', height: '45px' }}
                                    value={values.fecha_inicio}
                                    onChange={e => setValues({...values, fecha_inicio: e.target.value})}
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small fw-800 text-muted ms-2">FECHA FINAL</label>
                                <input 
                                    type="date" 
                                    className="form-control border-0 bg-light" 
                                    style={{ borderRadius: '12px', height: '45px' }}
                                    value={values.fecha_fin}
                                    onChange={e => setValues({...values, fecha_fin: e.target.value})}
                                />
                            </div>
                            <div className="col-md-4">
                                <button 
                                    onClick={handleFilter}
                                    className="btn btn-primary w-100 fw-bold shadow-blue" 
                                    style={{ borderRadius: '12px', height: '45px', backgroundColor: brandBlue, border: 'none' }}
                                >
                                    <i className="ti ti-filter me-2"></i> ACTUALIZAR REPORTE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fila 1: KPIs Rápidos */}
                <div className="row mb-4 g-3">
                    {Object.entries(metricas).map(([key, val]: any) => (
                        <div className="col-md-3" key={key}>
                            <div className="card border-0 shadow-sm p-3 text-center h-100" style={{ borderRadius: '20px' }}>
                                <div className="text-muted small fw-800 text-uppercase mb-1" style={{ letterSpacing: '0.5px' }}>
                                    {key.replace('_', ' ')}
                                </div>
                                <div className="h2 fw-900 mb-0" style={{ color: key === 'no_show' ? '#ef4444' : '#1e293b' }}>
                                    {val.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row g-4">
                    {/* Heatmap de Ocupación */}
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                            <h6 className="fw-900 mb-4 text-dark">MAPA DE CALOR: FLUJO DE CLIENTES</h6>
                            <div className="table-responsive">
                                <div style={{ minWidth: '600px' }}>
                                    <div className="d-flex mb-2">
                                        <div style={{ width: '50px' }}></div>
                                        {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].map(d => (
                                            <div key={d} className="flex-fill text-center small fw-800 text-muted">{d}</div>
                                        ))}
                                    </div>
                                    {[...new Set(heatmapData.map((h:any) => h.hora))].map((hora: any) => (
                                        <div key={hora} className="d-flex align-items-center mb-1">
                                            <div className="small text-muted fw-bold" style={{ width: '50px', fontSize: '10px' }}>{hora}</div>
                                            {heatmapData.filter((h:any) => h.hora === hora).map((punto: any, i: number) => (
                                                <div 
                                                    key={i}
                                                    className="flex-fill rounded-2 m-1 shadow-sm"
                                                    style={{ 
                                                        height: '35px', 
                                                        backgroundColor: getHeatColor(punto.valor),
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title={`${punto.dia} ${punto.hora}: ${punto.valor} citas`}
                                                ></div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="d-flex gap-3 mt-3 justify-content-end align-items-center">
                                <span className="small text-muted fw-bold">Bajo flujo</span>
                                <div style={{width: '20px', height: '10px', background: '#d0eaff', borderRadius: '3px'}}></div>
                                <div style={{width: '20px', height: '10px', background: '#70c1ff', borderRadius: '3px'}}></div>
                                <div style={{width: '20px', height: '10px', background: brandBlue, borderRadius: '3px'}}></div>
                                <span className="small text-muted fw-bold">Alta ocupación</span>
                            </div>
                        </div>
                    </div>

                    {/* Gráfica de Origen y Conversión */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '25px' }}>
                            <h6 className="fw-900 mb-4 text-dark">EMBUDO DE CONVERSIÓN</h6>
                            <div style={{ height: '250px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={pieData} 
                                            innerRadius={60} 
                                            outerRadius={80} 
                                            paddingAngle={8} 
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ReTooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className="mt-4">
                                <h6 className="small fw-900 text-muted mb-3 text-uppercase" style={{ letterSpacing: '1px' }}>Origen de Agendamiento</h6>
                                {Object.entries(origenes).map(([label, val]: any) => (
                                    <div className="mb-3" key={label}>
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className="small fw-bold text-dark">{label}</span>
                                            <span className="small fw-900 text-primary">{val}</span>
                                        </div>
                                        <div className="progress" style={{ height: '7px', borderRadius: '10px', backgroundColor: '#f0f3f6' }}>
                                            <div 
                                                className="progress-bar" 
                                                style={{ 
                                                    width: `${metricas.total > 0 ? (val / metricas.total) * 100 : 0}%`,
                                                    backgroundColor: label.includes('WhatsApp') ? '#25d366' : brandBlue,
                                                    borderRadius: '10px'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sección de Fidelización de Clientes */}
                <div className="row mt-5 pb-5">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h6 className="fw-900 text-dark mb-1">TOP CLIENTES (FIDELIZACIÓN)</h6>
                                    <p className="text-muted small mb-0 fw-500">Listado de clientes con mayor impacto en el comercio.</p>
                                </div>
                                <span className="badge bg-light-primary text-primary px-4 py-2 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    DATOS DE FIDELIDAD
                                </span>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-borderless align-middle mb-0">
                                    <thead>
                                        <tr className="text-muted small fw-800" style={{ borderBottom: '2px solid #f8fafc' }}>
                                            <th className="ps-0 pb-3">CLIENTE</th>
                                            <th className="text-center pb-3">VISITAS EFECTIVAS</th>
                                            <th className="text-center pb-3">NIVEL VIP</th>
                                            <th className="text-end pe-0 pb-3">INVERSIÓN TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topClientes.map((cliente: any, index: number) => (
                                            <tr key={index} className="item-row">
                                                <td className="ps-0 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-900 shadow-sm" 
                                                            style={{ width: '42px', height: '42px', background: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)', color: brandBlue }}>
                                                            {cliente.nombre.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">{cliente.nombre}</div>
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>
                                                                <i className="ti ti-phone-call me-1"></i>{cliente.telefono}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-center">
                                                    <div className="fw-900 text-dark" style={{ fontSize: '1.1rem' }}>{cliente.visitas}</div>
                                                    <div className="text-muted" style={{ fontSize: '10px' }}>Asistencias</div>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge rounded-pill px-3 py-2 fw-bold ${cliente.visitas > 3 ? 'bg-soft-success' : 'bg-soft-primary'}`} style={{ fontSize: '10px' }}>
                                                        {cliente.visitas > 3 ? 'PREMIUM GOLD' : 'MEMBER'}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-0">
                                                    <div className="fw-900 text-dark" style={{ fontSize: '1.1rem' }}>
                                                        ${cliente.total_invertido.toLocaleString()}
                                                    </div>
                                                    <div className="text-primary fw-bold" style={{ fontSize: '10px' }}>
                                                        AVG: ${(cliente.total_invertido / cliente.visitas).toLocaleString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
                .fw-500 { font-weight: 500; }
                .bg-soft-success { background-color: #dcfce7; color: #15803d; }
                .bg-soft-primary { background-color: #e0f2fe; color: #0369a1; }
                .shadow-blue { box-shadow: 0 8px 20px -5px rgba(0, 149, 255, 0.3); }
                .item-row { transition: all 0.2s ease; border-bottom: 1px solid #f8fafc; }
                .item-row:hover { background-color: #fcfdfe; transform: scale(1.002); }
                .form-control:focus { box-shadow: none; border: 1px solid ${brandBlue} !important; }
            `}} />
        </AppMainLayout>
    );
}