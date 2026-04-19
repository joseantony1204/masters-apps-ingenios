import AppMainLayout from '@/layouts/app-main-layout';
import { Link, Head } from '@inertiajs/react';

interface Props {
    mensaje: string;
    transactionId: string;
}

export default function Resultado({ mensaje, transactionId }: Props) {
    return (
        <AppMainLayout>
            <Head title="Resultado del Pago" />
            
            <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <div className="col-md-6 col-lg-5">
                    <div className="card border-0 shadow-lg p-5 text-center">
                        {/* Icono animado de éxito */}
                        <div className="avtar avtar-xl bg-light-success mx-auto mb-4">
                            <i className="ti ti-circle-check f-40 text-success"></i>
                        </div>
                        
                        <h2 className="fw-black text-dark">¡Transacción Recibida!</h2>
                        
                        <div className="my-4">
                            <p className="text-muted f-16">
                                {mensaje}
                            </p>
                        </div>

                        {transactionId && (
                            <div className="alert alert-secondary border-dashed py-2 mb-4">
                                <small className="text-muted d-block">Referencia de transacción:</small>
                                <span className="fw-bold font-mono">{transactionId}</span>
                            </div>
                        )}

                        <div className="d-grid gap-3">
                            <Link href={route('dashboard')} className="btn btn-primary btn-lg rounded-pill shadow">
                                <i className="ti ti-layout-dashboard me-2"></i> Ir al Dashboard
                            </Link>
                            <Link href={route('scsuscripciones.index')} className="btn btn-link-secondary">
                                Ver mis suscripciones
                            </Link>
                        </div>
                        
                        <p className="mt-4 text-muted f-12">
                            <i className="ti ti-info-circle me-1"></i> 
                            Si tu pago fue por PSE, la activación puede tardar unos minutos.
                        </p>
                    </div>
                </div>
            </div>
        </AppMainLayout>
    );
}