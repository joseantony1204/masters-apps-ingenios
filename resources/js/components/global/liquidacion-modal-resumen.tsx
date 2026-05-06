import React from 'react';

interface Props {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: any[];
    loading: boolean;
    fechas: { inicio: string, fin: string };
    // Opcional: si quieres permitir cambiar fechas desde la modal, 
    // podrías pasar setFiltroNomina aquí, pero por ahora mostramos control.
}

const LiquidacionModalResumen = ({ 
    show, 
    onClose, 
    onConfirm, 
    data = [], 
    loading,
    fechas
}: Props) => {
    if (!show) return null;

    const safeData = Array.isArray(data) ? data : [];
    const totalGeneral = safeData.reduce((acc, emp) => acc + Number(emp?.total_ganado_empleado || 0), 0);

    return (
        <div 
            className="modal fade show d-block" 
            style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1055 }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-2xl" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                    
                    {/* HEADER CON INFORMACIÓN DE RANGO */}
                    <div className="modal-header border-0 p-4 bg-white d-flex justify-content-between align-items-start">
                        <div>
                            <h4 className="fw-900 mb-1 text-dark">Confirmar Nómina</h4>
                            <div className="d-flex align-items-center gap-2">
                                <span className="badge bg-light text-muted border px-2 py-1">
                                    <i className="ti ti-calendar-event me-1"></i>
                                    {fechas.inicio} al {fechas.fin}
                                </span>
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-2 py-1">
                                    {safeData.length} Especialistas
                                </span>
                            </div>
                        </div>
                        <button onClick={onClose} className="btn-close shadow-none" disabled={loading}></button>
                    </div>

                    <div className="modal-body p-4 pt-0">
                        {/* ALERT DE ADVERTENCIA SOBRE FECHAS */}
                        <div className="alert alert-warning border-0 rounded-3 mb-4 d-flex align-items-center" style={{ backgroundColor: '#fff7ed', color: '#9a3412' }}>
                            <i className="ti ti-alert-triangle fs-3 me-3"></i>
                            <small className="fw-bold">
                                Al confirmar, todos los servicios y vales del rango seleccionado se marcarán como pagados y no aparecerán en futuros cálculos.
                            </small>
                        </div>

                        <div className="table-responsive rounded-3 border border-light shadow-sm" style={{ maxHeight: '400px' }}>
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light sticky-top" style={{ zIndex: 1 }}>
                                    <tr className="text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                                        <th className="ps-4 py-3">ESPECIALISTA</th>
                                        <th className="text-end py-3">RECAUDO BRUTO</th>
                                        <th className="text-end py-3">VALES</th>
                                        <th className="text-end pe-4 py-3">NETO A PAGAR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {safeData.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-5">
                                                <i className="ti ti-user-x fs-1 text-muted opacity-25"></i>
                                                <p className="text-muted mt-2">No hay datos para liquidar en este rango.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        safeData.map((emp) => (
                                            <tr key={emp.id}>
                                                <td className="ps-4 py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avtar avtar-s bg-light-primary text-primary me-2" style={{width: '32px', height: '32px', borderRadius: '10px'}}>
                                                            {emp.nombre.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="fw-800 text-dark f-14">{emp.nombre}</div>
                                                            <div className="text-muted" style={{fontSize: '10px'}}>{emp.total_servicios} servicios realizados</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="text-end fw-bold text-dark">
                                                    <small className="text-muted d-block fw-normal" style={{fontSize: '9px'}}>Comisiones + Propinas</small>
                                                    ${(emp.suma_comisiones + emp.suma_propinas).toLocaleString()}
                                                </td>
                                                <td className={`text-end fw-bold ${emp.suma_vales > 0 ? 'text-danger' : 'text-muted'}`}>
                                                    <small className="text-muted d-block fw-normal" style={{fontSize: '9px'}}>Deducciones</small>
                                                    {emp.suma_vales > 0 ? `-$${emp.suma_vales.toLocaleString()}` : '$0'}
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="fw-900 text-primary fs-6">
                                                        ${Number(emp.total_ganado_empleado).toLocaleString()}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FOOTER CON TOTALES Y BOTÓN DE ACCIÓN */}
                    <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-between align-items-center">
                        <div className="bg-light p-3 rounded-3 flex-grow-1 me-3 d-flex justify-content-between align-items-center">
                            <div>
                                <span className="text-muted fw-bold d-block" style={{fontSize: '10px'}}>TOTAL NETO A DISPERSAR</span>
                                <h3 className="fw-900 text-dark mb-0">${totalGeneral.toLocaleString()}</h3>
                            </div>
                            <i className="ti ti-wallet fs-1 text-primary opacity-25"></i>
                        </div>

                        <div className="d-flex gap-2">
                            <button className="btn btn-light-secondary px-4 fw-bold" style={{borderRadius: '14px'}} onClick={onClose} disabled={loading}>
                                Cancelar
                            </button>
                            <button 
                                className="btn btn-primary shadow-blue-deep px-4 py-3 fw-bold" 
                                style={{ borderRadius: '16px' }}
                                onClick={onConfirm}
                                disabled={loading || safeData.length === 0}
                            >
                                {loading ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>Cerrando Periodo...</>
                                ) : (
                                    <><i className="ti ti-circle-check me-2 fs-4"></i>Confirmar Pago</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiquidacionModalResumen;