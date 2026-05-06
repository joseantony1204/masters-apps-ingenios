import React from 'react';

export const FacturacionModalPos = ({ hook }: { hook: any }) => {
    // Extraemos empleados del hook para que sea más limpio
    const { empleados, loadingEmpleados, data, setData, errors, processing, tipoMovimiento, mostrarModal, cerrarModal, enviarMovimiento } = hook;

    if (!mostrarModal) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                    <form onSubmit={enviarMovimiento}>
                        {/* HEADER */}
                        <div className="modal-header border-0 p-4 pb-2">
                            <h5 className="fw-900 mb-0 d-flex align-items-center">
                                <div className={`avtar avtar-sm me-3 rounded-3 ${tipoMovimiento.id === 942 ? 'bg-light-danger text-danger' : 'bg-light-warning text-warning'}`}>
                                    <i className={`ti ${tipoMovimiento.id === 942 ? 'ti-receipt-2' : 'ti-cash-banknote'} fs-4`}></i>
                                </div>
                                <span className="text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                    Registrar {tipoMovimiento.nombre}
                                </span>
                            </h5>
                            <button type="button" className="btn-close shadow-none" onClick={cerrarModal}></button>
                        </div>

                        <div className="modal-body p-4">
                            {/* CAMPO MONTO */}
                            <div className="mb-4">
                                <label className="form-label fw-bold text-muted small text-uppercase mb-2" style={{ fontSize: '10px' }}>
                                    Monto del {tipoMovimiento.nombre}
                                </label>
                                <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden border">
                                    <span className="input-group-text bg-white border-0 fw-bold text-dark">$</span>
                                    <input 
                                        type="number" 
                                        className={`form-control border-0 fw-bolder ${errors.monto ? 'is-invalid' : ''}`}
                                        placeholder="0.00"
                                        value={data.monto}
                                        onChange={e => setData('monto', e.target.value)}
                                        required
                                        autoFocus
                                        style={{ fontSize: '1.5rem' }}
                                    />
                                </div>
                                {errors.monto && <div className="text-danger small mt-1 fw-bold">{errors.monto}</div>}
                            </div>

                            {/* SELECTOR DINÁMICO (EMPLEADOS O CATEGORÍA) */}
                            <div className="mb-4">
                                {tipoMovimiento.id === 944 ? (
                                    <>
                                        <label className="form-label fw-bold text-muted small text-uppercase mb-2" style={{ fontSize: '10px' }}>
                                            Empleado / Beneficiario
                                        </label>
                                        <div className="position-relative">
                                            <select 
                                                className={`form-select form-select-lg border shadow-sm rounded-3 fw-bold ${errors.model_type_id ? 'is-invalid' : ''}`}
                                                value={data.model_type_id}
                                                onChange={e => setData('model_type_id', e.target.value)}
                                                required
                                                disabled={loadingEmpleados}
                                                style={{ fontSize: '14px' }}
                                            >
                                                <option value="">{loadingEmpleados ? 'Cargando lista...' : 'Seleccionar empleado...'}</option>
                                                {empleados.map((emp: any) => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.nombre_completo || `${emp.nombres} ${emp.apellidos}`}
                                                    </option>
                                                ))}
                                            </select>
                                            {loadingEmpleados && (
                                                <div className="spinner-border spinner-border-sm text-primary position-absolute" 
                                                     style={{ right: '40px', top: '15px' }}></div>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <label className="form-label fw-bold text-muted small text-uppercase mb-2" style={{ fontSize: '10px' }}>
                                            Categoría de Gasto
                                        </label>
                                        <select 
                                            className="form-select form-select-lg border shadow-sm rounded-3 fw-bold" 
                                            style={{ fontSize: '14px' }}
                                            value={data.model_type_id}
                                            onChange={e => setData('model_type_id', e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccionar categoría...</option>
                                            <option value="1">Insumos / Productos</option>
                                            <option value="2">Servicios Públicos</option>
                                            <option value="3">Mantenimiento</option>
                                            <option value="4">Otros</option>
                                        </select>
                                    </>
                                )}
                                {errors.model_type_id && <div className="text-danger small mt-1 fw-bold">{errors.model_type_id}</div>}
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div className="mb-2">
                                <label className="form-label fw-bold text-muted small text-uppercase mb-2" style={{ fontSize: '10px' }}>
                                    Descripción / Concepto
                                </label>
                                <textarea 
                                    className={`form-control border shadow-sm rounded-3 ${errors.descripcion ? 'is-invalid' : ''}`}
                                    rows={3}
                                    placeholder="Detalles del movimiento..."
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    required
                                    style={{ fontSize: '14px' }}
                                ></textarea>
                                {errors.descripcion && <div className="text-danger small mt-1 fw-bold">{errors.descripcion}</div>}
                            </div>
                        </div>

                        {/* FOOTER ACCIONES */}
                        <div className="modal-footer border-0 p-4 pt-0">
                            <button 
                                type="button" 
                                className="btn btn-light fw-bold rounded-pill px-4" 
                                onClick={cerrarModal}
                                disabled={processing}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                className={`btn ${tipoMovimiento.id === 942 ? 'btn-danger shadow-danger' : 'btn-warning shadow-warning'} fw-900 rounded-pill px-5 flex-grow-1 flex-md-grow-0`}
                                disabled={processing}
                            >
                                {processing ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span> PROCESANDO...</>
                                ) : (
                                    <>CONFIRMAR REGISTRO</>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-900 { font-weight: 900; }
                .shadow-danger { box-shadow: 0 8px 20px -5px rgba(220, 53, 69, 0.4); }
                .shadow-warning { box-shadow: 0 8px 20px -5px rgba(255, 193, 7, 0.4); }
                .modal-content { animation: modalSlideUp 0.3s ease-out; }
                @keyframes modalSlideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}} />
        </div>
    );
};