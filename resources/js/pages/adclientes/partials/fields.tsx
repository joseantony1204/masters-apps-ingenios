import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast'; // Opcional para avisar al usuario

interface Props {
    data: any;
    setData: any; // Ajustado para aceptar el objeto de Inertia
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
    
    const [buscando, setBuscando] = useState(false);
    const [buscandoIdentificacion, setBuscandoIdentificacion] = useState(false);
    const [resultadosClientes, setResultadosClientes] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [nombreReferido, setNombreReferido] = useState("");
    const [resultados, setResultados] = useState<any[]>([]);
    
    // --- NUEVA FUNCIÓN: BUSCAR POR IDENTIFICACIÓN Y RELLENAR ---
    const consultarPersona = async (identificacion: string) => {
        if (identificacion.length < 5) return;

        setBuscandoIdentificacion(true);
        try {
            // Usamos la ruta que definimos para la modal global
            const response = await axios.get(route('api.personas.buscar'), {
                params: { term: identificacion }
            });
            if (response.data) {
                const p = response.data;
                //toast.success('Persona encontrada. Rellenando datos...');

                // IMPORTANTE: Mapeamos los campos exactos que espera tu 'data'
                const nuevosDatos = {
                    tipoidentificacion_id: p[0].tipoidentificacion_id || data.tipoidentificacion_id,
                    nombre: p[0].nombre || '',
                    segundonombre: p[0].segundonombre || '',
                    apellido: p[0].apellido || '',
                    segundoapellido: p[0].segundoapellido || '',
                    fechanacimiento: p[0].fechanacimiento || '',
                    email: p[0].email || '',
                    telefonomovil: p[0].telefonomovil || '',
                    sexo_id: p[0].sexo_id || '',
                    ocupacion_id: p[0].ocupacion_id || '',
                };

                // En Inertia, si pasas un objeto a setData, actualiza múltiples campos
                setData((prev: any) => ({
                    ...prev,
                    ...nuevosDatos
                }));
            }
        } catch (error) {
            console.error("Error al consultar identificación", error);
        } finally {
            setBuscandoIdentificacion(false);
        }
    };

    // --- FUNCIONES BÚSQUEDA REFERIDO ---
    const buscarCliente = async (query: string) => {
        setNombreReferido(query);
        if (query.length < 3) {
            setResultadosClientes([]);
            setMostrarSugerencias(false);
            return;
        }

        setBuscando(true);
        try {
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
        setData('referido_id', cliente.id);
        setNombreReferido(`${cliente.nombres} ${cliente.apellidos}`);
        setMostrarSugerencias(false);
    };

    return (
        <>
            <h5 className="mb-3 fw-bold text-primary">Información Personal</h5>
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="fw-bold small">Tipo Identificación</label>
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
                    <div className="form-group position-relative">
                        <label className="fw-bold small">Identificación</label>
                        <div className="input-group">
                            <input 
                                type="text" 
                                className={`form-control ${errors.identificacion ? 'is-invalid' : ''}`}
                                value={data.identificacion || ''}
                                onChange={e => setData('identificacion', e.target.value)}
                                onBlur={(e) => consultarPersona(e.target.value)} // <--- AQUÍ DISPARA LA BÚSQUEDA
                                placeholder="Cédula / DNI" 
                            />
                            {buscandoIdentificacion && (
                                <span className="input-group-text bg-white">
                                    <div className="spinner-border spinner-border-sm text-primary"></div>
                                </span>
                            )}
                        </div>
                        {errors.identificacion && <div className="invalid-feedback d-block">{errors.identificacion}</div>}
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <label className="fw-bold small">Fecha de nacimiento</label>
                        <input 
                            type="date" 
                            className={`form-control ${errors.fechanacimiento ? 'is-invalid' : ''}`}
                            value={data.fechanacimiento || ''}
                            onChange={e => setData('fechanacimiento', e.target.value)}
                        />
                    </div>
                    {errors.fechanacimiento && <div className="invalid-feedback d-block">{errors.fechanacimiento}</div>}
                </div>

                {/* Nombres y Apellidos */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="fw-bold small">Nombre</label>
                        <input type="text" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} value={data.nombre || ''} onChange={e => setData('nombre', e.target.value)} />
                    </div>
                    {errors.nombre && <div className="invalid-feedback d-block">{errors.nombre}</div>}
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="fw-bold small">Segundo Nombre</label>
                        <input type="text" className="form-control" value={data.segundonombre || ''} onChange={e => setData('segundonombre', e.target.value)} />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="fw-bold small">Apellido</label>
                        <input type="text" className={`form-control ${errors.apellido ? 'is-invalid' : ''}`} value={data.apellido || ''} onChange={e => setData('apellido', e.target.value)} />
                    </div>
                    {errors.apellido && <div className="invalid-feedback d-block">{errors.apellido}</div>}
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="fw-bold small">Segundo Apellido</label>
                        <input type="text" className="form-control" value={data.segundoapellido || ''} onChange={e => setData('segundoapellido', e.target.value)} />
                    </div>
                </div>

                {/* Email, Teléfono, Sexo y Ocupación */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label className="fw-bold small">Correo electrónico</label>
                        <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} value={data.email || ''} onChange={e => setData('email', e.target.value)} />
                    </div>
                    {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                </div>
                <div className="col-md-3">
                    <div className="form-group position-relative">
                        <label className="fw-bold small">Teléfono whatsapp</label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0"><i className="ti ti-brand-whatsapp text-muted"></i></span>
                            <input 
                                type="text" 
                                className={`form-control border-start-0 ${errors.telefonomovil ? 'is-invalid' : ''}`} value={data.telefonomovil || ''}
                                onChange={e => setData('telefonomovil', e.target.value)}
                                placeholder="Escribe numero de whatsapp"
                                autoComplete="off"
                            />
                            {errors.telefonomovil && <div className="invalid-feedback d-block">{errors.telefonomovil}</div>}
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="fw-bold small">Sexo</label>
                        <select className={`form-control ${errors.sexo_id ? 'is-invalid' : ''}`} value={data.sexo_id} onChange={e => setData('sexo_id', e.target.value)}>
                            <option value="">- Elige -</option>
                            {Object.entries(sexosList).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.sexo_id && <div className="invalid-feedback d-block">{errors.sexo_id}</div>}
                    </div>
                </div> 

                <div className="col-md-3">
                    <div className="form-group">
                        <label className="fw-bold small">Ocupación</label>
                        <select className="form-control" value={data.ocupacion_id} onChange={e => setData('ocupacion_id', e.target.value)}>
                            <option value="">- Elige -</option>
                            {Object.entries(ocupacionesList).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div> 
            </div>

            <hr className="my-4 opacity-25" />
            
            <h5 className="mb-3 fw-bold text-primary">Información adicional</h5>
            <div className="row g-3">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="fw-bold small">Fecha de Ingreso</label>
                        <input 
                            type="date" 
                            className="form-control"
                            value={data.fechaingreso || ''}
                            onChange={e => setData('fechaingreso', e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group position-relative">
                        <label className="fw-bold small">Referido por:</label>
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0"><i className="ti ti-users text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control border-start-0" 
                                value={nombreReferido}
                                onChange={(e) => buscarCliente(e.target.value)}
                                placeholder="Escribe nombre o identificación..."
                                autoComplete="off"
                            />
                        </div>
                        
                        {mostrarSugerencias && resultadosClientes.length > 0 && (
                            <ul className="list-group position-absolute w-100 shadow-lg z-3 mt-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {resultadosClientes.map((c: any) => (
                                    <li 
                                        key={c.id} 
                                        className="list-group-item list-group-item-action py-2"
                                        onClick={() => seleccionarCliente(c)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="fw-bold small">{c.nombres} {c.apellidos}</div>
                                        <small className="text-muted">{c.identificacion}</small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="form-group">
                        <label className="fw-bold small">Estado</label>
                        <select
                            className={`form-control ${errors.estado_id ? 'is-invalid' : ''}`}
                            value={data.estado_id}
                            onChange={e => setData('estado_id', e.target.value)}
                        >
                            <option value="">- Elige -</option>
                            {Object.entries(estadosList).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                        {errors.estado_id && <div className="invalid-feedback d-block">{errors.estado_id}</div>}
                    </div>
                </div> 
            </div>
        </>
    );
}