import React, { useEffect, useRef, useState } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';

interface Props {
    scsuscripciones: any[];
}

export default function Table({ scsuscripciones }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    const [expandedRows, setExpandedRows] = useState<number[]>([]);

    useEffect(() => {
        if (tableRef.current) {
            initDataTable(tableRef.current);
        }
    }, [scsuscripciones]);

    const toggleRow = (id: number) => {
        setExpandedRows(prev => 
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const handlePay = (suscripcion: number, planId: number) => {
        router.post(route('scsuscripciones.gopay'), { id: suscripcion, plan_id: planId });
    };

    const formatCurrency = (val: any) => 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

    const getProgressInfo = (inicio: string, vencimiento: string) => {
        const fechaInicio = dayjs(inicio).startOf('day');
        const fechaVencimiento = dayjs(vencimiento).startOf('day');
        const hoy = dayjs().startOf('day');
    
        const total = Math.max(1, fechaVencimiento.diff(fechaInicio, 'day'));
        const transcurrido = hoy.diff(fechaInicio, 'day'); // Días que ya pasaron
        const restan = fechaVencimiento.diff(hoy, 'day');
    
        // Porcentaje de consumo: de 0% (nuevo) a 100% (vencido)
        const porcentajeConsumido = Math.max(0, Math.min(100, (transcurrido * 100) / total));
        
        // Si prefieres que la barra muestre lo que QUEDA (como en la imagen pero corregido):
        // const porcentajeRestante = Math.max(0, Math.min(100, (restan * 100) / total));
    
        return {
            restan: restan > 0 ? restan : 0,
            porcentaje: porcentajeConsumido, // Ahora mostrará 0% si empezó hoy
            color: restan <= 3 ? 'danger' : restan <= 7 ? 'warning' : 'success'
        };
    };

    return (
        <div className="table-responsive">
            <table ref={tableRef} className="table table-hover align-middle">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: '40px' }}></th>
                        <th style={{ width: '20%' }}>Comercio / Plan</th>
                        <th style={{ width: '25%' }}>Vencimiento & Progreso</th>
                        <th className="text-center">Estado suscripción</th>
                        <th className="text-center">Último pago</th>
                        <th className="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {scsuscripciones.map((sub) => {
                        const info = getProgressInfo(sub.fecha_inicio, sub.fecha_vencimiento);
                        const isExpanded = expandedRows.includes(sub.id);
                        const ultimoPago = sub.pagos.length > 0 
                            ? sub.pagos.sort((a: any, b: any) => b.id - a.id)[0] 
                            : null;

                        return (
                            <React.Fragment key={sub.id}>
                                <tr className={isExpanded ? 'table-active' : ''}>
                                    <td>
                                        <button 
                                            onClick={() => toggleRow(sub.id)}
                                            className="btn btn-link-secondary avtar avtar-s border-0"
                                        >
                                            <i className={`ti ti-chevron-${isExpanded ? 'up' : 'down'} f-18`}></i>
                                        </button>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className={`avtar avtar-s bg-light-${sub.plan.id === 968 ? 'success' : 'primary'} me-2`}>
                                                <i className={`ti ti-${sub.plan.id === 972 ? 'crown' : 'package'} f-18`}></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{sub.comercio.nombre}</h6>
                                                <small className="text-muted fw-bold">{sub.plan.nombre}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-between align-items-end mb-1">
                                            <div>
                                                <small className={`fw-black f-12 text-${info.color} text-uppercase`}>
                                                    {info.restan > 0 ? `Quedan ${info.restan} días` : 'Plazo Vencido'}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <span className="badge bg-light text-dark border f-10">
                                                    {info.porcentaje.toFixed(0)}% consumido
                                                </span>
                                            </div>
                                        </div>

                                        {/* Barra de Progreso */}
                                        <div className="progress mb-2" style={{ height: '8px', borderRadius: '4px' }}>
                                            <div 
                                                className={`progress-bar progress-bar-striped progress-bar-animated bg-${info.color}`} 
                                                role="progressbar" 
                                                style={{ width: `${info.porcentaje}%` }}
                                            ></div>
                                        </div>

                                        {/* Fechas de Inicio y Fin detalladas */}
                                        <div className="d-flex justify-content-between align-items-center opacity-75">
                                            <div className="d-flex align-items-center">
                                                <i className="ti ti-calendar-event me-1 f-12"></i>
                                                <span className="f-11">{dayjs(sub.fecha_inicio).format('DD/MM/YYYY')}</span>
                                            </div>
                                            <div className="text-muted f-11 mx-1">—</div>
                                            <div className="d-flex align-items-center">
                                                <span className="f-11 fw-bold text-dark">{dayjs(sub.fecha_vencimiento).format('DD/MM/YYYY')}</span>
                                                <i className="ti ti-flag-2 me-1 f-12 ms-1"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-center">
                                        <span className={`badge bg-light-${sub.estado.observacion} text-${sub.estado.observacion} px-3 py-2 rounded-pill border border-${sub.estado.observacion}`}>
                                            {sub.estado.nombre}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        {ultimoPago ? (
                                            <div className="d-flex flex-column align-items-center">
                                                <span className="fw-bold f-14">{formatCurrency(ultimoPago.valor)}</span>
                                                <span className={`badge f-10 bg-light-${ultimoPago.estado.id === 974 ? 'success' : 'warning'} text-${ultimoPago.estado.id === 974 ? 'success' : 'warning'}`}>
                                                    {ultimoPago.estado.nombre}
                                                </span>
                                            </div>
                                        ) : '---'}
                                    </td>
                                    <td className="text-end">
                                        {(sub.estado.id != 980 && sub.plan.id != 968) && (
                                            <button 
                                                onClick={() => handlePay(sub.id,sub.plan_id)}
                                                className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm fw-bold"
                                            >
                                                Pagar
                                            </button>
                                        )}
                                    </td>
                                </tr>

                                {/* FILA EXPANDIBLE: HISTORIAL DE PAGOS */}
                                {isExpanded && (
                                    <tr>
                                        <td colSpan={6} className="bg-light-secondary bg-opacity-10 p-4">
                                            <div className="card border-0 shadow-none bg-transparent mb-0">
                                                <div className="card-header bg-transparent border-0 ps-0 pt-0">
                                                    <h6 className="mb-0"><i className="ti ti-history me-2"></i>Historial de Intentos de Pago</h6>
                                                </div>
                                                <div className="card-body p-0">
                                                    <div className="table-responsive">
                                                        <table className="table table-sm table-borderless mb-0">
                                                            <thead>
                                                                <tr className="text-muted f-12">
                                                                    <th>REFERENCIA</th>
                                                                    <th>FECHA</th>
                                                                    <th>MÉTODO</th>
                                                                    <th>VALOR</th>
                                                                    <th>ESTADO</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {sub.pagos.length > 0 ? (
                                                                    sub.pagos.map((pago: any) => (
                                                                        <tr key={pago.id} className="f-13">
                                                                            <td className="fw-bold text-primary">{pago.referencia_pasarela || 'N/A'}</td>
                                                                            <td>{dayjs(pago.created_at).format('DD MMM, YYYY hh:mm A')}</td>
                                                                            <td>{pago.metodo?.nombre || 'Desconocido'}</td>
                                                                            <td className="fw-bold">{formatCurrency(pago.valor)}</td>
                                                                            <td>
                                                                                <span className={`badge f-10 bg-${pago.estado.nombre === 'APROBADO' ? 'success' : 'warning'} bg-opacity-10 text-${pago.estado.nombre === 'APROBADO' ? 'success' : 'warning'}`}>
                                                                                    {pago.estado.nombre}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    ))
                                                                ) : (
                                                                    <tr><td colSpan={5} className="text-center py-3 text-muted">No hay intentos de pago registrados.</td></tr>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>

            <style dangerouslySetInnerHTML={{ __html: `
                .progress { border-radius: 4px; background-color: #f1f1f1; overflow: hidden; }
                .tracking-widest { letter-spacing: 0.1em; }
                .f-10 { font-size: 10px; }
                .f-11 { font-size: 11px; }
                .f-12 { font-size: 12px; }
                .f-14 { font-size: 14px; }
                .table-active { background-color: rgba(var(--bs-primary-rgb), 0.05) !important; }
                .badge { font-weight: 700; text-transform: uppercase; }
            `}} />
        </div>
    );
}