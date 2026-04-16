import { Ftfacturas } from '@/types';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import Modal from '@/components/ui/Modal';
import * as bootstrap from 'bootstrap';

interface Props {
    ftfactura: any;
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

export default function Fields({ftfactura, data, setData, errors, cita, comercio, sedePredeterminada, turnoActivo, turnosList, estadosList, metodospagosList }: Props) {
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
        const nuevosItems: any[] = [];
        if (ftfactura.id && data.items.length === 0 && ftfactura.detalles?.length > 0) {
            const nuevosItems = ftfactura.detalles.map((det: any) => ({
                id: det.id || 0,
                producto_id: det.producto?.id || det.producto_id,
                nombre: det.producto?.nombre || 'Producto/Servicio',
                descripcion: det.observaciones || '',
                cantidad: Number(det.cantidad),
                precio: Number(det.preciofinal),
                total: Number(det.totalapagar),
                is_from_appointment: !!det.observaciones?.includes('cita') // Detectar si era de cita por la observación
            }));
            
            actualizarItems(nuevosItems);
            return; // Salimos para no ejecutar la lógica de "cita"
        }
    
        // 2. SI ES CREACIÓN DESDE CITA: Cargar lo que viene de la agenda
        if (!data.id && cita && data.items.length === 0) {
            // Procesar Servicios
            if (cita.detalle_con_empleadoservicio) {
                cita.detalle_con_empleadoservicio.forEach((det: any) => {
                    nuevosItems.push({
                        id: det.empleadoservicio?.servicio?.id,
                        producto_id: det.empleadoservicio?.servicio?.id,
                        nombre: det.empleadoservicio?.servicio?.nombre || 'Servicio',
                        descripcion: `Servicio de cita #${cita.codigo} - ${det.empleadoservicio?.servicio?.nombre}`,
                        cantidad: det.cantidad || 1,
                        precio: det.preciounitario || 0,
                        total: (det.cantidad || 1) * (det.preciounitario || 0),
                        is_from_appointment: true
                    });
                });
            }
    
            // Procesar Productos adicionales
            if (cita.detalle_con_producto) {
                cita.detalle_con_producto.forEach((det: any) => {
                    const productoInfo = det.producto?.[0]; 
                    nuevosItems.push({
                        id: productoInfo?.id,
                        producto_id: productoInfo?.id,
                        nombre: productoInfo?.nombre || 'Producto',
                        descripcion: `Producto de cita #${cita.codigo}`,
                        cantidad: det.cantidad || 1,
                        precio: det.preciounitario || 0,
                        total: (det.cantidad || 1) * (det.preciounitario || 0),
                        is_from_appointment: true
                    });
                });
            }
    
            if (nuevosItems.length > 0) {
                actualizarItems(nuevosItems);
            }
    
            // Vincular datos del cliente solo si es nuevo
            setData((prev: any) => ({
                ...prev,
                model_type_id: cita.id,
                cliente_nombre_aux: cita.cliente?.persona?.personasnaturales?.nombrecompleto,
                cliente_documento_aux: cita.cliente?.persona?.identificacion,
                cliente_correo_aux: cita.cliente?.persona?.email,
            }));
        }
    }, [cita, data.id]); // Escuchamos cita y el ID de la factura

    

    // Función auxiliar para actualizar e integrar con tus cálculos de impuestos/descuentos
    const actualizarItems = (nuevosItems: any[]) => {
        const subtotal = nuevosItems.reduce((acc, item) => acc + Number(item.total), 0);
        
        // Aquí reutilizas tu lógica de impuestos/descuentos para que el Grand Total sea correcto
        const descPorc = Number(data.porcentajedescuento) || 0;
        const taxPorc = Number(data.tax_percent) || 0;
        
        const descuento = (subtotal * descPorc) / 100;
        const tax_amount = ((subtotal - descuento) * taxPorc) / 100;

        setData((prev: any) => ({
            ...prev,
            items: nuevosItems,
            subtotal: subtotal,
            descuento: descuento,
            tax_amount: tax_amount,
            total: subtotal - descuento + tax_amount
        }));
    };

    // Función unificada para calcular totales y actualizar el estado
    const calcularTotales = (nuevosItems: any[], descPorc: number = 0, taxPorc: number = 0) => {
        // 1. Calcular Subtotal recorriendo los items
        const subtotal = nuevosItems.reduce((acc, item) => {
            const cantidad = Number(item.cantidad) || 0;
            const precio = Number(item.precio) || 0;
            return acc + (cantidad * precio);
        }, 0);
    
        // 2. Asegurar que los porcentajes sean números válidos
        const dPorc = Number(descPorc) || 0;
        const tPorc = Number(taxPorc) || 0;
    
        // 3. Cálculos de montos
        const descuento = (subtotal * dPorc) / 100;
        const tax_amount = ((subtotal - descuento) * tPorc) / 100;
        const total = subtotal - descuento + tax_amount;
    
        // 4. Actualizar el estado global de una sola vez
        setData((prev: any) => ({
            ...prev,
            items: nuevosItems,
            subtotal: subtotal,
            porcentajedescuento: dPorc,
            tax_percent: tPorc,
            descuento: descuento,
            tax_amount: tax_amount,
            total: total
        }));
    };

    const addItem = () => {
        const nuevosItems = [...(data.items || []), { producto_id: null, nombre: '', descripcion: 'Producto nuevo agregado manualmente', cantidad: 1, precio: 0, total: 0 }];
        calcularTotales(nuevosItems);
    };

    const removeItem = (index: number) => {
        const nuevosItems = data.items.filter((_: any, i: number) => i !== index);
        calcularTotales(nuevosItems);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const nuevosItems = [...data.items];
        
        // Si el usuario cambia el nombre manualmente, reseteamos el ID del producto
        if (field === 'nombre') {
            nuevosItems[index].id = null; 
            nuevosItems[index].es_nuevo = true;
        }
    
        nuevosItems[index][field] = value;
    
        // Recalcular total de la fila
        if (field === 'cantidad' || field === 'precio') {
            const cantidad = field === 'cantidad' ? parseFloat(value) : nuevosItems[index].cantidad;
            const precio = field === 'precio' ? parseFloat(value) : nuevosItems[index].precio;
            nuevosItems[index].total = (cantidad || 0) * (precio || 0);
        }
    
        setData('items', nuevosItems);
        calcularTotales(nuevosItems);

    };

    const [buscandoProducto, setBuscandoProducto] = useState(false);
    const [resultadosProductos, setResultadosProductos] = useState<any[]>([]);
    const [filaActiva, setFilaActiva] = useState<number | null>(null); // Para saber en qué fila mostrar sugerencias

    const buscarProducto = async (query: string, index: number) => {
        setFilaActiva(index);
        handleItemChange(index, 'nombre', query); // Actualiza el input mientras escribes

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
            producto_id: producto.id,
            nombre: producto.nombre,
            descripcion: `Producto adicional #${producto.id} - ${producto?.nombre}`,
            precio: producto.precio || 0,
            total: (nuevosItems[index].cantidad || 1) * (producto.precio || 0),
            es_nuevo: false // Este ya existe en DB
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
            cliente_nombre_aux: `${cliente.nombre} ${cliente.apellido}`,
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

    // Dentro de tu componente Fields
    const [codigoCupon, setCodigoCupon] = useState('');
    const [cargandoCupon, setCargandoCupon] = useState(false);
    const [mensajeCupon, setMensajeCupon] = useState({ texto: '', tipo: '' });

    // Efecto para cargar el código si estamos editando
    useEffect(() => {
        if (data.cupon_id && !codigoCupon) {
            // Aquí podrías buscar el código del cupón si el objeto ftfactura lo trae
            setCodigoCupon(data.adcupon?.codigo || ftfactura?.adcupon?.codigo  || '');
        }
    }, [data.cupon_id]);

    const aplicarCupon = async () => {
        if (!codigoCupon) return;
        
        setCargandoCupon(true);
        setMensajeCupon({ texto: '', tipo: '' });
    
        try {
            const response = await axios.post(route('cfcupones.validar'), { 
                codigo: codigoCupon,
                persona_id: data.persona_id, // Asegúrate de que 'data.persona_id' tenga valor
                factura_id: data.id,        // Usa 'data.id' que es lo que maneja useForm
            });
    
            if (response.data.valido) {
                const cupon = response.data.cupon;
                // Obtenemos el valor del descuento desde la relación promociones
                const valorDescuento = cupon.promociones?.valor || 0;
    
                setData((prev:any) => ({
                    ...prev,
                    cupon_id: cupon.id,
                    porcentajedescuento: valorDescuento,
                }));
    
                setMensajeCupon({ 
                    texto: `¡Éxito! Cupón aplicado: ${valorDescuento}% de descuento`, 
                    tipo: 'success' 
                });
            }
        } catch (error:any) {
            // Capturamos el mensaje específico enviado por el controlador (422, 404, 403)
            const mensajeError = error.response?.data?.mensaje || 'Error al validar el cupón';
            
            setMensajeCupon({ 
                texto: mensajeError, 
                tipo: 'danger' 
            });
    
            // Limpiamos el cupón en el estado si la validación falla
            setData('cupon_id', null);
            setData('porcentajedescuento', 0);
        } finally {
            setCargandoCupon(false);
        }
    };

    useEffect(() => {
        const subtotal = data.items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
        
        // Calculamos el valor del descuento basado en el porcentaje del cupón
        const valorDescuento = (subtotal * (data.porcentajedescuento || 0)) / 100;
        const totalConDescuento = subtotal - valorDescuento;
    
        setData((prev: any) => ({
            ...prev,
            subtotal: subtotal,
            descuento: valorDescuento,
            total: totalConDescuento
        }));
    }, [data.items, data.porcentajedescuento]); // Importante escuchar cambios en el porcentaje

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
                        disabled={!!ftfactura.id} // Si ya existe un ID, no se puede editar el número
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
                            disabled={!!ftfactura.id} // Si viene de una factura, no se puede cambiar el turno
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
                                disabled={!!ftfactura.id} // Si viene de una factura, no se puede cambiar el turno
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
                                                value={item.nombre} 
                                                onChange={e => buscarProducto(e.target.value, index)}
                                                placeholder="Escribe para buscar..."
                                                autoComplete="off"
                                            />
                                            
                                            {/* Dropdown de sugerencias */}
                                            {filaActiva === index && resultadosProductos.length > 0 && (
                                                <div className="list-group shadow-lg position-absolute w-100" 
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
                                            value={item.descripcion} 
                                            onChange={e => handleItemChange(index, 'descripcion', e.target.value)} 
                                            placeholder="Informacion extra"
                                        />
                                    </td>
                                    <td>
                                        <input 
                                            type="number" 
                                            className="form-control form-control-sm bg-light border-0 text-center" 
                                            value={item.cantidad} 
                                            min="1"
                                            onChange={e => handleItemChange(index, 'cantidad', e.target.value)} 
                                        />
                                    </td>
                                    <td>
                                        <div className="input-group input-group-sm">
                                            <span className="input-group-text bg-light border-0">$</span>
                                            <input 
                                                type="number" 
                                                className="form-control bg-light border-0 text-end" 
                                                value={item.precio} 
                                                onChange={e => handleItemChange(index, 'precio', e.target.value)} 
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
            <div className="col-12 mt-4">
                <div className="invoice-total ms-auto p-4 bg-light-50 border" style={{ maxWidth: '450px' }}>
                    <div className="row g-3">
                        {/* --- SECCIÓN DE AJUSTES RÁPIDOS --- */}
                        <div className="col-6">
                            <div className="form-floating shadow-sm">
                                <input 
                                    type="number" 
                                    className={`form-control form-control-sm ${data.cupon_id ? 'bg-light text-muted' : ''}`}
                                    id="porcentajedescuento"
                                    placeholder="0"
                                    value={data.porcentajedescuento || ''}
                                    disabled={!!data.cupon_id} // Si hay cupón, el descuento manual se bloquea
                                    onChange={e => {
                                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                                        calcularTotales(data.items, val, data.tax_percent);
                                    }} 
                                />
                                <label htmlFor="porcentajedescuento">Descuento (%)</label>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="form-floating shadow-sm">
                                <input 
                                    type="number" 
                                    className="form-control form-control-sm" 
                                    id="tax_percent"
                                    placeholder="0"
                                    value={data.tax_percent || ''} 
                                    onChange={e => {
                                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                                        calcularTotales(data.items, data.porcentajedescuento, val);
                                    }} 
                                />
                                <label htmlFor="tax_percent">Impuestos (%)</label>
                            </div>
                        </div>

                        {/* --- SECCIÓN DE PAGOS Y ESTADO --- */}
                        <div className="col-6">
                            <label className="x-small fw-bolder text-uppercase text-muted mb-1">Estado Factura</label>
                            <select 
                                className={`form-select form-select-sm shadow-sm ${errors.estado_id ? 'is-invalid' : ''}`}
                                value={data.estado_id} 
                                onChange={e => setData('estado_id', e.target.value)} 
                            >
                                <option value="">Seleccionar...</option>
                                {Object.entries(estadosList).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            {errors.estado_id && <div className="invalid-feedback" role="alert"><strong>{errors.estado_id}</strong></div>}
                        </div>

                        <div className="col-6">
                            <label className="x-small fw-bolder text-uppercase text-muted mb-1">Método de Pago</label>
                            <select 
                                className={`form-select form-select-sm shadow-sm ${errors.metodo_id ? 'is-invalid' : ''}`}
                                value={data.metodo_id} 
                                onChange={e => setData('metodo_id', e.target.value)} 
                            >
                                <option value="">Seleccionar...</option>
                                {Object.entries(metodospagosList).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            {errors.metodo_id && <div className="invalid-feedback" role="alert"><strong>{errors.metodo_id}</strong></div>}
                        </div>

                        {/* --- SECCIÓN DE CUPÓN (Diseño compacto) --- */}
                        <div className="col-12 mt-2">
                            <div className={`p-1 rounded-3 border-dashed ${data.cupon_id ? 'bg-light-primary border-primary' : 'bg-white'}`} style={{ border: '2px dashed #dfe5ef' }}>
                                {!data.cupon_id ? (
                                    <div className="input-group input-group-sm">
                                        <span className="input-group-text bg-transparent border-end-0"><i className="ti ti-ticket text-muted"></i></span>
                                        <input
                                            type="text"
                                            className="form-control border-start-0 ps-0"
                                            placeholder="CÓDIGO DE CUPÓN"
                                            value={codigoCupon}
                                            onChange={(e) => setCodigoCupon(e.target.value.toUpperCase())}
                                        />
                                        <button className="btn btn-primary px-3" type="button" onClick={aplicarCupon} disabled={cargandoCupon || !codigoCupon}>
                                            {cargandoCupon ? <span className="spinner-border spinner-border-sm"></span> : 'Aplicar'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="d-flex align-items-center justify-content-between p-1">
                                        <div className="d-flex align-items-center">
                                            <i className="ti ti-circle-check-filled text-primary fs-4 me-2"></i>
                                            <div>
                                                <small className="d-block text-muted lh-1 text-uppercase fw-bold" style={{ fontSize: '9px' }}>Cupón activo</small>
                                                <span className="fw-bold text-primary">{codigoCupon}</span>
                                                <span className="badge bg-primary ms-2" style={{ fontSize: '10px' }}>{data.porcentajedescuento}% OFF</span>
                                            </div>
                                        </div>
                                        <div className="d-flex gap-1">
                                            {/* BOTÓN REAPLICAR / RECALCULAR */}
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-light-primary btn-icon"
                                                title="Recalcular / Re-validar"
                                                onClick={aplicarCupon}
                                                disabled={cargandoCupon}
                                            >
                                                {cargandoCupon ? <span className="spinner-border spinner-border-sm"></span> : <i className="ti ti-refresh fs-5"></i>}
                                            </button>

                                            {/* BOTÓN ELIMINAR */}
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-light-danger btn-icon"
                                                title="Quitar cupón"
                                                onClick={() => {
                                                    setData((prev: any) => ({ ...prev, cupon_id: null, porcentajedescuento: 0 }));
                                                    setCodigoCupon('');
                                                    setMensajeCupon({ texto: '', tipo: '' });
                                                }}
                                            >
                                                <i className="ti ti-trash fs-5"></i>
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {mensajeCupon.texto && (
                                    <div className={`x-small mt-1 px-2 pb-1 text-${mensajeCupon.tipo} fw-medium`}>
                                        <i className={`ti ti-${mensajeCupon.tipo === 'success' ? 'check' : 'alert-circle'} me-1`}></i>
                                        {mensajeCupon.texto}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- DESGLOSE FINAL --- */}
                        <div className="col-12">
                            <div className="mt-2 p-2">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span className="fw-semibold text-dark">${new Intl.NumberFormat().format(data.subtotal)}</span>
                                </div>
                                
                                {data.descuento > 0 && (
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-success fw-medium">Descuento {data.cupon_id ? '(Cupón)' : ''}</span>
                                        <span className="text-success fw-bold">-${new Intl.NumberFormat().format(data.descuento)}</span>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Impuestos</span>
                                    <span className="fw-semibold text-dark">${new Intl.NumberFormat().format(data.tax_amount)}</span>
                                </div>

                                <div className="border-top my-3"></div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 fw-bolder text-dark">Total a pagar</h4>
                                    <h3 className="mb-0 fw-bolder text-primary">${new Intl.NumberFormat().format(data.total)}</h3>
                                </div>
                            </div>
                        </div>
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
                            <i className={modoRegistro ? "ti ti-user-plus me-2" : "ti ti-users me-2"}></i>
                            {modoRegistro ? 'Registrar Cliente Nuevo' : 'Búsqueda de clientes'}
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => setModoRegistro(false)}>X</button>
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
                                                        <h6 className="mb-0 fw-bold">{cliente.nombre} {cliente.apellido}</h6>
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
