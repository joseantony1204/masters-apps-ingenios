import React from 'react';
import { useCancelarCita } from '@/hooks/use-cancelar-cita';

interface Props {
    cita: any;
    show: boolean;
    estadosList: Record<string, string>;
    onClose: () => void;
}

export default function CitasModalCancelar({ cita, show, estadosList, onClose }: Props) {
    const { form, handleCancelarSubmit } = useCancelarCita(cita);

    if (!show || !cita) return null;

    return (
        <>
            {/* Backdrop manual para oscurecer el fondo */}
            <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
            
            <div 
                className="modal fade show" 
                style={{ display: 'block', zIndex: 1060 }} 
                tabIndex={-1} 
                role="dialog"
                aria-modal="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <form onSubmit={(e) => handleCancelarSubmit(e, onClose)} className="modal-content border-0 shadow-lg">
                        <div className="modal-header bg-danger text-white p-3">
                            <div className="d-flex align-items-center gap-2">
                                <i className="ti ti-ban fs-3"></i>
                                <h5 className="modal-title fw-bold mb-0">Cancelar Cita #{form.data.codigo}</h5>
                            </div>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        
                        <div className="modal-body p-4">
                            <div className="alert alert-light-danger border-0 small mb-4 text-danger">
                                <i className="ti ti-info-circle me-2"></i>
                                <strong>¿Estás seguro?</strong> Esta acción liberará el espacio en la agenda de forma inmediata.
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase">Estado de Cancelación</label>
                                <select 
                                    className={`form-select ${form.errors.estado_id ? 'is-invalid' : ''}`}
                                    value={form.data.estado_id}
                                    onChange={e => form.setData('estado_id', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un motivo...</option>
                                    {Object.entries(estadosList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {form.errors.estado_id && <div className="invalid-feedback">{form.errors.estado_id}</div>}
                            </div>

                            <div className="mb-0">
                                <label className="form-label fw-bold small text-uppercase">Motivo detallado</label>
                                <textarea 
                                    className={`form-control ${form.errors.motivo_cancelacion ? 'is-invalid' : ''}`}
                                    rows={3}
                                    placeholder="Explica brevemente por qué se cancela..."
                                    value={form.data.motivo_cancelacion}
                                    onChange={e => form.setData('motivo_cancelacion', e.target.value)}
                                    required
                                ></textarea>
                                {form.errors.motivo_cancelacion && <div className="invalid-feedback">{form.errors.motivo_cancelacion}</div>}
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0">
                            <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                                Cerrar
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-danger px-4 shadow-sm"
                                disabled={form.processing}
                            >
                                {form.processing ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <i className="ti ti-ban me-2"></i>
                                )}
                                Confirmar Cancelación
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}