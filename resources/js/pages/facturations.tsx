import AppLandingLayout from '@/layouts/app/app-landing-layout';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Facturations({ comercio, reporte, filtros }: any) {
    // El reporte viene como un array según tu JSON
    const data = reporte[0] || {};
    const servicios = data.servicios || [];
    const vales = data.detalle_vales || [];

    const [loading, setLoading] = useState(false);
    const [showVales, setShowVales] = React.useState(false);
    // Obtener fecha actual en formato YYYY-MM-DD
    const hoy = new Date().toISOString().split('T')[0];

    // Función para filtrar
    const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        router.get(window.location.pathname, {
            token: new URLSearchParams(window.location.search).get('token'),
            empleado: new URLSearchParams(window.location.search).get('empleado'),
            fecha_inicio: formData.get('fecha_inicio'),
            fecha_fin: formData.get('fecha_fin'),
        }, {
            preserveState: true,
            onFinish: () => setLoading(false)
        });
    };

    return (
        <AppLandingLayout comercio={comercio}>
            <div className="pb-5 mb-5 px-1">
                
                {/* 1. HEADER PERFIL */}
                <div className="bg-white rounded-3 p-3 mb-3 shadow-sm d-flex align-items-center mt-2 border border-light">
                    <div className="me-3 bg-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" 
                         style={{ width: '50px', height: '50px', fontSize: '20px', minWidth: '50px', background: 'linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%)' }}>
                        {data.nombre?.charAt(0)}
                    </div>
                    <div>
                        <h6 className="fw-bold mb-0 text-dark">{data.nombre}</h6>
                        <span className="badge bg-light text-primary border-0 p-0" style={{ fontSize: '10px' }}>
                            <i className="ti ti- rosette-check-filled me-1"></i>Especialista
                        </span>
                    </div>
                </div>

                {/* 2. FILTROS DE FECHA */}
                <form onSubmit={handleFilter} className="bg-white rounded-3 p-3 mb-3 shadow-sm border border-light">
                    <div className="row g-2">
                        <div className="col-6">
                            <label className="form-label small fw-bold text-muted mb-1">Desde</label>
                            <input 
                                type="date" 
                                name="fecha_inicio" 
                                defaultValue={filtros.fecha_inicio || hoy} 
                                className="form-control form-control-sm border-light bg-light rounded-3" 
                            />
                        </div>
                        <div className="col-6">
                            <label className="form-label small fw-bold text-muted mb-1">Hasta</label>
                            <input 
                                type="date" 
                                name="fecha_fin" 
                                defaultValue={filtros.fecha_fin || hoy} 
                                className="form-control form-control-sm border-light bg-light rounded-3" 
                            />
                        </div>
                        <div className="col-12 mt-2">
                            <button type="submit" disabled={loading} className="btn btn-primary btn-sm w-100 rounded-3 fw-bold" style={{ background: '#24D2DB', border: 'none' }}>
                                {loading ? (
                                    'Cargando...'
                                ) : (
                                    <>
                                        <i className="ti ti-adjustments-horizontal me-1"></i> 
                                        Filtrar Actividad
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* 3. RESUMEN FINANCIERO (TARJETAS) */}
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <div className="bg-white p-3 rounded-3 shadow-sm border border-light h-100">
                            <span className="text-muted d-block mb-1" style={{ fontSize: '10px', fontWeight: '800' }}>RECAUDO NETO</span>
                            <h5 className="fw-bold mb-0 text-dark">${data.suma_recaudado?.toLocaleString()}</h5>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="p-3 rounded-3 shadow-sm border-0 h-100 text-white" style={{ background: 'linear-gradient(135deg, #051937 0%, #004d7a 100%)' }}>
                            <span className="opacity-75 d-block mb-1" style={{ fontSize: '10px', fontWeight: '800' }}>NETO A PAGAR</span>
                            <h5 className="fw-bold mb-0 text-white opacity-75">${data.total_ganado_empleado?.toLocaleString()}</h5>
                        </div>
                    </div>
                </div>

                {/* 4. DETALLE DE LIQUIDACIÓN Y VALES */}
                <div className="bg-white rounded-3 p-3 mb-3 shadow-sm border border-light">
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Comisiones ({data.suma_comisiones > 0 ? 'Pactadas' : '0'})</span>
                        <span className="fw-bold small text-dark">${data.suma_comisiones?.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small">Propinas Recibidas</span>
                        <span className="fw-bold small text-success">+${data.suma_propinas?.toLocaleString()}</span>
                    </div>
                    {data.suma_vales > 0 && (
                        <div className="pt-2 border-top">
                            {/* CABECERA DESPLEGABLE */}
                            <div 
                                className="d-flex justify-content-between align-items-center mb-1" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => setShowVales(!showVales)}
                            >
                                <span className="text-danger small fw-bold">
                                    <i className={`ti ti-chevron-${showVales ? 'down' : 'right'} me-1 transition-all`}></i>
                                    Vales y Adelantos / Liquidaciones
                                </span>
                                <span className="fw-bold small text-danger">
                                    -${data.suma_vales?.toLocaleString()}
                                </span>
                            </div>

                            {/* LISTA OCULTABLE */}
                            {showVales && (
                                <div className="ps-3 animate__animated animate__fadeIn">
                                    {vales.map((v: any) => (
                                        <div 
                                            key={v.id} 
                                            className="d-flex justify-content-between opacity-75 py-1 border-bottom border-light-subtle" 
                                            style={{ fontSize: '10px' }}
                                        >
                                            <span className="text-muted">
                                                <i className="ti ti-minus me-1"></i>
                                                {v.concepto}
                                            </span>
                                            <span className="text-danger">-${v.monto.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 5. HISTORIAL DE SERVICIOS (Mobile Friendly) */}
                <h6 className="fw-bold text-dark px-2 mb-3">Historial de Servicios ({servicios.length})</h6>
                
                <div className="vstack gap-2">
                    {servicios.length === 0 ? (
                        <div className="bg-white rounded-3 p-5 text-center shadow-sm border border-light">
                            <i className="ti ti-calendar-x fs-1 text-muted opacity-25"></i>
                            <p className="text-muted small mt-2">Sin actividad en estas fechas</p>
                        </div>
                    ) : (
                        servicios.map((s: any) => (
                            <div key={s.id} className="bg-white rounded-3 p-3 shadow-sm border border-light border-start-4 border-start-primary">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="bg-light rounded-3 p-2 me-3 text-center" style={{ minWidth: '50px' }}>
                                            <div className="fw-bold text-dark" style={{ fontSize: '11px' }}>{s.hora}</div>
                                            <div className="text-muted" style={{ fontSize: '8px' }}>{s.fecha}</div>
                                        </div>
                                        <div>
                                            <div className="fw-bold text-dark mb-0" style={{ fontSize: '14px' }}>{s.servicio}</div>
                                            <div className="text-muted" style={{ fontSize: '10px' }}>{s.cliente_nombre}</div>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold text-primary" style={{ fontSize: '14px' }}>+${s.comision_valor?.toLocaleString()}</div>
                                        <div className="text-muted" style={{ fontSize: '9px' }}>Mi Comis. ({s.comision_pactada}%)</div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light mt-2">
                                    <span className="badge bg-light text-muted border-0 fw-normal" style={{ fontSize: '9px' }}>#{s.codigo}</span>
                                    <div className="d-flex gap-2">
                                        {s.propina > 0 && (
                                            <span className="text-success fw-bold" style={{ fontSize: '10px' }}>
                                                <i className="ti ti-gift me-1"></i>+${s.propina.toLocaleString()}
                                            </span>
                                        )}
                                        <span className={`text-${s.estado_color} fw-bold`} style={{ fontSize: '10px' }}>
                                            <i className="ti ti-point-filled"></i> {s.estado_nombre}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .border-start-4 { border-left-width: 4px !important; }
                .border-start-primary { border-left-color: #24D2DB !important; }
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(0.5);
                }
            `}} />
        </AppLandingLayout>
    );
}