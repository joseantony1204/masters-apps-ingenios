import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Productos } from '@/types';
import { useForm, router } from '@inertiajs/react';

interface Props {
    productos: any[];
}

export default function Table({ productos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (tableRef.current) {
            initDataTable(tableRef.current);
        }
    }, [productos]);

    const handleEdit = (id: number) => router.visit(route('productos.edit', id));

    // Formateador de moneda
    const formatCurrency = (value: string | number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(Number(value));
    };

    // Badge de color según el tipo
    const getTipoBadge = (tipo: string) => {
        const colors: Record<string, string> = {
            'SERVICIO': 'bg-light-info text-info',
            'PRODUCTO': 'bg-light-primary text-primary',
            'COMBO': 'bg-light-warning text-warning'
        };
        return colors[tipo] || 'bg-light-secondary';
    };

    return (
        <div className="table-responsive">
            <table ref={tableRef} className="table table-hover align-middle shadow-sm">
                <thead className="table-light">
                    <tr>
                        <th className="text-center" style={{ width: '80px' }}>Acciones</th>
                        <th className="text-center">#</th>
                        <th>Información del Item</th>
                        <th>Tipo</th>
                        <th className="text-end">Precio Venta</th>
                        <th className="text-center">Stock Min.</th>
                        <th className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((item, index) => (
                        <tr key={item.id}>
                            <td className="text-center">
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="btn btn-icon btn-link-success avtar-s"
                                    title="Editar"
                                >
                                    <i className="ti ti-edit fs-4"></i>
                                </button>
                            </td>
                            <td className="text-center text-muted">{index + 1}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="avtar avtar-info avtar-s rounded-circle me-3">
                                        <i className={`ti ${item.tipo?.nombre === 'SERVICIO' ? 'ti-scissors' : 'ti-package'} fs-4`}></i>
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                                        <small className="text-muted">
                                            {item.codigo || 'S/C'} | {item.unidad?.nombre}
                                        </small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={`badge ${getTipoBadge(item.tipo?.nombre || '')}`}>
                                    {item.tipo?.nombre}
                                </span>
                            </td>
                            <td className="text-end fw-bold text-dark">
                                {formatCurrency(item.preciosalida)}
                            </td>
                            <td className="text-center">
                                <span className="badge bg-light-secondary text-dark border">
                                    {item.minimostock || 0}
                                </span>
                            </td>
                            <td className="text-center">
                                <span className={`badge ${item.estado?.nombre === 'ACTIVO' ? 'bg-success' : 'bg-danger'}`}>
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