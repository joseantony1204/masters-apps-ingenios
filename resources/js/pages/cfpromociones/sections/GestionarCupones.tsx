import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 8; // Aumentado un poco para mejor visualización

    useEffect(() => {
        axios.get(route('cfpromociones.cupones', promo.id))
            .then(res => {
                setCupones(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(" Error al cargar cupones", err);
                setLoading(false);
            });
    }, [promo.id]);

    // Resetear a la página 1 cuando se hace una búsqueda
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda]);

    const getNombreCliente = (cupon: Cupon) => {
        return cupon.personas?.personasnaturales?.nombrecompleto || 'Público / Lote';
    };

    // Lógica de filtrado
    const cuponesFiltrados = cupones.filter(cupon => {
        const query = busqueda.toLowerCase();
        const nombreCliente = getNombreCliente(cupon).toLowerCase();
        const codigo = cupon.codigo.toLowerCase();
        const identificacion = cupon.personas?.identificacion?.toLowerCase() || '';

        return nombreCliente.includes(query) || 
               codigo.includes(query) || 
               identificacion.includes(query);
    });

    // Lógica de Paginación
    const totalPaginas = Math.ceil(cuponesFiltrados.length / itemsPorPagina);
    const ultimoItem = paginaActual * itemsPorPagina;
    const primerItem = ultimoItem - itemsPorPagina;
    const cuponesPaginados = cuponesFiltrados.slice(primerItem, ultimoItem);

    // Función de Paginación Inteligente
    const obtenerPaginas = (actual: number, total: number) => {
        const delta = 2;
        const rango = [];
        const rangoConPuntos = [];
        let l;

        for (let i = 1; i <= total; i++) {
            if (i === 1 || i === total || (i >= actual - delta && i <= actual + delta)) {
                rango.push(i);
            }
        }

        for (let i of rango) {
            if (l) {
                if (i - l === 2) {
                    rangoConPuntos.push(l + 1);
                } else if (i - l !== 1) {
                    rangoConPuntos.push('...');
                }
            }
            rangoConPuntos.push(i);
            l = i;
        }
        return rangoConPuntos;
    };

    const copiarCodigo = (codigo: string) => {
        navigator.clipboard.writeText(codigo);
        toast.success(`Copiado: ${codigo}`);
    };

    const eliminarCupon = (id: number, usado: number) => {
        if (usado > 0) {
            toast.error("No puedes eliminar un cupón que ya ha sido utilizado.");
            return;
        }
        if (confirm("¿Estás seguro de eliminar este código?")) {
            axios.delete(route('cfcupones.destroy', id))
                .then(() => {
                    setCupones(prev => prev.filter(c => c.id !== id));
                    toast.success('Cupón eliminado');
                })
                .catch(err => console.error("Error al eliminar", err));
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                    {/* Header */}
                    <div className="modal-header bg-dark text-white">
                        <h5 className="modal-title fw-bold text-white">
                            <i className="ti ti-ticket me-2"></i> Cupones: {promo.nombre}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    {/* Buscador */}
                    <div className="bg-light p-3 border-bottom">
                        <div className="input-group">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="ti ti-search text-muted"></i>
                            </span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 ps-0" 
                                placeholder="Buscar por código, cliente o identificación..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                            {busqueda && (
                                <button className="btn btn-outline-secondary" onClick={() => setBusqueda('')}>
                                    <i className="ti ti-x"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="modal-body p-0" style={{ minHeight: '350px' }}>
                        {loading ? (
                            <div className="text-center p-5">
                                <div className="spinner-border text-primary mb-2" role="status"></div>
                                <div className="text-muted">Cargando cupones...</div>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive" style={{ maxHeight: '400px' }}>
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="table-light sticky-top">
                                            <tr>
                                                <th className="ps-4">Código</th>
                                                <th>Cliente</th>
                                                <th>Estado</th>
                                                <th>Vencimiento</th>
                                                <th className="text-end pe-4">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cuponesPaginados.map(cupon => (
                                                <tr key={cupon.id}>
                                                    <td className="ps-4">
                                                        <code className="fw-bold text-primary fs-6" style={{ cursor: 'pointer' }} onClick={() => copiarCodigo(cupon.codigo)}>
                                                            {cupon.codigo}
                                                        </code>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="fw-semibold text-dark">{getNombreCliente(cupon)}</div>
                                                            <small className="text-muted">{cupon.personas?.identificacion || 'Sin ID'}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {cupon.usos_actuales > 0 ? 
                                                            <span className="badge bg-light-secondary text-secondary">Usado</span> : 
                                                            <span className="badge bg-light-success text-success">Disponible</span>
                                                        }
                                                    </td>
                                                    <td className="small text-muted">
                                                        {cupon.fechavence ? new Date(cupon.fechavence).toLocaleDateString() : 'Sin límite'}
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        <div className="d-flex justify-content-end gap-1">
                                                            <button 
                                                                className="btn btn-sm btn-icon btn-light-info border-0"
                                                                onClick={() => copiarCodigo(cupon.codigo)}
                                                                title="Copiar código"
                                                            >
                                                                <i className="ti ti-copy fs-5"></i>
                                                            </button>
                                                            <button 
                                                                className={`btn btn-sm btn-icon border-0 ${cupon.usos_actuales > 0 ? 'btn-light-secondary text-muted opacity-50' : 'btn-light-danger'}`}
                                                                onClick={() => eliminarCupon(cupon.id, cupon.usos_actuales)}
                                                                disabled={cupon.usos_actuales > 0}
                                                                title={cupon.usos_actuales > 0 ? 'No se puede eliminar' : 'Eliminar'}
                                                            >
                                                                <i className="ti ti-trash fs-5"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {cuponesFiltrados.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="text-center p-5 text-muted">
                                                        <i className="ti ti-info-circle d-block fs-1 mb-2 opacity-25"></i>
                                                        {busqueda ? `No se encontraron resultados para "${busqueda}"` : "No hay cupones generados."}
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginación Inteligente */}
                                {cuponesFiltrados.length > itemsPorPagina && (
                                    <div className="d-flex justify-content-between align-items-center mt-auto px-4 py-3 border-top bg-white">
                                        <div className="text-muted x-small">
                                            Mostrando <strong>{primerItem + 1}</strong> a <strong>{Math.min(ultimoItem, cuponesFiltrados.length)}</strong> de {cuponesFiltrados.length}
                                        </div>
                                        
                                        <nav>
                                            <ul className="pagination pagination-sm mb-0">
                                                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                                    <button className="page-link shadow-none" onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}>
                                                        <i className="ti ti-chevron-left"></i>
                                                    </button>
                                                </li>

                                                {obtenerPaginas(paginaActual, totalPaginas).map((p, index) => (
                                                    <li key={index} className={`page-item ${p === paginaActual ? 'active' : ''} ${p === '...' ? 'disabled' : ''}`}>
                                                        <button 
                                                            className="page-link shadow-none" 
                                                            onClick={() => typeof p === 'number' && setPaginaActual(p)}
                                                        >
                                                            {p}
                                                        </button>
                                                    </li>
                                                ))}

                                                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                                    <button className="page-link shadow-none" onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}>
                                                        <i className="ti ti-chevron-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="modal-footer bg-light border-top-0">
                        <small className="me-auto text-muted fw-medium">
                            Total: {cupones.length} cupones registrados
                        </small>
                        <button type="button" className="btn btn-outline-dark btn-sm fw-bold px-3" onClick={onClose}>Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}