import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ productos, filtros }: any) {
    const brandBlue = '#0095ff';
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        producto_id: '',
        tipo: 'entrada',
        cantidad: 0,
        motivo: '',
    });

    const handleOpenModal = (producto: any) => {
        setSelectedProduct(producto);
        setData('producto_id', producto.id);
    };

    const submitMovimiento = (e: any) => {
        e.preventDefault();
        post(route('inventario.movimiento'), {
            onSuccess: () => {
                reset();
                document.getElementById('closeModal')?.click();
            },
        });
    };

    return (
        <AppMainLayout>
            <Head title="Inventario - Vantify" />
            
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 className="fw-900 mb-0">Gestión de <span style={{ color: brandBlue }}>Inventario</span></h2>
                        <p className="text-muted fw-500">Control de existencias y movimientos de almacén.</p>
                    </div>
                    <button className="btn btn-primary fw-bold px-4" style={{ borderRadius: '12px', backgroundColor: brandBlue }}>
                        <i className="ti ti-plus me-2"></i> Nuevo Producto
                    </button>
                </div>

                {/* Resumen Rápido */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '20px' }}>
                            <div className="small fw-800 text-muted">TOTAL PRODUCTOS</div>
                            <div className="h3 fw-900 mb-0">{productos.length}</div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '20px' }}>
                            <div className="small fw-800 text-danger">STOCK CRÍTICO</div>
                            <div className="h3 fw-900 mb-0 text-danger">
                                {productos.filter((p: any) => p.stock <= p.minimostock).length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de Inventario */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: '25px' }}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4 py-3 small fw-800 border-0">PRODUCTO</th>
                                    <th className="small fw-800 border-0">CATEGORÍA</th>
                                    <th className="text-center small fw-800 border-0">STOCK ACTUAL</th>
                                    <th className="text-center small fw-800 border-0">ESTADO</th>
                                    <th className="text-end pe-4 small fw-800 border-0">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((prod: any) => (
                                    <tr key={prod.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-dark">{prod.nombre}</div>
                                            <div className="text-muted small" style={{ fontSize: '11px' }}>REF: {prod.codigo || 'S/N'}</div>
                                        </td>
                                        <td><span className="badge bg-light text-muted border">{prod.categoria?.nombre || 'General'}</span></td>
                                        <td className="text-center">
                                            <div className={`h5 mb-0 fw-900 ${prod.stock <= prod.minimostock ? 'text-danger' : 'text-dark'}`}>
                                                {prod.stock}
                                            </div>
                                            <div className="text-muted" style={{ fontSize: '10px' }}>Min: {prod.minimostock}</div>
                                        </td>
                                        <td className="text-center">
                                            {prod.stock <= prod.minimostock ? 
                                                <span className="badge bg-soft-danger text-danger px-3">Reposición Urgente</span> : 
                                                <span className="badge bg-soft-success text-success px-3">Stock OK</span>
                                            }
                                        </td>
                                        <td className="text-end pe-4">
                                            <div className="btn-group">
                                                <button onClick={() => handleOpenModal(prod)} className="btn btn-sm btn-light-primary fw-bold me-2" data-bs-toggle="modal" data-bs-target="#movimientoModal" style={{ borderRadius: '8px' }}>
                                                    <i className="ti ti-arrows-exchange"></i> Ajustar
                                                </button>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de Movimientos */}
            <div className="modal fade" id="movimientoModal" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                        <form onSubmit={submitMovimiento}>
                            <div className="modal-header border-0 p-4 pb-0">
                                <h5 className="fw-900">Ajuste de Existencias</h5>
                                <button type="button" className="btn-close" id="closeModal" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body p-4">
                                <p className="text-muted small mb-4">Vas a registrar un movimiento para: <strong>{selectedProduct?.nombre}</strong></p>
                                
                                <div className="mb-3">
                                    <label className="small fw-800 text-muted">TIPO DE OPERACIÓN</label>
                                    <div className="d-flex gap-2 mt-2">
                                        {['entrada', 'salida', 'ajuste'].map(t => (
                                            <button key={t} type="button" 
                                                className={`btn flex-fill fw-bold text-uppercase ${data.tipo === t ? 'btn-primary' : 'btn-light text-muted'}`}
                                                style={{ fontSize: '10px', borderRadius: '10px' }}
                                                onClick={() => setData('tipo', t)}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="small fw-800 text-muted">CANTIDAD</label>
                                    <input type="number" className="form-control border-0 bg-light py-2" required
                                        value={data.cantidad} onChange={e => setData('cantidad', parseInt(e.target.value))} />
                                </div>

                                <div className="mb-3">
                                    <label className="small fw-800 text-muted">MOTIVO / OBSERVACIÓN</label>
                                    <textarea className="form-control border-0 bg-light" rows={3} required
                                        value={data.motivo} onChange={e => setData('motivo', e.target.value)}
                                        placeholder="Ej: Compra factura #123 o producto vencido"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="submit" className="btn btn-primary w-100 fw-900 py-2" disabled={processing} style={{ borderRadius: '12px' }}>
                                    {processing ? 'Procesando...' : 'REGISTRAR MOVIMIENTO'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .bg-soft-danger { background-color: #fee2e2; }
                .bg-soft-success { background-color: #dcfce7; }
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
            `}} />
        </AppMainLayout>
    );
}