import { useForm } from '@inertiajs/react';
import React, { useEffect } from 'react';

interface ModalProps {
    onClose: () => void;
    promo?: any;
}

export default function Create({ promo, onClose }: ModalProps) {
    // Usamos el hook de Inertia para manejar el formulario
    const { data, setData, put, post, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
        valor: '',
        tipo_descuento: 'porcentaje',
        categoria: '',
        compra_minima: '',
        fecha_fin: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (promo) {
            put(route('cfpromociones.update', promo.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('cfpromociones.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    // ESCUCHA SI LLEGA UNA PROMO Y RESETEA EL FORMULARIO
    useEffect(() => {
        if (promo) {
            setData({
                nombre: promo.nombre || '',
                descripcion: promo.descripcion || '',
                valor: promo.valor || '',
                tipo_descuento: promo.tipo_descuento || 'porcentaje',
                categoria: promo.categoria || 'recurrente',
                compra_minima: promo.compra_minima || '',
                fecha_fin: promo.fecha_fin || '',
            });
        }
    }, [promo]); // Se ejecuta cada vez que 'promo' cambia

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    <form onSubmit={submit}>
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title fw-bold text-white">
                                <i className={`ti ti-${promo ? 'edit' : 'plus'} me-2`}></i>
                                {promo ? `Editando: ${promo.nombre}` : 'Nueva Campaña'}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="row">
                                {/* Nombre de la Campaña */}
                                <div className="col-md-8 mb-3">
                                    <label className="form-label fw-bold">Nombre de la Campaña</label>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                        placeholder="Ej: Promo Verano, Descuento Cumpleaños..."
                                        value={data.nombre}
                                        onChange={e => setData('nombre', e.target.value)}
                                    />
                                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                                </div>

                                {/* Categoría */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Categoría</label>
                                    <select 
                                        className="form-select"
                                        value={data.categoria}
                                        onChange={e => setData('categoria', e.target.value)}
                                    >
                                        <option value="general">General</option>
                                        <option value="recurrente">Recurrentes</option>
                                        <option value="cumple">Cumpleaños</option>
                                        <option value="flash">Relámpago (Flash)</option>
                                        <option value="vip">VIP</option>
                                    </select>
                                </div>

                                {/* Descripción */}
                                <div className="col-12 mb-3">
                                    <label className="form-label fw-bold">Descripción (Opcional)</label>
                                    <textarea 
                                        className="form-control" 
                                        rows={2}
                                        placeholder="Detalles sobre cuándo aplica esta promo..."
                                        value={data.descripcion}
                                        onChange={e => setData('descripcion', e.target.value)}
                                    ></textarea>
                                </div>

                                {/* Valor y Tipo */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Valor Descuento</label>
                                    <div className="input-group">
                                        <input 
                                            type="number" 
                                            className={`form-control ${errors.valor ? 'is-invalid' : ''}`}
                                            value={data.valor}
                                            onChange={e => setData('valor', e.target.value)}
                                        />
                                        {errors.valor && <div className="invalid-feedback">{errors.valor}</div>}
                                        <select 
                                            className="form-select" 
                                            style={{ maxWidth: '90px' }}
                                            value={data.tipo_descuento}
                                            onChange={e => setData('tipo_descuento', e.target.value)}
                                        >
                                            <option value="porcentaje">%</option>
                                            <option value="fijo">$</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Límite de Usos */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Límite Global de Usos</label>
                                    <input 
                                        type="number" 
                                        className="form-control"
                                        placeholder="Ej: 100"
                                        value={data.compra_minima}
                                        onChange={e => setData('compra_minima', e.target.value)}
                                    />
                                    <small className="text-muted text-xs italic">Dejar vacío para ilimitado</small>
                                </div>

                                {/* Fecha de Expiración (Solo si es Flash o General) */}
                                <div className="col-md-4 mb-3">
                                    <label className="form-label fw-bold">Fecha de Expiración</label>
                                    <input 
                                        type="date" 
                                        className="form-control"
                                        value={data.fecha_fin}
                                        onChange={e => setData('fecha_fin', e.target.value)}
                                        disabled={data.categoria === 'cumple'}
                                    />
                                </div>
                            </div>

                            {/* Alerta dinámica según categoría */}
                            {data.categoria === 'cumple' && (
                                <div className="alert alert-info border-0 shadow-none mb-0 mt-2 d-flex align-items-center">
                                    <i className="ti ti-info-circle fs-4 me-2"></i>
                                    <small>Las promociones <b>Automáticas</b> no expiran y se disparan por eventos del sistema (ej: cumpleaños).</small>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer border-0">
                            <button type="button" className="btn btn-light" onClick={onClose}>Cancelar</button>
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {promo ? 'Guardar Cambios' : 'Crear Promoción'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};