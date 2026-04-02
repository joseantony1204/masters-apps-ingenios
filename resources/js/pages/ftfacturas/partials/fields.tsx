import { Ftfacturas } from '@/types';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/components/ui/Modal';
import * as bootstrap from 'bootstrap';

interface Props {
    data: any;
    setData: any;
    errors: Record<string, string>;
    cita?: any; // Si viene de una cita específica
    turnoActivo: any;
    comercio: any;
    sedePredeterminada: any;
    estadosList: any[];
    metodospagosList: any[];
    turnosList: any[];
}

export default function Fields({ data, setData, errors, cita, comercio, sedePredeterminada, turnoActivo, turnosList, estadosList, metodospagosList }: Props) {
    // Al inicio de tu componente o donde manejes el modal
    const inputBusquedaRef = React.useRef<HTMLInputElement>(null);
    // Al cargar, si hay un turno activo y el form no tiene ID, lo asignamos
    useEffect(() => {
        if (turnoActivo && !data.turno_id) {
            setData('turno_id', turnoActivo.id);
            setData('fecha', new Date().toISOString().slice(0, 16));
        }
    }, [turnoActivo]);

    useEffect(() => {
        const modalElement = document.getElementById('modalSeleccionarCliente');
        
        if (modalElement) {
            const handleShown = () => {
                // Un pequeño timeout asegura que el renderizado de la animación no bloquee el foco
                setTimeout(() => {
                    inputBusquedaRef.current?.focus();
                }, 50);
            };
    
            modalElement.addEventListener('shown.bs.modal', handleShown);
    
            // Limpieza del evento al desmontar
            return () => {
                modalElement.removeEventListener('shown.bs.modal', handleShown);
            };
        }
    }, []);

    useEffect(() => {
        // Si recibimos una cita y aún no hemos cargado los items en el formulario
        if (cita && data.items.length === 0) {
            const nuevosItems: any[] = [];

            // 1. Procesar Servicios (detalle_con_empleadoservicio)
            if (cita.detalle_con_empleadoservicio) {
                cita.detalle_con_empleadoservicio.forEach((det: any) => {
                    nuevosItems.push({
                        id: det.empleadoservicio?.servicio?.id,
                        name: det.empleadoservicio?.servicio?.nombre || 'Servicio',
                        description: `Servicio de cita #${cita.codigo} - ${det.empleadoservicio?.servicio?.nombre}`,
                        qty: det.cantidad || 1,
                        price: det.preciofinal || 0,
                        total: (det.cantidad || 1) * (det.preciofinal || 0),
                        is_from_appointment: true
                    });
                });
            }

            // 2. Procesar Productos adicionales (detalle_con_producto)
            if (cita.detalle_con_producto) {
                cita.detalle_con_producto.forEach((det: any) => {
                    // El producto viene como un array según tu JSON
                    const productoInfo = det.producto?.[0]; 
                    nuevosItems.push({
                        id: productoInfo?.id,
                        name: productoInfo?.nombre || 'Producto',
                        description: `Producto de cita #${cita.codigo}`,
                        qty: det.cantidad || 1,
                        price: det.preciofinal || 0,
                        total: (det.cantidad || 1) * (det.preciofinal || 0),
                        is_from_appointment: true
                    });
                });
            }

            // 3. Cargar todo al estado y recalcular totales
            if (nuevosItems.length > 0) {
                actualizarItems(nuevosItems);
            }

            // 4. Asegurar que los datos del cliente se vinculen
            setData((prev: any) => ({
                ...prev,
                model_type: 921, // 921 el tipo que manejes para el cliente
                model_type_id: cita.cliente?.persona_id,
                cliente_nombre_aux: cita.cliente?.persona?.personasnaturales?.nombrecompleto,
                cliente_documento_aux: cita.cliente?.persona?.identificacion,
                cliente_correo_aux: cita.cliente?.persona?.email,
            }));
        }
    }, [cita]);

    // Función auxiliar para actualizar e integrar con tus cálculos de impuestos/descuentos
    const actualizarItems = (nuevosItems: any[]) => {
        const subtotal = nuevosItems.reduce((acc, item) => acc + Number(item.total), 0);
        
        // Aquí reutilizas tu lógica de impuestos/descuentos para que el Grand Total sea correcto
        const descPorc = Number(data.discount_percent) || 0;
        const taxPorc = Number(data.tax_percent) || 0;
        
        const discount_amount = (subtotal * descPorc) / 100;
        const tax_amount = ((subtotal - discount_amount) * taxPorc) / 100;

        setData((prev: any) => ({
            ...prev,
            items: nuevosItems,
            subtotal: subtotal,
            discount_amount: discount_amount,
            tax_amount: tax_amount,
            total: subtotal - discount_amount + tax_amount
        }));
    };

    // Función unificada para calcular totales y actualizar el estado
    const calcularTotales = (nuevosItems: any[], descPorc: number = 0, taxPorc: number = 0) => {
        // 1. Calcular Subtotal recorriendo los items
        const subtotal = nuevosItems.reduce((acc, item) => {
            const qty = Number(item.qty) || 0;
            const price = Number(item.price) || 0;
            return acc + (qty * price);
        }, 0);
    
        // 2. Asegurar que los porcentajes sean números válidos
        const dPorc = Number(descPorc) || 0;
        const tPorc = Number(taxPorc) || 0;
    
        // 3. Cálculos de montos
        const discount_amount = (subtotal * dPorc) / 100;
        const tax_amount = ((subtotal - discount_amount) * tPorc) / 100;
        const total = subtotal - discount_amount + tax_amount;
    
        // 4. Actualizar el estado global de una sola vez
        setData((prev: any) => ({
            ...prev,
            items: nuevosItems,
            subtotal: subtotal,
            discount_percent: dPorc,
            tax_percent: tPorc,
            discount_amount: discount_amount,
            tax_amount: tax_amount,
            total: total
        }));
    };

    const addItem = () => {
        const nuevosItems = [...(data.items || []), { name: '', description: '', qty: 1, price: 0, total: 0 }];
        calcularTotales(nuevosItems);
    };

    const removeItem = (index: number) => {
        const nuevosItems = data.items.filter((_: any, i: number) => i !== index);
        calcularTotales(nuevosItems);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const nuevosItems = [...data.items];
        nuevosItems[index][field] = value;
        nuevosItems[index].total = nuevosItems[index].qty * nuevosItems[index].price;
        calcularTotales(nuevosItems);
    };

    const [buscandoProducto, setBuscandoProducto] = useState(false);
    const [resultadosProductos, setResultadosProductos] = useState<any[]>([]);
    const [filaActiva, setFilaActiva] = useState<number | null>(null); // Para saber en qué fila mostrar sugerencias

    const buscarProducto = async (query: string, index: number) => {
        setFilaActiva(index);
        handleItemChange(index, 'name', query); // Actualiza el input mientras escribes

        if (query.length < 2) {
            setResultadosProductos([]);
            return;
        }

        setBuscandoProducto(true);
        try {
            const response = await axios.get(route('api.productos.buscar'), {
                params: { q: query }
            });
            setResultadosProductos(response.data);
        } catch (error) {
            console.error("Error buscando producto", error);
        } finally {
            setBuscandoProducto(false);
        }
    };

    const seleccionarProducto = (producto: any, index: number) => {
        const nuevosItems = [...data.items];
        nuevosItems[index] = {
            ...nuevosItems[index],
            id: producto.id,
            name: producto.nombre,
            description: producto.tipo || '',
            price: producto.precio || 0,
            total: (nuevosItems[index].qty || 1) * (producto.precio || 0)
        };
        
        setResultadosProductos([]);
        setFilaActiva(null);
        calcularTotales(nuevosItems); // Usando la función de totales que definimos antes
    };

    const handleSelectCliente = (cliente: any, tipo: 921 | 922) => {  //921 = 'App\\Models\\Adcitas' | //922 = 'App\\Models\\Personas'
        // Usamos la versión funcional para evitar conflictos de tipos
        setData((prevData: any) => ({
            ...prevData,
            model_type: tipo,
            model_type_id: cliente.id,

            // Setteamos los datos en las variables auxiliares
            cliente_nombre_aux: `${cliente.nombres} ${cliente.apellidos}`,
            cliente_identificacion_aux: cliente.identificacion,
            cliente_email_aux: cliente.email,
            cliente_direccion_aux: cliente.direccion,
            cliente_telefonomovil_aux: cliente.telefonomovil,
        }));
    };

    const handleSelectSedeEmisora = (sede: any) => {
        setData((prev: any) => ({
            ...prev,
            origen_id: sede.id,
            emisor_direccion: sede.direccion || 'Sin direccion',
            emisor_telefono: sede.telefono || 'Sin telefono',
            emisor_email: sede.email || 'Sin email'

        }));
    };

    //Estados necesarios
    const [buscando, setBuscando] = useState(false);
    const [resultadosClientes, setResultadosClientes] = useState<any[]>([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [termino, setTermino] = useState('');

    // 2. Función para buscar (puedes conectarla a un endpoint de Laravel)
    const buscarClientes = async (query: string) => {
        setTermino(query); // Actualiza el input visual
    
        if (query.length < 3) {
            setResultadosClientes([]);
            setMostrarSugerencias(false);
            return;
        }
    
        setBuscando(true);
        try {
            // Usamos axios y route() de Ziggy
            const response = await axios.get(route('api.personas.buscar'), {
                params: { term: query }
            });
            setResultadosClientes(response.data);
            setMostrarSugerencias(true);
        } catch (error) {
            console.error("Error buscando cliente", error);
            setResultadosClientes([]);
        } finally {
            setBuscando(false);
        }
    };

    // ... dentro de tu función Index o Create ...
    const [showTurnoModal, setShowTurnoModal] = useState(false);
    // Hook para el Turno (NUEVO - con nombres únicos)
    const { 
        data: turnoData, 
        setData: setTurnoData, 
        post: postTurno, 
        processing: processingTurno, 
        errors: turnoErrors, 
        reset: resetTurno 
    } = useForm({
        codigo: 'TRN-001',
        baseinicial: '',
        descripcion: '',
        terminal_id: '', 
    });

    const handleAbrirTurno = (e?: React.MouseEvent | React.FormEvent) => {
        // Prevenimos que el click afecte al formulario de la factura de fondo
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
    
        // Validación básica antes de enviar
        if (!turnoData.terminal_id || !turnoData.baseinicial) {
            alert("Por favor, selecciona una terminal e ingresa la base inicial.");
            return;
        }
    
        postTurno(route('ftturnos.store'), {
            onSuccess: () => {
                setShowTurnoModal(false);
                resetTurno('codigo', 'baseinicial', 'descripcion', 'terminal_id');
                // Aquí podrías disparar un mensaje de éxito con Toastr o Swal
            },
            onError: (errors) => {
                console.log("Errores recibidos del servidor:", errors);
            },
            preserveScroll: true,
        });
    };

    // Nuevo formulario para creación rápida de clientes
    const { 
        data: nuevoClienteData, 
        setData: setNuevoClienteData, 
        post: postNuevoCliente, 
        processing: processingNuevoCliente, 
        errors: nuevoClienteErrors, 
        reset: resetNuevoCliente,
        setError
    } = useForm({
        nombre: '',
        apellido: '',
        fechanacimiento: '1990-01-01',
        sexo_id: 48,
        tipoidentificacion_id: 10,
        identificacion: '',
        email: '',
        telefonomovil: '',
    });

    // Estado para alternar entre búsqueda y registro
    const [modoRegistro, setModoRegistro] = useState(false);
    const handleCrearCliente = async (e: React.FormEvent) => {
        if (e) e.preventDefault();
        
        // Usamos axios para tener control total del JSON de respuesta
        try {
            const response = await axios.post(route('api.personas.store'), nuevoClienteData);
            
            if (response.data.data_created) {
                const cliente = response.data.data_created;
                
                // 1. Seleccionamos al cliente en la factura
                handleSelectCliente(cliente, 922);
                
                // 2. Limpieza de interfaz
                setModoRegistro(false);
                setTermino('');
                resetNuevoCliente();
                
                // 3. Cerrar modal
                const modalElement = document.getElementById('modalSeleccionarCliente');
                if (modalElement) {
                    const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
                    bootstrapModal?.hide();
                }
                
                // Opcional: Notificación de éxito
                //alert("Cliente creado y seleccionado");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                const serverErrors = error.response.data.errors;
                
                // Limpiar errores previos (opcional pero recomendado)
                // clearErrors(); // Si también lo desestructuras de useForm
        
                Object.keys(serverErrors).forEach(key => {
                    // setError(campo, mensaje)
                    // Usamos [0] porque Laravel devuelve un array de mensajes por campo
                    setError(key as any, serverErrors[key][0]); 
                });
            } else {
                console.error("Error inesperado:", error);
            }
        }    
        
    };

    

    return (
    <>
        <div className="row">  
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="numero">Numero</label>
                    <input 
                        type="text" 
                        id="numero" 
                        name="numero" 
                        className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                        value={data.numero}
                        onChange={e => setData('numero', e.target.value)}
                        placeholder="Numero" 
                    />
                    {errors.numero && <div className="invalid-feedback" role="alert"><strong>{errors.numero}</strong></div>}
                </div>
            </div> 
           

            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="fecha">Fecha emisión</label>
                    <input 
                        type="datetime-local" 
                        id="fecha" 
                        name="fecha" 
                        className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
                        value={data.fecha}
                        onChange={e => setData('fecha', e.target.value)}
                        placeholder="Fecha" 
                    />
                    {errors.fecha && <div className="invalid-feedback" role="alert"><strong>{errors.fecha}</strong></div>}
                </div>
            </div>            
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="fechanavencimiento">Fecha vencimiento</label>
                    <input 
                        type="datetime-local" 
                        id="fechanavencimiento" 
                        name="fechanavencimiento" 
                        className={`form-control ${errors.fechanavencimiento ? 'is-invalid' : ''}`}
                        value={data.fechanavencimiento}
                        onChange={e => setData('fechanavencimiento', e.target.value)}
                        placeholder="Fechanavencimiento" 
                    />
                    {errors.fechanavencimiento && <div className="invalid-feedback" role="alert"><strong>{errors.fechanavencimiento}</strong></div>}
                </div>
            </div>  
            <div className="col-md-3">
                <label className="fw-bold small text-muted mb-1">Turno de caja</label>
                {turnoActivo ? (
                    <div className="input-group shadow-sm rounded-3 overflow-hidden">
                        <span className="input-group-text bg-white border-0">
                            <i className="ti ti-device-floppy text-primary fs-4"></i>
                        </span>
                        <select 
                            className={`form-select border-0 fw-bold bg-white ${errors.turno_id ? 'is-invalid' : ''}`}
                            value={data.turno_id}
                            onChange={e => setData('turno_id', e.target.value)}
                            style={{ fontSize: '13px' }}
                        >
                            {Array.isArray(turnosList) ? (
                                turnosList.map((t: any) => (
                                    <option key={t.id} value={t.id}>
                                        {t.codigo} — {t.terminal?.nombre || 'Terminal'}
                                    </option>
                                ))
                            ) : (
                                <option value={turnoActivo.id}>{turnoActivo.codigo}</option>
                            )}
                        </select>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-2">
                        {/* Botón de acción principal con estilo dashed */}
                        <button 
                            type="button"
                            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2 shadow-sm"
                            onClick={() => setShowTurnoModal(true)}
                            style={{ 
                                borderStyle: 'dashed', 
                                borderWidth: '2px',
                                backgroundColor: '#fff5f5' 
                            }}
                        >
                            <i className="ti ti-plus fs-4"></i>
                            <span className="fw-bold small">SIN TURNOS, ABRE UNO AQUÍ</span>
                        </button>
                    </div>
                )}
                {errors.turno_id && <div className="text-danger small mt-1 fw-bold">{errors.turno_id}</div>}
            </div>

            {/* --- SECCIÓN 2: ORIGEN Y DESTINO (POLIMÓRFICO) --- */}
            <div className="col-xl-6">
                <div className="border rounded p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <h6 className="mb-0">Datos del emisor (empresa):</h6>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-light-primary rounded-pill px-3"
                            data-bs-toggle="modal" 
                            data-bs-target="#modalSeleccionarSede"
                        >
                            <i className="ti ti-edit me-1"></i> Cambiar sede
                        </button>
                    </div>
                    <h5 className="fw-bold">{comercio?.nombre || 'Mi Comercio'}</h5>
                    <div className="d-flex flex-column gap-1">
                        <span className="mb-0"><i className="ti ti-id me-1"></i>{comercio?.persona?.identificacion || 'N/A'}</span>
                        <span className="mb-0"><i className="ti ti-map-pin me-1"></i>{data.emisor_direccion}</span>
                        <span className="mb-0"><i className="ti ti-phone me-1"></i>{data.emisor_telefono}</span>
                        <span className="mb-0"><i className="ti ti-mail me-1"></i>{data.emisor_email}</span>
                    </div>
                </div>
            </div>

            <div className="col-xl-6">
                <div className="border p-3 h-100 bg-white shadow-sm">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="mb-0 fw-bold text-muted">
                            <i className="ti ti-user me-2"></i>Datos del receptor (cliente):
                        </h6>
                        
                        {/* Botón dinámico: Si hay cliente permite cambiarlo, si no, agregarlo */}
                        {(cita || data.model_type_id) ? (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-light-secondary rounded-pill px-3"
                                onClick={() => setData({ ...data, model_type_id: null, model_type: 922})}
                            >
                                <i className="ti ti-rotate"></i> Cambiar
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-light-primary rounded-pill px-3"
                                data-bs-toggle="modal" 
                                data-bs-target="#modalSeleccionarCliente" // Debe coincidir con el ID del modal
                            >
                                <i className="ti ti-plus me-1"></i> Agregar cliente
                            </button>
                        )}
                    </div>

                    <div className="client-detail-content">
                        {(cita || data.model_type_id) ? (
                            <div className="animate__animated animate__fadeIn">
                                <h5 className="fw-bold">
                                    {data.cliente_nombre_aux || ''}
                                </h5>
                                <div className="d-flex flex-column gap-1">
                                    <span className="mb-0">
                                        <i className="ti ti-id me-1"></i>
                                        {data.cliente_identificacion_aux || ''}
                                    </span>
                                    <span className="mb-0">
                                        <i className="ti ti-map-pin me-1"></i>
                                        {data.cliente_direccion_aux || ''}
                                    </span>
                                    <span className="mb-0">
                                        <i className="ti ti-phone me-1"></i>
                                        {data.cliente_telefonomovil_aux || ''}
                                    </span>
                                    <span className="mb-0">
                                        <i className="ti ti-mail me-1"></i>
                                        {data.cliente_email_aux || ''}
                                    </span>
                                    {cita && (
                                        <span className="badge bg-light-info text-info align-self-start mt-2">
                                            <i className="ti ti-calendar-event me-1"></i> Viene de cita #{cita.codigo}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-3">
                                <div className="avatar avatar-lg bg-light-secondary rounded-circle mb-2 mx-auto">
                                    <i className="ti ti-user-search fs-3 text-muted"></i>
                                </div>
                                <p className="text-muted small mb-0">No se ha seleccionado un destinatario para esta factura</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 3: DETALLE DE ITEMS --- */}
            <div className="col-12 mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Detalles</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle border-top">
                        <thead className="bg-light">
                            <tr>
                                <th className="py-3" style={{width: '50px'}}>#</th>
                                <th className="py-3"><span className="text-danger">*</span> Nombre</th>
                                <th className="py-3">Descripción</th>
                                <th className="py-3" style={{width: '120px'}}><span className="text-danger">*</span> Cantidad</th>
                                <th className="py-3" style={{width: '150px'}}><span className="text-danger">*</span> Precio</th>
                                <th className="py-3 text-end" style={{width: '150px'}}>Total</th>
                                <th className="py-3 text-center" style={{width: '80px'}}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.items || []).map((item: any, index: number) => (
                                <tr key={index} className="animate__animated animate__fadeIn">
                                    <td className="fw-bold text-muted">{index + 1}</td>
                                    <td>
                                        <div className="position-relative">
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm bg-light border-0" 
                                                value={item.name} 
                                                onChange={e => buscarProducto(e.target.value, index)}
                                                placeholder="Escribe para buscar..."
                                                autoComplete="off"
                                            />
                                            
                                            {/* Dropdown de sugerencias */}
                                            {filaActiva === index && resultadosProductos.length > 0 && (
                                                <div className="list-group shadow-lg position-absolute w-100 z-index-3" 
                                                    style={{ top: '100%', zIndex: 1050 }}>
                                                    {resultadosProductos.map((p) => (
                                                        <button 
                                                            key={p.id}
                                                            type="button"
                                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                            onClick={() => seleccionarProducto(p, index)}
                                                        >
                                                            <div>
                                                                <div className="fw-bold small">{p.nombre}</div>
                                                                <small className="text-muted">{p.tipo || 'General'}</small>
                                                            </div>
                                                            <span className="badge bg-light-primary text-primary">
                                                                ${new Intl.NumberFormat().format(p.precio)}
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm bg-light border-0" 
                                            value={item.description} 
                                            onChange={e => handleItemChange(index, 'description', e.target.value)} 
                                            placeholder="Informacion extra"
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="form-control form-control-sm bg-light border-0 text-center" 
                                            value={item.qty} 
                                            min="1"
                                            onChange={e => handleItemChange(index, 'qty', e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text bg-light border-0">$</span>
                                            <input 
                                                type="number" 
                                                className="form-control bg-light border-0 text-end" 
                                                value={item.price} 
                                                onChange={e => handleItemChange(index, 'price', e.target.value)} 
                                            />
                                        </div>
                                    </td>
                                    <td className="text-end fw-bolder text-dark">
                                        ${new Intl.NumberFormat().format(item.total || 0)}
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            type="button" 
                                            onClick={() => removeItem(index)} 
                                            className="btn btn-sm btn-light-danger rounded-circle p-2"
                                        >
                                            <i className="ti ti-trash fs-5"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <button 
                    type="button" 
                    onClick={addItem} 
                    className="btn btn-outline-primary btn-sm border-dashed w-100 py-2 mt-2"
                    style={{ borderStyle: 'dashed' }}
                >
                    <i className="ti ti-plus me-1"></i> Agregar nuevo item
                </button>
            </div>

            {/* --- SECCIÓN 4: TOTALES --- */}
            <div className="col-12">
                <div className="invoice-total ms-auto py-3" style={{ maxWidth: '400px' }}>
                    <div className="row g-2">
                        <div className="col-6">
                            <label className="small fw-bold">Descuento (%)</label>
                            <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={data.discount_percent || ''} // Mostrar vacío si es 0 para mejor UX
                                placeholder="0"
                                onChange={e => {
                                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                                    calcularTotales(data.items, val, data.tax_percent);
                                }} 
                            />
                        </div>

                        <div className="col-6">
                            <label className="small fw-bold">Impuestos (%)</label>
                            <input 
                                type="number" 
                                className="form-control form-control-sm" 
                                value={data.tax_percent || ''} 
                                placeholder="0"
                                onChange={e => {
                                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                                    calcularTotales(data.items, data.discount_percent, val);
                                }} 
                            />
                        </div>
                        <div className="col-6">
                            <label className="small fw-bold">Estado de factura</label>
                            <select 
                                className={`form-control form-select form-select-sm ${errors.estado_id ? ' is-invalid' : ''}`}
                                value={data.estado_id} 
                                onChange={e => setData('estado_id', e.target.value)} 
                                required
                            >
                            <option value="">Elige...</option>
                            {Object.entries(estadosList).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                            </select>
                            {errors.estado_id && <div className="invalid-feedback" role="alert"><strong>{errors.estado_id}</strong></div>}
                        </div>

                        <div className="col-6">
                            <label className="small fw-bold">Metodos de pago</label>
                            <select 
                                className={`form-control form-select form-select-sm ${errors.metodo_id ? ' is-invalid' : ''}`}
                                value={data.metodo_id} 
                                onChange={e => setData('metodo_id', e.target.value)} 
                                required
                            >
                            <option value="">Elige...</option>
                            {Object.entries(metodospagosList).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                            </select>
                            {errors.metodo_id && <div className="invalid-feedback" role="alert"><strong>{errors.metodo_id}</strong></div>}
                        </div>
                        
                        <div className="col-12 mt-3"><hr/></div>

                        <div className="col-6 text-muted">Subtotal :</div>
                        <div className="col-6 text-end fw-bold">${new Intl.NumberFormat().format(data.subtotal)}</div>
                        <div className="col-6 text-muted">Descuento :</div>
                        <div className="col-6 text-end text-success fw-bold">-${new Intl.NumberFormat().format(data.discount_amount)}</div>
                        <div className="col-6 text-muted">Impuesto :</div>
                        <div className="col-6 text-end fw-bold">${new Intl.NumberFormat().format(data.tax_amount)}</div>
                        <div className="col-12"><hr/></div>
                        <div className="col-6 fs-5 fw-bold text-primary">Total a pagar:</div>
                        <div className="col-6 fs-5 text-end fw-bolder text-primary">${new Intl.NumberFormat().format(data.total)}</div>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN 5: NOTAS Y ACCIONES --- */}
            <div className="col-12">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea 
                    className={`form-control bg-light border-0 ${errors.observaciones ? 'is-invalid' : ''}`}
                    rows={3} 
                    value={data.observaciones} 
                    onChange={e => setData('observaciones', e.target.value)} 
                    placeholder="Escribe algunas notas adicionales a esta factura"
                    >
                    {errors.observaciones && <div className="invalid-feedback" role="alert"><strong>{errors.observaciones}</strong></div>}
                </textarea>
            </div> 
        </div>

        {/* --- MODAL BUSCAR PERSONA --- */}
        <div className="modal fade" id="modalSeleccionarCliente" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title fw-bold text-white">
                            <i className={modoRegistro ? "ti ti-user-plus me-2" : "ti ti-user-search me-2"}></i>
                            {modoRegistro ? 'Registrar Cliente Nuevo' : 'Búsqueda de clientes'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" onClick={() => setModoRegistro(false)}></button>
                    </div>
                    
                    <div className="modal-body p-4">
                        {!modoRegistro ? (
                            <>
                                {/* --- VISTA DE BÚSQUEDA --- */}
                                <div className="form-group mb-4">
                                    <label className="form-label fw-bold small text-muted">Parámetros aceptados (nombres, documento, etc.)</label>
                                    <div className="input-group input-group-merge shadow-sm">
                                        <span className="input-group-text bg-light border-0">
                                            {buscando ? <div className="spinner-border spinner-border-sm text-primary" role="status"></div> : <i className="ti ti-search text-muted"></i>}
                                        </span>
                                        <input 
                                            ref={inputBusquedaRef}
                                            type="text" 
                                            className="form-control border-0 bg-light" 
                                            placeholder="Escribe al menos 3 caracteres..." 
                                            value={termino}
                                            onChange={(e) => buscarClientes(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="results-container" style={{ minHeight: '200px', maxHeight: '400px', overflowY: 'auto' }}>
                                {mostrarSugerencias && resultadosClientes.length > 0 ? (
                                        <div className="list-group list-group-flush border rounded-1">
                                            {resultadosClientes.map((cliente) => (
                                                <button 
                                                    key={cliente.id}
                                                    type="button" 
                                                    className="list-group-item list-group-item-action py-3 d-flex align-items-center"
                                                    onClick={() => {
                                                        handleSelectCliente(cliente, 922);
                                                        setMostrarSugerencias(false);
                                                        setTermino('');
                                                    }}
                                                    data-bs-dismiss="modal"
                                                >
                                                    <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-3">
                                                        {cliente.round.toUpperCase()}
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h6 className="mb-0 fw-bold">{cliente.nombres} {cliente.apellidos}</h6>
                                                        <small className="text-muted">
                                                            <i className="ti ti-id me-1"></i>{cliente.identificacion} 
                                                            <span className="mx-2">|</span>
                                                            <i className="ti ti-mail me-1"></i>{cliente.email || 'Sin correo'}
                                                            <span className="mx-2">|</span>
                                                            <i className="ti ti-phone me-1"></i>{cliente.telefonomovil || 'Sin telefono'}
                                                        </small>
                                                    </div>
                                                    <i className="ti ti-chevron-right text-muted"></i>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        !buscando && termino.length >= 3 && (
                                            <div className="text-center py-5">
                                                <i className="ti ti-mood-empty fs-1 text-muted mb-2"></i>
                                                <p className="text-muted">No se encontraron resultados para "{termino}"</p>
                                                <button 
                                                    type="button"
                                                    className="btn btn-primary rounded-pill px-4 shadow-sm"
                                                    onClick={() => {
                                                        setModoRegistro(true);
                                                        setNuevoClienteData('nombre', termino); // Pre-llenamos el nombre
                                                    }}
                                                >
                                                    <i className="ti ti-plus me-1"></i> Crear nuevo cliente
                                                </button>
                                            </div>
                                        )
                                    )}

                                    {termino.length < 3 && (
                                        <div className="text-center py-5 opacity-50">
                                            <i className="ti ti-keyboard fs-1 mb-2"></i>
                                            <p className="mb-0">Empieza a escribir para buscar...</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* --- FORMULARIO DE REGISTRO RÁPIDO --- */
                            <div className="animate__animated animate__fadeIn">
                                <div className="row g-3">
                                    

                                    {/* Identificación */}
                                    <div className="col-6">
                                        <label className="form-label small fw-bold">Identificación *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control bg-light border-0 ${nuevoClienteErrors.identificacion ? 'is-invalid' : ''}`}
                                            value={nuevoClienteData.identificacion}
                                            onChange={e => setNuevoClienteData('identificacion', e.target.value)}
                                            placeholder="Documento de identidad"
                                        />
                                        {nuevoClienteErrors.identificacion && <div className="invalid-feedback">{nuevoClienteErrors.identificacion}</div>}
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label small fw-bold">Fecha de nacimiento*</label>
                                            <input 
                                                type="date" 
                                                className={`form-control bg-light border-0 ${nuevoClienteErrors.fechanacimiento ? 'is-invalid' : ''}`}
                                                value={nuevoClienteData.fechanacimiento || ''}
                                                onChange={e => setNuevoClienteData('fechanacimiento', e.target.value)}
                                            />
                                            {nuevoClienteErrors.fechanacimiento && <div className="invalid-feedback">{nuevoClienteErrors.fechanacimiento}</div>}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold">Nombre *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control bg-light border-0 ${nuevoClienteErrors.nombre ? 'is-invalid' : ''}`}
                                            value={nuevoClienteData.nombre}
                                            onChange={e => setNuevoClienteData('nombre', e.target.value)}
                                        />
                                        {nuevoClienteErrors.nombre && <div className="invalid-feedback">{nuevoClienteErrors.nombre}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold">Apellido *</label>
                                        <input 
                                            type="text" 
                                            className={`form-control bg-light border-0 ${nuevoClienteErrors.apellido ? 'is-invalid' : ''}`}
                                            value={nuevoClienteData.apellido}
                                            onChange={e => setNuevoClienteData('apellido', e.target.value)}
                                        />
                                        {nuevoClienteErrors.apellido && <div className="invalid-feedback">{nuevoClienteErrors.apellido}</div>}
                                    </div>
                                    <div className="col-6">
                                        <label className="form-label small fw-bold">Teléfono móvil*</label>
                                        <input 
                                            type="text" 
                                            className={`form-control bg-light border-0 ${nuevoClienteErrors.telefonomovil ? 'is-invalid' : ''}`}
                                            value={nuevoClienteData.telefonomovil}
                                            onChange={e => setNuevoClienteData('telefonomovil', e.target.value)}
                                        />
                                        {nuevoClienteErrors.telefonomovil && <div className="invalid-feedback">{nuevoClienteErrors.telefonomovil}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label small fw-bold">Correo electrónico</label>
                                            <input 
                                                type="email" 
                                                className={`form-control bg-light border-0 ${nuevoClienteErrors.email ? 'is-invalid' : ''}`}
                                                value={nuevoClienteData.email || ''}
                                                onChange={e => setNuevoClienteData('email', e.target.value)}
                                            />
                                            {nuevoClienteErrors.email && <div className="invalid-feedback">{nuevoClienteErrors.email}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid gap-2 mt-4">
                                    <button 
                                        type="button" 
                                        className="btn btn-primary btn-lg shadow" 
                                        onClick={handleCrearCliente}
                                        disabled={processingNuevoCliente}
                                    >
                                        {processingNuevoCliente ? 'Guardando...' : 'Guardar y Seleccionar'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-link text-muted" 
                                        onClick={() => setModoRegistro(false)}
                                    >
                                        <i className="ti ti-arrow-back me-1"></i> Volver a buscar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="modalSeleccionarSede" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title fw-bold">Seleccionar Sede Emisora</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body p-0">
                        <div className="list-group list-group-flush">
                            {comercio.sedes.map((sede: any) => (
                                <button 
                                    key={sede.id}
                                    type="button"
                                    className={`list-group-item list-group-item-action py-3 ${data.origen_id === sede.id ? 'bg-light-primary' : ''}`}
                                    onClick={() => handleSelectSedeEmisora(sede)}
                                    data-bs-dismiss="modal"
                                >
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0 fw-bold">{sede.nombre}</h6>
                                            <small className="text-muted">{sede.direccion}</small>
                                        </div>
                                        {data.origen_id === sede.id && (
                                            <span className="badge bg-primary rounded-pill">Actual</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
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
                            Registra el saldo inicial para <strong>{comercio?.nombre}</strong>.
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
                                onClick={handleAbrirTurno} // Llamada manual
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
