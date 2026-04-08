import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast'; // Opcional para avisar al usuario

interface Props {
    data: any;
    setData: any;
    errors: Record<string, string>;
    tpidentificacionList: Record<string, string>;
    sexosList: Record<string, string>;
    ocupacionesList: Record<string, string>;
    estadosList: Record<string, string>;
}

export default function Fields({ data, setData, errors, tpidentificacionList = {},  sexosList = {},  ocupacionesList = {},  estadosList = {}  }: Props) {
    const [buscandoIdentificacion, setBuscandoIdentificacion] = useState(false);

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
                toast.success('Persona encontrada. Rellenando datos...');

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
                    fechaingreso: data.fechaingreso || '',    
                    ocupacion_id: p[0].ocupacion_id || '',
                    estado_id: data.estado_id || '',                 
                    observaciones: data.observaciones || '', 
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
                            onBlur={(e) => consultarPersona(e.target.value)} // <--- AQUÍ DISPARA LA BÚSQUEDA
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
            <h5 className="mb-3">Información Laboral</h5>
            <div className="row">
                {/* Fecha de Ingreso */}
                <div className="col-md-6">
                    <div className="form-group">
                        <label className="form-label">Fecha de ingreso</label>
                        <input 
                            type="date" 
                            className={`form-control ${errors.fechaingreso ? 'is-invalid' : ''}`}
                            value={data.fechaingreso || ''}
                            onChange={e => setData('fechaingreso', e.target.value)}
                        />
                        {errors.fechaingreso && <div className="invalid-feedback">{errors.fechaingreso}</div>}
                    </div>
                </div>

                {/* Estado (Activo/Inactivo) */}
                <div className="col-md-6">
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

                {/* Observaciones */}
                <div className="col-md-12 mt-3">
                    <div className="form-group">
                        <label className="form-label">Observaciones internas</label>
                        <textarea 
                            className={`form-control ${errors.observaciones ? 'is-invalid' : ''}`}
                            rows={3}
                            value={data.observaciones || ''}
                            onChange={e => setData('observaciones', e.target.value)}
                            placeholder="Notas sobre el contrato, especialidad, etc."
                        />
                    </div>
                </div>
            </div>
        </>
    );
}