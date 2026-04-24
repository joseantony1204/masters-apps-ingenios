import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { router } from '@inertiajs/react';

interface Props {
    productos: any[];
    activeTab: 'servicios' | 'productos' | 'combos';
    onAdjust: (item: any) => void;
}

export default function Table({ productos, onAdjust, activeTab }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);

    // --- Efecto para DataTables ---
    useEffect(() => {
        let dt: any;
        if (tableRef.current) {
            dt = initDataTable(tableRef.current);
        }
        return () => {
            if (dt && typeof dt.destroy === 'function') {
                dt.destroy();
            }
        };
    }, [productos]);

    // --- Helpers ---
    const handleEdit = (id: number) => router.visit(route('productos.edit', id));

    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(Number(value));
    };

    const getTipoBadge = (tipo: string) => {
        const colors: Record<string, string> = {
            'SERVICIO': 'bg-light-info text-info',
            'PRODUCTO': 'bg-light-primary text-primary',
            'COMBO': 'bg-light-warning text-warning'
        };
        return colors[tipo] || 'bg-light-secondary';
    };

    const getItemIcon = (item: any) => {
        if (item.tipo?.id === 855) return item.categoria?.observacion || 'ti-scissors'; // Servicio
        if (item.tipo?.id === 856) return 'ti-layers-intersect'; // Combo
        return 'ti-package'; // Producto
    };

    return (
        <div className="table-responsive">
            <table 
                ref={tableRef} 
                className="table table-hover align-middle shadow-sm w-100"
                style={{ borderCollapse: 'separate', borderSpacing: '0 5px' }}
            >
                <thead className="table-light">
                    <tr>
                        <th className="text-center" style={{ width: '100px' }}>Acciones</th>
                        <th className="text-center" style={{ width: '50px' }}>#</th>
                        <th>Información del Item</th>
                        <th>Tipo</th>
                        <th className="text-end">Precio Venta</th>
                        <th className="text-center">Stock Actual</th>
                        <th className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((item, index) => (
                        <tr key={item.id}>
                            {/* Celda de Acciones Centralizada */}
                            <td className="text-center">
                                <div className="d-flex justify-content-center gap-1">
                                    <button
                                        onClick={() => handleEdit(item.id)}
                                        className="btn btn-icon btn-link-success avtar-s"
                                        title="Editar Ítem"
                                    >
                                        <i className="ti ti-edit fs-4"></i>
                                    </button>
                                    
                                    {activeTab === 'productos' && (
                                        <>
                                        <button 
                                            onClick={() => onAdjust(item)} 
                                            className="btn btn-icon btn-link-primary avtar-s"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#movimientoModal"
                                            title="Ajustar Inventario"
                                        >
                                            <i className="ti ti-arrows-exchange fs-4"></i>
                                        </button>

                                        <a href={route('productos.kardex', item.id)} className="btn btn-sm btn-light-secondary fw-bold" style={{ borderRadius: '8px' }}>
                                        <i className="ti ti-history"></i> Kardex
                                        </a>
                                        </>
                                        
                                    )}
                                </div>
                            </td>

                            <td className="text-center text-muted small">{index + 1}</td>

                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="avtar avtar-info avtar-s rounded-circle me-3">
                                        <i className={`ti ${getItemIcon(item)} fs-4`}></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                                        <small className="text-muted text-uppercase" style={{ fontSize: '10px' }}>
                                            {item.codigo || 'SIN REF'} | {item.unidad?.nombre || 'UNIDAD'}
                                        </small>
                                    </div>
                                </div>
                            </td>

                            <td>
                                <span className={`badge border-0 ${getTipoBadge(item.tipo?.nombre || '')}`}>
                                    {item.tipo?.nombre}
                                </span>
                            </td>

                            <td className="text-end fw-bold text-dark">
                                {formatCurrency(item.preciosalida)}
                            </td>

                            <td className="text-center">
                                {/* Cambié a mostrar stock si es producto */}
                                {activeTab === 'productos' ? (
                                    <div className={`fw-900 ${item.stock <= item.minimostock ? 'text-danger' : 'text-dark'}`}>
                                        {item.stock}
                                        <div className="text-muted" style={{ fontSize: '9px', fontWeight: 'normal' }}>
                                            Min: {item.minimostock}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-muted">---</span>
                                )}
                            </td>

                            <td className="text-center">
                                <span className={`badge rounded-pill ${item.estado?.nombre === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`}>
                                    {item.estado?.nombre}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}