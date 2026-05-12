import React, { useState, useEffect } from 'react';

interface CajasModalCierreProps {
    show: boolean;
    onClose: () => void;
    resumen: any;
    onConfirm: (data: { efectivo_real: number, diferencia: number }) => void;
    processing: boolean;
}

const CajasModalCierre = ({ show, onClose, resumen, onConfirm, processing }: CajasModalCierreProps) => {
    const [efectivoReal, setEfectivoReal] = useState<number>(0);
    const [diferencia, setDiferencia] = useState<number>(0);

    useEffect(() => {
        if (resumen) {
            setDiferencia(efectivoReal - resumen.total_sistema);
        }
    }, [efectivoReal, resumen]);

    if (!show || !resumen) return null;

    const formatMoney = (amount: number) => 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '30px' }}>
                    <div className="modal-body p-4">
                        
                        {/* HEADER CON NOMBRE DEL CAJERO */}
                        <div className="text-center mb-4">
                            <div className="bg-light-primary text-primary d-inline-block p-3 rounded-circle mb-2">
                                <i className="ti ti-user-check fs-1"></i>
                            </div>
                            <h5 className="fw-900 mb-0">{resumen.cajero}</h5>
                            <p className="text-muted small">Cierre de Turno • {resumen.fecha_apertura}</p>
                        </div>

                        {/* ENTRADAS: VENTAS + PROPINAS */}
                        <div className="mb-3">
                            <label className="fw-bold small text-uppercase text-primary mb-2">
                                <i className="ti ti-arrow-up-right me-1"></i> Entradas
                            </label>
                            <div className="bg-light rounded-3 p-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted small">Base Inicial:</span>
                                    <span className="fw-bold">{formatMoney(resumen.base_inicial)}</span>
                                </div>
                                {resumen.ventas_detalle?.map((pago: any) => (
                                    <div className="d-flex justify-content-between mb-1" key={pago.nombre}>
                                        <span className="text-muted small">Venta {pago.nombre}:</span>
                                        <span className="fw-bold">{formatMoney(pago.total)}</span>
                                    </div>
                                ))}
                                {/* FILA DE PROPINAS */}
                                <div className="d-flex justify-content-between pt-1 border-top mt-1" style={{ borderStyle: 'dotted' }}>
                                    <span className="text-muted small italic">Total Propinas:</span>
                                    <span className="fw-bold text-info">+{formatMoney(resumen.propinas)}</span>
                                </div>
                            </div>
                        </div>

                        {/* SALIDAS */}
                        {(resumen.gastos > 0 || resumen.nomina > 0) && (
                            <div className="mb-3">
                                <label className="fw-bold small text-uppercase text-danger mb-2">
                                    <i className="ti ti-arrow-down-left me-1"></i> Salidas
                                </label>
                                <div className="bg-light-danger rounded-3 p-3" style={{ backgroundColor: 'rgba(255, 0, 0, 0.03)' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-muted small">Gastos / Avances / Vales:</span>
                                        <span className="fw-bold text-danger">-{formatMoney(resumen.gastos)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Nómina :</span>
                                        <span className="fw-bold text-danger">-{formatMoney(resumen.nomina)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SALDO ESPERADO */}
                        <div className="p-3 mb-3 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: '#e0f7f9', border: '1px dashed #1FBCC5' }}>
                            <span className="fw-900 text-dark small">DINERO EN SISTEMA:</span>
                            <span className="fw-900 text-primary fs-4">{formatMoney(resumen.total_sistema)}</span>
                        </div>

                        {/* INPUT CONTEO FÍSICO */}
                        <div className="mb-3 card border-primary rounded-3 p-3 shadow-none" style={{ borderWidth: '2px' }}>
                            <label className="fw-900 small text-uppercase text-center text-primary mb-2">Dinero Físico en Caja</label>
                            <input 
                                type="number" 
                                className="form-control border-0 text-center fw-900 p-0" 
                                placeholder="$ 0"
                                value={efectivoReal || ''}
                                onChange={(e) => setEfectivoReal(Number(e.target.value))}
                                style={{ fontSize: '32px', boxShadow: 'none' }}
                            />
                        </div>

                        {/* RESULTADO */}
                        <div className={`p-3 rounded-3 mb-4 text-center ${diferencia === 0 ? 'bg-light-success' : diferencia > 0 ? 'bg-light-info' : 'bg-light-danger'}`}>
                            <span className="d-block small fw-bold text-uppercase opacity-75">
                                {diferencia === 0 ? 'Caja Cuadrada' : diferencia > 0 ? 'Sobrante' : 'Faltante'}
                            </span>
                            <h3 className={`fw-900 mb-0 ${diferencia === 0 ? 'text-success' : diferencia > 0 ? 'text-info' : 'text-danger'}`}>
                                {formatMoney(diferencia)}
                            </h3>
                        </div>

                        <div className="d-flex gap-2">
                            <button onClick={() => onConfirm({ efectivo_real: efectivoReal, diferencia: diferencia })} className="btn btn-primary w-100 rounded-pill py-3 fw-bold" disabled={processing}>
                                {processing ? <span className="spinner-border spinner-border-sm"></span> : "FINALIZAR ARQUEO"}
                            </button>
                            <button onClick={onClose} className="btn btn-light w-100 rounded-pill py-3 fw-bold text-muted">CANCELAR</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CajasModalCierre;