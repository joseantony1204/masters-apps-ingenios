import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface Calificacion {
    id: number;
    estrellas: number;
    comentario: string | null;
    fecha: string;
    detalle: {
        totalapagar: number;
        servicio: { nombre: string };
        empleadoservicio: {
            empleado_id: number;
            empleado: {
                persona: {
                    personasnaturales: {
                        nombrecompleto: string;
                        nombre: string;
                    }
                }
            },
            servicio?: {
                nombre: string;   
            };
        }
    }
    persona?: {
        telefonomovil: string | null;
        personasnaturales: {
            nombrecompleto: string;
            nombre: string;
        }
    }
}

interface Props {
    calificaciones: Calificacion[];
    filtros: {
        fecha_inicio: string;
        fecha_fin: string;
        empleado_id: string; // <-- Recibido desde Laravel
    };
}

type SortKey = 'especialista' | 'cliente' | 'puntuacion' | 'fecha';
type SortOrder = 'asc' | 'desc';

export default function Index({ calificaciones, filtros }: Props) {
    const brandGold = '#ffb703';

    // --- ESTADO INICIAL DE FILTROS (Sincronizados con el Servidor) ---
    const [values, setValues] = useState({
        fecha_inicio: filtros.fecha_inicio || "",
        fecha_fin: filtros.fecha_fin || "",
        empleado_id: filtros.empleado_id || "todos"
    });
    
    const [sortKey, setSortKey] = useState<SortKey>('fecha');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;

    // Ejecuta la petición al backend con todos los filtros acoplados
    const handleFilterSubmit = (updatedValues = values) => {
        router.get(route('reportes.qualify'), updatedValues, { 
            preserveState: true,
            replace: true 
        });
        setCurrentPage(1);
    };

    // --- PROCESAMIENTO DE RENDIMIENTO PARA LA GRÁFICA ---
    const rankingEspecialistas = useMemo(() => {
        return calificaciones.reduce((acc: any, curr) => {
            const nombre = curr.detalle?.empleadoservicio?.empleado?.persona?.personasnaturales?.nombrecompleto || 'Sin Nombre';
            if (!acc[nombre]) {
                acc[nombre] = { nombre, sumaEstrellas: 0, totalResenas: 0 };
            }
            acc[nombre].sumaEstrellas += curr.estrellas;
            acc[nombre].totalResenas += 1;
            return acc;
        }, {});
    }, [calificaciones]);

    const chartData = useMemo(() => {
        return Object.values(rankingEspecialistas).map((esp: any) => ({
            nombreCompleto: esp.nombre,
            nombre: esp.nombre.split(' ')[0] + ' ' + (esp.nombre.split(' ')[2] || ''), 
            promedio: parseFloat((esp.sumaEstrellas / esp.totalResenas).toFixed(2)),
            resenas: esp.totalResenas
        })).sort((a, b) => b.promedio - a.promedio);
    }, [rankingEspecialistas]);

    const empleadoEstrella = useMemo(() => {
        return chartData.length > 0 ? chartData[0] : null;
    }, [chartData]);

    // Opciones estáticas basadas en los datos cargados para el select
    const listaEmpleados = useMemo(() => {
        // Mapea ID y Nombre Completo para estructurar el select
        const map: any = {};
        calificaciones.forEach(c => {
            const id = c.detalle?.empleadoservicio?.empleado_id;
            const nombre = c.detalle?.empleadoservicio?.empleado?.persona?.personasnaturales?.nombrecompleto;
            if (id && nombre) map[id] = nombre;
        });
        return Object.entries(map);
    }, [calificaciones]);

    // --- ORDENAMIENTO Y PAGINACIÓN DE LA TABLA ---
    const tablaProcesada = useMemo(() => {
        let items = [...calificaciones];

        items.sort((a, b) => {
            let valA: any = '';
            let valB: any = '';

            if (sortKey === 'especialista') {
                valA = a.detalle?.empleadoservicio?.empleado?.persona?.personasnaturales?.nombrecompleto || '';
                valB = b.detalle?.empleadoservicio?.empleado?.persona?.personasnaturales?.nombrecompleto || '';
            } else if (sortKey === 'cliente') {
                valA = a.persona?.personasnaturales?.nombrecompleto || '';
                valB = b.persona?.personasnaturales?.nombrecompleto || '';
            } else if (sortKey === 'puntuacion') {
                valA = a.estrellas;
                valB = b.estrellas;
            } else if (sortKey === 'fecha') {
                valA = new Date(a.fecha).getTime();
                valB = new Date(b.fecha).getTime();
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return items;
    }, [calificaciones, sortKey, sortOrder]);

    const totalPages = Math.ceil(tablaProcesada.length / itemsPerPage);
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return tablaProcesada.slice(start, start + itemsPerPage);
    }, [tablaProcesada, currentPage]);

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    // --- METRICAS GLOBALES ---
    const totalCalificaciones = calificaciones.length;
    const promedioGeneral = totalCalificaciones > 0 
        ? (calificaciones.reduce((sum, c) => sum + c.estrellas, 0) / totalCalificaciones).toFixed(2)
        : "0.0";

    const excelentes = calificaciones.filter(c => c.estrellas >= 4).length;
    const porcentajeSatisfechos = totalCalificaciones > 0 
        ? ((excelentes / totalCalificaciones) * 100).toFixed(0) 
        : "0";

    return (
        <AppMainLayout>
            <Head title="Satisfacción y Reseñas - Vantify" />

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb mb-3">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('reportes.index')}> Reportes</a></li>
                                <li className="breadcrumb-item" aria-current="page">Calificaciones</li>
                            </ul>
                        </div>
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-900 mb-0" style={{ color: '#1e293b' }}>
                                    Control de <span style={{ color: brandGold }}>Satisfacción</span>
                                </h2>
                                <p className="text-muted fw-500 mb-0">Monitoreo de reputación y rendimiento de atención en tus sedes.</p>
                            </div>
                            <a href={route('reportes.index')} className="btn btn-link text-muted text-decoration-none d-flex align-items-center fw-800 p-0" style={{ fontSize: '14px' }}>
                                <i className="ti ti-chevron-left fs-4 me-1"></i> Regresar a reportes
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container-fluid py-4" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>

                {/* --- FILTROS DE FECHA Y EMPLEADO --- */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                    <div className="card-body p-4">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-3">
                                <label className="small fw-800 text-uppercase mb-2 text-primary">Filtrar por Especialista</label>
                                <select 
                                    className="form-select border-0 bg-light fw-600" 
                                    style={{ borderRadius: '12px', height: '45px' }}
                                    value={values.empleado_id}
                                    onChange={e => {
                                        const newValues = { ...values, empleado_id: e.target.value };
                                        setValues(newValues);
                                        handleFilterSubmit(newValues);
                                    }}
                                >
                                    <option value="todos">✨ Todos los especialistas</option>
                                    {listaEmpleados.map(([id, nombre]: any) => (
                                        <option key={id} value={id}>{nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="small fw-800 text-uppercase mb-2 text-primary">Desde Fecha</label>
                                <input type="date" className="form-control border-0 bg-light" style={{ borderRadius: '12px', height: '45px' }} value={values.fecha_inicio} onChange={e => setValues({...values, fecha_inicio: e.target.value})} />
                            </div>
                            <div className="col-md-3">
                                <label className="small fw-800 text-uppercase mb-2 text-primary">Hasta Fecha</label>
                                <input type="date" className="form-control border-0 bg-light" style={{ borderRadius: '12px', height: '45px' }} value={values.fecha_fin} onChange={e => setValues({...values, fecha_fin: e.target.value})} />
                            </div>
                            <div className="col-md-3">
                                <button onClick={() => handleFilterSubmit()} className="btn btn-primary w-100 py-2 shadow-blue" style={{ borderRadius: '12px', background: `linear-gradient(135deg, ${brandGold} 0%, #f59e0b 100%)`, border: 'none', fontWeight: '700', height: '45px' }}>
                                    <i className="ti ti-refresh me-2"></i> REPROCESAR RANGO
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CARDS DE METRICAS PRINCIPALES --- */}
                <div className="row mb-4 g-3">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 text-center h-100" style={{ borderRadius: '20px' }}>
                            <div className="text-muted small fw-800 text-uppercase mb-1">PROMEDIO GLOBAL</div>
                            <div className="h1 fw-900 mb-1 d-flex align-items-center justify-content-center gap-2" style={{ color: brandGold }}>
                                {promedioGeneral} <i className="ti ti-star" style={{ fill: 'currentColor' }}></i>
                            </div>
                            <span className="text-muted small">Puntuación general del comercio</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 text-center h-100" style={{ borderRadius: '20px' }}>
                            <div className="text-muted small fw-800 text-uppercase mb-1">TOTAL OPINIONES</div>
                            <div className="h1 fw-900 mb-1 text-dark">{totalCalificaciones}</div>
                            <span className="text-muted small">Encuestas de este período</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-4 text-center h-100" style={{ borderRadius: '20px' }}>
                            <div className="text-muted small fw-800 text-uppercase mb-1">INDICE DE SATISFACCIÓN</div>
                            <div className="h1 fw-900 mb-1 text-success">{porcentajeSatisfechos}%</div>
                            <span className="text-muted small">Clientes satisfechos (4★ o 5★)</span>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN GRÁFICA CON FIJACIÓN DE FORMATTER --- */}
                <div className="row g-4 mb-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '25px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h6 className="fw-900 mb-1 text-dark">RATING PROMEDIO POR ESPECIALISTA</h6>
                                    <p className="text-muted small mb-0">Visualización de rendimiento basado en opiniones reales.</p>
                                </div>
                                <span className="badge rounded-pill bg-light-warning text-warning px-3 py-2 fw-bold" style={{ fontSize: '11px' }}>
                                    MÉTRICA ACTIVA
                                </span>
                            </div>

                            <div style={{ width: '100%', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="nombre" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 'bold', fontSize: '12px' }} />
                                        <YAxis domain={[0, 5]} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 'bold' }} />
                                        <ReTooltip 
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}
                                            formatter={(value, name, props) => [`${value} ★ (${props.payload.resenas} Reseñas)`, 'Rendimiento']}
                                        />
                                        <Bar dataKey="promedio" radius={[10, 10, 0, 0]} maxBarSize={45}>
                                            {/* Formateador seguro usando any para erradicar errores de compilación */}
                                            <LabelList dataKey="promedio" position="top" style={{ fill: '#334155', fontWeight: '800', fontSize: '12px' }} formatter={(v: any) => `${v} ★`} />
                                            {chartData.map((entry: any, index: number) => {
                                                const esEstrella = empleadoEstrella && entry.nombreCompleto === empleadoEstrella.nombreCompleto;
                                                return (
                                                    <Cell 
                                                        key={`cell-${index}`} 
                                                        fill={esEstrella ? '#4f46e5' : entry.promedio >= 4.0 ? '#10b981' : entry.promedio >= 3.0 ? brandGold : '#ef4444'} 
                                                    />
                                                );
                                            })}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* TARJETA HIGHLIGHT: COLABORADOR ESTRELLA */}
                    <div className="col-lg-4">
                        <div className="card border-0 text-white h-100 p-4 d-flex flex-column justify-content-between shadow-sm position-relative overflow-hidden" 
                             style={{ borderRadius: '25px', background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)' }}>
                            <div className="position-absolute opacity-10" style={{ right: '-20px', top: '-20px', fontSize: '160px', pointerEvents: 'none' }}>
                                <i className="ti ti-trophy"></i>
                            </div>
                            <div>
                                <span className="badge rounded-pill bg-white bg-opacity-20 text-white px-3 py-1.5 fw-bold text-uppercase" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                                    Líder del Período
                                </span>
                                <h3 className="fw-900 mt-3 mb-1">Especialista Estrella</h3>
                                <p className="text-white text-opacity-70 small">Colaborador con el promedio de satisfacción más alto en este rango.</p>
                            </div>
                            
                            {empleadoEstrella ? (
                                <div className="bg-white bg-opacity-10 p-3 rounded-4 border border-white border-opacity-10 mt-4">
                                    <h5 className="fw-900 mb-1 text-uppercase text-warning">{empleadoEstrella.nombreCompleto}</h5>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="d-flex text-warning fs-5">
                                            <i className="ti ti-star" style={{ fill: 'currentColor' }}></i>
                                        </div>
                                        <span className="fw-800 fs-4">{empleadoEstrella.promedio}</span>
                                        <span className="text-white text-opacity-60 small">({empleadoEstrella.resenas} opiniones)</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-white text-opacity-50 italic-style small">Sin registros suficientes.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- DETALLE CRONOLÓGICO CON ORDENAMIENTO Y PAGINACIÓN --- */}
                <div className="row pb-5">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '25px' }}>
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-2">
                                <h6 className="fw-900 text-dark mb-0">HISTORIAL DE OPINIONES Y COMENTARIOS RECIENTES</h6>
                                <span className="text-muted small fw-600">Mostrando {paginatedData.length} de {tablaProcesada.length} registros</span>
                            </div>
                            
                            <div className="table-responsive">
                                <table className="table table-borderless align-middle mb-0">
                                    <thead>
                                        <tr className="text-muted small fw-800" style={{ borderBottom: '2px solid #f8fafc' }}>
                                            <th className="ps-0 pb-3 sortable-th" onClick={() => handleSort('especialista')}>
                                                ESPECIALISTA {sortKey === 'especialista' ? (sortOrder === 'asc' ? '🔼' : '🔽') : '↕️'}
                                            </th>
                                            <th className="pb-3 sortable-th" onClick={() => handleSort('cliente')}>
                                                CLIENTE {sortKey === 'cliente' ? (sortOrder === 'asc' ? '🔼' : '🔽') : '↕️'}
                                            </th>
                                            <th className="pb-3">SERVICIO REALIZADO</th>
                                            <th className="text-center pb-3 sortable-th" onClick={() => handleSort('puntuacion')}>
                                                PUNTUACIÓN {sortKey === 'puntuacion' ? (sortOrder === 'asc' ? '🔼' : '🔽') : '↕️'}
                                            </th>
                                            <th className="pb-3" style={{ width: '25%' }}>COMENTARIO DEL CLIENTE</th>
                                            <th className="text-end pe-0 pb-3 sortable-th" onClick={() => handleSort('fecha')}>
                                                ACCIONES / FECHA {sortKey === 'fecha' ? (sortOrder === 'asc' ? '🔼' : '🔽') : '↕️'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData.length > 0 ? (
                                            paginatedData.map((cal: any, idx: number) => {
                                                const esp = cal.detalle?.empleadoservicio?.empleado?.persona?.personasnaturales;
                                                const inicialEsp = esp?.nombre?.charAt(0) || 'E';
                                                
                                                const cliente = cal.persona?.personasnaturales;
                                                const clienteTel = cal.persona?.telefonomovil;
                                                const inicialCliente = cliente?.nombre?.charAt(0) || 'C';

                                                const formattedPhone = clienteTel ? (clienteTel.startsWith('57') ? clienteTel : `57${clienteTel}`) : '';
                                                const wsText = encodeURIComponent(`Hola ${cliente?.nombre || ''}, te saludamos de Vantify. Recibimos tu feedback de ${cal.estrellas} estrellas. ¡Muchas gracias por ayudarnos a mejorar!`);
                                                const whatsappUrl = `https://wa.me/${formattedPhone}?text=${wsText}`;

                                                const esEstrella = empleadoEstrella && esp?.nombrecompleto === empleadoEstrella.nombreCompleto;

                                                return (
                                                    <tr key={cal.id || idx} className={`item-row ${esEstrella ? 'highlight-row' : ''}`}>
                                                        <td className="ps-0 py-3">
                                                            <div className="d-flex align-items-center">
                                                                <div className="rounded-circle me-3 d-flex align-items-center justify-content-center fw-900 shadow-sm text-white position-relative" 
                                                                    style={{ width: '40px', height: '40px', background: esEstrella ? 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' : 'linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%)' }}>
                                                                    {inicialEsp}
                                                                    {esEstrella && (
                                                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-warning p-1 border border-white" style={{fontSize: '8px'}}>
                                                                            ⭐
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold text-dark text-uppercase d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                                                                        {esp?.nombrecompleto || 'N/A'}
                                                                    </div>
                                                                    <div className="text-muted small" style={{ fontSize: '11px' }}>ID: #{cal.detalle?.empleadoservicio?.empleado_id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="rounded-circle me-2 d-flex align-items-center justify-content-center fw-800 shadow-sm text-primary" 
                                                                    style={{ width: '34px', height: '34px', backgroundColor: '#e0f2fe', fontSize: '12px' }}>
                                                                    {inicialCliente}
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{cliente?.nombrecompleto || 'Cliente General'}</div>
                                                                    {clienteTel && (
                                                                        <div className="text-muted small d-flex align-items-center" style={{ fontSize: '11px' }}>
                                                                            <i className="ti ti-phone me-1 text-success"></i>{clienteTel}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{cal.detalle?.empleadoservicio?.servicio?.nombre || 'N/A'}</div>
                                                            <div className="text-primary small fw-800" style={{ fontSize: '11px' }}>${cal.detalle?.totalapagar?.toLocaleString()} COP</div>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="d-flex align-items-center justify-content-center gap-1 text-warning">
                                                                {[...Array(cal.estrellas)].map((_, i) => (
                                                                    <i key={`filled-${i}`} className="ti ti-star fs-5" style={{ fill: 'currentColor' }}></i>
                                                                ))}
                                                                {[...Array(5 - cal.estrellas)].map((_, i) => (
                                                                    <i key={`empty-${i}`} className="ti ti-star text-muted opacity-25 fs-5" style={{ fill: 'none' }}></i>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {cal.comentario ? (
                                                                <p className="mb-0 text-dark fw-500 bg-light p-2 rounded-3 small border-start border-warning border-3 italic-style" style={{ fontSize: '12px' }}>
                                                                    "{cal.comentario}"
                                                                </p>
                                                            ) : (
                                                                <span className="text-muted small text-opacity-50 italic-style" style={{ fontSize: '12px' }}>Sin comentarios.</span>
                                                            )}
                                                        </td>
                                                        <td className="text-end pe-0">
                                                            <div className="d-flex flex-column align-items-end gap-2">
                                                                <span className="badge bg-light text-muted fw-bold px-3 py-1.5 rounded-pill" style={{ fontSize: '10px' }}>
                                                                    {new Date(cal.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </span>
                                                                {clienteTel && (
                                                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-success d-inline-flex align-items-center px-2.5 py-1 rounded-pill text-white text-decoration-none border-0" style={{ fontSize: '11px', fontWeight: '700', gap: '4px', backgroundColor: '#25d366' }}>
                                                                        <i className="ti ti-brand-whatsapp fs-5"></i> Contactar
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="text-center py-5 text-muted small italic-style">
                                                    No se encontraron opiniones para este filtro.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- COMPONENTE DE PAGINACIÓN --- */}
                            {totalPages > 1 && (
                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 pt-3 gap-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                                    <small className="text-muted fw-600 order-2 order-sm-1">
                                        Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
                                    </small>
                                    
                                    <nav aria-label="Navegación del historial" className="order-1 order-sm-2">
                                        <ul className="pagination pagination-sm mb-0 gap-1 align-items-center flex-wrap justify-content-center">
                                            {/* Botón Anterior */}
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link border-0 bg-light text-dark fw-bold px-3 py-2 rounded-3 shadow-none transition-all"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                >
                                                    <i className="ti ti-chevron-left me-1"></i> Anterior
                                                </button>
                                            </li>

                                            {/* Generación de números con lógica de elipse */}
                                            {(() => {
                                                const pages = [];
                                                const maxVisible = 2; // Número de páginas a mostrar a los lados de la actual

                                                for (let i = 1; i <= totalPages; i++) {
                                                    // Siempre mostrar la primera, la última, y el rango cercano a la página actual
                                                    if (
                                                        i === 1 || 
                                                        i === totalPages || 
                                                        (i >= currentPage - maxVisible && i <= currentPage + maxVisible)
                                                    ) {
                                                        pages.push(
                                                            <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                                                                <button 
                                                                    className="page-link border-0 px-3 py-2 fw-700 rounded-3 shadow-none transition-all"
                                                                    style={{ 
                                                                        backgroundColor: currentPage === i ? '#4f46e5' : '#f8fafc',
                                                                        color: currentPage === i ? '#ffffff' : '#475569'
                                                                    }}
                                                                    onClick={() => setCurrentPage(i)}
                                                                >
                                                                    {i}
                                                                </button>
                                                            </li>
                                                        );
                                                    } 
                                                    // Agregar elipse a la izquierda si hay un hueco
                                                    else if (i === currentPage - maxVisible - 1 && i > 1) {
                                                        pages.push(
                                                            <li key="ellipsis-left" className="page-item disabled px-2">
                                                                <span className="text-muted fw-bold">...</span>
                                                            </li>
                                                        );
                                                    } 
                                                    // Agregar elipse a la derecha si hay un hueco
                                                    else if (i === currentPage + maxVisible + 1 && i < totalPages) {
                                                        pages.push(
                                                            <li key="ellipsis-right" className="page-item disabled px-2">
                                                                <span className="text-muted fw-bold">...</span>
                                                            </li>
                                                        );
                                                    }
                                                }
                                                return pages;
                                            })()}

                                            {/* Botón Siguiente */}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link border-0 bg-light text-dark fw-bold px-3 py-2 rounded-3 shadow-none transition-all"
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                >
                                                    Siguiente <i className="ti ti-chevron-right ms-1"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
                .fw-700 { font-weight: 700; }
                .fw-600 { font-weight: 600; }
                .fw-500 { font-weight: 500; }
                .bg-light-warning { background-color: #fff9db; color: #f59e0b; }
                .shadow-blue { box-shadow: 0 8px 20px -5px rgba(255, 183, 3, 0.3); }
                .item-row { transition: all 0.2s ease; border-bottom: 1px solid #f8fafc; }
                .item-row:hover { background-color: #fcfdfe; }
                .highlight-row { border-left: 4px solid #4f46e5 !important; }
                .italic-style { font-style: italic; }
                .form-control:focus, .form-select:focus { box-shadow: none; border: 1px solid #4f46e5 !important; }
                .sortable-th { cursor: pointer; user-select: none; transition: color 0.15s; }
                .sortable-th:hover { color: #4f46e5 !important; }
            `}} />
        </AppMainLayout>
    );
}