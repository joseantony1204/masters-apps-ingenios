import AppMainLayout from '@/layouts/app-main-layout';
import { useEffect } from 'react';
import axios from 'axios';

export default function Pay({ pago, plan, comercio, publicKey }: any) {

    // Ejemplo en tu componente de Suscripciones
    const handlePagar = async (subId: number, pagoId: number) => {
        try {
            const url = route('api.wompi.prepare', { suscripcionId: subId, pagoId: pagoId });
            const response = await axios.get(url);    
            const data = response.data;
    
            // Limpiamos cualquier rastro de duda en los tipos
            const checkout = new window.WidgetCheckout({
                publicKey: data.publicKey,
                currency: data.currency,
                amountInCents: data.amountInCents,
                reference: data.reference,
                // ASÍ ES COMO DEBE IR SEGÚN LA DOCUMENTACIÓN:
                signature: {
                    integrity: data.signature 
                },
                redirectUrl: route('api.wompi.resultado'), // <--- CORREGIDO 'r'edirectUrl
            });
    
            checkout.open((result: any) => {
                // El callback suele ser para lógica inmediata, 
                // pero el cierre de la transacción real lo esperamos por Webhook.
                console.log("Resultado Wompi:", result);
                if (result.transaction.status === 'APPROVED') {
                    alert('¡Pago aprobado!');
                }
            });
            
        } catch (error) {
            console.error("Error preparando el pago", error);
        }
    };

    return (
        <AppMainLayout>

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

            <div className="row justify-content-center py-5">
                <div className="col-md-6">
                    <div className="card shadow-lg border-0 overflow-hidden">
                        <div className="bg-primary p-4 text-white text-center">
                            <h4 className="mb-0 text-white">Resumen de tu orden de pago</h4>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex justify-content-between mb-3">
                                <span>Plan seleccionado:</span>
                                <span className="fw-bold">{plan.nombre}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Duración:</span>
                                <span className="fw-bold">{plan.codigo} días</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4">
                                <span className="h5">Total a pagar:</span>
                                <span className="h5 fw-black text-primary">
                                    ${new Intl.NumberFormat('es-CO').format(pago.valor)}
                                </span>
                            </div>
                            
                            <button 
                                onClick={() => handlePagar(pago.suscripcion.id,pago.id)}
                                className="btn btn-primary btn-lg w-100 rounded-pill fw-bold py-3 shadow"
                            >
                                <i className="ti ti-credit-card me-2"></i> Pagar con Wompi / PSE
                            </button>
                            
                            <p className="text-muted text-center mt-3 f-12">
                                <i className="ti ti-lock me-1"></i> Pago seguro y cifrado
                            </p>
                            <p className="text-muted text-center mt-3 f-12">
                                <a href={route('scsuscripciones.index')} className="avtar avtar-s btn-link-secondary" title="Regresar">
                                    <i className="ti ti-arrow-back f-22"></i>
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppMainLayout>
    );
}