import AppLandingLayout from '@/layouts/app/app-landing-layout';
import React, { useState, useMemo } from 'react';
import { Link } from '@inertiajs/react';

export default function Appointments({ comercio, citas }: any) {
    const hoyStr = new Date().toISOString().split('T')[0];

    const { citasAgrupadas, fechasDisponibles } = useMemo(() => {
        const grupos: any = {};
        citas.detallescitas?.forEach((detalle: any) => {
            const fecha = detalle.cita.fecha;
            if (fecha >= hoyStr) {
                if (!grupos[fecha]) grupos[fecha] = [];
                grupos[fecha].push(detalle);
            }
        });
        const fechasOrdenadas = Object.keys(grupos).sort();
        return { citasAgrupadas: grupos, fechasDisponibles: fechasOrdenadas };
    }, [citas]);

    const [selectedDate, setSelectedDate] = useState(() => 
        fechasDisponibles.includes(hoyStr) ? hoyStr : (fechasDisponibles[0] || '')
    );

    const getDiaSemana = (f: string) => new Date(f + "T00:00:00").toLocaleDateString('es-ES', { weekday: 'short' }).toUpperCase().replace('.', '');
    const getDiaNumero = (f: string) => f.split('-')[2];
    const getDiaNombreLargo = (f: string) => f === hoyStr ? "Hoy" : new Date(f + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <AppLandingLayout comercio={comercio}>
            <div className="pb-5 mb-5 px-2">
                
                {/* HEADER PERFIL */}
                <div className="bg-white rounded-3 p-3 mb-3 shadow-sm d-flex align-items-center mt-2 border border-light">
                    <div className="me-3 bg-primary rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" 
                         style={{ width: '50px', height: '50px', fontSize: '20px', minWidth: '50px', background: 'linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%)' }}>
                        {citas.persona.personasnaturales.nombre?.charAt(0)}
                    </div>
                    <div>
                        <h6 className="fw-bold mb-0 text-dark">{citas.persona.personasnaturales.nombrecompleto}</h6>
                        <span className="badge bg-light text-primary border-0 p-0" style={{ fontSize: '10px' }}>
                            <i className="ti ti-calendar-check me-1"></i>Agenda del Especialista
                        </span>
                    </div>
                </div>

                {/* CALENDARIO HORIZONTAL */}
                <div className="d-flex overflow-auto gap-2 mb-4 pb-2 no-scrollbar">
                    {fechasDisponibles.map((fecha) => {
                        const isActive = selectedDate === fecha;
                        return (
                            <div 
                                key={fecha} 
                                onClick={() => setSelectedDate(fecha)}
                                className={`d-flex flex-column align-items-center justify-content-center transition-all ${isActive ? 'active-day shadow-sm' : 'bg-white border-light'}`}
                                style={{
                                    minWidth: '60px', height: '75px', borderRadius: '16px', cursor: 'pointer',
                                    border: isActive ? '2px solid #24D2DB' : '1px solid #f1f5f9',
                                    backgroundColor: isActive ? '#f0fdfa' : '#fff', transition: '0.3s'
                                }}
                            >
                                <span style={{ fontSize: '10px', fontWeight: '800', color: isActive ? '#24D2DB' : '#A0A0A0' }}>{getDiaSemana(fecha)}</span>
                                <span style={{ fontSize: '20px', fontWeight: '800', color: isActive ? '#24D2DB' : '#1e293b' }}>{getDiaNumero(fecha)}</span>
                            </div>
                        );
                    })}
                </div>

                <h6 className="fw-bold text-dark px-2 mb-4 text-capitalize" style={{ fontSize: '16px' }}>
                    {getDiaNombreLargo(selectedDate)}
                </h6>

                {/* TIMELINE CONTAINER */}
                <div className="position-relative ms-2">
                    {/* Línea vertical de fondo */}
                    <div className="position-absolute h-100" style={{ width: '2px', backgroundColor: '#e2e8f0', left: '14px', top: '0', zIndex: 0 }}></div>

                    <div className="vstack gap-4">
                        {selectedDate && citasAgrupadas[selectedDate] ? (
                            citasAgrupadas[selectedDate].map((detalle: any) => (
                                <div key={detalle.id} className="position-relative ps-5">
                                    
                                    {/* Punto del timeline */}
                                    <div className="position-absolute" style={{ 
                                        width: '12px', height: '12px', backgroundColor: '#24D2DB', 
                                        borderRadius: '50%', left: '9px', top: '22px', 
                                        border: '3px solid #fff', boxShadow: '0 0 0 4px rgba(36, 210, 219, 0.1)', zIndex: 1 
                                    }}></div>

                                    {/* Tarjeta de la Cita con Border-Left */}
                                    <div className="bg-white rounded-3 p-3 shadow-sm border border-light border-start-4 border-start-primary">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-3 p-2 me-3 text-center" style={{ minWidth: '55px' }}>
                                                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{detalle.cita.horainicio.substring(0, 5)}</div>
                                                    <div className="text-muted" style={{ fontSize: '9px', fontWeight: '700' }}>{detalle.empleadoservicio.duracionpersonalizado} MIN</div>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark mb-0" style={{ fontSize: '15px', letterSpacing: '-0.3px' }}>
                                                        {detalle.cita.cliente.persona.personasnaturales.nombrecompleto}
                                                    </div>
                                                    <div className="text-muted d-flex align-items-center" style={{ fontSize: '11px' }}>
                                                        <i className="ti ti-phone me-1 text-primary"></i>
                                                        {detalle.cita.cliente.persona.telefonomovil}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`badge bg-light-${detalle.cita.estado.color || 'primary'} text-${detalle.cita.estado.color || 'primary'} border-0 px-2`} style={{ fontSize: '9px', fontWeight: '800' }}>
                                                {detalle.cita.estado.nombre.toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light mt-2">
                                            <div className="d-flex align-items-center text-primary fw-bold" style={{ fontSize: '12px' }}>
                                                <i className="ti ti-scissors me-1"></i>
                                                {detalle.empleadoservicio.servicio.nombre}
                                            </div>
                                            <div className="d-flex gap-2">
                                                <a href={`https://wa.me/57${detalle.cita.cliente.persona.telefonomovil}`}
                                                   target="_blank" className="btn rounded-3 d-flex align-items-center justify-content-center p-0 shadow-sm"
                                                   style={{ width: '35px', height: '35px', backgroundColor: '#dcfce7', color: '#22c55e', border: 'none' }}>
                                                    <i className="ti ti-brand-whatsapp fs-5"></i>
                                                </a>
                                                <Link href="#" className="btn rounded-3 d-flex align-items-center justify-content-center p-0 shadow-sm"
                                                      style={{ width: '35px', height: '35px', backgroundColor: '#f0f9ff', color: '#0095ff', border: 'none' }}>
                                                    <i className="ti ti-user fs-5"></i>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="ms-5 bg-white rounded-3 p-5 text-center shadow-sm border border-light">
                                <i className="ti ti-calendar-x fs-1 text-muted opacity-25"></i>
                                <p className="text-muted small mt-2">Sin citas programadas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .border-start-4 { border-left-width: 4px !important; }
                .border-start-primary { border-left-color: #24D2DB !important; }
                .active-day {
                    border: 2px solid #24D2DB !important;
                    background-color: #f0fdfa !important;
                    transform: scale(1.05);
                }
                .bg-light-primary { background-color: #f0f9ff !important; }
                .bg-light-success { background-color: #dcfce7 !important; }
                .bg-light-warning { background-color: #fefce8 !important; }
                .text-warning { color: #ca8a04 !important; }
            `}} />
        </AppLandingLayout>
    );
}