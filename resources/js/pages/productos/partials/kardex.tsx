import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';

export default function Kardex({ producto, movimientos }: any) {
    const brandBlue = '#0095ff';

    // Cálculos rápidos para el resumen
    const totalEntradas = movimientos.filter((m: any) => m.tipo === 'entrada').reduce((acc: number, m: any) => acc + m.cantidad, 0);
    const totalSalidas = movimientos.filter((m: any) => m.tipo !== 'entrada').reduce((acc: number, m: any) => acc + m.cantidad, 0);

    return (
        <AppMainLayout>
            <Head title={`Kardex - ${producto.nombre}`} />
            
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb mb-3">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('productos.index')}> Gestión</a></li>
                                <li className="breadcrumb-item" aria-current="page">Auditoría de Inventario</li>
                            </ul>
                        </div>
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-900 mb-0">Kardex de <span style={{ color: brandBlue }}>Movimientos</span></h2>
                                <p className="text-muted small fw-bold mb-0 text-uppercase">Rastreo detallado de existencias</p>
                            </div>
                            
                            {/* Link sin bordes alineado a la derecha */}
                            <a 
                                href={route('productos.index')} 
                                className="btn btn-link text-muted text-decoration-none d-flex align-items-center fw-800 p-0"
                                style={{ fontSize: '14px', transition: 'color 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.color = brandBlue}
                                onMouseOut={(e) => e.currentTarget.style.color = '#6c757d'}
                            >
                                <i className="ti ti-chevron-left fs-4 me-1"></i>
                                Regresar a inventario
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-4">
                {/* Header de Info del Producto */}
                <div className="row g-4 mb-4">
                    <div className="col-md-5">
                        <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '25px', borderLeft: `6px solid ${brandBlue}` }}>
                            <div className="card-body d-flex align-items-center">
                                <div className="avtar avtar-lg bg-light-primary rounded-circle me-3">
                                    <i className="ti ti-box fs-2" style={{ color: brandBlue }}></i>
                                </div>
                                <div>
                                    <h4 className="fw-900 mb-0 text-dark">{producto.nombre}</h4>
                                    <span className="text-muted small fw-bold">REF: {producto.codigo || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Stats rápidas */}
                    <div className="col-md-7">
                        <div className="row g-3">
                            <div className="col-4">
                                <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: '20px' }}>
                                    <div className="small fw-800 text-success text-uppercase">Entradas</div>
                                    <div className="h4 fw-900 mb-0">+{totalEntradas}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: '20px' }}>
                                    <div className="small fw-800 text-danger text-uppercase">Salidas</div>
                                    <div className="h4 fw-900 mb-0">-{totalSalidas}</div>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: '20px', backgroundColor: '#f8faff' }}>
                                    <div className="small fw-800 text-primary text-uppercase">Stock Actual</div>
                                    <div className="h4 fw-900 mb-0 text-primary">{producto.stock}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de Movimientos */}
                <div className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: '25px' }}>
                    <div className="card-header bg-white border-0 py-3">
                        <h5 className="mb-0 fw-800"><i className="ti ti-list-details me-2"></i>Historial Cronológico</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4 py-3 small fw-800 text-muted">FECHA Y HORA</th>
                                        <th className="small fw-800 text-muted">OPERACIÓN</th>
                                        <th className="text-center small fw-800 text-muted">CANTIDAD</th>
                                        <th className="text-center small fw-800 text-muted">STOCK RESULTANTE</th>
                                        <th className="small fw-800 text-muted">MOTIVO / NOTA</th>
                                        <th className="pe-4 small fw-800 text-muted text-end">RESPONSABLE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movimientos.length > 0 ? movimientos.map((mov: any) => (
                                        <tr key={mov.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark" style={{fontSize: '13px'}}>
                                                    {new Date(mov.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-muted small" style={{fontSize: '11px'}}>
                                                    {new Date(mov.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td>
                                                <div className={`d-flex align-items-center fw-900 text-uppercase`} style={{ 
                                                    fontSize: '11px',
                                                    color: mov.tipo === 'entrada' ? '#166534' : '#991b1b'
                                                }}>
                                                    <i className={`ti ${mov.tipo === 'entrada' ? 'ti-arrow-up-circle' : 'ti-arrow-down-circle'} me-2 fs-5`}></i>
                                                    {mov.tipo}
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <span className={`badge rounded-pill px-3 ${mov.tipo === 'entrada' ? 'bg-light-success text-success' : 'bg-light-danger text-danger'}`} style={{fontSize: '13px'}}>
                                                    {mov.tipo === 'entrada' ? '+' : '-'}{mov.cantidad}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <div className="fw-900 text-dark fs-5">{mov.stock_resultante}</div>
                                            </td>
                                            <td>
                                                <div className="text-muted small" style={{ maxWidth: '250px', whiteSpace: 'normal' }}>
                                                    {mov.motivo || <em className="opacity-50">Sin descripción</em>}
                                                </div>
                                            </td>
                                            <td className="pe-4 text-end">
                                                <div className="fw-bold text-dark small">{mov.usuario?.name || 'Sistema'}</div>
                                                <div className="text-muted" style={{fontSize: '10px'}}>ID: #{mov.created_by}</div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-5 text-muted">
                                                <i className="ti ti-database-off fs-1 d-block mb-2 opacity-25"></i>
                                                No se han registrado movimientos para este producto aún.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .bg-light-success { background-color: #dcfce7 !important; }
                .bg-light-danger { background-color: #fee2e2 !important; }
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
                .avtar-lg { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; }
            `}} />
        </AppMainLayout>
    );
}