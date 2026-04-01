import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Sedes {
    id: number;
    nombre: string;
    direccion: string;
    email: string;
    telefono: string;
    ciudad: string;
    estado: number; // '1' para Activo, '0' para Inactivo
    comercio_id: number; 
}

interface Props {
    sedes: Sedes[];
}

export default function Sedes({ sedes = [] }: Props) {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editData, setEditData] = useState<Sedes | null>(null);

    // Formulario de Inertia para crear/editar
    const { data, setData, post, put, processing, reset, errors } = useForm({
        nombre: '',
        direccion: '',
        email: '',
        telefono: '',
        ciudad: '',
        estado: 0,
        comercio_id:0,
    });

    const handleCreate = () => {
        setEditData(null);
        reset();
        setView('form');
    };

    const { delete: destroy } = useForm();
    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfsedes.destroy', id));
        }
    };

    const handleEdit = (sede: Sedes) => {
        setEditData(sede);
        setData({
            nombre: sede.nombre,
            direccion: sede.direccion,
            email: sede.email,
            telefono: sede.telefono,
            ciudad: sede.ciudad,
            estado: sede.estado, // Ajustar según tus campos
            comercio_id: sede.comercio_id, 
        });
        setView('form');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editData) {
            put(route('cfsedes.update', editData.id), { onSuccess: () => setView('list') });
        } else {
            post(route('cfsedes.store'), { onSuccess: () => setView('list') });
        }
    };

    const toggleEstado = (id: number) => {
        // Usamos router.patch para una acción directa sin necesidad de useForm
        router.patch(route('cfsedes.updateEstado', id), {}, {
            preserveScroll: true, // Evita que la página salte al inicio
            onSuccess: () => {
                // Aquí puedes disparar una notificación tipo Toast
            }
        });
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {view === 'list' ? (
                <>
                    {/* Header de la sección de Sedes */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h6 className="fw-bold mb-0">Sucursales registradas</h6>
                            <small className="text-muted">Tienes {sedes.length} sedes operativas</small>
                        </div>
                        <button onClick={handleCreate} className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
                            <i className="ti ti-plus me-1"></i> Nueva Sede
                        </button>
                    </div>

                    {/* Tabla Estilizada */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle border-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 text-muted small fw-bold text-uppercase">Nombre / Ciudad</th>
                                    <th className="border-0 text-muted small fw-bold text-uppercase">Email</th>
                                    <th className="border-0 text-muted small fw-bold text-uppercase text-center">Estado</th>
                                    <th className="border-0 text-muted small fw-bold text-uppercase text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sedes.length > 0 ? (
                                    sedes.map((sede) => (
                                        <tr key={sede.id} className="border-bottom">
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light-primary text-primary p-2 rounded-circle me-3">
                                                        <i className="ti ti-map-pin fs-5"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold text-dark">{sede.nombre}</div>
                                                        <div className="text-muted small">Ciu: {sede.ciudad}</div>
                                                        <div className="text-muted small">Dir: {sede.direccion}</div>
                                                        <div className="text-muted small">Tel: {sede.telefono}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="small text-muted">{sede.email}</td>
                                            <td className="text-center">
                                                <span 
                                                    onClick={() => toggleEstado(sede.id)}
                                                    className={`badge rounded-pill shadow-sm px-3 py-2 ${
                                                        sede.estado === 1 ? 'bg-light-success text-success' : 'bg-light-danger text-danger'
                                                    }`}
                                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                    <i className={`ti ti-${sede.estado === 1 ? 'check' : 'x'} me-1`}></i>
                                                    {sede.estado === 1 ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button onClick={() => handleEdit(sede)} className="btn btn-icon btn-light-primary border-0 btn-sm me-1 rounded-circle">
                                                    <i className="ti ti-edit fs-5"></i>
                                                </button>
                                                <button onClick={() => handleDelete(sede.id)} className="btn btn-icon btn-light-danger border-0 btn-sm rounded-circle">
                                                    <i className="ti ti-trash fs-5"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-5 text-muted">
                                            <i className="ti ti-info-circle fs-1 mb-2 d-block"></i>
                                            No hay sedes registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                /* FORMULARIO DE SEDE */
                <form onSubmit={submit} className="row g-3">
                    <div className="col-12 mb-3 d-flex align-items-center justify-content-between">
                        <h6 className="fw-bold mb-0">
                            <i className="ti ti-arrow-left me-2 text-primary" style={{cursor:'pointer'}} onClick={() => setView('list')}></i>
                            {editData ? 'Editar Sede' : 'Registrar Nueva Sede'}
                        </h6>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Nombre de la sede</label>
                        <input 
                            type="text" 
                            className={`form-control border-0 bg-light ${errors.nombre ? 'is-invalid' : ''}`}
                            value={data.nombre} 
                            onChange={e => setData('nombre', e.target.value)} 
                            placeholder="Ej: Sede Norte"
                        />
                        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Ciudad</label>
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light shadow-none" 
                            value={data.ciudad} 
                            onChange={e => setData('ciudad', e.target.value)} 
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label small fw-bold">Dirección completa</label>
                        <input 
                            type="text" 
                            className={`form-control border-0 bg-light ${errors.direccion ? 'is-invalid' : ''}`}
                            value={data.direccion} 
                            onChange={e => setData('direccion', e.target.value)} 
                        />
                        {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Teléfono</label>
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light shadow-none" 
                            value={data.telefono} 
                            onChange={e => setData('telefono', e.target.value)} 
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Email</label>
                        <input 
                            type="text" 
                            className="form-control border-0 bg-light shadow-none" 
                            value={data.email} 
                            onChange={e => setData('email', e.target.value)} 
                        />
                    </div>

                    <div className="col-12 pt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4 rounded-3 fw-bold" disabled={processing}>
                            {editData ? 'Actualizar Sede' : 'Crear Sede'}
                        </button>
                        <button type="button" onClick={() => setView('list')} className="btn btn-light px-4 rounded-3 fw-bold">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}