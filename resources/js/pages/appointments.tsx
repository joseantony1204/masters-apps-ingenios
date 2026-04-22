import AppLandingLayout from '@/layouts/app/app-landing-layout';
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Appointments({ comercio, citas }: any) {
    // 1. Lógica para filtrar (Hoy + Futuro) y ordenar
    const { citasAgrupadas, fechasDisponibles } = useMemo(() => {
        const grupos: any = {};
        const hoyStr = new Date().toISOString().split('T')[0];

        citas.detallescitas?.forEach((detalle: any) => {
            const fecha = detalle.cita.fecha;
            // FILTRO: Solo permitimos fechas de hoy en adelante
            if (fecha >= hoyStr) {
                if (!grupos[fecha]) grupos[fecha] = [];
                grupos[fecha].push(detalle);
            }
        });

        // ORDENAR FECHAS: De pasado (hoy) a futuro
        const fechasOrdenadas = Object.keys(grupos).sort((a, b) => 
            new Date(a).getTime() - new Date(b).getTime()
        );

        const objetoOrdenado = fechasOrdenadas.reduce((obj: any, key) => {
            obj[key] = grupos[key].sort((a: any, b: any) => 
                a.cita.horainicio.localeCompare(b.cita.horainicio)
            );
            return obj;
        }, {});

        return { citasAgrupadas: objetoOrdenado, fechasDisponibles: fechasOrdenadas };
    }, [citas]);

    // 2. Estado inicial: Hoy o la primera fecha disponible en el futuro
    const [selectedDate, setSelectedDate] = useState(() => {
        const hoy = new Date().toISOString().split('T')[0];
        return fechasDisponibles.includes(hoy) ? hoy : (fechasDisponibles[0] || '');
    });

    // Helpers de Formato
    const getDiaSemana = (fechaStr: string) => {
        const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        const fecha = new Date(fechaStr + "T00:00:00");
        return dias[fecha.getDay()];
    };

    const getDiaNumero = (fechaStr: string) => fechaStr.split('-')[2];

    const getMesNombre = (fechaStr: string) => {
        return new Date(fechaStr + 'T00:00:00')
            .toLocaleDateString('es-ES', { month: 'short' })
            .replace('.', '').toUpperCase();
    };

    const getDiaNombreLargo = (fechaStr: string) => {
        const hoy = new Date().toISOString().split('T')[0];
        if (fechaStr === hoy) return "Hoy";
        return new Date(fechaStr + 'T00:00:00')
            .toLocaleDateString('es-ES', { weekday: 'long' });
    };

    return (
        <AppLandingLayout comercio={comercio}>
            <div className="pb-5 mb-5 px-3">
                
                {/* TARJETA DEL ESPECIALISTA (HEADER) */}
                <div className="bg-white border-0 rounded-3 p-3 mb-4 shadow-sm d-flex align-items-center mt-3 animate__animated animate__fadeInDown">
                    <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-800 shadow-sm" 
                         style={{ width: '56px', height: '56px', fontSize: '22px', minWidth: '56px' }}>
                        {citas.persona.personasnaturales.nombre?.charAt(0).toUpperCase() || 'E'}
                    </div>
                    <div>
                        <h5 className="fw-800 mb-0 text-dark text-uppercase" style={{ letterSpacing: '-0.5px' }}>
                            {citas.persona.personasnaturales.nombrecompleto}
                        </h5>
                        <p className="text-muted mb-0 fw-bold small text-uppercase" style={{ fontSize: '11px', opacity: 0.8 }}>
                            Agenda / Próximas Citas
                        </p>
                    </div>
                </div>

                {/* CALENDARIO PREMIUM COMPACTO */}
                <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                    Calendario Próximo
                </h6>
                <div className="d-flex overflow-auto gap-3 mb-4 pb-3 no-scrollbar" style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                    {fechasDisponibles.length > 0 ? (
                        fechasDisponibles.map((fecha) => {
                            const isActive = selectedDate === fecha;
                            const esHoy = fecha === new Date().toISOString().split('T')[0];
                            return (
                                <div 
                                    key={fecha} 
                                    onClick={() => setSelectedDate(fecha)}
                                    className={`calendar-card d-flex flex-column align-items-center justify-content-center transition-all ${isActive ? 'active shadow-blue' : 'bg-white border-light-subtle shadow-sm'}`}
                                >
                                    <div className="day-name">{getDiaSemana(fecha)}</div>
                                    <div className="day-number">
                                        {getDiaNumero(fecha)}
                                        {esHoy && <div className="today-dot"></div>}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="small text-muted p-2">No hay citas futuras programadas</div>
                    )}
                </div>

                {/* LISTADO DE CITAS */}
                {selectedDate && citasAgrupadas[selectedDate] ? (
                    <div className="animate__animated animate__fadeIn">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="fw-800 text-dark text-capitalize mb-0">
                                    {getDiaNombreLargo(selectedDate)}
                                </h5>
                                <p className="text-muted small mb-0">
                                    {citasAgrupadas[selectedDate].length} servicios para este día
                                </p>
                            </div>
                            <span className="badge bg-light-primary text-primary rounded-pill px-3 py-2 fw-800 shadow-sm">
                                {getMesNombre(selectedDate)}
                            </span>
                        </div>

                        {/* Timeline de Citas */}
                        <div className="ms-2 border-start ps-4 position-relative">
                            {citasAgrupadas[selectedDate].map((detalle: any) => (
                                <div key={detalle.id} className="mb-4 position-relative">
                                    <div className="timeline-dot"></div>
                                    
                                    <div className="bg-white rounded-3 border-0 p-3 shadow-sm hover-card transition-all">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="d-flex align-items-center">
                                                <div className="time-badge me-2">
                                                    {detalle.cita.horainicio.substring(0, 5)}
                                                </div>
                                                <span className="text-muted small fw-bold">
                                                    <i className="ti ti-clock me-1"></i>
                                                    {detalle.empleadoservicio.duracionpersonalizado} min
                                                </span>
                                            </div>
                                            <span className={`badge rounded-pill bg-light-${detalle.cita.estado.observacion || 'primary'} text-${detalle.cita.estado.observacion || 'primary'} px-3 fw-bold`}>
                                                {detalle.cita.estado.nombre}
                                            </span>
                                            
                                        </div>

                                        <h6 className="fw-800 text-dark mb-1 fs-5">
                                            <span>
                                                {detalle.cita.cliente.persona.personasnaturales.nombrecompleto}
                                            </span>
                                        </h6>
                                        <p className="text-muted f-12 mb-0">
                                            {detalle.cita.cliente.persona.telefonomovil}
                                        </p>
                                            
                                        
                                        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2">
                                            <div className="text-primary fw-800" style={{ fontSize: '13px' }}>
                                                <i className="ti ti-scissors me-1"></i>
                                                {detalle.empleadoservicio.servicio.nombre}
                                            </div>
                                            
                                            <div className="d-flex gap-2">
                                                <a href={`https://wa.me/57${detalle.cita.cliente.persona.telefonomovil}`}
                                                   target="_blank" className="btn-action bg-light-success text-success">
                                                    <i className="ti ti-brand-whatsapp fs-5"></i>
                                                </a>
                                                <Link href="#" className="btn-action bg-light-primary text-primary">
                                                    <i className="ti ti-user fs-5"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white rounded-3 border border-dashed mt-4 shadow-sm">
                        <i className="ti ti-calendar-off fs-1 text-muted opacity-25"></i>
                        <p className="text-muted mt-3 fw-bold">Sin citas para mostrar.</p>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                body { background-color: #f8fafc; }
                .fw-800 { font-weight: 800 !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

                /* Indicador de hoy */
                .today-dot {
                    width: 6px;
                    height: 6px;
                    background-color: #0095ff;
                    border-radius: 50%;
                    margin: 2px auto 0;
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .active .today-dot { background-color: #fff; }

                /* Calendario Premium Compacto */
                .calendar-card {
                    min-width: 72px;
                    height: 90px;
                    background-color: #ffffff;
                    border: 1.5px solid #f1f5f9;
                    border-radius: 16px;
                    cursor: pointer;
                    flex-shrink: 0;
                    position: relative;
                }
                .calendar-card .day-name {
                    font-size: 11px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                }
                .calendar-card .day-number {
                    font-size: 26px;
                    font-weight: 800;
                    color: #1e293b;
                    line-height: 1;
                    position: relative;
                }
                .calendar-card.active {
                    background-color: #0095ff !important;
                    border-color: #0095ff !important;
                    transform: translateY(-4px);
                }
                .calendar-card.active .day-name, .calendar-card.active .day-number {
                    color: #ffffff !important;
                }
                .shadow-blue {
                    box-shadow: 0 10px 20px -5px rgba(0, 149, 255, 0.45) !important;
                }

                /* Agenda/Timeline */
                .timeline-dot {
                    position: absolute;
                    width: 14px;
                    height: 14px;
                    background-color: #0095ff;
                    border: 3px solid #fff;
                    border-radius: 50%;
                    left: -32px;
                    top: 10px;
                    box-shadow: 0 0 0 4px rgba(0, 149, 255, 0.1);
                    z-index: 2;
                }
                .time-badge {
                    background-color: #f1f5f9;
                    color: #1e293b;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 13px;
                }
                .hover-card:hover {
                    transform: translateX(5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
                }
                .btn-action {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    transition: 0.2s;
                    border: none;
                    text-decoration: none;
                }
                .btn-action:hover { opacity: 0.8; transform: scale(1.1); }
                
                .bg-light-primary { background-color: #e0f2fe !important; }
                .bg-light-success { background-color: #dcfce7 !important; }
                .text-primary { color: #0095ff !important; }
                .bg-primary { background-color: #0095ff !important; }
            `}} />
        </AppLandingLayout>
    );
}