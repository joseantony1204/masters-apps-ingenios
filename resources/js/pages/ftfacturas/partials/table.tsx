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
                <thead className="table-light text-muted">
                    <tr className="small text-uppercase">
                        <th className="text-center ps-4" style={{ width: '40px' }}>#</th>
                        <th>Información Factura</th>
                        <th>Cliente / Identificación</th>
                        <th>Punto de Venta (Sede/Caja)</th>
                        <th className="text-end">Monto Total</th>
                        <th className="text-center pe-4">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ftfacturas.map((item, index) => {
                        const subtotal = Number(item.subtotal || 0);
                        const descuento = Number(item.descuento || 0);
                        const totalFinal = Number(item.total || 0);
                        const porcentajeDesc = item.porcentajedescuento || (descuento > 0 ? Math.round((descuento / subtotal) * 100) : 0);

                        // --- LÓGICA DE IDENTIFICACIÓN POR TIPO ---
                        const obtenerConfigTipo = (tipoId:number) => {
                            switch (tipoId) {
                                case 942:
                                    return { label: 'Compra', color: 'danger', icon: 'ti ti-shopping-cart', bg: 'bg-light-danger' };
                                case 943:
                                    // Mantenemos la distinción si es Cita o Venta Directa
                                    return { 
                                        label: item.model_type === 921 ? 'Cita' : 'Venta', 
                                        color: 'primary', 
                                        icon: item.model_type === 921 ? 'ti ti-calendar-event' : 'ti ti-tag', 
                                        bg: 'bg-light-primary' 
                                    };
                                case 944:
                                    return { label: 'Vale/Adelanto', color: 'warning', icon: 'ti ti-cash', bg: 'bg-light-warning' };
                                case 1063:
                                    return { label: 'Nómina', color: 'info', icon: 'ti ti-briefcase', bg: 'bg-light-info' };
                                default:
                                    return { label: 'Documento', color: 'secondary', icon: 'ti ti-file-text', bg: 'bg-light-secondary' };
                            }
                        };

                        const config = obtenerConfigTipo(item.tipo_id);

                        return (
                            <tr key={item.id}>
                                <td className="text-center text-muted ps-4 small">{index + 1}</td>
                                
                                {/* COLUMNA 1: FACTURA, TIPO Y FECHA */}
                                <td>
                                    <div className="d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold text-dark">
                                                {item.numero === "0" ? 'Borrador' : `#${item.numero}`}
                                            </span>
                                            <span className={`badge bg-light-${item.estado?.observacion} text-${item.estado?.observacion} border-0`} style={{fontSize: '10px', padding: '2px 6px'}}>
                                                {item.estado?.nombre}
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            {/* Icono dinámico según el tipo_id */}
                                            <i className={`${config.icon} text-${config.color}`} title={config.label}></i>
                                            <span className={`text-${config.color} fw-bold`} style={{fontSize: '11px'}}>
                                                {config.label}
                                            </span>
                                            <span className="text-muted" style={{fontSize: '11px'}}>•</span>
                                            <small className="text-muted" style={{fontSize: '11px'}}>
                                                {new Date(item.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                {/* COLUMNA 2: CLIENTE CON AVATAR DINÁMICO */}
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className={`avtar avtar-s ${config.bg} text-${config.color} me-2 fw-bold`}>
                                            {item.round || item.nombres?.charAt(0)}
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="fw-bold">{item.nombres} {item.apellidos}</span>
                                            <small className="text-muted">{item.identificacion}</small>
                                        </div>
                                    </div>
                                </td>

                                {/* COLUMNA 3: SEDE Y CAJA */}
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="bg-light-secondary rounded-circle p-1 me-2">
                                            <i className="ti ti-building-store fs-5 text-secondary"></i>
                                        </div>
                                        <div className="d-flex flex-column">
                                            <span className="small fw-bold">{item.turnos?.terminal?.sede?.nombre || 'Sede'}</span>
                                            <span className="x-small text-muted">{item.turnos?.terminal?.nombre || 'Caja'}</span>
                                        </div>
                                    </div>
                                </td>

                                {/* COLUMNA 4: BLOQUE FINANCIERO */}
                                <td className="text-end">
                                    <div className="d-flex flex-column align-items-end">
                                        {descuento > 0 && (
                                            <small className="text-muted text-decoration-line-through x-small">
                                                ${new Intl.NumberFormat('es-CO').format(subtotal)}
                                            </small>
                                        )}
                                        <div className="d-flex align-items-center gap-1">
                                            {descuento > 0 && (
                                                <span className="badge bg-light-danger text-danger border-0 p-1" style={{fontSize: '9px'}}>
                                                    -{porcentajeDesc}%
                                                </span>
                                            )}
                                            <span className="fw-bold text-dark fs-6">
                                                ${new Intl.NumberFormat('es-CO').format(totalFinal)}
                                            </span>
                                        </div>
                                        {item.cupon_id && (
                                            <small className="text-primary x-small fw-medium">
                                                <i className="ti ti-ticket me-1"></i>{item.adcupon?.codigo}
                                            </small>
                                        )}
                                    </div>
                                </td>

                                {/* COLUMNA 5: ACCIONES */}
                                <td className="text-center pe-4">
                                    <div className="d-flex justify-content-center">
                                        <button onClick={() => handleView(item.id)} className="btn btn-sm btn-icon btn-link-secondary border-0"><i className="ti ti-eye fs-4"></i></button>
                                        <button onClick={() => handleEdit(item.id)} className="btn btn-sm btn-icon btn-link-secondary border-0"><i className="ti ti-edit fs-4"></i></button>
                                        <div className="vr mx-1 my-2 opacity-25"></div>
                                        <button className="btn btn-sm btn-icon btn-link-secondary border-0"><i className="ti ti-printer fs-4"></i></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}