import React from 'react';

interface Props {
    state: any;
    onReservar: (datos: any) => void;
}

export default function CitasOffcanvasReserva({ state, onReservar }: Props) {
    const {
        show,
        cerrarModal,
        servicios,
        categorias, 
        activeCat, 
        setActiveCat,
        servicioSeleccionado,
        setServicioSeleccionado,
        especialistaSeleccionado,
        setEspecialistaSeleccionado,
        seleccionarEspecialista,
        turnosDisponibles,
        fechaSeleccionada,
        setFechaSeleccionada,
        jornadaActiva,
        setJornadaActiva,
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
                <div className="offcanvas-header bg-primary text-white py-4">
                    <div>
                        <h4 className="offcanvas-title fw-bold text-white mb-1">📅 Reservar Cita</h4>
                        <p className="text-white-50 small mb-0">Sigue los pasos para agendar</p>
                    </div>
                    <button type="button" className="btn-close btn-close-white" onClick={cerrarModal}></button>
                </div>

                <div className="offcanvas-body p-0 bg-light-subtle d-flex flex-column" style={{ overflowX: 'hidden' }}>
                    
                    {/* SKELETON LOAD */}
                    {cargando && !turnosDisponibles && (
                        <div className="p-4">
                            <div className="placeholder-glow">
                                <div className="placeholder col-6 mb-3 rounded py-2"></div>
                                <div className="placeholder col-12 mb-2 rounded py-4"></div>
                                <div className="placeholder col-12 mb-2 rounded py-4"></div>
                            </div>
                        </div>
                    )}

                    {/* PASO 1: CATEGORÍAS Y SERVICIOS */}
                    {!servicioSeleccionado && !cargando && (
                        <div className="p-4 animate__animated animate__fadeIn">
                            <h6 className="fw-bold text-muted small text-uppercase mb-3">1. Selecciona una Categoría</h6>
                            
                            {/* Burbujas de Categorías */}
                            <div className="d-flex overflow-auto gap-3 mb-4 pb-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
                                {categorias.map((cat: any) => (
                                    <div key={cat.id} onClick={() => setActiveCat(cat.id)} className="text-center" style={{ minWidth: '75px', cursor: 'pointer' }}>
                                        <div 
                                            className={`mb-2 mx-auto d-flex align-items-center justify-content-center rounded-circle border transition-all ${
                                                activeCat === cat.id ? 'bg-primary-subtle border-primary shadow-sm' : 'bg-white'
                                            }`} 
                                            style={{ width: '55px', height: '55px' }}
                                        >
                                            <i className={`${cat.observacion || 'ti ti-layout-grid'} fs-4 ${
                                                activeCat === cat.id ? 'text-primary' : 'text-muted'
                                            }`}></i>
                                        </div>
                                        <span 
                                            className={`small fw-bold d-block ${activeCat === cat.id ? 'text-primary' : 'text-muted'}`} 
                                            style={{ fontSize: '11px', lineHeight: '1.2' }}
                                        >
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
                                        // Usamos el icono del servicio, o el de la categoría como fallback
                                        const iconoFinal = s.icon || s.categoria?.observacion || 'ti ti-cut';
                                        
                                        return (
                                            <div key={s.id} className="col-12">
                                                <div 
                                                    className="card shadow-none border hover-border-primary cursor-pointer mb-0 transition-all"
                                                    onClick={() => setServicioSeleccionado(s)} 
                                                >
                                                    <div className="card-body p-3 d-flex align-items-center">
                                                        <div className="bg-light-primary rounded-3 p-2 me-3 d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                                                            <i className={`${iconoFinal} text-primary fs-4`}></i>
                                                        </div>
                                                        <div className="flex-grow-1">
                                                            <div className="fw-bold text-dark">{s.nombre}</div>
                                                            <small className="text-muted">Especialistas disponibles</small>
                                                        </div>
                                                        <i className="ti ti-chevron-right text-muted"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                                
                                {/* Empty State para categorías vacías */}
                                {servicios.filter((s: any) => s.categoria?.id === activeCat).length === 0 && (
                                    <div className="text-center py-4 opacity-50">
                                        <i className="ti ti-package fs-1"></i>
                                        <p className="small">No hay servicios en esta categoría</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* PASO 2: SELECCIONAR ESPECIALISTA */}
                    {servicioSeleccionado && !especialistaSeleccionado && !cargando && (
                        <div className="p-4 animate__animated animate__fadeIn">
                            <button className="btn btn-link btn-sm p-0 mb-3 text-decoration-none text-primary" onClick={() => setServicioSeleccionado(null)}>
                                <i className="ti ti-arrow-left me-1"></i> Volver a servicios
                            </button>
                            <h6 className="fw-bold text-muted small text-uppercase mb-3">2. Selecciona un especialista</h6>
                            
                            <div className="row g-2">
                                {servicioSeleccionado.asignaciones?.map((esp: any) => (
                                    <div key={esp.empleado_id} className="col-12">
                                        <div className="card border shadow-none cursor-pointer hover-border-primary mb-0"
                                            onClick={() => seleccionarEspecialista(esp)}>
                                            <div className="card-body p-3 d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center">
                                                    <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold" style={{width: '40px', height: '40px'}}>
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
                                                    <span className="fw-bold text-primary d-block">${Number(esp.preciopersonalizado).toLocaleString()}</span>
                                                    <span className="badge bg-light-primary text-primary" style={{fontSize: '0.65rem'}}>Elegir</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PASO 3: CALENDARIO DE TURNOS */}
                    {especialistaSeleccionado && turnosDisponibles && !cargando && (
                        <div className="animate__animated animate__fadeIn d-flex flex-column h-100">
                            {/* Selector de días horizontal */}
                            <div className="px-4 pt-3 pb-2 border-bottom bg-white">
                                <button className="btn btn-link btn-sm p-0 text-decoration-none mb-3" onClick={() => {setEspecialistaSeleccionado(null);}}>
                                    <i className="ti ti-arrow-left me-1"></i> Cambiar especialista
                                </button>
                                
                                <div className="d-flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                                    {Object.keys(turnosDisponibles).map((fecha) => (
                                        <button
                                            key={fecha}
                                            onClick={() => setFechaSeleccionada(fecha)}
                                            className={`btn btn-sm px-3 flex-shrink-0 transition-all ${fechaSeleccionada === fecha ? 'btn-primary shadow' : 'btn-outline-light text-dark border'}`}
                                            style={{ minWidth: '70px' }}
                                        >
                                            <div className="small text-uppercase opacity-75" style={{ fontSize: '0.6rem' }}>
                                                {new Date(fecha + 'T00:00:00').toLocaleDateString('es', { weekday: 'short' })}
                                            </div>
                                            <div className="fw-bold fs-5">{new Date(fecha + 'T00:00:00').getDate()}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Jornadas */}
                            <div className="bg-white border-bottom px-4">
                                <ul className="nav nav-pills nav-fill py-2 gap-2">
                                    {['Mañana', 'Tarde', 'Noche'].map((j) => (
                                        <li className="nav-item" key={j}>
                                            <button 
                                                className={`nav-link py-2 border-0 small fw-bold ${jornadaActiva === j ? 'active bg-primary' : 'bg-light text-muted'}`}
                                                onClick={() => setJornadaActiva(j as any)}
                                            >
                                                {j}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Turnos */}
                            <div className="p-4 overflow-y-auto flex-grow-1">
                                {(() => {
                                    const turnosFiltrados = turnosDisponibles[fechaSeleccionada]?.filter((t: any) => {
                                        const horaInt = parseInt(t.hora.split(':')[0]);
                                        if (jornadaActiva === 'Mañana') return horaInt < 12;
                                        if (jornadaActiva === 'Tarde') return horaInt >= 12 && horaInt < 18;
                                        return horaInt >= 18;
                                    });

                                    if (!turnosFiltrados || turnosFiltrados.length === 0) {
                                        return (
                                            <div className="text-center py-5 opacity-50">
                                                <i className="ti ti-calendar-off fs-1"></i>
                                                <p className="mt-2 small">No hay turnos para esta jornada.</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="row g-3">
                                            {turnosFiltrados.map((bloque: any, bIdx: number) => (
                                                <div key={bIdx} className="col-12">
                                                    <div className="card border shadow-sm mb-0 hover-border-primary transition-all">
                                                        <div className="card-body p-3 d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-light-primary text-primary fw-bold rounded px-3 py-2 border border-primary-subtle me-3">
                                                                    {bloque.hora}
                                                                </div>
                                                                <div className="text-muted small">Disponible</div>
                                                            </div>
                                                            <div className="d-flex flex-wrap gap-1">
                                                                {bloque.servicios_que_caben.map((serv: any, sIdx: number) => (
                                                                    <button 
                                                                        key={sIdx}
                                                                        onClick={() => {
                                                                            const datosCita = state.manejarSeleccionFinal(state.fechaSeleccionada, bloque.hora, serv);
                                                                            onReservar(datosCita);
                                                                        }}
                                                                        className="btn btn-sm btn-primary rounded-pill px-3 fw-medium"
                                                                    >
                                                                        <i className="ti ti-plus me-1"></i> Reservar
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}