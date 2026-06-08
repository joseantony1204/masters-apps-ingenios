import React, { useState, useEffect } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import axios from 'axios';

interface TurnoProps {
    id?: number;
    codigo: string;
    descripcion: string;
    observaciones: string;
    baseinicial: number;
    fecha: string; 
    fechanaapertura: string; 
    fechanacierre?: string;
    terminal_id: string | number; 
    estado_id: number; 
    persona?: any;
    estado?: any;
    terminal?: any;
    [key: string]: any;
}

interface Props {
    // Cambiamos turnosInitial para mapear la estructura del paginador de Laravel
    turnosInitial?: {
        data: TurnoProps[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    terminales: { id: number; nombre: string }[];
}

export default function ListTurnos({ turnosInitial, terminales }: Props) {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editData, setEditData] = useState<TurnoProps | null>(null);
    
    // Extraemos la data interna del paginador con un fallback seguro
    const turnos = turnosInitial?.data || [];
    const links = turnosInitial?.links || [];

    // Estados para el Modal de Cierre
    const [showCierre, setShowCierre] = useState(false);
    const [resumenCierre, setResumenCierre] = useState<any>(null);
    const [loadingResumen, setLoadingResumen] = useState(false);
    const [turnoParaCerrar, setTurnoParaCerrar] = useState<TurnoProps | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm<TurnoProps>({
        codigo: '',
        descripcion: '',
        observaciones: '',
        baseinicial: 0,
        fecha: new Date().toISOString().split('T')[0],
        fechanaapertura: '', 
        terminal_id: '',
        estado_id: 924, 
    });

    // --- LÓGICA DE APERTURA / EDICIÓN ---
    const handleEdit = (turno: TurnoProps) => {
        setEditData(turno);
        setData({ ...turno });
        setView('form');
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editData?.id) {
            put(route('ftturnos.update', editData.id), { onSuccess: () => setView('list') });
        } else {
            post(route('ftturnos.store'), { onSuccess: () => setView('list') });
        }
    };

    // --- LÓGICA DE CIERRE ---
    const abrirModalCierre = async (turno: TurnoProps) => {
        setTurnoParaCerrar(turno);
        setLoadingResumen(true);
        try {
            const response = await axios.get(route('ftturnos.resumen', turno.id));
            setResumenCierre(response.data);
            setShowCierre(true);
        } catch (error) {
            alert("No se pudo obtener el resumen de ventas.");
        } finally {
            setLoadingResumen(false);
        }
    };

    const confirmarCierre = () => {
        if (!turnoParaCerrar) return;
        
        router.patch(route('ftturnos.cerrar', turnoParaCerrar.id), {}, {
            onSuccess: () => {
                setShowCierre(false);
                setTurnoParaCerrar(null);
            }
        });
    };

    return (
        <div className="animate__animated animate__fadeIn">
            {view === 'list' ? (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h6 className="fw-bold mb-0 text-dark">Control de Turnos y Cajas</h6>
                            <p className="text-muted small mb-0">Sesiones activas de facturación por terminal</p>
                        </div>
                        <button onClick={() => { setEditData(null); reset(); setView('form'); }} 
                                className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm">
                            <i className="ti ti-key me-1"></i> Abrir Nuevo Turno
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 text-muted small fw-bold">CÓDIGO / DESCRIPCIÓN</th>
                                    <th className="border-0 text-muted small fw-bold">TERMINAL/SEDE</th>
                                    <th className="border-0 text-muted small fw-bold">DETALLES</th>
                                    <th className="border-0 text-muted small fw-bold text-end">BASE INICIAL</th>
                                    <th className="border-0 text-muted small fw-bold text-center">ESTADO</th>
                                    <th className="border-0 text-muted small fw-bold text-end">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {turnos.length > 0 ? (
                                    turnos.map((t) => (
                                        <tr key={t.id}>
                                            <td>
                                                <div className="fw-bold text-dark">{t.codigo}</div>
                                                <small className="text-muted">{t.descripcion}</small>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">
                                                    <span className="badge bg-light-info text-info border-info-subtle border">
                                                        {t.terminal?.nombre || 'Caja '+t.terminal_id}
                                                    </span>
                                                </div>
                                                <small className="text-muted">Sede: {t.terminal?.sede?.nombre || 'Sede no encontrada'}</small>
                                            </td>
                                            <td>
                                                <div className="small fw-bold">Apertura: {t.fechaapertura}</div>
                                                <small className="text-muted">Por: {t.persona?.personasnaturales?.nombreapellido || 'N/A'}</small>
                                                <br />
                                                <small className={t.fechacierre ? "text-muted" : "text-primary fw-bold"}>
                                                    Cierre: {t.fechacierre || 'Turno en curso...'}
                                                </small>
                                            </td>
                                            <td className="text-end fw-bold text-success">
                                                ${new Intl.NumberFormat().format(t.baseinicial)}
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge rounded-pill px-3 py-2 bg-light-${t.estado?.observacion || 'secondary'} text-${t.estado?.observacion || 'secondary'}`}>
                                                    {t.estado?.nombre}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <button 
                                                    onClick={() => handleEdit(t)} 
                                                    className="avtar avtar-s btn-light-primary btn-sm rounded-circle border-0 me-1"
                                                    disabled={t.estado_id === 927}
                                                >
                                                    <i className="ti ti-edit fs-5"></i>
                                                </button>

                                                {t.estado_id !== 927 && (
                                                    <button 
                                                        onClick={() => abrirModalCierre(t)}
                                                        className="avtar avtar-s btn-link-danger btn-sm rounded-circle border-0 me-1"
                                                        disabled={loadingResumen}
                                                    >
                                                        <i className="ti ti-lock fs-5"></i>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-muted small">
                                            No se encontraron turnos registrados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- COMPONENTE DE PAGINACIÓN DE INERTIA --- */}
                    {links.length > 3 && (
                        <div className="d-flex justify-content-between align-items-center mt-3 px-2">
                            <small className="text-muted">
                                Mostrando registros del <strong>{turnosInitial?.total ? turnos.length : 0}</strong> de un total de <strong>{turnosInitial?.total}</strong>
                            </small>
                            <nav aria-label="Navegación de turnos">
                                <ul className="pagination pagination-sm mb-0 gap-1">
                                    {links.map((link, idx) => {
                                        // Limpiamos los textos devueltos por Laravel para los iconos de flechas
                                        let label = link.label;
                                        if (label.includes('Previous')) label = '«';
                                        if (label.includes('Next')) label = '»';

                                        return (
                                            <li key={idx} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                                                {link.url ? (
                                                    <Link
                                                        href={link.url}
                                                        preserveScroll
                                                        className="page-link rounded border-0 px-3 py-2 fw-semibold"
                                                        // dangerouslySetInnerHTML maneja strings puros de Laravel perfectamente
                                                        dangerouslySetInnerHTML={{ __html: label }}
                                                    />
                                                ) : (
                                                    <span 
                                                        className="page-link rounded border-0 px-3 py-2 text-muted opacity-50"
                                                        dangerouslySetInnerHTML={{ __html: label }}
                                                    />
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                    )}
                </>
            ) : (
                /* --- FORMULARIO DE APERTURA --- */
                <form onSubmit={submit} className="row g-4 p-2">
                    <div className="col-12">
                        <h6 className="fw-bold d-flex align-items-center">
                            <i className="ti ti-arrow-left me-2 text-primary" style={{cursor:'pointer'}} onClick={() => setView('list')}></i>
                            {editData ? 'Detalles del Turno' : 'Apertura de Turno (Caja)'}
                        </h6>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label small fw-bold">Código Interno</label>
                        <input type="text" className={`form-control border-0 bg-light ${errors.codigo ? 'is-invalid' : ''}`}
                               value={data.codigo} onChange={e => setData('codigo', e.target.value)} placeholder="Ej: TRN-001" />
                        {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}       
                    </div>

                    <div className="col-md-8">
                        <label className="form-label small fw-bold">Descripción / Nombre</label>
                        <input type="text" className="form-control border-0 bg-light shadow-none py-2" 
                               value={data.descripcion} onChange={e => setData('descripcion', e.target.value)} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold text-primary">Terminal (Caja POS)</label>
                        <select className={`form-control border-0 bg-light ${errors.terminal_id ? 'is-invalid' : ''}`}
                                value={data.terminal_id} onChange={e => setData('terminal_id', e.target.value)}>
                            <option value="">Seleccione Terminal...</option>
                            {terminales.map(ter => <option key={ter.id} value={ter.id}>{ter.nombre}</option>)}
                        </select>
                        {errors.terminal_id && <div className="invalid-feedback">{errors.terminal_id}</div>}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label small fw-bold">Base Inicial de Dinero</label>
                        <div className="input-group">
                            <span className="input-group-text border-0 bg-light-success text-success fw-bold">$</span>
                            <input type="number" className={`form-control border-0 bg-light ${errors.baseinicial ? 'is-invalid' : ''}`}
                                   value={data.baseinicial} onChange={e => setData('baseinicial', Number(e.target.value))} />
                            {errors.baseinicial && <div className="invalid-feedback">{errors.baseinicial}</div>}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label small fw-bold">Observaciones de Apertura</label>
                        <textarea className="form-control border-0 bg-light shadow-none" rows={3}
                                  value={data.observaciones} onChange={e => setData('observaciones', e.target.value)}></textarea>
                    </div>

                    <div className="col-12 pt-3 d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-5 rounded-pill fw-bold shadow-sm" disabled={processing}>
                            <i className="ti ti-door-enter me-2"></i>
                            {editData ? 'Actualizar Datos' : 'Realizar Apertura'}
                        </button>
                    </div>
                </form>
            )}

            {/* MODAL DE RESUMEN Y CIERRE */}
            {showCierre && resumenCierre && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '25px' }}>
                            <div className="modal-body p-4">
                                <div className="text-center mb-4">
                                    <div className="bg-light-danger text-danger d-inline-block p-3 rounded-circle mb-3">
                                        <i className="ti ti-lock fs-1"></i>
                                    </div>
                                    <h5 className="fw-bold">Cierre de Caja y Arqueo</h5>
                                    <p className="text-muted small">Resumen de ventas hasta este momento</p>
                                </div>

                                <div className="bg-light rounded-3 p-3 mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted small">Base Inicial:</span>
                                        <span className="fw-bold">${new Intl.NumberFormat().format(resumenCierre.base_inicial)}</span>
                                    </div>
                                    
                                    {resumenCierre.ventas_detalle?.map((pago: any) => (
                                        <div className="d-flex justify-content-between mb-2" key={pago.nombre}>
                                            <span className="text-muted small">Ventas ({pago.nombre}):</span>
                                            <span className="fw-bold text-dark">${new Intl.NumberFormat().format(pago.total)}</span>
                                        </div>
                                    ))}

                                    <hr className="my-2 opacity-25" />
                                    
                                    <div className="d-flex justify-content-between text-primary">
                                        <span className="fw-bold">Total Sistema:</span>
                                        <span className="fw-bolder fs-5">${new Intl.NumberFormat().format(resumenCierre.total_sistema)}</span>
                                    </div>
                                </div>

                                <div className="alert alert-warning border-0 small rounded-3 mb-4">
                                    <i className="ti ti-alert-triangle me-2"></i>
                                    Al cerrar el turno, ya no se podrán registrar más facturas en esta terminal hasta que se realice una nueva apertura.
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        onClick={confirmarCierre} 
                                        className="btn btn-danger w-100 rounded-pill py-2 fw-bold shadow-sm"
                                        disabled={processing}
                                    >
                                        Confirmar Cierre
                                    </button>
                                    <button 
                                        onClick={() => setShowCierre(false)} 
                                        className="btn btn-light w-100 rounded-pill py-2 fw-bold text-muted"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}