// components/ModalCierreCaja.tsx
import React from 'react';

interface CajasModalCierreProps {
    show: boolean;
    onClose: () => void;
    resumen: any;
    onConfirm: () => void;
    processing: boolean;
}

const CajasModalCierre = ({ show, onClose, resumen, onConfirm, processing }: CajasModalCierreProps) => {
    if (!show || !resumen) return null;

    const formatMoney = (amount: number) => 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '25px' }}>
                    <div className="modal-body p-4">
                        <div className="text-center mb-4">
                            <div className="bg-light-danger text-danger d-inline-block p-3 rounded-circle mb-3">
                                <i className="ti ti-lock fs-1"></i>
                            </div>
                            <h5 className="fw-900">Cierre de Caja y Arqueo</h5>
                            <p className="text-muted small">Resumen de transacciones del turno actual</p>
                        </div>

                        <div className="bg-light rounded-3 p-4 mb-4">
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-muted fw-bold small text-uppercase">Base Inicial:</span>
                                <span className="fw-900 text-dark">{formatMoney(resumen.base_inicial)}</span>
                            </div>
                            
                            {resumen.ventas_detalle?.map((pago: any) => (
                                <div className="d-flex justify-content-between mb-2" key={pago.nombre}>
                                    <span className="text-muted small">Ventas ({pago.nombre}):</span>
                                    <span className="fw-bold text-dark">{formatMoney(pago.total)}</span>
                                </div>
                            ))}

                            <hr className="my-3 opacity-25" />
                            
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-900 text-primary text-uppercase small">Total en Sistema:</span>
                                <span className="fw-900 fs-4 text-primary">{formatMoney(resumen.total_sistema)}</span>
                            </div>
                        </div>

                        <div className="alert alert-warning border-0 small rounded-3 mb-4 d-flex align-items-center">
                            <i className="ti ti-alert-triangle fs-4 me-2"></i>
                            <div>
                                <strong>Atención:</strong> Al confirmar, se bloqueará el registro de nuevas facturas para esta terminal.
                            </div>
                        </div>

                        <div className="d-flex gap-3">
                            <button 
                                onClick={onConfirm} 
                                className="btn btn-danger w-100 rounded-pill py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center"
                                disabled={processing}
                            >
                                {processing ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : <i className="ti ti-lock-open me-2"></i>}
                                CONFIRMAR CIERRE
                            </button>
                            <button 
                                onClick={onClose} 
                                className="btn btn-light w-100 rounded-pill py-3 fw-bold text-muted"
                                disabled={processing}
                            >
                                CANCELAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CajasModalCierre;