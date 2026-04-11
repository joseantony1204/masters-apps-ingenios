import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Cupon {
    id: number;
    codigo: string;
    personas?: {
        id: number;
        identificacion: string;
        personasnaturales?: {
            nombrecompleto: string;
        }
    };
    usos_actuales: number;
    fechavence: string;
}

export default function GestionarCupones({ promo, onClose }: { promo: any, onClose: () => void }) {
    const [cupones, setCupones] = useState<Cupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Cargamos los cupones específicos de esta promoción
        axios.get(route('cfpromociones.cupones', promo.id))
            .then(res => {
                setCupones(res.data);
                setLoading(false);
            });
    }, [promo.id]);

    const getNombreCliente = (cupon: Cupon) => {
        // Navegamos la relación: personas -> personasnaturales
        return cupon.personas?.personasnaturales?.nombrecompleto || 'Público / Lote';
    };

    const copiarCodigo = (codigo: string) => {
        navigator.clipboard.writeText(codigo);
        // Opcional: Podrías disparar una notificación tipo Toast aquí
        alert(`Copiado: ${codigo}`); 
    };

    const eliminarCupon = (id: number, usado: number) => {
        if (usado > 0) {
            alert("No puedes eliminar un cupón que ya ha sido utilizado.");
            return;
        }
    
        if (confirm("¿Estás seguro de eliminar este código?")) {
            // Usamos axios para no cerrar el modal al refrescar con Inertia
            axios.delete(route('cfcupones.destroy', id))
                .then(() => {
                    // Filtramos el estado local para que desaparezca de la tabla inmediatamente
                    setCupones(prev => prev.filter(c => c.id !== id));
                })
                .catch(err => console.error("Error al eliminar", err));
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title fw-bold text-white">
                            <i className="ti ti-ticket me-2"></i> Cupones: {promo.nombre}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    <div className="modal-body p-0" style={{ minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}>
                        {loading ? (
                            <div className="text-center p-5">Cargando cupones...</div>
                        ) : (
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Código</th>
                                        <th>Cliente</th>
                                        <th>Estado</th>
                                        <th>Vencimiento</th>
                                        <th className="text-end pe-4">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cupones.map(cupon => (
                                        <tr key={cupon.id}>
                                            <td className="ps-4"><code className="fw-bold text-primary">{cupon.codigo}</code></td>
                                            <td>
                                                <div>
                                                    <div className="fw-semibold">{getNombreCliente(cupon)}</div>
                                                    <small className="text-muted">{cupon.personas?.identificacion || 'N/A'}</small>
                                                </div>
                                            </td>
                                            <td>
                                                {cupon.usos_actuales ? 
                                                    <span className="badge bg-light-secondary text-secondary">Usado</span> : 
                                                    <span className="badge bg-light-success text-success">Disponible</span>
                                                }
                                            </td>
                                            <td className="small">{cupon.fechavence || 'Sin límite'}</td>
                                            <td className="text-end pe-4">
                                                <button 
                                                    className="btn btn-sm btn-icon btn-link-info border-0"
                                                    onClick={() => copiarCodigo(cupon.codigo)}
                                                    title="Copiar código"
                                                >
                                                    <i className="ti ti-copy"></i>
                                                </button>
                                                
                                                {/* El botón de eliminar solo se ve activo si usos_actuales es 0 */}
                                                <button 
                                                    className={`btn btn-sm btn-icon border-0 ${cupon.usos_actuales > 0 ? 'text-muted opacity-50' : 'btn-link-danger'}`}
                                                    onClick={() => eliminarCupon(cupon.id, cupon.usos_actuales)}
                                                    disabled={cupon.usos_actuales > 0}
                                                    title={cupon.usos_actuales > 0 ? "No se puede eliminar" : "Eliminar cupón"}
                                                >
                                                    <i className="ti ti-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {cupones.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center p-4 text-muted">No hay cupones generados para esta campaña.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="modal-footer bg-light">
                        <small className="me-auto text-muted">Total: {cupones.length} cupones</small>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}