import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Ftfacturas } from '@/types';
import { router } from '@inertiajs/react';

interface Props {
    ftfacturas: any[]; // Usamos any temporalmente por los campos agregados en el join
}

export default function Table({ ftfacturas }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (tableRef.current) {
            initDataTable(tableRef.current);
        }
    }, []);

    const handleEdit = (id: number) => router.visit(route('ftfacturas.edit', id));
    const handleView = (id: number) => router.visit(route('ftfacturas.show', id));

    return (
        <div className="table-responsive">
            <table ref={tableRef} className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th className="text-center" style={{ width: '50px' }}>#</th>
                        <th>Factura / Fecha</th>
                        <th>Cliente</th>
                        <th>Sede / Caja</th>
                        <th className="text-end">Total</th>
                        <th>Estado</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ftfacturas.map((item, index) => (
                        <tr key={item.id}>
                            <td className="text-center text-muted">{index + 1}</td>
                            
                            {/* Información de la Factura */}
                            <td>
                                <div className="d-flex flex-column">
                                    <span className="fw-bold text-dark">
                                        #{item.numero === "0" ? 'Borrador' : item.numero}
                                    </span>
                                    <small className="text-muted">
                                        <i className="ti ti-calendar me-1"></i>{item.fecha}
                                    </small>
                                </div>
                            </td>

                            {/* Información del Cliente */}
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="avtar avtar-s bg-light-primary text-primary me-2">
                                        {item.round || item.nombres?.charAt(0)}
                                    </div>
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold">{item.nombres} {item.apellidos}</span>
                                        <small className="text-muted">{item.identificacion}</small>
                                    </div>
                                </div>
                            </td>

                            {/* Información de Sede y Turno */}
                            <td>
                                <div className="d-flex flex-column">
                                    <span className="small fw-bold">{item.turnos?.terminal?.sede?.nombre || 'N/A'}</span>
                                    <small className="badge bg-light-secondary text-secondary" style={{width: 'fit-content'}}>
                                        {item.turnos?.terminal?.nombre || 'Sin Terminal'}
                                    </small>
                                </div>
                            </td>

                            {/* Monto Total (Si no tienes el campo grand_total en el JSON, ajustarlo) */}
                            <td className="text-end">
                                <span className="fw-bold text-dark">
                                    ${new Intl.NumberFormat().format(item.grand_total || 0)}
                                </span>
                            </td>

                            {/* Estado con Badge Dinámico */}
                            <td>
                                <span className={`badge rounded-pill ${
                                    item.estado_id === 937 ? 'bg-light-warning text-warning' : 
                                    item.estado_id === 11 ? 'bg-light-success text-success' : 'bg-light-secondary'
                                }`}>
                                    <i className={`${item.estado?.observacion || 'ti ti-circle'} me-1`}></i>
                                    {item.estado?.nombre || 'Desconocido'}
                                </span>
                            </td>

                            {/* Acciones */}
                            <td className="text-center">
                                <div className="d-flex justify-content-center gap-1">
                                    <button
                                        onClick={() => handleView(item.id)}
                                        className="btn btn-sm btn-icon btn-link-info"
                                        title="Ver Detalle"
                                    >
                                        <i className="ti ti-eye fs-4"></i>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(item.id)}
                                        className="btn btn-sm btn-icon btn-link-success"
                                        title="Editar"
                                    >
                                        <i className="ti ti-edit fs-4"></i>
                                    </button>
                                    <button
                                        className="btn btn-sm btn-icon btn-link-secondary"
                                        title="Imprimir"
                                    >
                                        <i className="ti ti-printer fs-4"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}