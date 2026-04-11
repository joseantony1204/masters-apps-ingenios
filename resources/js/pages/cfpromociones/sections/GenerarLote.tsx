import React from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    promociones: any[];
    onClose: () => void;
}

export default function GenerarLote({ promociones, onClose }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        promocion_id: '',
        cantidad: 10,
        prefijo: '',
        fechavence: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cfcupones.storeLote'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <form onSubmit={submit}>
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title fw-bold text-white">
                                <i className="ti ti-layers-intersect me-2"></i>Generar Lote de Cupones
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <div className="modal-body p-4">
                            <div className="alert alert-warning border-0 small">
                                <i className="ti ti-alert-circle me-2"></i>
                                Se generarán códigos únicos aleatorios que los clientes podrán canjear.
                            </div>

                            {/* Selección de Promoción */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Seleccionar Promoción Base</label>
                                <select 
                                    className={`form-select ${errors.promocion_id ? 'is-invalid' : ''}`}
                                    value={data.promocion_id}
                                    onChange={e => setData('promocion_id', e.target.value)}
                                >
                                    <option value="">Seleccione una campaña...</option>
                                    {promociones.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} ({Number(p.valor).toFixed(0)}%)</option>
                                    ))}
                                </select>
                                {errors.promocion_id && <div className="invalid-feedback">{errors.promocion_id}</div>}
                            </div>

                            <div className="row">
                                {/* Cantidad */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Cantidad de Cupones</label>
                                    <input 
                                        type="number" 
                                        className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                                        value={data.cantidad}
                                        onChange={e => setData('cantidad', parseInt(e.target.value))}
                                        min="1"
                                        max="500"
                                    />
                                    {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}
                                </div>

                                {/* Prefijo */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Prefijo (Opcional)</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        placeholder="Ej: VERANO-"
                                        value={data.prefijo}
                                        onChange={e => setData('prefijo', e.target.value.toUpperCase())}
                                    />
                                </div>

                                {/* Fecha de Vencimiento Opcional */}
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-bold">Vencimiento Lote</label>
                                    <input 
                                        type="date" 
                                        className={`form-control ${errors.fechavence ? 'is-invalid' : ''}`}
                                        value={data.fechavence}
                                        onChange={e => setData('fechavence', e.target.value)}
                                    />
                                    <small className="text-muted x-small italic">Opcional: ignora la fecha de la promo</small>
                                </div>
                            </div>

                            <div className="bg-light p-2 rounded text-center">
                                <small className="text-muted">Ejemplo de código: </small>
                                <code className="text-primary fw-bold">
                                    {data.prefijo || 'CP-'}{Math.random().toString(36).substring(7).toUpperCase()}
                                </code>
                            </div>
                        </div>

                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-light" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-dark px-4" disabled={processing || !data.promocion_id}>
                                {processing ? 'Generando...' : 'Iniciar Generación'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}