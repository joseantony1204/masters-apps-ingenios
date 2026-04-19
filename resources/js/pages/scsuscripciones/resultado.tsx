import AppMainLayout from '@/layouts/app-main-layout';
import { Link, Head} from '@inertiajs/react';

interface Props {
    mensaje: string;
    transactionId: string;
}

export default function Resultado({ mensaje, transactionId }: Props) {
    return (
        <AppMainLayout>
             <Head title="Resultado del Pago" />
            <div className="row justify-content-center py-5 text-center">
                <div className="col-md-6">
                    <div className="card border-0 shadow-lg p-5">
                        <div className="avtar avtar-xl bg-light-success mx-auto mb-4">
                            <i className="ti ti-circle-check f-40 text-success"></i>
                        </div>
                        <h2 className="fw-black">¡Pago Procesado!</h2>
                        <p className="text-muted">
                            Estamos validando tu transacción. Tu servicio se activará automáticamente en unos minutos.
                        </p>
                        <div className="d-grid gap-2 mt-4">
                            <Link href={route('dashboard')} className="btn btn-primary btn-lg rounded-pill">
                                Ir al Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
           
            
            <div className="p-8 bg-white shadow-xl rounded-2xl max-w-md text-center">
                <div className="mb-4 text-green-500">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Transacción Recibida!</h1>
                <p className="text-gray-600 mb-6">{mensaje}</p>
                
                {transactionId && (
                    <p className="text-sm text-gray-400 mb-6">
                        Ref. de transacción: <span className="font-mono">{transactionId}</span>
                    </p>
                )}

                <Link
                    href={route('scsuscripciones.index')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
        </AppMainLayout>
    );
}