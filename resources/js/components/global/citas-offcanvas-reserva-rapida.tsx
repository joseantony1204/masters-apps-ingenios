import React from 'react';

interface Props {
    state: any;
    onReservar: (datos: any) => void;
}

export default function CitasOffcanvasReservaRapida({ state, onReservar }: Props) {
    const {
        show,
        cerrarModal,
        servicios,
        categorias, 
        activeCat, 
        setActiveCat,
        servicioSeleccionado,
        setServicioSeleccionado,
        manejarSeleccionDirecta,
        cargando
    } = state;

    if (!show) return null;

    return (
        <>
            <div className="offcanvas-backdrop fade show" style={{ zIndex: 1040 }} onClick={cerrarModal}></div>
            
            <div 
                className={`offcanvas offcanvas-end border-0 shadow ${show ? 'show' : ''}`} 
                style={{ width: '460px', visibility: 'visible', zIndex: 1045 }} 
                tabIndex={-1}
            >
                <div className="offcanvas-header bg-warning text-dark py-4">
                    <div>
                        <h4 className="offcanvas-title fw-bold text-dark mb-1">⚡ Agenda Rápida</h4>
                        <p className="text-dark-50 small mb-0">Selecciona lo esencial para continuar</p>
                    </div>
                    <button type="button" className="btn-close" onClick={cerrarModal}></button>
                </div>

                <div className="offcanvas-body p-0 bg-light-subtle d-flex flex-column" style={{ overflowX: 'hidden' }}>
                    
                    {/* SKELETON LOAD */}
                    {cargando && (
                        <div className="p-4">
                            <div className="placeholder-glow">
                                <div className="placeholder col-6 mb-3 rounded py-2"></div>
                                <div className="placeholder col-12 mb-2 rounded py-4"></div>
                            </div>
                        </div>
                    )}

                    {/* PASO 1: CATEGORÍAS Y SERVICIOS */}
                    {!servicioSeleccionado && !cargando && (
                        <div className="p-4 animate__animated animate__fadeIn">
                            <h6 className="fw-bold text-muted small text-uppercase mb-3">1. Selecciona una Categoría</h6>
                            
                            <div className="d-flex overflow-auto gap-3 mb-4 pb-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                                {categorias.map((cat: any) => (
                                    <div key={cat.id} onClick={() => setActiveCat(cat.id)} className="text-center" style={{ minWidth: '75px', cursor: 'pointer' }}>
                                        <div 
                                            className={`mb-2 mx-auto d-flex align-items-center justify-content-center rounded-circle border transition-all ${
                                                activeCat === cat.id ? 'bg-warning-subtle border-warning shadow-sm' : 'bg-white'
                                            }`} 
                                            style={{ width: '55px', height: '55px' }}
                                        >
                                            <i className={`${cat.observacion || 'ti ti-layout-grid'} fs-4 ${
                                                activeCat === cat.id ? 'text-warning' : 'text-muted'
                                            }`}></i>
                                        </div>
                                        <span className={`small fw-bold d-block ${activeCat === cat.id ? 'text-dark' : 'text-muted'}`} style={{ fontSize: '11px', lineHeight: '1.2' }}>
                                            {cat.nombre}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <h6 className="fw-bold text-muted small text-uppercase mb-3">Servicios Disponibles</h6>
                            <div className="row g-2">
                                {servicios
                                    .filter((s: any) => s.categoria?.id === activeCat)
                                    .map((s: any) => {
                                        const iconoFinal = s.icon || s.categoria?.observacion || 'ti ti-cut';
                                        return (
                                            <div key={s.id} className="col-12">
                                                <div className="card shadow-none border hover-border-warning cursor-pointer mb-0 transition-all" onClick={() => setServicioSeleccionado(s)}>
                                                    <div className="card-body p-3 d-flex align-items-center">
                                                        <div className="bg-light-warning rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                                                            <i className={`${iconoFinal} text-warning fs-4`}></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-bold text-dark">{s.nombre}</div>
                                                            <small className="text-muted">Especialistas listos</small>
                                                        </div>
                                                        <i className="ti ti-chevron-right text-muted"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    )}

                    {/* PASO 2: SELECCIONAR ESPECIALISTA Y FINALIZAR */}
                    {servicioSeleccionado && !cargando && (
                        <div className="p-4 animate__animated animate__fadeIn">
                            <button className="btn btn-link btn-sm p-0 mb-3 text-decoration-none text-warning" onClick={() => setServicioSeleccionado(null)}>
                                <i className="ti ti-arrow-left me-1"></i> Volver a servicios
                            </button>
                            <h6 className="fw-bold text-muted small text-uppercase mb-3">2. Selecciona el especialista para asignar</h6>
                            
                            <div className="row g-2">
                                {servicioSeleccionado.asignaciones?.map((esp: any) => (
                                    <div key={esp.empleado_id} className="col-12">
                                        <div 
                                            className="card border shadow-none cursor-pointer hover-border-warning mb-0"
                                            onClick={() => {
                                                const datosCitaDirecta = manejarSeleccionDirecta(esp);
                                                onReservar(datosCitaDirecta);
                                            }}
                                        >
                                            <div className="card-body p-3 d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar avatar-sm bg-light-warning text-warning rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>
                                                        {esp.nombre?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{esp.nombre}</div>
                                                        <small className="text-muted">
                                                            <i className="ti ti-clock me-1"></i>{esp.duracionpersonalizado} min
                                                        </small>
                                                    </div>
                                                </div>
                                                <div className="text-end">
                                                    <span className="fw-bold text-dark d-block">${Number(esp.preciopersonalizado).toLocaleString()}</span>
                                                    <span className="badge bg-warning text-dark px-2 py-1 rounded-pill" style={{fontSize: '0.65rem'}}>Asignar Directo</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}