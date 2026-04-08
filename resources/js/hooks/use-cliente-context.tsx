import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ClienteContextType {
    openModalCliente: (onSuccess?: (cliente: any) => void) => void;
    closeModalCliente: () => void;
}

const ClienteModalContext = createContext<ClienteContextType | undefined>(undefined);

export const ClienteModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modoRegistro, setModoRegistro] = useState(false);
    const [buscando, setBuscando] = useState(false);
    const [termino, setTermino] = useState('');
    const [resultados, setResultados] = useState<any[]>([]);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [onSuccessCallback, setOnSuccessCallback] = useState<((cliente: any) => void) | null>(null);

    const inputBusquedaRef = useRef<HTMLInputElement>(null);

    // Estado del Formulario
    const [nuevoCliente, setNuevoCliente] = useState({
        tipoidentificacion_id: 10,
        sexo_id: 48,
        identificacion: '',
        fechanacimiento: '1990-01-01',
        nombre: '',
        apellido: '',
        telefonomovil: '',
        email: ''
    });

    // Función para buscar clientes (Debounce sugerido)
    const buscarClientes = async (val: string) => {
        setTermino(val);
        if (val.length < 3) {
            setResultados([]);
            return;
        }
        setBuscando(true);
        try {
            // Ajusta esta URL a tu endpoint real de búsqueda
            const response = await axios.get(route('api.personas.buscar'), {
                params: { term: val }
            });
            setResultados(response.data);
        } catch (error) {
            console.error("Error buscando clientes", error);
        } finally {
            setBuscando(false);
        }
    };

    const openModalCliente = (onSuccess?: (cliente: any) => void) => {
        if (onSuccess) setOnSuccessCallback(() => onSuccess);
        setIsOpen(true);
        setModoRegistro(false);
        setTermino('');
        setResultados([]);
        // Focus al input de búsqueda después de un breve delay
        setTimeout(() => inputBusquedaRef.current?.focus(), 300);
    };

    const closeModalCliente = () => {
        setIsOpen(false);
        setModoRegistro(false);
        setNuevoCliente({ tipoidentificacion_id: 10, identificacion: '', sexo_id: 48, fechanacimiento: '1990-01-01', nombre: '', apellido: '', telefonomovil: '', email: '' });
    };

    const handleSelectCliente = (cliente: any) => {
        if (onSuccessCallback) onSuccessCallback(cliente);
        closeModalCliente();
    };

    const handleCrearCliente = async () => {
        setLoadingRegistro(true);
        try {
            const response = await axios.post(route('api.personas.store'), nuevoCliente);
            toast.success('Cliente creado con éxito');
            if (onSuccessCallback) onSuccessCallback(response.data);
            closeModalCliente();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error al crear cliente');
        } finally {
            setLoadingRegistro(false);
        }
    };

    return (
        <ClienteModalContext.Provider value={{ openModalCliente, closeModalCliente }}>
            {children}

            {isOpen && (
                <div className="modal fade show d-block animate__animated animate__fadeIn" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold text-white mb-0">
                                    <i className={modoRegistro ? "ti ti-user-plus me-2" : "ti ti-users me-2"}></i>
                                    {modoRegistro ? 'Registrar Cliente Nuevo' : 'Búsqueda de clientes'}
                                </h5>
                                <button type="button" className="btn-close" onClick={closeModalCliente}>X</button>
                            </div>

                            <div className="modal-body p-4 bg-light-subtle">
                                {!modoRegistro ? (
                                    <>
                                        <div className="form-group mb-4">
                                            <label className="form-label fw-bold small text-muted">Documento, nombre o teléfono</label>
                                            <div className="input-group input-group-merge shadow-sm">
                                                <span className="input-group-text bg-white border-0">
                                                    {buscando ? <div className="spinner-border spinner-border-sm text-primary"></div> : <i className="ti ti-search text-muted"></i>}
                                                </span>
                                                <input 
                                                    ref={inputBusquedaRef}
                                                    type="text" 
                                                    className="form-control border-0 bg-white" 
                                                    placeholder="Escribe al menos 3 caracteres..." 
                                                    value={termino}
                                                    onChange={(e) => buscarClientes(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="results-container" style={{ minHeight: '150px', maxHeight: '350px', overflowY: 'auto' }}>
                                            {resultados.length > 0 ? (
                                                <div className="list-group list-group-flush border rounded shadow-sm bg-white">
                                                    {resultados.map((cliente) => (
                                                        <button 
                                                            key={cliente.id}
                                                            className="list-group-item list-group-item-action py-3 d-flex align-items-center"
                                                            onClick={() => handleSelectCliente(cliente)}
                                                        >
                                                            <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold">
                                                                {cliente.round.toUpperCase()}
                                                            </div>
                                                            <div className="flex-grow-1">
                                                                <h6 className="mb-0 fw-bold">{cliente.nombre} {cliente.apellido}</h6>
                                                                <small className="text-muted">
                                                                    <i className="ti ti-id me-1"></i>{cliente.identificacion} 
                                                                    <span className="mx-2">|</span>
                                                                    <i className="ti ti-mail me-1"></i>{cliente.email || 'Sin correo'}
                                                                    <span className="mx-2">|</span>
                                                                    <i className="ti ti-phone me-1"></i>{cliente.telefonomovil || 'Sin telefono'}
                                                                </small>
                                                            </div>
                                                            <i className="ti ti-chevron-right text-muted"></i>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                !buscando && termino.length >= 3 && (
                                                    <div className="text-center py-4">
                                                        <i className="ti ti-mood-empty fs-1 text-muted mb-2"></i>
                                                        <p className="text-muted small">No se encontraron resultados para "{termino}"</p>
                                                        <button 
                                                            className="btn btn-primary rounded-pill px-4 btn-sm"
                                                            onClick={() => {
                                                                setModoRegistro(true);
                                                                setNuevoCliente({...nuevoCliente, nombre: termino});
                                                            }}
                                                        >
                                                            <i className="ti ti-plus me-1"></i> Crear nuevo cliente
                                                        </button>
                                                    </div>
                                                )
                                            )}

                                            {termino.length < 3 && (
                                                <div className="text-center py-5 opacity-50">
                                                    <i className="ti ti-keyboard fs-1 mb-2"></i>
                                                    <p className="mb-0">Empieza a escribir para buscar...</p>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="row g-3 animate__animated animate__fadeIn">
                                        {/* FORMULARIO */}
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Identificación *</label>
                                            <input type="text" className="form-control" value={nuevoCliente.identificacion} onChange={e => setNuevoCliente({...nuevoCliente, identificacion: e.target.value})} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Fecha Nacimiento *</label>
                                            <input type="date" className="form-control" value={nuevoCliente.fechanacimiento} onChange={e => setNuevoCliente({...nuevoCliente, fechanacimiento: e.target.value})} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Nombre *</label>
                                            <input type="text" className="form-control" value={nuevoCliente.nombre} onChange={e => setNuevoCliente({...nuevoCliente, nombre: e.target.value})} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Apellido *</label>
                                            <input type="text" className="form-control" value={nuevoCliente.apellido} onChange={e => setNuevoCliente({...nuevoCliente, apellido: e.target.value})} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Teléfono *</label>
                                            <input type="text" className="form-control" value={nuevoCliente.telefonomovil} onChange={e => setNuevoCliente({...nuevoCliente, telefonomovil: e.target.value})} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label small fw-bold">Email</label>
                                            <input type="email" className="form-control" value={nuevoCliente.email} onChange={e => setNuevoCliente({...nuevoCliente, email: e.target.value})} />
                                        </div>
                                        
                                        <div className="col-12 mt-4">
                                            <button className="btn btn-primary w-100 py-2 fw-bold" onClick={handleCrearCliente} disabled={loadingRegistro}>
                                                {loadingRegistro ? 'Guardando...' : 'Guardar y Seleccionar'}
                                            </button>
                                            <button className="btn btn-link w-100 text-muted small mt-2" onClick={() => setModoRegistro(false)}>
                                                Volver a la búsqueda
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </ClienteModalContext.Provider>
    );
};

export const useClienteModal = () => {
    const context = useContext(ClienteModalContext);
    if (!context) throw new Error('useClienteModal debe usarse dentro de ClienteModalProvider');
    return context;
};