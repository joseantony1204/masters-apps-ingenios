import { useEffect, useRef, useState } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Adcitas  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import $ from 'jquery'; // <--- AGREGA ESTA LÍNEA

interface Props {
    citas: any[];
    estadosList: Record<string, string>;
}

export default function Table({ citas, estadosList}: Props) {
    const tableRef = useRef<HTMLTableElement>(null);

    // Usamos un layoutEffect para que la limpieza ocurra 
    // ANTES de que el DOM se actualice y cause el error de removeChild
    useEffect(() => {
        // Inicializar
        if (tableRef.current) {
            initDataTable(tableRef.current);
        }

        // Función de limpieza
        return () => {
            if (tableRef.current && $.fn.DataTable.isDataTable(tableRef.current)) {
                // El true es para que no intente manipular el DOM al destruir
                $(tableRef.current).DataTable().destroy(false); 
            }
        };
    }, [citas]); // Se dispara cada vez que filtras

    // Estados para Cancelación
    const [isModalCancelarOpen, setIsModalCancelarOpen] = useState(false);
    const [citaParaCancelar, setCitaParaCancelar] = useState<any>(null);
   

    const handleView = (id: number) => {
        router.visit(route('adcitas.show', id));
    };
    
    // Estado para saber qué dropdown de qué cita está abierto
    const [dropdownAbierto, setDropdownAbierto] = useState<number | null>(null);
    const [citaDetalle, setCitaDetalle] = useState<any>(null);
    // --- ESTADOS PARA EL POS/DETALLE DE CITA ---
    const [buscandoProducto, setBuscandoProducto] = useState(false);
    const [resultadosBusqueda, setResultadosBusqueda] = useState<any[]>([]); // Resultados del buscador
    const [filtroBusqueda, setFiltroBusqueda] = useState(''); // Lo que el usuario escribe

    // Función para cerrar el menú al hacer click afuera
    useEffect(() => {
        const cerrarMenu = () => setDropdownAbierto(null);
        window.addEventListener('click', cerrarMenu);
        return () => window.removeEventListener('click', cerrarMenu);
    }, []);

    // 1. Ver Detalle (Puedes abrir un modal con la info extendida)
    // 1. Abrir el Modal POS
    const verDetalleCita = (cita: any) => {
        setCitaDetalle(cita);
        // Pre-llenamos el formulario con datos existentes si los hay
        formPostCita.setData({
            nombreCliente: `${cita.nombres} ${cita.apellidos}` || '',
            observaciones: cita.observaciones || '',
            items: [], // Empezamos con items adicionales vacíos
            total: cita.detalle_con_empleadoservicio?.reduce((acc: number, det: any) => acc + Number(det.preciofinal), 0) + cita.detalle_con_producto?.reduce((acc: number, det: any) => acc + Number(det.preciofinal), 0) || 0,
        });
        setFiltroBusqueda('');
        setResultadosBusqueda([]);
        const element = document.getElementById('modalDetalleCitaPOS')
        if (element) {
            const modal = new bootstrap.Modal(element);
            modal.show();
        }

    };

    // --- FORMULARIOS INERTIA ---
    const { data: filterData, setData: setFilterData, get: fetchFilters, processing: filtering, reset: resetFilters } = useForm({
        fecha: '',
        servicio_id: '',
        identificacion: '',
        nombre: '',
        apellido: '',
        empleado_id: '',
        estado: '',
    });

    const formPostCita = useForm({
        nombreCliente: '',
        observaciones: '',
        items: [] as any[],
        total: 0,
    });

    const formCancelar = useForm({
        id: '',
        codigo: '',
        estado_id: '',
        motivo_cancelacion: '',
    });

    // 2. Buscar Productos/Servicios Adicionales (Llamada a API)
    const buscarProductosAdicionales = async (query: string) => {
        setFiltroBusqueda(query);
        if (query.length < 2) {
            setResultadosBusqueda([]);
            return;
        }

        setBuscandoProducto(true);
        try {
            // Esta API debe devolver productos y servicios del comercio
            const resp = await axios.get(route('api.productos.buscar'), { params: { q: query } });
            setResultadosBusqueda(resp.data);
        } catch (error) {
            console.error("Error buscando productos", error);
        } finally {
            setBuscandoProducto(false);
        }
    };

    // 3. Agregar Item a la lista del POS
    const agregarItemACita = (item: any) => {
        const itemsActuales = [...formPostCita.data.items];
        const precio = Number(item.precio || item.precio);
        
        itemsActuales.push({
            ...item,
            producto_id: item.id,
            unique_id: Date.now(),
            cantidad: 1,
            descuento: 0, // Inicializa en 0
            precio: precio,
            total_item: precio // Al ser cantidad 1 y desc 0, el total es el precio
        });
    
        actualizarTotalesFormulario(itemsActuales);
        setFiltroBusqueda('');
        setResultadosBusqueda([]);
    };

    // 4. Eliminar Item adicional
    const eliminarItemAdicional = (uniqueId: number) => {
        const itemsFiltrados = formPostCita.data.items.filter((item: any) => item.unique_id !== uniqueId);
        actualizarTotalesFormulario(itemsFiltrados);
    };

    // Función para cambiar cantidad
    const cambiarCantidadItem = (uniqueId: number, operacion: 'sumar' | 'restar') => {
        const nuevosItems = formPostCita.data.items.map((item: any) => {
            if (item.unique_id === uniqueId) {
                const nuevaCantidad = operacion === 'sumar' ? item.cantidad + 1 : Math.max(1, item.cantidad - 1);
                return { 
                    ...item, 
                    cantidad: nuevaCantidad,
                    total_item: (item.precio * nuevaCantidad) * (1 - (item.descuento / 100))
                };
            }
            return item;
        });
        actualizarTotalesFormulario(nuevosItems);
    };

    // 5. Función auxiliar para recalar totales del useForm
    // Función de totales actualizada para incluir descuentos
    const actualizarTotalesFormulario = (items: any[]) => {
        const subtotalCita = citaDetalle?.detalle_con_empleadoservicio?.reduce((acc: number, det: any) => acc + Number(det.preciofinal), 0) || 0;
        const totalAdicionales = items.reduce((acc: number, item: any) => acc + item.total_item, 0);
        
        formPostCita.setData({
            ...formPostCita.data,
            items: items,
            total: subtotalCita + totalAdicionales
        });
    };

    // 6. Enviar datos al Backend (Guardar Cita Finalizada)
    const finalizarYGuardarCita = (e: React.FormEvent) => {
        e.preventDefault();
        // Esta ruta debe manejar la actualización de observaciones y creación de nuevos detalle_con_empleadoservicio
        formPostCita.post(route('api.citas.actualizar', citaDetalle.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Cerrar modal y notificar
                const modalElement = document.getElementById('modalDetalleCitaPOS');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance?.hide();
                }
                // 2. Limpiamos el formulario
                // Swal.fire('¡Cita Guardada!', 'Se han registrado los adicionales y observaciones.', 'success');
            }
        });
    };

    // Función para cambiar descuento (0 a 100)
    const cambiarDescuentoItem = (uniqueId: number, valor: string) => {
        const desc = Math.min(100, Math.max(0, Number(valor) || 0));
        const nuevosItems = formPostCita.data.items.map((item: any) => {
            if (item.unique_id === uniqueId) {
                return { 
                    ...item, 
                    descuento: desc,
                    total_item: (item.precio * item.cantidad) * (1 - (desc / 100))
                };
            }
            return item;
        });
        actualizarTotalesFormulario(nuevosItems);
    };

    // --- FUNCIONES CANCELACIÓN ---
    const abrirModalCancelar = (cita: any) => {
        // 1. Guardamos la referencia para la interfaz
        setCitaParaCancelar(cita);
        // 2. Llenamos el formulario de Inertia con los datos de la cita
        formCancelar.setData({
            id: cita.id,
            codigo: cita.codigo,
            estado_id: '',
            motivo_cancelacion: '',
        });
    
        // 3. Mostramos la modal
        const modalElement = document.getElementById('modalCancelarCita');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    };

    const handleCancelarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    
        // Extraemos el id directamente desde los datos del formulario de Inertia
        const idParaEnviar = formCancelar.data.id;
        if (!idParaEnviar) {
            console.error("Error: El formulario no tiene un ID de cita asignado.");
            return;
        }
    
        // Enviamos a la ruta usando el ID confirmado
        formCancelar.put(route('adcitas.cancelar', idParaEnviar), {
            onSuccess: () => {
                const modalElement = document.getElementById('modalCancelarCita');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance?.hide();
                }
                formCancelar.reset();
            },
            onError: (errors) => {
                console.log("Errores del servidor:", errors);
            },
            preserveScroll: true
        });
    };

    const handleFacturar = (id: number) => {
        router.visit(route('ftfacturas.create',{ cita: id }));
    };

    const abrirModalRapidoProducto = (nombre : any) => {
        // Pedimos el precio rápidamente (puedes cambiar esto por un mini-modal si prefieres)
        const precioSugerido = window.prompt(`Introduce el precio para "${nombre}":`, "0");
        
        if (precioSugerido !== null) {
            const nuevoItem = {
                id: Date.now(), // ID temporal
                producto_id: null,     // El backend sabrá que es nuevo porque no tiene ID
                nombre: nombre.toUpperCase(),
                tipo: 'PRODUCTO',
                cantidad: 1,
                precio: parseFloat(precioSugerido),
                descuento: 0,
                total_item: parseFloat(precioSugerido),
                es_nuevo: true         // Flag para el backend
            };
    
            formPostCita.setData('items', [...formPostCita.data.items, nuevoItem]);
            setFiltroBusqueda('');
            setResultadosBusqueda([]);
        }
    };

    return (
        <>
            <div className="table-responsive" key={citas.length}> 
                <table ref={tableRef} className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '15%' }}>Fecha y hora</th>
                            <th className="text-center" style={{ width: '30%' }}>Cliente</th>
                            <th className="text-center" style={{ width: '50%' }}>Servicios</th>
                            <th className="text-center" style={{ width: '5%' }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {citas.map((cita: any) => {
                            // 1. Declaramos la lógica de bloqueo (Ajusta los códigos 'CA', 'RE' según tu BD)
                            const esInactiva = ['CA', 'RE', 'CAN'].includes(cita.estado_codigo?.toUpperCase());
                            const esPagada = ['PA'].includes(cita.estado_codigo?.toUpperCase());
                            return (
                                <tr key={cita.id} className={esInactiva ? 'opacity-75 bg-light' : ''}>
                                    <td className="text-center">
                                        <span className="fw-bold text-primary">#{cita.codigo}</span>
                                        <div className="fw-medium">
                                            {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                weekday: 'long', 
                                                day: 'numeric', 
                                                month: 'long' 
                                            })}
                                        </div>
                                        <small className="text-muted">{cita.horainicio} - {cita.horafinal}</small>
                                        <br></br>
                                        <span 
                                            className={`badge bg-light-${cita.estado_observacion} text-${cita.estado_observacion}`} 
                                            style={{  minWidth: '90px',  padding: '5px 10px', borderRadius: '4px', fontWeight: '600',textTransform: 'capitalize'}}>
                                            {cita.estado_nombre}
                                        </span>
                                    </td>
                                    <td className="text-left">
                                        {/* Avatar pequeño opcional */}
                                        <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-2 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                            {cita.round || 'CL'}
                                        </div>

                                        {/* Nombre del Cliente */}
                                        <div className="d-flex flex-column">
                                            <span className="fw-semibold text-dark">
                                            {cita.nombres 
                                                    ? `${cita.nombres} ${cita.apellidos}`
                                                    : 'Cliente no encontrado'}
                                            </span>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                {cita.identificacion || 'ID N/A'}
                                            </small>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                {cita.edad || 'N/A'}
                                            </small>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                {cita.telefonomovil || 'N/A'}
                                            </small>
                                        </div>
                                    </td>
                                    <td className="text-left">
                                        {cita.detalle_con_empleadoservicio?.map((detalle: any) => (
                                            <div key={detalle.id} className="d-flex align-items-center">
                                                <div className="bg-light-primary rounded p-2 me-2">
                                                    <i className="ti ti-clipboard-list text-primary"></i>
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{detalle.empleadoservicio.servicio.nombre || 'Servicio N/A'}</div>
                                                    <small className="text-muted">Dur: {detalle.empleadoservicio?.duracionpersonalizado} min</small>
                                                    <br></br>
                                                    <small className="text-muted">Total: $ {detalle?.preciofinal}</small>
                                                </div>
                                            
                                                <div key={detalle.id} className="d-flex align-items-center mb-1\">
                                                    {/* Avatar pequeño opcional */}
                                                    <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-2 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                        {detalle.empleadoservicio.empleado.persona.personasnaturales.nombres?.charAt(0) || 'E'}
                                                    </div>
                                                    
                                                    {/* Nombre del Empleado */}
                                                    <div className="d-flex flex-column">
                                                        <span className="fw-semibold text-dark">
                                                        {detalle.empleadoservicio?.empleado?.persona 
                                                                ? `${detalle.empleadoservicio.empleado.persona.personasnaturales.nombres} ${detalle.empleadoservicio.empleado.persona.personasnaturales.apellidos}`
                                                                : 'Empleado no encontrado'}
                                                        </span>
                                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            {detalle.empleadoservicio.empleado.persona.identificacion || 'ID N/A'}
                                                        </small>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            
                                        ))}
                                        {cita.detalle_con_producto?.map((d: any) => (
                                            <div key={d.id} className="d-flex align-items-center">
                                                <div className="bg-light-primary rounded p-2 me-2">
                                                    <i className="ti ti-shopping-cart-plus text-primary"></i>
                                                </div>
                                                <div>
                                                    {d.producto?.map((p: any) => ( 
                                                        <div className="fw-semibold">{p.nombre || 'Producto N/A'}</div>
                                                    ))}
                                                    
                                                    <small className="text-muted">Cant: {d.cantidad}</small>
                                                    <br></br>
                                                    <small className="text-muted">Total: $ {d?.preciofinal}</small>
                                                    
                                                </div>
                                            </div>
                                            
                                        ))}
                                    </td>

                                    <td className="text-end pe-4">
                                        <div className="btn-group shadow-sm" style={{ borderRadius: '6px' }}>
                                            
                                           {/* BOTÓN ESTADO: Si está pagada, podrías poner un icono de check */}
                                           <button 
                                                type="button"
                                                onClick={() => verDetalleCita(cita)}
                                                className={`btn btn-outline-${cita.estado_observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: '0.75rem', fontWeight: 600 }}
                                                disabled={esInactiva}
                                            >
                                                <i className="ti ti-receipt fs-5"></i>
                                            </button>
                                            
                                            <button 
                                                type="button" 
                                                className="btn btn-outline-primary btn-sm px-3"
                                                style={{ borderRadius: 0, borderLeft: 'none' }}
                                                onClick={() => handleFacturar(cita.id)}
                                                disabled={esInactiva || esPagada} 
                                            >
                                                <i className="ti ti-currency-dollar fs-5"></i>
                                            </button>

                                            {/* BOTÓN FLECHA DROPDOWN */}
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm dropdown-toggle-split d-flex align-items-center justify-content-center ${dropdownAbierto === cita.id ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                                                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none', width: '32px' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDropdownAbierto(dropdownAbierto === cita.id ? null : cita.id);
                                                }}
                                            >
                                                <i className={`ti ti-chevron-down ${dropdownAbierto === cita.id ? 'rotate-180' : ''}`}></i>
                                            </button>

                                            {/* MENÚ DESPLEGABLE CON LÓGICA CONDICIONAL */}
                                            {dropdownAbierto === cita.id && (
                                                <ul className="dropdown-menu show dropdown-menu-end shadow-lg border-0 m-0 py-2 animate__animated animate__fadeInUp" 
                                                    style={{ position: 'absolute', right: 0, top: '110%', zIndex: 1050, display: 'block', minWidth: '200px', borderRadius: '8px' }}>
                                                    
                                                    <li className="px-3 py-2">
                                                        <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Opciones</span>
                                                    </li>
                                                    
                                                    {/* SI YA ESTÁ PAGADA: Mostrar Ir a Factura */}
                                                    {esPagada ? (
                                                        <li>
                                                            <button 
                                                                className="dropdown-item d-flex align-items-center py-2 px-3 text-info"
                                                                onClick={() => window.open(route('facturas.show', cita.factura_id), '_blank')}
                                                            >
                                                                <i className="ti ti-file-invoice me-3 fs-5"></i>
                                                                <span className="small fw-medium">Ver Factura</span>
                                                            </button>
                                                        </li>
                                                    ) : (
                                                        /* SI NO ESTÁ PAGADA NI CANCELADA: Mostrar Facturar y Cancelar */
                                                        !esInactiva && (
                                                            <>
                                                                <li>
                                                                    <button 
                                                                    className="dropdown-item d-flex align-items-center py-2 px-3 text-success"
                                                                    onClick={() => handleFacturar(cita.id)}
                                                                    >
                                                                        <i className="ti ti-coin me-3 fs-5"></i>
                                                                        <span className="small fw-medium">Facturar cita</span>
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button 
                                                                        className="dropdown-item d-flex align-items-center py-2 px-3 text-danger" 
                                                                        onClick={() => abrirModalCancelar(cita)}
                                                                    >
                                                                        <i className="ti ti-ban me-3 fs-5"></i>
                                                                        <span className="small fw-medium">Cancelar cita</span>
                                                                    </button>
                                                                </li>
                                                            </>
                                                        )
                                                    )}

                                                    {/* Opción común: Ver historial o log (Opcional) */}
                                                    <li><hr className="dropdown-divider opacity-50" /></li>
                                                    <li>
                                                        <button className="dropdown-item d-flex align-items-center py-2 px-3 text-muted">
                                                            <i className="ti ti-history me-3 fs-5"></i>
                                                            <span className="small">Log de movimientos</span>
                                                        </button>
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    
                </table>
            </div>

            {/* --- MODAL DETALLE CITA / POS (FACTURADORA) --- */}
            <div className="modal fade" id="modalDetalleCitaPOS" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
                    <form onSubmit={finalizarYGuardarCita} className="modal-content border-0 shadow-lg">
                        
                        {/* HEADER ESTILO FACTURA */}
                        <div className="modal-header bg-dark text-white p-3 border-0">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary rounded p-2 text-white">
                                    <i className="ti ti-receipt fs-3"></i>
                                </div>
                                <div>
                                    <h5 className="modal-title fw-bold text-white mb-0">Resumen de Cuenta: Cita #{citaDetalle?.codigo}</h5>
                                    <small className="opacity-75">Cliente: {formPostCita?.data.nombreCliente}</small>
                                </div>
                            </div>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body p-0 bg-light-subtle">
                            <div className="row g-0 h-100">

                                <div className="col-lg-8 border-end bg-white">
                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold text-uppercase small text-muted mb-0">Detalle de cargos unificados</h6>
                                            <span className="badge bg-light-primary text-primary">
                                                {((citaDetalle?.detalle_con_empleadoservicio?.length || 0) + 
                                                (citaDetalle?.detalle_con_producto?.length || 0) + 
                                                formPostCita.data.items.length)} Items
                                            </span>
                                        </div>
                                        
                                        {/* Cabecera Única */}
                                        <div className="row g-0 align-items-center py-2 px-3 bg-light rounded-3 fw-bold text-muted small mb-2">
                                            <div className="col-1 text-center">#</div>
                                            <div className="col-5">Descripción del Cargo</div>
                                            <div className="col-2 text-center">Cant.</div>
                                            <div className="col-2 text-end">Precio</div>
                                            <div className="col-2 text-end">Total</div>
                                        </div>

                                        <div className="scroll-cargos" style={{maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden'}}>
                                            
                                            {/* A. SERVICIOS BASE (Guardados) */}
                                            {citaDetalle?.detalle_con_empleadoservicio?.map((detalle: any, index: number) => (
                                                <div key={`serv-${detalle.id}`} className="row g-0 align-items-center py-3 px-3 border-bottom border-light hover-bg-light">
                                                    <div className="col-1 text-center text-muted small">{index + 1}</div>
                                                    <div className="col-5">
                                                        <div className="fw-bold text-dark">{detalle.empleadoservicio?.servicio?.nombre}</div>
                                                        <small className="text-primary" style={{fontSize: '11px'}}>
                                                            <i className="ti ti-user me-1"></i>
                                                            {detalle.empleadoservicio?.empleado?.persona?.personasnaturales?.nombrecompleto}
                                                        </small>
                                                    </div>
                                                    <div className="col-2 text-center">1</div>
                                                    <div className="col-2 text-end fw-medium">${Number(detalle.empleadoservicio?.preciopersonalizado).toLocaleString()}</div>
                                                    <div className="col-2 text-end fw-bold text-dark">${Number(detalle.preciofinal).toLocaleString()}</div>
                                                </div>
                                            ))}

                                            {/* B. PRODUCTOS/ADICIONALES (Ya guardados en DB) */}
                                            {citaDetalle?.detalle_con_producto?.map((detalle: any, index: number) => (
                                                <div key={`prod-db-${detalle.id}`} className="row g-0 align-items-center py-3 px-3 border-bottom border-light hover-bg-light">
                                                    <div className="col-1 text-center text-muted small">
                                                        {(citaDetalle?.detalle_con_empleadoservicio?.length || 0) + index + 1}
                                                    </div>
                                                    <div className="col-5">
                                                        {/* Nota: 'detalle.producto' parece ser una relación de uno a muchos 
                                                            o una colección según tu JSON, por eso el .map 
                                                        */}
                                                        {detalle.producto?.map((p: any) => ( 
                                                            <div key={p.id}>
                                                                <div className="fw-bold text-dark">{p.nombre}</div>
                                                                <span className={`badge bg-light-${p?.tipo?.id===854 ? 'success' : 'info'} text-${p?.tipo?.id===855 ? 'success' : 'info'} f-10 text-uppercase`} style={{fontSize:'9px'}}>{p?.tipo?.nombre}</span>
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

                                            {/* C. NUEVOS ITEMS (En edición / formPostCita) */}
                                            {formPostCita.data.items.map((item: any, index: number) => (
                                                <div key={`new-${item.unique_id}`} className="row g-0 align-items-center py-3 px-3 border-bottom border-warning-subtle bg-warning-subtle rounded-3 mt-1 animated fadeIn">
                                                    <div className="col-1 text-center">
                                                        <button type="button" className="btn btn-link btn-sm text-danger p-0" onClick={() => eliminarItemAdicional(item.unique_id)}>
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="fw-bold text-dark">{item.nombre}</div>
                                                        <span className={`badge bg-light-${item.tipo==='PRODUCTO' ? 'success' : 'info'} text-${item.tipo==='PRODUCTO' ? 'success' : 'info'} f-10 text-uppercase`} style={{fontSize:'9px'}}>{item.tipo}</span>
                                                    </div>
                                                    <div className="col-2 text-center">
                                                        {/* Selector de cantidad optimizado */}
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
                                                        ${Number(item.total_item).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* BUSCADOR */}
                                        <div className="mt-4 buscador-pos">
                                            <div className="input-group input-group-lg shadow-sm border rounded-pill overflow-hidden bg-white">
                                                <span className="input-group-text bg-white border-0 text-muted ps-4"><i className="ti ti-search fs-4"></i></span>
                                                <input 
                                                    type="text" 
                                                    className="form-control border-0 shadow-none ps-2" 
                                                    placeholder="Agregar otro producto o servicio consumido..."
                                                    value={filtroBusqueda}
                                                    onChange={(e) => buscarProductosAdicionales(e.target.value)}
                                                />
                                            </div>
                                            {/* Resultados Buscador (Lista flotante) */}
                                            {(resultadosBusqueda.length > 0 || filtroBusqueda.length > 2) && (
                                                <div className="position-absolute w-100 shadow-lg z-3 mt-1" style={{ maxWidth: '500px' }}>
                                                    <ul className="list-group rounded-3 overflow-hidden">
                                                        {/* A. Resultados de la base de datos */}
                                                        {resultadosBusqueda.map((res: any) => (
                                                            <li 
                                                                key={res.id} 
                                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer py-3" 
                                                                onClick={() => agregarItemACita(res)}
                                                            >
                                                                <div>
                                                                    <strong className="text-dark">{res.nombre}</strong> 
                                                                    <span className="badge bg-light-secondary text-muted ms-2 f-10">{res.tipo}</span>
                                                                    <div className="text-primary fw-bold small">${Number(res.precio).toLocaleString()}</div>
                                                                </div>
                                                                <i className="ti ti-plus fs-4 text-primary"></i>
                                                            </li>
                                                        ))}

                                                        {/* B. OPCIÓN PARA CREAR NUEVO PRODUCTO */}
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
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA DERECHA: TOTALES Y OBSERVACIONES */}
                                <div className="col-lg-4 bg-light-subtle h-100">
                                    <div className="p-4 d-flex flex-column h-100">
                                        
                                        {/* Notas / Observaciones */}
                                        <div className="mb-4">
                                            <label className="form-label fw-bold text-uppercase small text-muted mb-2">Notas Finales de la Cita</label>
                                            <textarea 
                                                className="form-control border-0 shadow-sm" 
                                                rows={4}
                                                placeholder="Escribe recomendaciones, fórmula o detalles del servicio..."
                                                value={formPostCita.data.observaciones}
                                                onChange={(e) => formPostCita.setData('observaciones', e.target.value)}
                                            ></textarea>
                                        </div>

                                        {/* Resumen de Totales (Estilo inferior de la imagen) */}
                                        <div className="card border-0 shadow-sm rounded-3 mt-auto mb-3">
                                            <div className="card-body p-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="text-muted">Cita Base (Servicios):</span>
                                                    <span className="fw-medium text-dark">${citaDetalle?.detalle_con_empleadoservicio?.reduce((acc: number, det: any) => acc + Number(det.preciofinal), 0).toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="text-muted">Adicionales previos:</span>
                                                    <span className="fw-medium text-dark">${citaDetalle?.detalle_con_producto?.reduce((acc: number, det: any) => acc + Number(det.preciofinal), 0).toLocaleString()}</span>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <span className="text-muted">Nuevos consumos:</span>
                                                    <span className="fw-medium text-warning">+ ${formPostCita.data.items.reduce((acc: number, item: any) => acc + item.total_item, 0).toLocaleString()}</span>
                                                </div>
                                                <hr className="my-2 opacity-25" />
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h5 className="fw-bold mb-0 text-uppercase">TOTAL A COBRAR</h5>
                                                    <h3 className="fw-bold text-primary mb-0">
                                                        ${(
                                                            (citaDetalle?.detalle_con_empleadoservicio?.reduce((acc: number, det: any) => acc + Number(det.preciofinal), 0) || 0) +
                                                            (citaDetalle?.detalle_con_producto?.reduce((acc: number, det: any) => acc + Number(det.preciofinal), 0) || 0) +
                                                            (formPostCita.data.items.reduce((acc: number, item: any) => acc + item.total_item, 0) || 0)
                                                        ).toLocaleString()}
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FOOTER ACCIONES */}
                        <div className="modal-footer border-top bg-white p-3">
                            <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cancelar</button>
                            <button 
                                type="submit" 
                                className="btn btn-primary px-4" 
                                disabled={formPostCita.processing}
                            >
                                {formPostCita.processing ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <i className="ti ti-device-floppy me-2 fs-4"></i>
                                )}
                                Actualizar cuenta
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- MODAL: CANCELAR CITA --- */}
            <div className="modal fade" id="modalCancelarCita" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <form onSubmit={handleCancelarSubmit} className="modal-content border-0 shadow-lg">
                        <div className="modal-header bg-danger text-white p-3">
                            <div className="d-flex align-items-center gap-2">
                                <i className="ti ti-ban fs-3"></i>
                                <h5 className="modal-title fw-bold mb-0">Cancelar Cita #{formCancelar?.data.codigo}</h5>
                            </div>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        
                        <div className="modal-body p-4">
                            <div className="alert alert-light-danger border-0 small mb-4">
                                <i className="ti ti-info-circle me-2"></i>
                                ¿Estás seguro de cancelar esta cita? Esta acción liberará el espacio en la agenda.
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small text-uppercase">Estado de Cancelación</label>
                                <select 
                                    className={`form-select ${formCancelar.errors.estado_id ? 'is-invalid' : ''}`}
                                    value={formCancelar.data.estado_id} // Vinculación bidireccional
                                    onChange={e => formCancelar.setData('estado_id', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione un estado...</option>
                                    {Object.entries(estadosList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                {formCancelar.errors.estado_id && <div className="invalid-feedback">{formCancelar.errors.estado_id}</div>}
                            </div>

                            <div className="mb-0">
                                <label className="form-label fw-bold small text-uppercase">Motivo detallado</label>
                                <textarea 
                                    className={`form-control ${formCancelar.errors.motivo_cancelacion ? 'is-invalid' : ''}`}
                                    rows={3}
                                    placeholder="Ej: Cliente no pudo asistir por motivos personales..."
                                    value={formCancelar.data.motivo_cancelacion}
                                    onChange={e => formCancelar.setData('motivo_cancelacion', e.target.value)}
                                    required
                                ></textarea>
                                {formCancelar.errors.motivo_cancelacion && <div className="invalid-feedback">{formCancelar.errors.motivo_cancelacion}</div>}
                            </div>
                        </div>

                        <div className="modal-footer bg-light border-0">
                            <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cerrar</button>
                            <button 
                                type="submit" 
                                className="btn btn-danger px-4 shadow-sm"
                                disabled={formCancelar.processing}
                            >
                                {formCancelar.processing ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="ti ti-check me-2"></i>}
                                Confirmar Cancelación
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </> 
    );
  }