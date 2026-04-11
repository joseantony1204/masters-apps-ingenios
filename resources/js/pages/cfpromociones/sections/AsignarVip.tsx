import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

interface Props {
    promo: any;
    onClose: () => void;
}

export default function AsignarVip({ promo, onClose }: Props) {
    const [search, setSearch] = useState('');
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing } = useForm({
        promocion_id: promo.id,
        persona_id: '',
    });

    // Buscador en tiempo real (Debounce sugerido para producción)
    useEffect(() => {
        if (search.length > 2) {
            setLoading(true);
            axios.get(route('api.personas.buscar'), { params: { term: search } })
                .then(res => {
                    setPersonas(res.data);
                    setLoading(false);
                });
        }
    }, [search]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cfcupones.asignarVip'), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg bg-dark text-white">
                    <form onSubmit={submit}>
                        <div className="modal-header border-secondary">
                            <h5 className="modal-title text-white d-flex align-items-center gap-2">
                                <i className="ti ti-diamond text-danger"></i> 
                                Asignar Beneficio VIP
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                        </div>

                        <div className="modal-body p-4">
                            <p className="small text-muted mb-4">
                                Estás asignando la promo <strong>{promo.nombre}</strong> ({Number(promo.valor).toFixed(2)}%) a un cliente exclusivo.
                            </p>

                            <div className="mb-4">
                                <label className="form-label small fw-bold">Buscar Cliente (Nombre o WhatsApp)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-secondary border-0 text-white">
                                        <i className="ti ti-search"></i>
                                    </span>
                                    <input 
                                        type="text" 
                                        className="form-control bg-dark border-secondary text-white shadow-none"
                                        placeholder="Escribe para buscar..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="list-group list-group-flush border-top border-secondary overflow-auto" style={{ maxHeight: '200px' }}>
                                {loading && <div className="text-center py-3 small">Buscando...</div>}
                                
                                {personas.map((persona: any) => (
                                    <button
                                        key={persona.id}
                                        type="button"
                                        onClick={() => setData('persona_id', persona.id)}
                                        className={`list-group-item list-group-item-action bg-dark text-white border-secondary d-flex justify-content-between align-items-center ${data.persona_id === persona.id ? 'active bg-danger border-danger' : ''}`}
                                    >
                                        <div>
                                            <div className="fw-bold">{persona.nombre} {persona.apellido}</div>
                                            <small className={data.persona_id === persona.id ? 'text-white' : 'text-muted'}>{persona.telefonomovil}</small>
                                        </div>
                                        {data.persona_id === persona.id && <i className="ti ti-check"></i>}
                                    </button>
                                ))}

                                {search.length > 2 && personas.length === 0 && !loading && (
                                    <div className="text-center py-3 small text-muted">No se encontraron clientes.</div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer border-secondary">
                            <button type="button" className="btn btn-outline-light btn-sm" onClick={onClose}>Cerrar</button>
                            <button 
                                type="submit" 
                                className="btn btn-danger btn-sm px-4 fw-bold" 
                                disabled={processing || !data.persona_id}
                            >
                                {processing ? 'Asignando...' : 'Confirmar Asignación VIP'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}