import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';

interface TerminalProps {
    id?: number;
    nombre: string;
    codigo: string;
    sede_id: string | number;
    resolucion_id: string | number;
    estado: number;
    [key: string]: any; // Firma de índice para evitar el error de FormDataType
}

interface Props {
    terminalesInitial?: any[];
    sedes: any[];
    resoluciones: any[];
}

export default function Terminales({ terminalesInitial = [], sedes, resoluciones }: Props) {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editData, setEditData] = useState<TerminalProps | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm<TerminalProps>({
        nombre: '',
        codigo: '',
        sede_id: '',
        resolucion_id: '',
        estado: 1,
    });

    const handleEdit = (terminal: TerminalProps) => {
        setEditData(terminal);
        setData({
            nombre: terminal.nombre ?? '',
            codigo: terminal.codigo ?? '',
            sede_id: terminal.sede_id ?? '',
            resolucion_id: terminal.resolucion_id ?? '',
            estado: terminal.estado ?? 1,
        });
        setView('form');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editData?.id) {
            put(route('ftterminales.update', editData.id), { onSuccess: () => setView('list') });
        } else {
            post(route('ftterminales.store'), { onSuccess: () => setView('list') });
        }
    };

    const toggleEstado = (id: number) => {
        // Usamos router.patch para una acción directa sin necesidad de useForm
        router.patch(route('ftterminales.updateEstado', id), {}, {
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
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h6 className="fw-bold mb-0 text-dark">Terminales (Cajas POS)</h6>
                            <p className="text-muted small mb-0">Equipos autorizados para facturar</p>
                        </div>
                        <button onClick={() => { setEditData(null); reset(); setView('form'); }} 
                                className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
                            <i className="ti ti-plus me-1"></i> Nueva Terminal
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 text-muted small fw-bold">EQUIPO / CÓDIGO</th>
                                    <th className="border-0 text-muted small fw-bold">SEDE ASOCIADA</th>
                                    <th className="border-0 text-muted small fw-bold">RESOLUCIÓN</th>
                                    <th className="border-0 text-muted small fw-bold text-center">ESTADO</th>
                                    <th className="border-0 text-muted small fw-bold text-end">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {terminalesInitial.map((term) => (
                                    <tr key={term.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light-info text-info p-2 rounded-3 me-3" style={{backgroundColor: '#e0f7fa'}}>
                                                    <i className="ti ti-device-desktop fs-4"></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{term.nombre}</div>
                                                    <small className="text-muted">ID POS: {term.codigo}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="text-muted small">{term.sede?.nombre || 'Sin sede'}</span></td>
                                        <td>
                                            <span className="badge bg-light-primary text-primary border-primary-subtle border">
                                                {term.resolucion?.prefijo} {term.resolucion?.numero}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                                <span 
                                                    onClick={() => toggleEstado(term.id)}
                                                    className={`badge rounded-pill shadow-sm px-3 py-2 ${
                                                        term.estado === 1 ? 'bg-light-success text-success' : 'bg-light-danger text-danger'
                                                    }`}
                                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                                >
                                                    <i className={`ti ti-${term.estado === 1 ? 'check' : 'x'} me-1`}></i>
                                                    {term.estado === 1 ? 'Activa' : 'Inactiva'}
                                                </span>
                                            </td>
                                        <td className="text-end">
                                            <button onClick={() => handleEdit(term)} className="btn btn-icon btn-light-primary btn-sm rounded-circle border-0 me-1">
                                                <i className="ti ti-edit fs-5"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <form onSubmit={submit} className="row g-4 p-2">
                    <div className="col-12 mb-2">
                        <h6 className="fw-bold d-flex align-items-center">
                            <i className="ti ti-arrow-left me-2 text-primary" style={{cursor:'pointer'}} onClick={() => setView('list')}></i>
                            {editData ? 'Editar Terminal' : 'Vincular Nueva Terminal'}
                        </h6>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Nombre de la Caja/Equipo</label>
                        <input type="text" className="form-control border-0 bg-light shadow-none py-2" 
                               value={data.nombre} onChange={e => setData('nombre', e.target.value)} placeholder="Ej: Caja Principal 01" />
                        {errors.nombre && <small className="text-danger">{errors.nombre}</small>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Código POS (DIAN)</label>
                        <input type="text" className="form-control border-0 bg-light shadow-none py-2" 
                               value={data.codigo} onChange={e => setData('codigo', e.target.value)} placeholder="Ej: P001" />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Sede donde se ubica</label>
                        <select className="form-select border-0 bg-light shadow-none py-2" 
                                value={data.sede_id} onChange={e => setData('sede_id', e.target.value)}>
                            <option value="">Seleccione una sede...</option>
                            {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Resolución a utilizar</label>
                        <select className="form-select border-0 bg-light shadow-none py-2" 
                                value={data.resolucion_id} onChange={e => setData('resolucion_id', e.target.value)}>
                            <option value="">Seleccione una resolución...</option>
                            {resoluciones.map(r => <option key={r.id} value={r.id}>{r.prefijo} - {r.numero}</option>)}
                        </select>
                    </div>

                    <div className="col-12 pt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4 rounded-pill fw-bold shadow-sm" disabled={processing}>
                            {editData ? 'Actualizar Terminal' : 'Activar Terminal'}
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