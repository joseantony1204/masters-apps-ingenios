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
        showMetodosExtra,
        setShowMetodosExtra,
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
                                
                                {/* COLUMNA DERECHA: PROCESO DE PAGO Y FIDELIZACIÓN */}
                                <div className="col-lg-4 bg-white d-flex flex-column border-start shadow-lg" style={{ height: '100%' }}>
                                    {/* HEADER: CLIENTE */}
                                    <div className="p-3 bg-light-subtle border-bottom">
                                        {cita?.adcliente ? (
                                            /* VISTA: CLIENTE VINCULADO */
                                            <div className="d-flex align-items-center bg-white p-2 rounded-3 shadow-sm border border-light">
                                                <div className="flex-shrink-0 position-relative">
                                                    {cita?.foto ? (
                                                        <img 
                                                            src={cita?.foto} 
                                                            className="rounded-circle border border-white shadow-sm object-fit-cover" 
                                                            style={{ width: '45px', height: '45px' }} 
                                                            alt="User" 
                                                        />
                                                    ) : (
                                                        /* Icono/Avatar por defecto si no hay foto */
                                                        <div className="rounded-circle bg-light-primary text-primary d-flex align-items-center justify-content-center fw-bold shadow-sm" 
                                                            style={{ width: '45px', height: '45px', fontSize: '14px' }}>
                                                            {cita?.round.toUpperCase()}
                                                        </div>
                                                    )}
                                                    {/* Indicador de estado/fidelidad opcional */}
                                                    <span className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1"></span>
                                                </div>
                                                
                                                <div className="flex-grow-1 ms-3">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h6 className="mb-0 fw-900 text-dark" style={{ fontSize: '13px' }}>
                                                            
                                                            {cita.nombres} {cita.apellidos}
                                                        </h6>
                                                    </div>
                                                    <div className="d-flex align-items-center mt-1">
                                                        <i className="ti ti-brand-days-counter text-muted me-1" style={{ fontSize: '11px' }}></i>
                                                        <span className="text-muted f-10 text-truncate" style={{ maxWidth: '150px' }}>
                                                            {cita?.edad || 'Sin configurar'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* VISTA: BUSCADOR (Si no hay cliente) */
                                            <div className="position-relative">
                                                <div className="bg-white rounded-3 p-1 border shadow-sm d-flex align-items-center transition-all focus-within-primary">
                                                    <div className="avtar avtar-xs bg-light-secondary text-secondary ms-1 rounded-2">
                                                        <i className="ti ti-user-plus"></i>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-sm border-0 bg-transparent fw-bold ps-2" 
                                                        placeholder="Buscar o vincular cliente..." 
                                                        style={{ fontSize: '13px', boxShadow: 'none' }}
                                                    />
                                                    <div className="me-2 text-muted opacity-50">
                                                        <i className="ti ti-search fs-5"></i>
                                                    </div>
                                                </div>
                                                {/* Pequeño tag informativo */}
                                                <div className="mt-2 text-center">
                                                    <small className="text-muted fw-bold" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>
                                                        <i className="ti ti-info-circle me-1"></i> SE REQUIERE UN CLIENTE PARA FACTURAR
                                                    </small>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <style dangerouslySetInnerHTML={{ __html: `
                                        .fw-900 { font-weight: 900; }
                                        .focus-within-primary:focus-within {
                                            border-color: rgba(13, 110, 253, 0.5) !important;
                                            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1) !important;
                                        }
                                    `}} />

                                    {/* NAVEGACIÓN TABS */}
                                    <div className="px-3 pt-3">
                                        <ul className="nav nav-pills nav-fill border border-light p-1 rounded-3 bg-white shadow-sm" role="tablist">
                                            <li className="nav-item">
                                                <button 
                                                    className="nav-link active py-2 fw-bold small transition-all" 
                                                    id="tab-pago-link"
                                                    data-bs-toggle="tab" 
                                                    data-bs-target="#tab-pago" 
                                                    type="button"
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    <i className="ti ti-currency-dollar me-1 fs-5"></i> PAGO
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button 
                                                    className="nav-link py-2 fw-bold small transition-all" 
                                                    id="tab-fidel-link"
                                                    data-bs-toggle="tab" 
                                                    data-bs-target="#tab-fidel" 
                                                    type="button"
                                                    style={{ borderRadius: '8px' }}
                                                >
                                                    <i className="ti ti-heart me-1 fs-5"></i> FIDELIDAD
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Agrega este pequeño CSS para que el 'active' sea sutil pero claro */}
                                    <style dangerouslySetInnerHTML={{ __html: `
                                        .nav-pills .nav-link {
                                            color: #64748b; /* Color slate/gris para inactivos */
                                            border: 1px solid transparent;
                                        }
                                        .nav-pills .nav-link.active {
                                            background-color: #f8fafc !important; /* Un gris casi blanco */
                                            color: #0d6efd !important; /* Tu color primario */
                                            border-color: rgba(13, 110, 253, 0.2) !important;
                                            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                                        }
                                        .transition-all { transition: all 0.2s ease; }
                                    `}} />

                                    {/* CUERPO TABS */}
                                    <div className="tab-content flex-grow-1 overflow-y-auto p-3">
                                        <div className="tab-pane fade show active" id="tab-pago">
                                            <div className="vstack gap-3">
                                                {/* Metodo Pago */}
                                                {/* SECCIÓN: MÉTODO DE PAGO HÍBRIDO */}
                                                <div className="group position-relative">
                                                    <label className="text-muted fw-bold mb-2 d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}>MÉTODO DE PAGO</label>
                                                    <div className="row g-2 position-relative">
                                                        {/* 1. BOTONES DE ACCESO RÁPIDO (Los 3 más usados) */}
                                                        {[
                                                            { id: 929, nombre: 'EFECTIVO', icon: 'ti-cash' },//EFECTIVO
                                                            { id: 1050 , nombre: 'NEQUI', icon: 'ti-letter-n' }, //NEQUI
                                                            { id: 1054 , nombre: 'QR', icon: 'ti-qrcode' } //QR
                                                        ].map((m) => (
                                                            <div className="col-3" key={m.id}>
                                                                <button 
                                                                    type="button"
                                                                    className={`btn btn-sm w-100 border py-2 rounded-3 fw-bold transition-all ${facturaData.metodo_id == m.id.toString() ? 'btn-primary border-primary shadow-sm' : 'btn-light text-muted opacity-75'}`}
                                                                    onClick={() => {
                                                                        setFacturaData('metodo_id', m.id.toString());
                                                                        setShowMetodosExtra(false); // Cerramos el menú extra si elige un principal
                                                                    }}
                                                                >
                                                                    <i className={`ti ${m.icon} d-block mb-1 fs-4`}></i>
                                                                    <span style={{ fontSize: '8px' }}>{m.nombre}</span>
                                                                </button>
                                                            </div>
                                                        ))}

                                                        {/* 2. BOTÓN "MÁS" (Controlado por estado) */}
                                                        <div className="col-3 position-relative" style={{ zIndex: 1001 }}>
                                                            <button 
                                                                type="button"
                                                                className={`btn btn-sm w-100 border py-2 rounded-3 fw-bold h-100 transition-all ${![929,1050,1054].includes(Number(facturaData.metodo_id)) && facturaData.metodo_id ? 'btn-info text-white shadow-sm' : 'btn-light text-muted'}`}
                                                                onClick={() => setShowMetodosExtra(!showMetodosExtra)}
                                                            >
                                                                <i className={`ti ${showMetodosExtra ? 'ti-x' : 'ti-dots'} d-block mb-1 fs-4`}></i>
                                                                <span style={{ fontSize: '8px' }}>
                                                                    {![929,1050,1051,1054].includes(Number(facturaData.metodo_id)) && facturaData.metodo_id ? 'OTRO' : 'MÁS'}
                                                                </span>
                                                            </button>

                                                            {/* 3. OVERLAY INVISIBLE (Para cerrar al hacer clic fuera) */}
                                                            {showMetodosExtra && (
                                                                <div 
                                                                    className="position-fixed" 
                                                                    style={{ inset: 0, zIndex: 9998, backgroundColor: 'transparent' }} 
                                                                    onClick={() => setShowMetodosExtra(false)} 
                                                                />
                                                            )}

                                                            {/* 4. MENÚ DESPLEGABLE (Flota sobre todo el contenido) */}
                                                            {showMetodosExtra && (
                                                                <ul className="list-unstyled shadow-lg border p-2 animate__animated animate__fadeInDown" 
                                                                    style={{ 
                                                                        position: 'absolute', 
                                                                        top: '105%', 
                                                                        right: '0', 
                                                                        zIndex: 9999, 
                                                                        backgroundColor: 'white', 
                                                                        borderRadius: '12px', 
                                                                        width: 'max-content',
                                                                        minWidth: '240px',
                                                                        maxWidth: '300px',
                                                                        boxShadow: '0 15px 35px rgba(0,0,0,0.25)',
                                                                        border: '1px solid rgba(0,0,0,0.08)'
                                                                    }}
                                                                >
                                                                    <li>
                                                                        <h6 className="dropdown-header f-10 fw-900 text-uppercase text-muted mb-2 border-bottom pb-2">
                                                                            Otros Métodos
                                                                        </h6>
                                                                    </li>
                                                                    <div className="overflow-y-auto" style={{ maxHeight: '280px', overflowX: 'hidden' }}>
                                                                        {Object.entries(metodospagosList)
                                                                            .filter(([id]) => ![929,1050,1054].includes(Number(id)))
                                                                            .map(([id, label]) => (
                                                                                <li key={id}>
                                                                                    <button 
                                                                                        className={`dropdown-item rounded-3 py-2 px-3 mb-1 d-flex align-items-center border-0 w-100 text-start transition-all ${facturaData.metodo_id == id ? 'bg-light-info text-info fw-bold' : 'bg-transparent text-dark'}`} 
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setFacturaData('metodo_id', id);
                                                                                            setShowMetodosExtra(false);
                                                                                        }}
                                                                                        style={{ whiteSpace: 'normal', lineHeight: '1.2' }}
                                                                                    >
                                                                                        <div className="flex-shrink-0 avtar avtar-xs bg-light-secondary me-2 rounded-circle" style={{ width: '24px', height: '24px' }}>
                                                                                            <i className="ti ti-chevron-right fs-6"></i>
                                                                                        </div>
                                                                                        <div className="flex-grow-1">
                                                                                            <span className="small d-block">{label}</span>
                                                                                        </div>
                                                                                        {facturaData.metodo_id == id && (
                                                                                            <i className="ti ti-check ms-2 text-success flex-shrink-0"></i>
                                                                                        )}
                                                                                    </button>
                                                                                </li>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* INDICADOR DE MÉTODO SELECCIONADO (Si no es favorito) */}
                                                    {![929,1050,1054].includes(Number(facturaData.metodo_id)) && facturaData.metodo_id && (
                                                        <div className="mt-2 animate__animated animate__fadeIn">
                                                            <div className="badge bg-info-subtle text-info border border-info border-opacity-25 rounded-pill px-3 py-2 w-100 d-flex align-items-center justify-content-center">
                                                                <i className="ti ti-info-circle me-2"></i>
                                                                <span>Seleccionado: <strong>{metodospagosList[facturaData.metodo_id]}</strong></span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="group">
                                                    {/* Turno caja */}
                                                    {turnoActivo ? (
                                                    <div className="input-group input-group-merge">
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
                                                {/* 3. CUPÓN (Estilo Neumórfico) */}
                                                <div className="group">
                                                    <label className="text-muted fw-bold mb-2 d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}> CUPÓN</label>
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

                                                <div className="group">
                                                    <label className="text-muted fw-bold mb-2 d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}> RECOMENDACIONES / PROPINAS</label>
                                                    <textarea 
                                                        className="form-control border-0 shadow-sm bg-white" 
                                                        rows={2}
                                                        style={{ resize: 'none', fontSize: '14px' }}
                                                        placeholder="Observaciones finales..."
                                                        value={form.data.observaciones}
                                                        onChange={(e) => form.setData('observaciones', e.target.value)}
                                                    ></textarea>
                                                </div>
                                                {/* Sección Propina */}
                                                <div className="group">
                                                    <label className="text-muted fw-bold mb-2 d-block" style={{ fontSize: '10px', letterSpacing: '1px' }}>PROPINA (VOLUNTARIA)</label>
                                                    <div className="input-group shadow-sm rounded-3 overflow-hidden border border-light bg-white p-1">
                                                        <span className="input-group-text bg-transparent border-0 text-primary">
                                                            <i className="ti ti-coin fs-4"></i>
                                                        </span>
                                                        <input 
                                                            type="number" 
                                                            className="form-control border-0 bg-transparent fw-bold text-dark" 
                                                            placeholder="0.00"
                                                            style={{ fontSize: '14px' }}
                                                            value={facturaData.propina || ''}
                                                            onChange={(e) => {
                                                                const val = parseFloat(e.target.value) || 0;
                                                                setFacturaData('propina', val);
                                                            }}
                                                        />
                                                        {/* Botones de sugerencia rápida (opcional, muy útil en POS) */}
                                                        <button 
                                                            className="btn btn-sm btn-light-primary border-0 fw-bold px-3 ms-1 rounded-2" 
                                                            type="button"
                                                            onClick={() => {
                                                                const sugerida = Math.round(totales.totalFinal * 0.10); // 10%
                                                                setFacturaData('propina', sugerida);
                                                            }}
                                                        >
                                                            +10%
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="tab-fidel">
                                            <div className="vstack gap-3">
                                                <div className="p-2 bg-light rounded-3 border">
                                                    <label className="small text-muted fw-bold mb-1">WHATSAPP</label>
                                                    <input type="tel" className="form-control border-0 fw-bold" value={form.data.telefonomovil || ''} onChange={(e) => form.setData('telefonomovil', e.target.value)} />
                                                </div>
                                                <div className="p-2 bg-light rounded-3 border">
                                                    <label className="small text-muted fw-bold mb-1">CUMPLEAÑOS</label>
                                                    <input type="date" className="form-control border-0 fw-bold" value={form.data.fechanacimiento || ''} onChange={(e) => form.setData('fechanacimiento', e.target.value)} />
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

                        {/* FOOTER ACCIONES: TOTALES Y BOTONES */}
                        <div className="modal-footer bg-white border-top p-3 shadow-lg">
                            <div className="container-fluid px-0">
                                <div className="row g-3 align-items-center">
                                    
                                    {/* LADO IZQUIERDO: RESUMEN FINANCIERO */}
                                    <div className="col-12 col-xl-8">
                                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                                            
                                            {/* Bloque 1: Desglose Detallado */}
                                            <div className="d-flex flex-wrap gap-3 gap-md-4 align-items-center">
                                                <div className="border-end pe-3">
                                                    <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>SUBTOTAL</span>
                                                    <h5 className="mb-0 fw-bolder text-dark">${(totales.subtotalServicios + totales.subtotalProductosPrevios).toLocaleString()}</h5>
                                                </div>

                                                <div className="border-end pe-3">
                                                    <span className="text-muted fw-bold d-block mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>NUEVOS</span>
                                                    <h5 className="mb-0 fw-bold text-warning">+ ${totales.subtotalNuevos.toLocaleString()}</h5>
                                                </div>

                                                {totales.montoDescuento > 0 && (
                                                    <div className="bg-light-danger px-2 py-1 rounded-2 border border-danger border-opacity-10">
                                                        <span className="text-danger fw-bold d-block" style={{ fontSize: '9px' }}>DTO. ({appliedCoupon?.promociones.valor}%)</span>
                                                        <h6 className="mb-0 text-danger fw-bolder">-${totales.montoDescuento.toLocaleString()}</h6>
                                                    </div>
                                                )}

                                                {facturaData.propina > 0 && (
                                                    <div>
                                                        <span className="text-success fw-bold d-block mb-1" style={{ fontSize: '10px' }}>PROPINA</span>
                                                        <h5 className="mb-0 fw-bold text-success">+ ${Number(facturaData.propina).toLocaleString()}</h5>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bloque 2: Total a Cobrar */}
                                            <div className="d-flex align-items-center gap-3 ms-auto ms-md-0 border-start-md ps-md-4 mt-2 mt-md-0">
                                                <div className="text-end">
                                                    <p className="text-uppercase text-muted fw-900 mb-0" style={{ fontSize: '11px', letterSpacing: '1px' }}>Total a cobrar</p>
                                                    <h2 className="fw-900 text-primary mb-0 lh-1 total-text">
                                                        <small className="fs-5 fw-normal text-muted me-1">$</small>
                                                        {(totales.totalFinal).toLocaleString()}
                                                    </h2>
                                                </div>
                                                <div className="text-center d-none d-sm-block border-start ps-3">
                                                    <i className="ti ti-shield-check text-success fs-1 d-block"></i>
                                                    <span className="fw-bold text-muted d-block" style={{ fontSize: '8px', lineHeight: '1' }}>PAGO<br/>SEGURO</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* LADO DERECHO: BOTONES DE ACCIÓN */}
                                    <div className="col-12 col-xl-4">
                                        <div className="d-flex flex-column gap-1">
                                            <button 
                                                type="button" 
                                                className="btn btn-primary btn-lg fw-900 rounded-3 shadow-blue-deep py-3 w-100 d-flex align-items-center justify-content-center"
                                                onClick={manejarClickFactura}
                                                disabled={processingFactura}
                                            >
                                                {processingFactura ? (
                                                    <><span className="spinner-border spinner-border-sm me-2"></span> PROCESANDO...</>
                                                ) : (
                                                    <><i className="ti ti-bolt fs-4 me-2"></i> FACTURAR AHORA</>
                                                )}
                                            </button>

                                            <button 
                                                type="submit" 
                                                className="btn btn-link text-muted fw-bold py-1 d-flex align-items-center justify-content-center text-decoration-none small" 
                                                disabled={form.processing}
                                            >
                                                {form.processing ? (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                ) : (
                                                    <><i className="ti ti-device-floppy me-2"></i> Solo guardar cambios</>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            
                            <style dangerouslySetInnerHTML={{ __html: `
                                .fw-900 { font-weight: 900; }
                                .total-text { font-size: 2.6rem; letter-spacing: -1.5px; }
                                
                                @media (max-width: 1199px) {
                                    .total-text { font-size: 2rem; }
                                    .border-start-md { border-left: none !important; }
                                }

                                @media (min-width: 768px) {
                                    .border-start-md { border-left: 1px solid #dee2e6 !important; }
                                }

                                .shadow-blue-deep { box-shadow: 0 10px 20px -5px rgba(0, 149, 255, 0.4); }
                                .shadow-blue-deep:hover { transform: translateY(-1px); box-shadow: 0 12px 25px -5px rgba(0, 149, 255, 0.5); }
                                .transition-all { transition: all 0.2s ease-in-out; }
                            `}} />
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