import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

// 1. Definimos la interfaz del Formulario con la firma de índice
interface FormProps {
    id?: number;
    numero: string;
    fecha: string;
    prefijo: string;
    desde: number;
    hasta: number;
    actual: number;
    advertirescacez: number;
    descripcion: string;
    fechafinal: string;
    comercio_id: string | number;
    estado: string | number;
    
    // ESTA LÍNEA ES LA CLAVE: Permite que useForm maneje los datos internamente
    [key: string]: string | number | boolean | undefined; 
}

interface Props {
    resolucionesInitial?: FormProps[];
}

export default function Resoluciones({ resolucionesInitial = [] }: Props) {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editData, setEditData] = useState<FormProps | null>(null);

    // 2. Configuración inicial del formulario
    const { data, setData, post, put, processing, reset, errors } = useForm<FormProps>({
        numero: '',
        fecha: '',
        prefijo: '',
        desde: 0,
        hasta: 0,
        actual: 0,
        advertirescacez: 0, 
        descripcion: '',
        fechafinal: '',
        comercio_id: '',
        estado: 1,
    });

    const handleCreate = () => {
        setEditData(null);
        reset();
        setView('form');
    };

    const handleEdit = (resolucion: FormProps) => {
        setEditData(resolucion);
        // Mapeo seguro de datos para evitar nulos
        setData({
            numero: resolucion.numero ?? '', 
            fecha: resolucion.fecha ?? '',
            prefijo: resolucion.prefijo ?? '',
            desde: Number(resolucion.desde) ?? 0,
            hasta: Number(resolucion.hasta) ?? 0,
            actual: Number(resolucion.actual) ?? 0,
            advertirescacez: resolucion.advertirescacez ? 1 : 0, 
            descripcion: resolucion.descripcion ?? '',
            fechafinal: resolucion.fechafinal ?? '',
            comercio_id: resolucion.comercio_id ?? '',
            estado: resolucion.estado ?? 1,
        });
        setView('form');
    };

    const handleDelete = (id?: number) => {
        if (id && confirm('¿Seguro que quiere eliminar este elemento?')) {
            router.delete(route('ftresoluciones.destroy', id));
        }
    };

    const toggleEstado = (id?: number) => {
        if (id) {
            router.patch(route('ftresoluciones.updateEstado', id), {}, {
                preserveScroll: true,
            });
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editData && editData.id) {
            put(route('ftresoluciones.update', editData.id), { 
                onSuccess: () => { setView('list'); reset(); } 
            });
        } else {
            post(route('ftresoluciones.store'), { 
                onSuccess: () => { setView('list'); reset(); } 
            });
        }
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {view === 'list' ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h6 className="fw-bold mb-0 text-dark">Resoluciones de Facturación</h6>
                            <p className="text-muted small mb-0">Control de rangos numeración DIAN</p>
                        </div>
                        <button onClick={handleCreate} className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
                            <i className="ti ti-plus me-1"></i> Nueva Resolución
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 text-muted small fw-bold">RESOLUCIÓN / PREFIJO</th>
                                    <th className="border-0 text-muted small fw-bold text-center">RANGO</th>
                                    <th className="border-0 text-muted small fw-bold text-center">PROGRESO</th>
                                    <th className="border-0 text-muted small fw-bold">VIGENCIA</th>
                                    <th className="border-0 text-muted small fw-bold text-center">ESTADO</th>
                                    <th className="border-0 text-muted small fw-bold text-end">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resolucionesInitial.map((res) => {
                                    const diff = res.hasta - res.desde;
                                    const progreso = diff > 0 ? Math.round(((res.actual - res.desde) / diff) * 100) : 0;
                                    const porcentaje = Math.min(Math.max(progreso, 0), 100);

                                    return (
                                        <tr key={res.id}>
                                            <td>
                                                <div className="fw-bold text-primary">{res.prefijo} {res.numero}</div>
                                                <small className="text-muted">Fecha: {res.fecha}</small>
                                                <br/>
                                                <small className="text-muted small">ID: {res.id}</small>
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-light text-dark border">{res.desde} - {res.hasta}</span>
                                            </td>
                                            <td className="text-center" style={{ minWidth: '120px' }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress w-100" style={{ height: '6px' }}>
                                                        <div className={`progress-bar ${porcentaje > 90 ? 'bg-danger' : 'bg-success'}`} 
                                                             style={{ width: `${porcentaje}%` }}></div>
                                                    </div>
                                                    <small className="fw-bold">{porcentaje}%</small>
                                                </div>
                                                <small className="text-muted small" style={{fontSize: '10px'}}>Actual: {res.actual}</small>
                                            </td>
                                            <td>
                                                <div className="small">Vence: <span className="fw-bold">{res.fechafinal}</span></div>
                                            </td>
                                            <td className="text-center">
                                                <span 
                                                    onClick={() => toggleEstado(res.id)}
                                                    className={`badge rounded-pill shadow-sm px-3 py-2 ${
                                                        Number(res.estado) === 1 ? 'bg-light-success text-success' : 'bg-light-danger text-danger'
                                                    }`}
                                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                    <i className={`ti ti-${Number(res.estado) === 1 ? 'check' : 'x'} me-1`}></i>
                                                    {Number(res.estado) === 1 ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button onClick={() => handleEdit(res)} className="btn btn-icon btn-light-primary border-0 btn-sm me-1 rounded-circle">
                                                    <i className="ti ti-edit fs-5"></i>
                                                </button>
                                                <button onClick={() => handleDelete(res.id)} className="btn btn-icon btn-light-danger border-0 btn-sm rounded-circle">
                                                    <i className="ti ti-trash fs-5"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <form onSubmit={submit} className="row g-3 p-2">
                    <div className="col-12 mb-2">
                        <h6 className="fw-bold d-flex align-items-center">
                            <i className="ti ti-arrow-left me-2 text-primary" style={{cursor:'pointer'}} onClick={() => setView('list')}></i>
                            {editData ? 'Editar Resolución' : 'Configurar Nueva Resolución'}
                        </h6>
                    </div>

                    <div className="col-md-8">
                        <label className="form-label small fw-bold">Número de Resolución</label>
                        <input type="text" className="form-control border-0 bg-light shadow-none" 
                               value={data.numero} onChange={e => setData('numero', e.target.value)} placeholder="Ej: 187600000..." />
                        {errors.numero && <small className="text-danger">{errors.numero}</small>}
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Prefijo</label>
                        <input type="text" className="form-control border-0 bg-light shadow-none text-uppercase" 
                               value={data.prefijo} onChange={e => setData('prefijo', e.target.value)} placeholder="Ej: SETT" />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Número Inicial (Desde)</label>
                        <input type="number" className="form-control border-0 bg-light shadow-none" 
                               value={data.desde} onChange={e => setData('desde', Number(e.target.value))} />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Número Final (Hasta)</label>
                        <input type="number" className="form-control border-0 bg-light shadow-none" 
                               value={data.hasta} onChange={e => setData('hasta', Number(e.target.value))} />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-primary">Comenzar en (Actual)</label>
                        <input type="number" className="form-control border-0 bg-light shadow-none fw-bold" 
                               value={data.actual} onChange={e => setData('actual', Number(e.target.value))} />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Fecha de Expedición</label>
                        <input type="date" className="form-control border-0 bg-light shadow-none" 
                               value={data.fecha} onChange={e => setData('fecha', e.target.value)} />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Fecha de Vencimiento</label>
                        <input type="date" className="form-control border-0 bg-light shadow-none" 
                               value={data.fechafinal} onChange={e => setData('fechafinal', e.target.value)} />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold text-muted d-block mb-2">Advertir escasez</label>
                        <div className="form-check form-switch custom-switch-v2">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch"
                                checked={data.advertirescacez === 1}
                                onChange={e => setData('advertirescacez', e.target.checked ? 1 : 0)}
                                style={{ 
                                    width: '45px', 
                                    height: '22px', 
                                    cursor: 'pointer',
                                    border: 'none'
                                }}
                            />
                            <label className="form-check-label small text-muted ms-2 mt-1">
                                {data.advertirescacez === 1 ? 'Activado' : 'Desactivado'}
                            </label>
                        </div>
                    </div>

                    <div className="col-12 pt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4 rounded-pill fw-bold" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Resolución'}
                        </button>
                        <button type="button" onClick={() => setView('list')} className="btn btn-light px-4 rounded-pill fw-bold text-muted">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}