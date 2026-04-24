import AppMainLayout from '@/layouts/app-main-layout';
import Table from './partials/table'; // Asegúrate que Table use la key={activeTab} como vimos antes
import { Productos } from '@/types';
import { Head, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    productos: Productos[];
}

export default function Index({ productos }: Props) {
    const brandBlue = '#0095ff';
    const [activeTab, setActiveTab] = useState<'servicios' | 'productos' | 'combos'>('servicios');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Lógica de Formulario para Movimientos de Inventario
    const { data, setData, post, processing, reset } = useForm({
        producto_id: '',
        tipo: 'entrada',
        cantidad: 0,
        motivo: '',
    });

    // Filtrado por tipo_id
    const productosFiltrados = productos.filter(p => {
        if (activeTab === 'servicios') return p.tipo_id === 855;
        if (activeTab === 'productos') return p.tipo_id === 854;
        if (activeTab === 'combos') return p.tipo_id === 856;
        return false;
    });

    const handleOpenModal = (producto: any) => {
        setSelectedProduct(producto);
        setData('producto_id', producto.id);
    };

    const submitMovimiento = (e: any) => {
        e.preventDefault();
        post(route('productos.movimiento'), {
            onSuccess: () => {
                reset();
                document.getElementById('closeModal')?.click();
            },
        });
    };

    return (
        <AppMainLayout>
            <Head title="Gestión de Catálogo" />
            
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb mb-2">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('productos.index')}> Gestión</a></li>
                                <li className="breadcrumb-item" aria-current="page">Listado</li>
                            </ul>
                            <h2 className="fw-900 mb-0">Catálogo de <span style={{ color: brandBlue }}>Negocio</span></h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-4">
                {/* TABS */}
                <ul className="nav nav-tabs border-0 mb-4 gap-2" role="tablist">
                    <li className="nav-item">
                        <button className={`nav-link border-0 px-4 py-2 fw-bold rounded-pill ${activeTab === 'servicios' ? 'active shadow-sm text-white' : 'text-muted'}`}
                            onClick={() => setActiveTab('servicios')}
                            style={activeTab === 'servicios' ? { backgroundColor: brandBlue } : {}}>
                            <i className="ti ti-scissors me-2"></i> Servicios
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link border-0 px-4 py-2 fw-bold rounded-pill ${activeTab === 'productos' ? 'active shadow-sm text-white' : 'text-muted'}`}
                            onClick={() => setActiveTab('productos')}
                            style={activeTab === 'productos' ? { backgroundColor: brandBlue } : {}}>
                            <i className="ti ti-package me-2"></i> Productos
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link border-0 px-4 py-2 fw-bold rounded-pill ${activeTab === 'combos' ? 'active shadow-sm text-white' : 'text-muted'}`}
                            onClick={() => setActiveTab('combos')}
                            style={activeTab === 'combos' ? { backgroundColor: '#7000ff' } : {}}>
                            <i className="ti ti-layers-intersect me-2"></i> Combos
                        </button>
                    </li>
                </ul>

                {/* RESUMEN DE STOCK (Solo visible en pestaña Productos) */}
                {activeTab === 'productos' && (
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '20px' }}>
                                <div className="small fw-800 text-muted">TOTAL PRODUCTOS</div>
                                <div className="h3 fw-900 mb-0 text-dark">{productosFiltrados.length}</div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '20px' }}>
                                <div className="small fw-800 text-danger text-uppercase">Stock Crítico</div>
                                <div className="h3 fw-900 mb-0 text-danger">
                                    {productosFiltrados.filter((p: any) => p.stock <= p.minimostock).length}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TABLA PRINCIPAL */}
                <div className="card border-0 shadow-sm" style={{ borderRadius: '25px' }}>
                    <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                        <h5 className="fw-800 mb-0 text-capitalize">Listado de {activeTab}</h5>
                        <a href={route('productos.create')} className="btn btn-primary fw-bold px-4" 
                           style={{ borderRadius: '12px', backgroundColor: activeTab === 'combos' ? '#7000ff' : brandBlue, border:'none' }}>
                            <i className="ti ti-plus me-2"></i> Agregar {activeTab.slice(0,-1)}
                        </a>
                    </div>
                    <div className="card-body pt-0">
                        {/* Pasamos handleOpenModal a la tabla para que el botón "Ajustar" funcione */}
                        <Table 
                            key={activeTab} 
                            productos={productosFiltrados} 
                            activeTab={activeTab} 
                            onAdjust={handleOpenModal} 
                        />
                    </div>
                </div>
            </div>

            {/* MODAL (Global, pero disparado desde la tabla de productos) */}
            <div className="modal fade" id="movimientoModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                        <form onSubmit={submitMovimiento}>
                            <div className="modal-header border-0 p-4 pb-0">
                                <h5 className="fw-900">Ajuste de Inventario</h5>
                                <button type="button" className="btn-close" id="closeModal" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body p-4">
                                <p className="text-muted small mb-4">Producto: <span className="fw-bold text-dark">{selectedProduct?.nombre}</span></p>
                                
                                <div className="mb-3">
                                    <label className="small fw-800 text-muted">ACCIÓN</label>
                                    <div className="d-flex gap-2 mt-2">
                                        {['entrada', 'salida', 'ajuste'].map(t => (
                                            <button key={t} type="button" 
                                                className={`btn flex-fill fw-bold text-uppercase ${data.tipo === t ? 'btn-primary' : 'btn-light text-muted'}`}
                                                style={{ fontSize: '10px', borderRadius: '10px' }}
                                                onClick={() => setData('tipo', t)}>
                                                {t === 'entrada' ? 'Ingreso' : t === 'salida' ? 'Egreso' : 'Ajuste'}
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
                                    <label className="small fw-800 text-muted">COMENTARIO</label>
                                    <textarea className="form-control border-0 bg-light" rows={3} required
                                        value={data.motivo} onChange={e => setData('motivo', e.target.value)}
                                        placeholder="Ej: Reposición de stock o merma por daño"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="submit" className="btn btn-primary w-100 fw-900 py-2" disabled={processing} 
                                    style={{ borderRadius: '12px', backgroundColor: brandBlue, border: 'none' }}>
                                    {processing ? 'Guardando...' : 'CONFIRMAR CAMBIOS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-900 { font-weight: 900; }
                .fw-800 { font-weight: 800; }
                .nav-link.active { color: white !important; }
            `}} />
        </AppMainLayout>
    );
}