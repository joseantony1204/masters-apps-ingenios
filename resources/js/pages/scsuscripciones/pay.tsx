import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import logoWompi from '../../../../public/assets/images/logos/wompi.png'; // Ajusta la ruta según tu carpeta
import logoPse from '../../../../public/assets/images/logos/pse.png'; // Ajusta la ruta según tu carpeta

interface Props {
    pago: any;
    plan: any;
    comercio: any;
}

export default function Pay({ pago, plan, comercio }: Props) {

    const handlePagar = async (subId: number, pagoId: number) => {
        const loadingToast = toast.loading('Conectando con la pasarela segura...');
        
        try {
            const url = route('api.wompi.prepare', { suscripcionId: subId, pagoId: pagoId });
            const response = await axios.get(url);    
            const data = response.data;
            
            toast.dismiss(loadingToast);

            // Verificación de existencia del Widget en el window
            if (!(window as any).WidgetCheckout) {
                toast.error('El script de Wompi no se ha cargado. Por favor recarga la página.');
                return;
            }

            const checkout = new (window as any).WidgetCheckout({
                publicKey: data.publicKey,
                currency: data.currency,
                amountInCents: data.amountInCents,
                reference: data.reference,
                signature: { integrity: data.signature },
                redirectUrl: route('scsuscripciones.resultado'), 
            });

            checkout.open((result: any) => {
                const transaction = result.transaction;
                if (transaction.status === 'APPROVED') {
                    toast.success('¡Pago procesado con éxito!');
                    setTimeout(() => router.visit(route('scsuscripciones.resultado')), 1000);
                } else if (transaction.status === 'DECLINED') {
                    toast.error('La transacción fue rechazada.');
                }
            });
            
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Error Wompi:", error);
            toast.error('Hubo un problema al generar la firma de pago.');
        }
    };

    return (
        <AppMainLayout>
            <Head title="Finalizar Pago" />

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('scsuscripciones.index')}> Suscripciones</a></li>
                                <li className="breadcrumb-item" aria-current="page">Pagos</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <div className="page-header-title"><h2 className="mb-0">Resumen de tu orden</h2></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center py-4">
                <div className="col-xxl-6 col-xl-7 col-lg-8">
                    <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '16px' }}>
                        {/* Header con Branding */}
                        <div className="bg-dark p-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h4 className="text-white mb-0">Resumen de Pago</h4>
                                    <small className="text-white-50">Orden #{pago.id}</small>
                                </div>
                                <div className="avtar avtar-m bg-light-primary">
                                    <i className="ti ti-shield-lock f-20 text-primary"></i>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            {/* Card de Producto */}
                            <div className="d-flex align-items-center mb-4 p-3 border rounded-3 bg-light">
                                <div className="avtar avtar-s bg-primary text-white me-3">
                                    <i className="ti ti-crown f-18"></i>
                                </div>
                                <div className="flex-grow-1">
                                    <h6 className="mb-0">Plan {plan.nombre}</h6>
                                    <small className="text-muted">Acceso por {plan.codigo} días</small>
                                </div>
                                <div className="text-end">
                                    <span className="fw-black text-primary h5">
                                        ${new Intl.NumberFormat('es-CO').format(pago.valor)}
                                    </span>
                                </div>
                            </div>

                            {/* Desglose */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span>${new Intl.NumberFormat('es-CO').format(pago.valor)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="text-muted">Cargo por servicio</span>
                                    <span className="text-success">Gratis</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center pt-2">
                                    <span className="h5 mb-0 fw-bold">Total a pagar:</span>
                                    <span className="h3 mb-0 fw-black text-primary">
                                        ${new Intl.NumberFormat('es-CO').format(pago.valor)}
                                    </span>
                                </div>
                            </div>

                            {/* Botón Principal */}
                            <button 
                                onClick={() => handlePagar(pago.suscripcion_id, pago.id)}
                                className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold shadow transition-all"
                                style={{ fontSize: '1.1rem' }}
                            >
                                <i className="ti ti-lock-check me-2"></i> Pagar con Wompi
                            </button>

                            {/* Sección Logos Locales */}
                            <div className="mt-4 text-center border-top pt-4">
                                <div className="d-flex justify-content-center align-items-center gap-4 mb-3 grayscale-filter opacity-75">
                                    <img 
                                        src={logoWompi}
                                        alt="Wompi" 
                                        style={{ height: '48px', objectFit: 'contain' }} 
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                    <img 
                                        src={logoPse}
                                        alt="PSE" 
                                        style={{ height: '48px', objectFit: 'contain' }}
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                </div>
                                <div className="bg-light-success d-inline-block px-3 py-1 rounded-pill">
                                    <small className="text-success fw-medium">
                                        <i className="ti ti-shield-check me-1"></i> 
                                        Transacción Protegida por SSL
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-3">
                        <Link href={route('scsuscripciones.index')} className="text-muted text-decoration-none f-12 hover-primary">
                            <i className="ti ti-arrow-narrow-left me-1"></i> Cancelar y volver a suscripciones
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .grayscale-filter img {
                    filter: grayscale(100%);
                    transition: all 0.3s;
                }
                .grayscale-filter img:hover {
                    filter: grayscale(0%);
                    opacity: 1 !important;
                }
                .fw-black { font-weight: 900; }
                .hover-primary:hover { color: var(--bs-primary) !important; }
            `}</style>
        </AppMainLayout>
    );
}