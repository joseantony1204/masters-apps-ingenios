import React from 'react';
import { useFacturacionCita } from '@/hooks/use-facturacion-cita';
import Modal from '@/components/ui/Modal';

interface Props {
    cita: any;
    metodospagosList: Record<string, string>;
    turnoActivo: any;
    turnosList: Record<string, string>;
    sedePredeterminada: any;
    show: boolean;
    onClose: () => void;
}

export default function CitasModalPos({ cita, metodospagosList, turnoActivo, turnosList, sedePredeterminada, show, onClose }: Props) {
    // Extraemos todo lo necesario del hook
    const { 
        form, 
        agregarItem, 
        eliminarItem, 
        cambiarCantidadItem, 
        cambiarDescuentoItem,
        filtroBusqueda, 
        setFiltroBusqueda, 
        resultadosBusqueda, 

        finalizarYGuardarCita,
        abrirModalRapidoProducto, // Asegúrate de que esta función esté en tu hook
        manejarFacturaRapida,
        manejarAbrirTurno,

        facturaData,
        setFacturaData,
        processingFactura,
        facturaErrors,

        turnoData, 
        setTurnoData, 
        processingTurno, 
        turnoErrors,
        showTurnoModal,
        setShowTurnoModal,
   
        couponCode, setCouponCode, validarCupon, appliedCoupon, quitarCupon, isValidatingCoupon,
        totales
    } = useFacturacionCita(cita, turnoActivo);

    const manejarClickFactura = () => {
        // Validamos que haya un método de pago antes de preguntar
        if (!facturaData.metodo_id) {
            alert("Por favor, selecciona un método de pago primero.");
            return;
        }

        // Validamos que haya un turno de pago antes de preguntar
        if (!facturaData.turno_id) {
            alert("Por favor, selecciona o crea un turno primero.");
            return;
        }

        const mensaje = `¿Estás seguro de generar la factura por $${totales.totalFinal.toLocaleString()}?`;
        
        if (window.confirm(mensaje)) {
            manejarFacturaRapida(onClose);
        }
    };
    
    const manejarClickTurno = () => {
        // Validación básica antes de enviar
        if (!turnoData.terminal_id || !turnoData.baseinicial) {
            alert("Por favor, selecciona una terminal e ingresa la base inicial.");
            return;
        }
        manejarAbrirTurno();
    };

    // Si 'show' es falso o no hay cita, no renderizamos nada
    if (!show || !cita) return null;

    return (
        <>
            {/* 1. Backdrop Manual: Oscurece el fondo del dashboard */}
            <div 
                className="modal-backdrop fade show" 
                style={{ zIndex: 1050 }}
                onClick={onClose} 
            ></div>
            
            {/* 2. Estructura del Modal con clases de visibilidad forzadas */}
            <div 
                className="modal fade show" 
                id="modalDetalleCitaPOS"
                style={{ display: 'block', zIndex: 1060 }} 
                tabIndex={-1} 
                aria-modal="true" 
                role="dialog"
            >
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <form onSubmit={(e) => finalizarYGuardarCita(e, onClose)} className="modal-content border-0 shadow-lg">
                        
                        {/* HEADER ESTILO FACTURA */}
                        <div className="modal-header bg-dark text-white p-3 border-0">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary rounded p-2 text-white">
                                    <i className="ti ti-receipt fs-3"></i>
                                </div>
                                <div>
                                    <h5 className="modal-title fw-bold text-white mb-0">Resumen de Cuenta: Cita #{cita?.codigo}</h5>
                                    <small className="opacity-75">Cliente: {form.data.nombreCliente}</small>
                                </div>
                            </div>
                            <button type="button" className="btn-close" onClick={onClose}><i className="ti ti-x"></i></button>
                        </div>

                        <div className="modal-body p-0 bg-light-subtle">
                            <div className="row g-0 h-100">

                                {/* COLUMNA IZQUIERDA: DETALLE DE CARGOS */}
                                <div className="col-lg-8 border-end bg-white">
                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold text-uppercase small text-muted mb-0">Detalle de cargos unificados</h6>
                                            <span className="badge bg-light-primary text-primary">
                                                {(cita?.detalle_con_empleadoservicio?.length || 0) + 
                                                (cita?.detalle_con_producto?.length || 0) + 
                                                (form.data.items?.length || 0)} Items
                                            </span>
                                        </div>
                                        
                                        {/* Cabecera de Tabla */}
                                        <div className="row g-0 align-items-center py-2 px-3 bg-light rounded-3 fw-bold text-muted small mb-2">
                                            <div className="col-1 text-center">#</div>
                                            <div className="col-5">Descripción del Cargo</div>
                                            <div className="col-2 text-center">Cant.</div>
                                            <div className="col-2 text-end">Precio</div>
                                            <div className="col-2 text-end">Total</div>
                                        </div>

                                        <div className="scroll-cargos" style={{maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden'}}>
                                            
                                            {/* A. SERVICIOS BASE (Ya guardados) */}
                                            {cita?.detalle_con_empleadoservicio?.map((detalle: any, index: number) => (
                                                <div key={`serv-${detalle.id}`} className="row g-0 align-items-center py-3 px-3 border-bottom border-light hover-bg-light">
                                                    <div className="col-1 text-center text-muted small">{index + 1}</div>
                                                    <div className="col-5">
                                                        <div className="fw-bold text-dark">{detalle.empleadoservicio?.servicio?.nombre}</div>
                                                        <small className="text-primary" style={{fontSize: '11px'}}>
                                                            <i className="ti ti-user me-1"></i>
                                                            {detalle.empleadoservicio?.empleado?.persona?.personasnaturales?.nombrecompleto}
                                                        </small>
                                                    </div>
                                                    <div className="col-2 text-center">{detalle.cantidad}</div>
                                                    <div className="col-2 text-end fw-medium">${Number(detalle.empleadoservicio?.preciopersonalizado).toLocaleString()}</div>
                                                    <div className="col-2 text-end fw-bold text-dark">${Number(detalle.preciofinal).toLocaleString()}</div>
                                                </div>
                                            ))}

                                            {/* B. PRODUCTOS/ADICIONALES (Ya guardados) */}
                                            {cita?.detalle_con_producto?.map((detalle: any, index: number) => (
                                                <div key={`prod-db-${detalle.id}`} className="row g-0 align-items-center py-3 px-3 border-bottom border-light">
                                                    <div className="col-1 text-center text-muted small">
                                                        {(cita?.detalle_con_empleadoservicio?.length || 0) + index + 1}
                                                    </div>
                                                    <div className="col-5">
                                                        {detalle.producto?.map((p: any) => ( 
                                                            <div key={p.id}>
                                                                <div className="fw-bold text-dark">{p.nombre}</div>
                                                                <span className="badge bg-light-info text-info f-10 text-uppercase" style={{fontSize:'9px'}}>{p?.tipo?.nombre}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="col-2 text-center">{detalle.cantidad}</div>
                                                    <div className="col-2 text-end fw-medium">
                                                        ${Number(detalle.preciofinal / (detalle.cantidad || 1)).toLocaleString()}
                                                    </div>
                                                    <div className="col-2 text-end fw-bold text-dark">
                                                        ${Number(detalle.preciofinal).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* C. NUEVOS ITEMS AGREGADOS EN EL MOMENTO */}
                                            {form.data.items.map((item: any) => (
                                                <div key={`new-${item.unique_id}`} className="row g-0 align-items-center py-3 px-3 border-bottom border-warning-subtle bg-warning-subtle rounded-3 mt-1">
                                                    <div className="col-1 text-center">
                                                        <button type="button" className="btn btn-link btn-sm text-danger p-0" onClick={() => eliminarItem(item.unique_id)}>
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="fw-bold text-dark">{item.nombre}</div>
                                                        <span className="badge bg-light-success text-success f-10 text-uppercase" style={{fontSize:'9px'}}>{item.tipo}</span>
                                                    </div>
                                                    <div className="col-2 text-center">
                                                        <div className="d-flex align-items-center justify-content-center border rounded-pill bg-white p-1 shadow-sm">
                                                            <button type="button" className="btn btn-xs p-0 px-1" onClick={() => cambiarCantidadItem(item.unique_id, 'restar')}><i className="ti ti-minus fs-7"></i></button>
                                                            <span className="px-2 fw-bold small">{item.cantidad}</span>
                                                            <button type="button" className="btn btn-xs p-0 px-1" onClick={() => cambiarCantidadItem(item.unique_id, 'sumar')}><i className="ti ti-plus fs-7"></i></button>
                                                        </div>
                                                    </div>
                                                    <div className="col-2 px-2 text-center">
                                                        <div className="input-group input-group-sm">
                                                            <input 
                                                                type="number" 
                                                                className="form-control form-control-sm text-center border-warning-subtle"
                                                                value={item.descuento}
                                                                onChange={(e) => cambiarDescuentoItem(item.unique_id, e.target.value)}
                                                            />
                                                            <span className="input-group-text bg-white border-warning-subtle" style={{fontSize:'9px'}}>%</span>
                                                        </div>
                                                    </div>
                                                    <div className="col-3 text-end fw-bold text-primary">
                                                        ${Number(item.total).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* BUSCADOR DINÁMICO */}
                                        <div className="mt-4 buscador-pos position-relative">
                                            <div className="input-group input-group-lg shadow-sm border rounded-pill overflow-hidden bg-white">
                                                <span className="input-group-text bg-white border-0 text-muted ps-4"><i className="ti ti-search fs-4"></i></span>
                                                <input 
                                                    type="text" 
                                                    className="form-control border-0 shadow-none ps-2" 
                                                    placeholder="Agregar otro producto o servicio consumido..."
                                                    value={filtroBusqueda}
                                                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                                                />
                                            </div>
                                            
                                            {/* Resultados Buscador (Lista flotante) */}
                                            {(resultadosBusqueda.length > 0 || filtroBusqueda.length > 2) && (
                                                <div className="position-absolute w-100 shadow-lg z-3 mt-1" style={{ top: '100%', left: 0 }}>
                                                    <ul className="list-group rounded-3 overflow-hidden">
                                                        {/* A. Resultados de la base de datos */}
                                                        {resultadosBusqueda.map((res: any) => (
                                                            <li 
                                                                key={res.id} 
                                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer py-3" 
                                                                onClick={() => agregarItem(res)}
                                                            >
                                                                <div>
                                                                    <strong className="text-dark">{res.nombre}</strong> 
                                                                    <span className="badge bg-light-secondary text-muted ms-2" style={{fontSize: '10px'}}>{res.tipo}</span>
                                                                    <div className="text-primary fw-bold small">${Number(res.precio || res.preciosalida).toLocaleString()}</div>
                                                                </div>
                                                                <i className="ti ti-plus fs-4 text-primary"></i>
                                                            </li>
                                                        ))}

                                                        {/* B. OPCIÓN PARA CREAR NUEVO */}
                                                        {filtroBusqueda.length > 2 && (
                                                            <li 
                                                                className="list-group-item list-group-item-action list-group-item-warning d-flex justify-content-between align-items-center cursor-pointer py-3 border-dashed"
                                                                onClick={() => abrirModalRapidoProducto(filtroBusqueda)}
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    <div className="bg-warning text-white rounded-circle p-2 me-3">
                                                                        <i className="ti ti-package-plus fs-4"></i>
                                                                    </div>
                                                                    <div>
                                                                        <strong className="text-dark">¿No encuentras "{filtroBusqueda}"?</strong>
                                                                        <div className="small text-muted">Haz clic para crearlo y agregarlo ahora</div>
                                                                    </div>
                                                                </div>
                                                                <span className="badge bg-warning text-dark fw-bold">NUEVO</span>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA: TOTALES Y OBSERVACIONES */}
                                <div className="col-lg-4 bg-white h-100 border-start shadow-lg">
                                    <div className="p-4 d-flex flex-column h-100 overflow-y-auto" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)' }}>
                                        
                                        {/* ENCABEZADO TIPO TICKET */}
                                        <div className="text-center mb-1 pb-1 border-bottom border-dashed">
                                            <div className="avtar avtar-sm bg-light-primary text-primary mb-2 mx-auto">
                                                <i className="ti ti-cash-banknote fs-1"></i>
                                            </div>
                                            <h6 className="fw-900 mb-1 text-dark">FINALIZAR COBRO</h6>
                                            <p className="text-muted small fw-bold">Verifica los datos de fidelización y pago</p>
                                        </div>

                                        {/* 1. SECCIÓN DE FIDELIZACIÓN (Impacto Visual) */}
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <label className="x-small fw-900 text-uppercase text-muted letter-spacing-1">
                                                    1. FIDELIZACIÓN
                                                </label>
                                            </div>
                                            
                                            <div className="bg-white rounded-3 shadow-sm p-3 border border-light">
                                                <div className="vstack gap-3">
                                                    {/* WhatsApp con Input Group Moderno */}
                                                    <div className="input-group input-group-merge border-bottom pb-2">
                                                        <span className="input-group-text bg-transparent border-0 p-0 me-2">
                                                            <i className="ti ti-brand-whatsapp text-success fs-4"></i>
                                                        </span>
                                                        <input 
                                                            type="tel" 
                                                            className="form-control border-0 p-0 fw-bold" 
                                                            placeholder="Telefono del cliente..."
                                                            style={{ fontSize: '14px' }}
                                                            value={form.data.telefonomovil || ''}
                                                            onChange={(e) => {
                                                                // Elimina cualquier caracter que no sea número
                                                                const value = e.target.value.replace(/\D/g, ''); 
                                                                
                                                                form.setData('telefonomovil', value);
                                                                setFacturaData('telefonomovil', value);
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Fecha Nacimiento con Input Group Moderno */}
                                                    <div className="input-group input-group-merge">
                                                        <span className="input-group-text bg-transparent border-0 p-0 me-2">
                                                            <i className="ti ti-cake text-danger fs-4"></i>
                                                        </span>
                                                        <input 
                                                            type="date" 
                                                            className="form-control border-0 p-0 fw-bold text-muted" 
                                                            style={{ fontSize: '14px' }}
                                                            value={form.data.fechanacimiento || ''}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                form.setData('fechanacimiento', value);
                                                                setFacturaData('fechanacimiento', value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2. CAJA Y MÉTODO (Grid Estilizado) */}
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center justify-content-between mb-3">
                                                <label className="form-label x-small fw-bolder text-uppercase text-muted mb-2">
                                                    2. CONFIGURACIÓN DE PAGO
                                                </label>
                                            </div>
                                            
                                            <div className="bg-white rounded-3 shadow-sm p-3 border border-light">
                                                <div className="vstack gap-3">
                                                    {/* Metodo pago */}
                                                    <div className="input-group input-group-merge border-bottom pb-2">
                                                        <span className="input-group-text bg-transparent border-0 p-0 me-2">
                                                            <i className="ti ti-cash text-info fs-4"></i>
                                                        </span>
                                                        <select 
                                                            className={`form-select border-light bg-light-subtle fw-bold ${facturaErrors.metodo_id ? 'is-invalid' : ''}`}
                                                            style={{ borderRadius: '12px', fontSize: '13px' }}
                                                            value={facturaData.metodo_id} 
                                                            onChange={e => setFacturaData('metodo_id', e.target.value)} 
                                                        >
                                                            <option value="">Metodo de pago...</option>
                                                            {Object.entries(metodospagosList).map(([key, label]) => (
                                                                <option key={key} value={key}>{label}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Turno caja */}
                                                    <div className="input-group input-group-merge">
                                                        {turnoActivo ? (
                                                            <div className="input-group input-group-merge border-bottom pb-2">
                                                                <span className="input-group-text bg-transparent border-0 p-0 me-2">
                                                                    <i className="ti ti-device-floppy text-primary"></i>
                                                                </span>
                                                                <select 
                                                                    
                                                                    className={`form-select border-light bg-light-subtle fw-bold ${facturaErrors.turno_id ? 'is-invalid' : ''}`}
                                                                    value={facturaData.turno_id}
                                                                    onChange={e => setFacturaData('turno_id', e.target.value)}
                                                                >
                                                                    {Array.isArray(turnosList) ? (
                                                                        turnosList.map((t: any) => (
                                                                            <option key={t.id} value={t.id}>{t.codigo} — {t.terminal?.nombre}</option>
                                                                        ))
                                                                    ) : (
                                                                        <option value={turnoActivo.id}>{turnoActivo.codigo}</option>
                                                                    )}
                                                                </select>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger w-100 border-dashed fw-bold"
                                                                onClick={() => setShowTurnoModal(true)}
                                                            >
                                                                <i className="ti ti-alert-triangle me-1"></i> ABRIR TURNO REQUERIDO
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 3. CUPÓN (Estilo Neumórfico) */}
                                        <div className="mb-4">
                                            {!appliedCoupon ? (
                                                <div className="input-group shadow-sm rounded-3 overflow-hidden border border-primary border-dashed">
                                                    <span className="input-group-text bg-white border-0"><i className="ti ti-ticket text-primary"></i></span>
                                                    <input 
                                                        type="text" 
                                                        className="form-control border-0 bg-white fw-bold" 
                                                        placeholder="CÓDIGO PROMOCIONAL"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    />
                                                    <button className="btn btn-primary fw-bold" type="button" onClick={validarCupon} disabled={isValidatingCoupon || !couponCode}>
                                                        {isValidatingCoupon ? <span className="spinner-border spinner-border-sm"></span> : 'APLICAR'}
                                                    </button>
                                                </div>
                                            ) : (
                                                
                                                <div className="p-2 rounded-3 bg-light-primary border border-primary border-dashed d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avtar avtar-s bg-primary text-white me-2" style={{ width: '30px', height: '30px' }}>
                                                            <i className="ti ti-ticket fs-5"></i>
                                                        </div>
                                                        <div>
                                                            <small className="d-block text-muted lh-1" style={{ fontSize: '10px' }}>CUPÓN ACTIVO</small>
                                                            <span className="fw-bolder text-primary small">{appliedCoupon.promociones.nombre}</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-1">
                                                        {/* Botón RE-APLICAR / RECALCULAR */}
                                                        <button 
                                                            type="button"  // <--- CRUCIAL: Esto evita el submit del formulario
                                                            className="btn btn-sm btn-link-primary p-1" 
                                                            title="Recalcular" 
                                                            onClick={(e) => {
                                                                e.preventDefault(); // Doble seguridad
                                                                validarCupon();
                                                            }}
                                                            disabled={isValidatingCoupon}
                                                        >
                                                            {isValidatingCoupon ? (
                                                                <span className="spinner-border spinner-border-sm"></span>
                                                            ) : (
                                                                <i className="ti ti-refresh fs-5"></i>
                                                            )}
                                                        </button>

                                                        {/* Botón ELIMINAR */}
                                                        <button 
                                                            type="button" // <--- CRUCIAL
                                                            className="btn btn-sm btn-link-danger p-1" 
                                                            title="Quitar" 
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                quitarCupon();
                                                            }}
                                                        >
                                                            <i className="ti ti-trash fs-5"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* --- NOTAS --- */}
                                        <div className="mb-4">
                                            <label className="form-label x-small fw-bolder text-uppercase text-muted mb-2">
                                                3. RECOMENDACIONES / FORMULAS
                                            </label>
                                            <textarea 
                                                className="form-control border-0 shadow-sm bg-white" 
                                                rows={2}
                                                style={{ resize: 'none', fontSize: '14px' }}
                                                placeholder="Escribe aquí las observaciones finales..."
                                                value={form.data.observaciones}
                                                onChange={(e) => form.setData('observaciones', e.target.value)}
                                            ></textarea>
                                        </div>

                                        {/* 4. TOTALES (Diseño Premium) */}
                                        <div className="mb-4">
                                            <label className="form-label x-small fw-bolder text-uppercase text-muted mb-2">
                                                4. SERVICIOS Y CONSUMOS
                                            </label>
                                            <div className="bg-white rounded-3 p-4 shadow-blue-sm border border-light position-relative overflow-hidden">
                                                {/* Decoración de fondo */}
                                                
                                                <div className="vstack gap-2 position-relative z-1">
                                                    <div className="d-flex justify-content-between mb-1">
                                                        <span className="text-muted small">Subtotal base</span>
                                                        <span className="fw-semibold text-dark">${(totales.subtotalServicios + totales.subtotalProductosPrevios).toLocaleString()}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span className="text-muted small">Nuevos consumos</span>
                                                        <span className="text-warning fw-bold small">+ ${totales.subtotalNuevos.toLocaleString()}</span>
                                                    </div>
                                                    
                                                    {totales.montoDescuento > 0 && (
                                                        <div className="d-flex justify-content-between mb-2 p-2 bg-light-danger rounded-2">
                                                            <span className="text-danger fw-bold small">DESCUENTO ({appliedCoupon?.promociones.valor}%)</span>
                                                            <span className="text-danger fw-bold">-${totales.montoDescuento.toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="d-flex justify-content-between align-items-end">
                                                        <div>
                                                            <p className="text-uppercase text-muted fw-bolder mb-0" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>Total a cobrar</p>
                                                            <h2 className="fw-bolder text-primary mb-0" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
                                                                <small className="fs-4 fw-normal text-muted">$</small>
                                                                {totales.totalFinal.toLocaleString()}
                                                            </h2>
                                                        </div>
                                                        <div className="text-end">
                                                            <i className="ti ti-shield-check text-success fs-2 d-block"></i>
                                                            <small className="fw-bold text-muted" style={{fontSize: '9px'}}>PAGO SEGURO</small>
                                                        </div>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <style dangerouslySetInnerHTML={{ __html: `
                                    .shadow-blue-sm { box-shadow: 0 10px 30px -10px rgba(0, 149, 255, 0.15); }
                                    .letter-spacing-1 { letter-spacing: 1px; }
                                    .opacity-05 { opacity: 0.05; }
                                    .fw-900 { font-weight: 900; }
                                    .border-dashed { border-style: dashed !important; }
                                `}} />
                            </div>
                        </div>

                        {/* FOOTER ACCIONES */}
                        <div className="modal-footer border-top bg-white p-3">
                            {/* BOTONES DE ACCIÓN */}
                            <div className="d-grid gap-1">
                                <button 
                                    type="button" 
                                    className="btn btn-primary btn-small fw-bold shadow-sm"
                                    onClick={manejarClickFactura}
                                    disabled={processingFactura}
                                >
                                    {processingFactura ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span>Facturando...</>
                                    ) : (
                                        <><i className="ti ti-bolt me-1"></i> Factura rápida</>
                                    )}
                                </button>
                                
                                <button type="submit" className="btn btn-outline-primary border-2 fw-bold" disabled={form.processing}>
                                    {form.processing ? 'Guardando...' : 'Solo actualizar detalle'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>

            {/* Modal para Abrir Turno */}
            <Modal show={showTurnoModal} onClose={() => setShowTurnoModal(false)} maxWidth="md">
                <div className="overflow-hidden rounded-3">
                    <div className="bg-primary p-4 text-white">
                        <h4 className="mb-0 text-white d-flex align-items-center gap-2">
                            <i className="ti ti-device-floppy fs-2"></i>
                            Apertura de Caja
                        </h4>
                    </div>
                    
                    <div className="p-4">
                        <div className="alert alert-info border-0 shadow-none mb-4">
                            <p className="mb-0 small">
                                Registra el saldo inicial.
                            </p>
                        </div>

                        <div className="modal-body-wrapper">
                            {/* Código Interno */}
                            <div className="mb-3">
                                <label className="form-label fw-bold">Código Interno</label>
                                <input 
                                    type="text" 
                                    className={`form-control border-0 bg-light ${turnoErrors.codigo ? 'is-invalid' : ''}`}
                                    value={turnoData.codigo} 
                                    onChange={e => setTurnoData('codigo', e.target.value)} 
                                    placeholder="Ej: TRN-001" 
                                />
                                {turnoErrors.codigo && <div className="invalid-feedback">{turnoErrors.codigo}</div>}
                            </div>

                            {/* Terminal con Tipado Corregido */}
                            <div className="mb-3">
                                <label className="form-label fw-bold text-primary">Terminal (Caja POS)</label>
                                <select 
                                    className={`form-select border-0 bg-light ${turnoErrors.terminal_id ? 'is-invalid' : ''}`}
                                    value={turnoData.terminal_id} 
                                    onChange={e => setTurnoData('terminal_id', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione Terminal...</option>
                                    {sedePredeterminada?.terminal?.map((ter: any) => ( // Cambia any por tu interfaz Terminal si la tienes
                                        <option key={ter.id} value={ter.id}>{ter.nombre}</option>
                                    ))}
                                </select>
                                {turnoErrors.terminal_id && <div className="invalid-feedback d-block">{turnoErrors.terminal_id}</div>}
                            </div>

                            {/* Base Inicial */}
                            
                            <div className="mb-3">
                                <label className="form-label fw-bold">Base inicial (Efectivo)</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light">$</span>
                                    <input 
                                        type="number" 
                                        className={`form-control form-control-lg ${turnoErrors.baseinicial ? 'is-invalid' : ''}`}
                                        value={turnoData.baseinicial}
                                        onChange={e => setTurnoData('baseinicial', e.target.value)}
                                        required
                                    />
                                </div>
                                {turnoErrors.baseinicial && <div className="text-danger small mt-1">{turnoErrors.baseinicial}</div>}
                            </div>

                            {/* Observaciones */}
                            <div className="mb-4">
                                <label className="form-label fw-bold">Observaciones de apertura</label>
                                <textarea 
                                    className="form-control border-0 bg-light" 
                                    rows={2}
                                    value={turnoData.descripcion}
                                    onChange={e => setTurnoData('descripcion', e.target.value)}
                                    placeholder="Ej: Turno mañana..."
                                ></textarea>
                            </div>

                            <div className="d-grid gap-2">
                                <button 
                                    type="button" // Cambiado de submit a button para evitar conflictos
                                    className="btn btn-primary btn-lg shadow-sm d-flex align-items-center justify-content-center gap-2" 
                                    disabled={processingTurno}
                                    onClick={manejarClickTurno} // Llamada manual
                                >
                                    {processingTurno ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            <span>Guardando turno...</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="ti ti-device-floppy fs-4"></i>
                                            <span>Confirmar y Abrir Turno</span>
                                        </>
                                    )}
                                </button>
                                
                                <button 
                                    type="button" 
                                    className="btn btn-link text-muted fw-bold" 
                                    onClick={() => setShowTurnoModal(false)}
                                    disabled={processingTurno}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}