import axios from 'axios';
import React, { useState } from 'react';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    tpidentificacionList?: Record<string, string>;
    sexosList?: Record<string, string>;
    ocupacionesList?: Record<string, string>;
    estadosList?: Record<string, string>;
}

export default function Fields({ 
    data, 
    setData, 
    errors, 
    tpidentificacionList = {},  
    sexosList = {},  
    ocupacionesList = {},  
    estadosList = {}  
}: Props) {
    
    // --- ESTADOS (Ahora dentro del componente) ---
    const [buscando, setBuscando] = useState(false);
    const [resultadosClientes, setResultadosClientes] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [nombreReferido, setNombreReferido] = useState(""); // Para mostrar el nombre en el input

    // --- FUNCIONES ---
    const buscarCliente = async (query: string) => {
        setNombreReferido(query); // Actualiza lo que el usuario ve
        
        if (query.length < 3) {
            setResultadosClientes([]);
            setMostrarSugerencias(false);
            return;
        }

        setBuscando(true);
        try {
            // Asegúrate de que la ruta 'api.clientes.buscar' esté disponible
            const response = await axios.get(route('api.clientes.buscar', { term: query }));
            setResultadosClientes(response.data);
            setMostrarSugerencias(true);
        } catch (error) {
            console.error("Error buscando cliente", error);
        } finally {
            setBuscando(false);
        }
    };

    const seleccionarCliente = (cliente: any) => {
        // En Inertia useForm, setData se usa así para un solo campo:
        setData('referido_id', cliente.id);
        
        // Actualizamos el texto visual del input
        setNombreReferido(`${cliente.nombres} ${cliente.apellidos}`);
        setMostrarSugerencias(false);
    };

return (
        <>
            <h5 className="mb-3">Información Personal</h5>
            <div className="row">
                {/* Identificación */}

                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="tipoidentificacion_id">Tipo Identificación</label>
                        <select
                        className={`form-control${errors.tipoidentificacion_id ? ' is-invalid' : ''}`}
                        value={data.tipoidentificacion_id}
                        onChange={e => setData('tipoidentificacion_id', e.target.value)}
                        >
                        <option value="">- Elige -</option>
                        {Object.entries(tpidentificacionList).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                        </select>
                        {errors.tipoidentificacion_id && <div className="invalid-feedback">{errors.tipoidentificacion_id}</div>}
                    </div>
                </div> 

                <div className="col-md-4">
                    <div className="form-group">
                        <label className="form-label">Identificación</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.identificacion ? 'is-invalid' : ''}`}
                            value={data.identificacion || ''}
                            onChange={e => setData('identificacion', e.target.value)}
                            placeholder="Cédula / DNI" 
                        />
                        {errors.identificacion && <div className="invalid-feedback">{errors.identificacion}</div>}
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <label className="form-label">Fecha de nacimiento</label>
                        <input 
                            type="date" 
                            className={`form-control ${errors.fechanacimiento ? 'is-invalid' : ''}`}
                            value={data.fechanacimiento || ''}
                            onChange={e => setData('fechanacimiento', e.target.value)}
                        />
                        {errors.fechanacimiento && <div className="invalid-feedback">{errors.fechanacimiento}</div>}
                    </div>
                </div>

                {/* Nombres */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label">Nombre</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                            value={data.nombre || ''}
                            onChange={e => setData('nombre', e.target.value)}
                        />
                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label">S. nombre</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.segundonombre ? 'is-invalid' : ''}`}
                            value={data.segundonombre || ''}
                            onChange={e => setData('segundonombre', e.target.value)}
                        />
                        {errors.segundonombre && <div className="invalid-feedback">{errors.segundonombre}</div>}
                    </div>
                </div>

                {/* Apellidos */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label">Apellido</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.apellido ? 'is-invalid' : ''}`}
                            value={data.apellido || ''}
                            onChange={e => setData('apellido', e.target.value)}
                        />
                        {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label">S. apellido</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.segundoapellido ? 'is-invalid' : ''}`}
                            value={data.segundoapellido || ''}
                            onChange={e => setData('segundoapellido', e.target.value)}
                        />
                        {errors.segundoapellido && <div className="invalid-feedback">{errors.segundoapellido}</div>}
                    </div>
                </div>

                {/* Email y Teléfono */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label">Correo electrónico</label>
                        <input 
                            type="email" 
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={data.email || ''}
                            onChange={e => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="form-label">Teléfono móvil</label>
                        <input 
                            type="text" 
                            className={`form-control ${errors.telefonomovil ? 'is-invalid' : ''}`}
                            value={data.telefonomovil || ''}
                            onChange={e => setData('telefonomovil', e.target.value)}
                        />
                        {errors.telefonomovil && <div className="invalid-feedback">{errors.telefonomovil}</div>}
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="sexo_id">Sexo</label>
                        <select
                        className={`form-control${errors.sexo_id ? ' is-invalid' : ''}`}
                        value={data.sexo_id}
                        onChange={e => setData('sexo_id', e.target.value)}
                        >
                        <option value="">- Elige -</option>
                        {Object.entries(sexosList).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                        </select>
                        {errors.sexo_id && <div className="invalid-feedback">{errors.sexo_id}</div>}
                    </div>
                </div> 

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="ocupacion_id">Ocupación</label>
                        <select
                        className={`form-control${errors.ocupacion_id ? ' is-invalid' : ''}`}
                        value={data.ocupacion_id}
                        onChange={e => setData('ocupacion_id', e.target.value)}
                        >
                        <option value="">- Elige -</option>
                        {Object.entries(ocupacionesList).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                        </select>
                        {errors.ocupacion_id && <div className="invalid-feedback">{errors.ocupacion_id}</div>}
                    </div>
                </div> 

            </div>

            <hr className="my-4" />
            <h5 className="mb-3">Información adicioal</h5>
            <div className="row">
                {/* Fecha de Ingreso */}
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="form-label">Fecha de Ingreso</label>
                        <input 
                            type="date" 
                            className={`form-control ${errors.fechaingreso ? 'is-invalid' : ''}`}
                            value={data.fechaingreso || ''}
                            onChange={e => setData('fechaingreso', e.target.value)}
                        />
                        {errors.fechaingreso && <div className="invalid-feedback">{errors.fechaingreso}</div>}
                    </div>
                </div>

                {/* BUSCADOR DE REFERIDO */}
                <div className="col-md-4">
                    <div className="form-group position-relative">
                        <label className="form-label fw-semibold small text-muted">Referido por:</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><i className="ti ti-users"></i></span>
                            <input 
                                type="text" 
                                className="form-control" 
                                value={nombreReferido}
                                onChange={(e) => buscarCliente(e.target.value)}
                                placeholder="Buscar referido..."
                                autoComplete="off"
                            />
                            {buscando && (
                                <span className="input-group-text bg-white">
                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                </span>
                            )}
                        </div>
                        
                        {/* Lista de sugerencias */}
                        {mostrarSugerencias && resultadosClientes.length > 0 && (
                            <ul className="list-group position-absolute w-100 shadow-lg z-3" style={{ top: '100%', maxHeight: '200px', overflowY: 'auto' }}>
                                {resultadosClientes.map((c: any) => (
                                    <li 
                                        key={c.id} 
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                        onClick={() => seleccionarCliente(c)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <div className="fw-bold">{c.nombres} {c.apellidos}</div>
                                            <small className="text-muted">{c.telefonomovil || 'Sin tel.'}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Estado (Activo/Inactivo) */}
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="estado_id">Estado</label>
                        <select
                        className={`form-control${errors.estado_id ? ' is-invalid' : ''}`}
                        value={data.estado_id}
                        onChange={e => setData('estado_id', e.target.value)}
                        >
                        <option value="">- Elige -</option>
                        {Object.entries(estadosList).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                        </select>
                        {errors.estado_id && <div className="invalid-feedback">{errors.estado_id}</div>}
                    </div>
                </div> 
            </div>
        </>
    );
}
