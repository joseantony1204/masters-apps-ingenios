import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLandingLayout from '@/layouts/app/app-landing-layout';

interface Props {
    comercio: any;
    cita: {
        id: number;
        codigo: string; // El código SLTV...
        fecha: string;
        hora: string;
        duracion: number;
        total: string;
        empleado: { nombre: string; avatar_url: string | null; };
        sede: Array<{nombre: string; direccion: string; ciudad: string; }>;
        servicio: Array<{ id: number; nombre: string; duracion: number; precio: string; }>;
    };
}

const ConfirmacionCita = ({ cita, comercio }: Props) => {
    if (!cita) return <div className="text-center py-5 text-muted">Cargando confirmación...</div>;

    return (
        <AppLandingLayout comercio={comercio}>
            <Head title="Cita Confirmada" />

            {/* Fondo gris muy sutil para dar contraste a la tarjeta blanca */}
            <div className="min-vh-100 py-5" style={{ backgroundColor: '#f4f7f6' }}>
                <div className="container">
                    <div className="mx-auto" style={{ maxWidth: '550px' }}>
                        
                        {/* 1. TARJETA PRINCIPAL (ESTILO TICKET) */}
                        <div className="bg-white rounded-5 shadow-lg border animate__animated animate__fadeIn" 
                            style={{ overflow: 'hidden', borderColor: '#eee !important' }}>
                            
                            {/* ENCABEZADO SIMPLE DE LA TARJETA */}
                            <div className="p-4 border-bottom text-center" style={{ backgroundColor: '#fafafa' }}>
                                <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm border mb-2" 
                                    style={{ width: '60px', height: '60px' }}>
                                    <i className="ti ti-check" style={{ fontSize: '30px', color: '#24D2DB' }}></i>
                                </div>
                                <h3 className="fw-extrabold text-dark mb-1">Cita confirmada</h3>
                                <p className="text-muted small mb-0">Referencia: <strong>#{cita.codigo}</strong></p>
                            </div>

                            <div className="p-4 p-md-5">
                                
                                {/* A. INFO DEL PROFESIONAL */}
                                <h6 className="fw-bolder mb-3 text-muted" style={{ fontSize: '11px', letterSpacing: '1px' }}>CON QUIEN</h6>
                                <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom border-light">
                                    <div className="d-flex align-items-center">
                                        <div className="position-relative">
                                            <div className="rounded-circle overflow-hidden shadow-sm" style={{ width: '60px', height: '60px', border: '3px solid white' }}>
                                                {cita.empleado.avatar_url ? (
                                                    <img src={cita.empleado.avatar_url} className="w-100 h-100 object-fit-cover" />
                                                ) : (
                                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white fw-bold" style={{ backgroundColor: '#24D2DB' }}>
                                                        {cita.empleado.nombre.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle animate__animated animate__pulse animate__infinite" style={{ width: '14px', height: '14px' }}></span>
                                        </div>
                                        <div className="ms-3">
                                            <h6 className="fw-bold mb-0 text-dark">{cita.empleado.nombre}</h6>
                                            <small className="text-muted">Profesional asignado</small>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="badge rounded-pill text-success bg-success-subtle px-3 py-2 border border-success-subtle" style={{ fontSize: '11px' }}>
                                            <i className="ti ti-circle-fill me-1" style={{ fontSize: '8px' }}></i>
                                            CONFIRMADA
                                        </div>
                                    </div>
                                </div>

                                {/* B. GRILLA DE FECHA Y HORA */}
                                <h6 className="fw-bolder mb-3 text-muted" style={{ fontSize: '11px', letterSpacing: '1px' }}>CUANDO</h6>
                                <div className="row g-3 mb-4">
                                    <div className="col-6">
                                        <div className="p-3 rounded-4 bg-light border border-white shadow-sm h-100">
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Fecha</small>
                                            <span className="fw-bold text-dark fs-6">{cita.fecha}</span>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="p-3 rounded-4 bg-light border border-white shadow-sm h-100">
                                            <small className="text-muted d-block mb-1 text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Hora</small>
                                            <span className="fw-bold fs-6" style={{ color: '#24D2DB' }}>{cita.hora}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* C. DETALLES DE UBICACIÓN */}
                                <h6 className="fw-bolder mb-3 text-muted" style={{ fontSize: '11px', letterSpacing: '1px' }}>DONDE</h6>
                                <div className="d-flex align-items-start mb-4 px-2">
                                    <div className="p-2 rounded-3 me-3" style={{ color: '#24D2DB', backgroundColor: '#E9FAFB' }}>
                                        <i className="ti ti-map-pin fs-4"></i>
                                    </div>
                                    {cita.sede.map((sd) => (
                                    <div>
                                        <h6 className="fw-bold mb-0">{sd.nombre}</h6>
                                        <small className="text-muted">{sd.direccion}, {sd.ciudad}</small>
                                    </div>
                                    ))}
                                </div>

                                <hr className="my-4 border-dashed" />

                                {/* D. RESUMEN DEL SERVICIO */}
                                <h6 className="fw-bolder mb-3 text-muted" style={{ fontSize: '11px', letterSpacing: '1px' }}>SERVICIO</h6>
                                <div className="mb-4">
                                    {cita.servicio.map((s) => (
                                        <div key={s.id} className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <p className="fw-bold mb-0 text-dark">{s.nombre}</p>
                                                <small className="text-muted"><i className="ti ti-clock-hour-4 me-1"></i>{s.duracion} min</small>
                                            </div>
                                            <span className="fw-extrabold text-dark fs-6">{s.precio}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* E. TOTAL */}
                                <h6 className="fw-bolder mb-3 text-muted" style={{ fontSize: '11px', letterSpacing: '1px' }}>TOTAL</h6>
                                <div className="rounded-4 p-4 mb-4 d-flex justify-content-between align-items-center shadow-inner" 
                                    style={{ backgroundColor: '#F8FDFD', border: '1px dashed #24D2DB' }}>
                                    <span className="h6 fw-bold mb-0 text-muted">Total a pagar</span>
                                    <span className="h1 fw-bolder mb-0" style={{ color: '#24D2DB', letterSpacing: '-1px' }}>{cita.total}</span>
                                </div>

                                {/* F. BOTONES DE ACCIÓN */}
                                <div className="d-grid gap-3 pt-3">
                                    <button 
                                        onClick={() => window.print()}
                                        className="btn btn-link text-muted fw-medium text-decoration-none btn-sm"
                                    >
                                        <i className="ti ti-download me-2"></i> Guardar comprobante PDF
                                    </button>
                                </div>

                                {/* BANNER DE AVISO FINAL */}
                                <div className="mt-5 p-3 rounded-4 text-center border alert-warning border-opacity-25" style={{ backgroundColor: '#FFF9E6' }}>
                                    <p className="small mb-0 text-dark-emphasis">
                                        <i className="ti ti-info-circle-filled me-2 text-warning"></i>
                                        ¿No puedes asistir? Cancela desde el portal hasta 2h antes.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Estilos CSS adicionales */}
            <style>{`
                .border-dashed { border-top: 2px dashed #e9ecef; }
                .shadow-inner { box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.03); }
                .animate__animated { --animate-duration: 0.6s; }
                @media print {
                    .btn, .badge, .alert-warning, .ti-map-pin, hr { display: none !important; }
                    .bg-white { box-shadow: none !important; border: none !important; }
                    .bg-light { background-color: white !important; border: 1px solid #eee !important; }
                    body { background: white; }
                }
            `}</style>
        </AppLandingLayout>
    );
};

export default ConfirmacionCita;