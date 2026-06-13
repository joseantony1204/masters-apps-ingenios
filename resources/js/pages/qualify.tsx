import AppLandingLayout from '@/layouts/app/app-landing-layout';
import React, { useState } from 'react';
import { Head, useForm} from '@inertiajs/react';

interface Soporte {
    id: number;
    ruta: string;
    predeterminado: string;
    tipo_id: number;
}

interface CalificacionJson {
    id: number;
    token: string;
    estrellas: number;
    comentario: string | null;
    detalle?: {
        fecha: string;
        totalapagar: number;
        servicio?: {
            nombre: string;
        };
        empleadoservicio?: {
            empleado?: {
                persona?: {
                    personasnaturales?: {
                        nombrecompleto: string;
                        nombre: string;
                    };
                    soportes?: Soporte[];
                };
            },
            servicio?: {
                nombre: string;   
            };
        };
    };
}

interface QualifyProps {
    comercio: any;
    calificacion: CalificacionJson;
    error?: string;
}

export default function Qualify({ comercio, calificacion, error }: QualifyProps) {
    const [hoverRating, setHoverRating] = useState<number>(0);
    // ESTADO PARA MANEJAR EL ZOOM DE LA IMAGEN
    const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);
    
    const { data, setData, post, processing, wasSuccessful } = useForm({
        token: calificacion?.token || '',
        estrellas: calificacion?.estrellas || 0,
        comentario: calificacion?.comentario || ''
    });

    const personaObj = calificacion?.detalle?.empleadoservicio?.empleado?.persona;
    const especialistaObj = personaObj?.personasnaturales;
    
    const nombreEspecialista = especialistaObj?.nombrecompleto || 'Nuestro Especialista';
    const inicialEspecialista = especialistaObj?.nombre?.charAt(0).toUpperCase() || 'E';
    const nombreServicio = calificacion?.detalle?.empleadoservicio?.servicio?.nombre || 'Servicio';
    
    const fotoSoporte = personaObj?.soportes?.find(s => s.predeterminado === "1" && s.tipo_id === 1);
    const urlFoto = fotoSoporte ? `storage/${fotoSoporte.ruta}` : null;

    const totalServicio = calificacion?.detalle?.totalapagar 
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(calificacion.detalle.totalapagar)
        : null;

    const fechaServicio = calificacion?.detalle?.fecha 
        ? new Date(calificacion.detalle.fecha + "T00:00:00").toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
        : null;

    const manejarEnvio = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.estrellas === 0) return;
        
        post(route('public.save-qualify'), {
            preserveScroll: true
        });
    };

    const getLabelEstrellas = (rating: number) => {
        switch (rating) {
            case 1: return 'Mal servicio 😞';
            case 2: return 'Regular 😐';
            case 3: return 'Bueno, Puede Mejorar 🙂';
            case 4: return '¡Excelente atención!  😀';
            case 5: return '¡Espectacular servicio! 🌟';
            default: return 'Selecciona tu puntuación';
        }
    };

    return (
        <AppLandingLayout comercio={comercio}>
            <Head title="Vantify - Calificación Servicios" />
            <div className="pb-5 mb-5 px-3 d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light-gradient">
                
                <div className="w-100 bg-white rounded-3 p-4 shadow-lg border-0 text-center animate__animated animate__fadeIn position-relative overflow-hidden" 
                     style={{ maxWidth: '440px', marginTop: '2rem' }}>
                    
                    <div className="position-absolute top-0 start-0 w-100 bg-primary-gradient" style={{ height: '6px' }}></div>
                    
                    {error ? (
                        <div className="py-5">
                            <div className="bg-light-danger text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4 wave-animation" 
                                style={{ width: '80px', height: '80px' }}>
                                <i className="ti ti-alert-triangle" style={{ fontSize: '42px', fill: 'currentColor' }}></i>
                            </div>
                            <h4 className="fw-extrabold text-dark mb-2">Enlace no disponible</h4>
                            <p className="text-muted small px-3 mb-0">{error}</p>
                        </div>
                    ) : wasSuccessful ? (
                        
                        <div className="py-5 animate__animated animate__zoomIn animate__faster">
                            <div className="bg-light-success text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm" 
                                style={{ width: '85px', height: '85px', boxShadow: '0 8px 24px rgba(34, 197, 94, 0.2)' }}>
                                <i className="ti ti-circle-check" style={{ fontSize: '45px', fill: 'currentColor' }}></i>
                            </div>
                            <h4 className="fw-extrabold text-dark mb-2">¡Calificación Enviada!</h4>
                            <p className="text-muted small px-4 mb-0">
                                Tu opinión es vital para mantener la excelencia en <strong className="text-dark">{comercio?.nombre || 'nuestro comercio'}</strong>. ¡Te esperamos pronto!
                            </p>
                        </div>
                    ) : (
                        
                        <form onSubmit={manejarEnvio} className="pt-2">
                            
                            {/* 1. TÍTULO PRINCIPAL ARRIBA */}
                            <h4 className="fw-extrabold text-dark mb-4" style={{ letterSpacing: '-0.5px' }}>¿Cómo estuvo tu atención?</h4>

                            {/* 2. REACOMODO CON INTEGRACIÓN DE LIGHTBOX EN LA FOTO */}
                            <div className="d-flex align-items-center gap-3 text-start mb-4 px-1">
                                <div className="position-relative flex-shrink-0">
                                    {urlFoto ? (
                                        <div 
                                            className="p-0-5 rounded-circle bg-white shadow-sm border cursor-zoom-in" 
                                            style={{ width: '68px', height: '68px' }}
                                            onClick={() => setImagenAmpliada(urlFoto)}
                                        >
                                            <img 
                                                src={urlFoto} 
                                                className="w-100 h-100 rounded-circle object-cover" 
                                                alt={nombreEspecialista}
                                                onError={(e) => {
                                                    (e.target as HTMLElement).style.display = 'none';
                                                    const parent = (e.target as HTMLElement).parentElement;
                                                    if(parent) {
                                                        parent.classList.remove('cursor-zoom-in');
                                                        parent.innerHTML = `<div class="w-100 h-100 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary-gradient fs-4">${inicialEspecialista}</div>`;
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-extrabold shadow-sm animate__animated animate__scaleIn" 
                                             style={{ width: '65px', height: '65px', fontSize: '22px', background: 'linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%)' }}>
                                            {inicialEspecialista}
                                        </div>
                                    )}
                                    <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1-5 shadow-sm"></span>
                                </div>

                                <div className="d-flex flex-column">
                                    <span className="text-muted small lh-sm">Tu opinión ayuda a calificar el desempeño de:</span>
                                    <strong className="text-dark fw-bold text-uppercase mt-0-5" style={{ fontSize: '14.5px', letterSpacing: '-0.2px' }}>
                                        {nombreEspecialista}
                                    </strong>
                                </div>
                            </div>

                            {/* 3. DETALLE DEL SERVICIO */}
                            <div className="bg-light-subtle rounded-3 p-3 mb-4 border border-light text-start d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-primary-light text-primary p-2 rounded-3">
                                        <i className="ti ti-scissors fs-4"></i>
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark small" style={{ fontSize: '13.5px' }}>{nombreServicio}</div>
                                        {fechaServicio && <div className="text-muted style-date">{fechaServicio}</div>}
                                    </div>
                                </div>
                                {totalServicio && (
                                    <div className="fw-extrabold text-dark" style={{ fontSize: '14px' }}>
                                        {totalServicio}
                                    </div>
                                )}
                            </div>

                            {/* 4. ESTRELLAS INTERACTIVAS */}
                            <div className="d-flex flex-column align-items-center mb-4">
                                <div className="d-flex justify-content-center gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((estrella) => {
                                        const activo = estrella <= (hoverRating || data.estrellas);
                                        return (
                                            <button
                                                key={estrella}
                                                type="button"
                                                className="btn p-0 border-0 focus-none star-button"
                                                onClick={() => setData('estrellas', estrella)}
                                                onMouseEnter={() => setHoverRating(estrella)}
                                                onMouseLeave={() => setHoverRating(0)}
                                            >
                                                <i className={`ti ti-star star-icon ${activo ? 'active' : 'inactive'}`} 
                                                   style={{ fontSize: '42px' }}></i>
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className={`small fw-bold text-capitalize ${(data.estrellas > 0 || hoverRating > 0) ? 'text-primary' : 'text-muted opacity-50'}`} style={{ fontSize: '12px', transition: 'color 0.2s' }}>
                                    {getLabelEstrellas(hoverRating || data.estrellas)}
                                </span>
                            </div>

                            {/* 5. COMENTARIO CON ICONO */}
                            <div className="mb-4 text-start">
                                <label className="form-label text-dark fw-bold small ps-1 mb-1" style={{ fontSize: '12.5px' }}>
                                    ¿Quieres dejar un mensaje, observación, comentario o aspécto para mejorar? <span className="text-muted fw-normal fs-7">(Opcional)</span>
                                </label>
                                <div className="position-relative">
                                    <textarea
                                        className="form-control rounded-3 border-light bg-light-subtle small custom-input text-area-icon-padding"
                                        rows={3}
                                        placeholder="Escribe tu opinión sobre el especialista o el servicio..."
                                        maxLength={500}
                                        value={data.comentario}
                                        onChange={(e) => setData('comentario', e.target.value)}
                                        style={{ fontSize: '13px', resize: 'none' }}
                                    ></textarea>
                                    <div className="position-absolute top-0 start-0 pt-2-5 ps-3 text-muted opacity-50">
                                        <i className="ti ti-message-2 fs-4"></i>
                                    </div>
                                </div>
                            </div>

                            {/* 6. BOTÓN DE ENVÍO */}
                            <button
                                type="submit"
                                disabled={processing || data.estrellas === 0}
                                className="btn w-100 fw-bold text-white rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 border-0 bg-primary-gradient btn-submit-luxury"
                                style={{ height: '48px' }}
                            >
                                {processing ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    <>
                                        Confirmar calificación 
                                        <i className="ti ti-circle-check fs-5"></i>
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* ========================================================================= */}
            {/* MODAL LIGHTBOX PARA AMPLIAR LA FOTO DE PERFIL */}
            {/* ========================================================================= */}
            {imagenAmpliada && (
                <div 
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate__animated animate__fadeIn"
                    style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.82)', 
                        zIndex: 3000, 
                        backdropFilter: 'blur(6px)',
                        transition: 'all 0.2s ease'
                    }}
                    onClick={() => setImagenAmpliada(null)}
                >
                    <div className="position-relative text-center p-3 animate__animated animate__zoomIn animate__faster" onClick={(e) => e.stopPropagation()}>
                        {/* Botón Cerrar */}
                        <button 
                            className="btn btn-sm btn-dark rounded-circle position-absolute d-flex align-items-center justify-content-center shadow" 
                            style={{ top: '-15px', right: '-15px', width: '34px', height: '34px', padding: 0, border: '2px solid rgba(255,255,255,0.2)' }}
                            onClick={() => setImagenAmpliada(null)}
                        >
                            <i className="ti ti-x fs-4"></i>
                        </button>
                        
                        {/* Imagen Ampliada */}
                        <img 
                            src={imagenAmpliada} 
                            className="img-fluid rounded-4 shadow-lg border border-dark" 
                            style={{ maxHeight: '70vh', maxWidth: '85vw', objectFit: 'contain' }}
                            alt={nombreEspecialista}
                        />
                        
                        {/* Nombre del especialista */}
                        <div className="text-white fw-bold mt-3 fs-5 text-uppercase" style={{ letterSpacing: '0.5px' }}>
                            {nombreEspecialista}
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{ __html: `
                .bg-light-gradient {
                    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
                }
                .bg-primary-gradient {
                    background: linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%) !important;
                }
                .bg-primary-light {
                    background-color: rgba(36, 210, 219, 0.1) !important;
                }
                .bg-light-success { background-color: #e8f5e9 !important; }
                .bg-light-danger { background-color: #ffebee !important; }
                
                .star-button {
                    transition: transform 0.1s ease-in-out;
                    background: transparent !important;
                }
                .star-button:hover {
                    transform: scale(1.15);
                }
                .star-icon {
                    display: inline-block;
                    transition: all 0.15s ease-in-out;
                }
                .star-icon.active {
                    color: #ffb703 !important;
                    fill: #ffb703 !important;
                    filter: drop-shadow(0 2px 4px rgba(255, 183, 3, 0.25));
                }
                .star-icon.inactive {
                    color: #cbd5e1 !important;
                    fill: transparent !important;
                }
                
                .object-cover { object-fit: cover !important; }
                .fw-extrabold { font-weight: 800 !important; }
                .fs-7 { font-size: 11px !important; }
                .shadow-md { box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
                .style-date { font-size: 11px; font-weight: 500; }
                
                .focus-none:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
                
                .cursor-zoom-in {
                    cursor: zoom-in !important;
                }
                
                .custom-input {
                    transition: all 0.2s ease-in-out;
                    background-color: #fafafa;
                }
                .custom-input:focus {
                    border-color: #24D2DB !important;
                    box-shadow: 0 0 0 3px rgba(36, 219, 215, 0.12) !important;
                    background-color: #fff;
                }
                .text-area-icon-padding {
                    padding: 0.65rem 0.75rem 0.65rem 2.5rem !important;
                }
                .pt-2-5 { padding-top: 0.7rem !important; }
                .p-0-5 { padding: 0.15rem !important; }
                .mt-0-5 { margin-top: 0.15rem !important; }
                .p-1-5 { padding: 0.22rem !important; }
                
                .btn-submit-luxury {
                    transition: all 0.25s ease;
                }
                .btn-submit-luxury:disabled {
                    background: #cbd5e1 !important;
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .btn-submit-luxury:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(36, 210, 219, 0.3) !important;
                }
                
                @keyframes pulse-wave {
                    0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.2); }
                    70% { box-shadow: 0 0 0 12px rgba(220, 53, 69, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
                }
                .wave-animation {
                    animation: pulse-wave 2s infinite;
                }
            `}} />
        </AppLandingLayout>
    );
}