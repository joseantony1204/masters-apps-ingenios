import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router} from '@inertiajs/react';

interface Plan {
    id: number;
    nombre: string;
    codigo: string; // Días
    observacion: string; // Precio
}

interface Props {
    planes: Plan[];
}

export default function Index({ planes }: Props) {
    
    const formatPrice = (price: string) => {
        const value = parseFloat(price);
        if (value === 0) return 'Gratis';
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getPlanMeta = (nombre: string) => {
        const n = nombre.toUpperCase();
        if (n.includes('FREE')) return { icon: 'ti-gift', theme: 'success' };
        if (n.includes('MENSUAL')) return { icon: 'ti-calendar', theme: 'primary' };
        if (n.includes('TRIMESTRAL')) return { icon: 'ti-package', theme: 'info' };
        if (n.includes('SEMESTRAL')) return { icon: 'ti-star', theme: 'warning' };
        if (n.includes('ANUAL')) return { icon: 'ti-crown', theme: 'dark' };
        return { icon: 'ti-circle', theme: 'secondary' };
    };

    const handleSelectPlan = (plan: Plan) => {
        // Opción A: Abrir un Modal de confirmación (Recomendado)
        // Opción B: Ir directo a una ruta de checkout
        router.post(route('scsuscripciones.checkout'), {
            plan_id: plan.id,
            // Aquí podrías enviar cupones de descuento si tienes
        });
    };

    return (
        <AppMainLayout>
            <Head title="Planes" />

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('scplanes.index')}> Membresías</a></li>
                                <li className="breadcrumb-item" aria-current="page">Listado</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <div className="page-header-title"><h2 className="mb-0">Membresías disponibles</h2></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header Estilo Premium */}
            <div className="row justify-content-center py-2">
                <div className="col-md-8 text-center">
                    <h2 className="display-5 fw-black text-dark mb-3">Membresías <span className="text-primary text-gradient">Exclusivas</span></h2>
                    <p className="lead text-muted">Impulsa tu comercio con herramientas de marketing automatizado.</p>
                </div>
            </div>

            {/* Contenedor de Tarjetas con Lógica Bootstrap */}
            <div className="row g-4 justify-content-center align-items-center pb-5">
                {planes.map((plan) => {
                    const meta = getPlanMeta(plan.nombre);
                    const isSemestral = plan.codigo === "180";
                    
                    return (
                        <div className={`col-sm-12 col-md-6 col-lg-4 col-xl ${isSemestral ? 'z-3' : 'z-1'}`} 
                             key={plan.id} 
                             style={{ maxWidth: '330px' }}>
                            
                            <div className={`card h-100 border-0 transition-gold ${isSemestral ? 'shadow-premium scale-up border-gradient' : 'shadow-sm'}`}>
                                
                                {isSemestral && (
                                    <div className="ribbon-premium">
                                        <span>MEJOR VALOR</span>
                                    </div>
                                )}

                                <div className="card-body p-4 p-xl-5 text-center d-flex flex-column">
                                    <div className={`avtar avtar-xl bg-light-${meta.theme} rounded-circle mb-4 mx-auto`}>
                                        <i className={`ti ${meta.icon} f-30 text-${meta.theme}`}></i>
                                    </div>

                                    <h5 className="text-uppercase fw-bold text-muted mb-2 tracking-widest f-12">{plan.nombre}</h5>
                                    
                                    <div className="mb-4">
                                        <span className="h1 fw-black text-dark mb-0">{formatPrice(plan.observacion)}</span>
                                        <div className="f-13 text-muted mt-1 fw-medium">{plan.codigo} días de servicio</div>
                                    </div>

                                    <hr className="my-4 opacity-25" />

                                    <ul className="list-group list-group-flush text-start mb-5 flex-grow-1">
                                        <li className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
                                            <i className="ti ti-circle-check-filled text-success me-2 f-18"></i>
                                            <span className="text-dark f-14">Módulo de IA Cumpleaños</span>
                                        </li>
                                        <li className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
                                            <i className="ti ti-circle-check-filled text-success me-2 f-18"></i>
                                            <span className="text-dark f-14">WhatsApp Ilimitado</span>
                                        </li>
                                        <li className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
                                            <i className="ti ti-circle-check-filled text-success me-2 f-18"></i>
                                            <span className="text-dark f-14">Soporte Prioritario</span>
                                        </li>
                                    </ul>

                                    <div className="d-grid mt-auto">
                                        <button 
                                            className={`btn btn-lg fw-bold rounded-pill ${isSemestral ? 'btn-primary' : 'btn-outline-dark'}`}
                                            onClick={() => handleSelectPlan(plan)}
                                        >
                                            Seleccionar plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-black { font-weight: 900; }
                .tracking-widest { letter-spacing: 0.15em; }
                .text-gradient { background: linear-gradient(45deg, #2196F3, #047edf); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                /* Efectos de Tarjeta Premium */
                .transition-gold {
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    border-radius: 2rem;
                    background: #fff;
                }

                .transition-gold:hover {
                    transform: translateY(-10px);
                }

                .scale-up {
                    transform: scale(1.08);
                }

                .shadow-premium {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
                }

                .border-gradient {
                    border: 2px solid #2196F3 !important;
                }

                /* Cinta decorativa */
                .ribbon-premium {
                    position: absolute;
                    top: 20px;
                    right: -10px;
                    background: #FFD700;
                    color: #000;
                    padding: 5px 15px;
                    font-weight: 800;
                    font-size: 10px;
                    border-radius: 4px 0 0 4px;
                    box-shadow: -2px 2px 4px rgba(0,0,0,0.1);
                }

                .avtar.avtar-xl {
                    width: 70px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 992px) {
                    .scale-up { transform: scale(1); margin-bottom: 20px; }
                    .z-3 { z-index: 1 !important; }
                }
            `}} />
        </AppMainLayout>
    );
}