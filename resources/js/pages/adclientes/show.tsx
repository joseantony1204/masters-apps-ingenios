import React, { useState, useEffect, useRef } from 'react';
import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
import avatar9 from '/public/assets/images/user/avatar-9.jpg';  
import { router } from '@inertiajs/react';
import { initDataTable } from '@/utils/initDataTable';
import { Offcanvas } from 'bootstrap';
import axios from 'axios';
import * as bootstrap from 'bootstrap';

export default function Show({ cliente, sedesComercio, perfilesList, sedesAsignadasIds, sedePredeterminadaId, }: any) {
    const persona = cliente.persona;
    const nombreCompleto = `${persona.personasnaturales.nombres} ${persona.personasnaturales.apellidos}`;
    const icons = {
        perfil: 'ti ti-user',
        agenda: 'ti ti-calendar-event',
        seguridad: 'ti ti-shield-lock'
    };
    const [activeTab, setActiveTab] = useState('perfil');
    // 1. Estados adicionales para visibilidad (puedes usar un objeto para manejar varios)
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

    // 1. Formulario para la información de la cuenta (Perfil)
    const { data, setData, put, processing, errors, clearErrors} = useForm({
        username: cliente.persona.user?.username || '',
        email: cliente.persona.user?.email || '',
        telefonomovil: cliente.persona.user.telefonomovil || '',
        perfil_id: cliente.persona.user?.perfil_id?.toString() || '',
    });

    const submitPerfil = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('adclientes.updateperfil', cliente.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Notificación de éxito
            }
        });
    };

    // Funciones de acción
    const handleToggleSede = (sedeId: number, isActivo: boolean) => {
        router.put(route('adclientes.toggle-permiso', { cliente: cliente.id, sede: sedeId }), {
            activo: !isActivo
        }, { preserveScroll: true });
    };

    const handleSetDefault = (sedeId: number) => {
        router.put(route('adclientes.set-default', { cliente: cliente.id, sede: sedeId }), {}, { 
            preserveScroll: true 
        });
    };

    const formPass = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Limpiamos errores previos antes de intentar
        formPass.clearErrors();
    
        formPass.put(route('users.updatepassword', cliente.persona.user.id), {
            preserveScroll: true,
            onSuccess: () => {
                formPass.reset();
                // Aquí podrías disparar un alert de éxito
            },
            onError: (errors) => {
                console.log("Errores recibidos del servidor:", errors);
            }
        });
    };

    const requirements = [
        { label: "Al menos 8 caracteres", met: formPass.data.password.length >= 8 },
        { label: "Al menos 1 minúscula (a-z)", met: /[a-z]/.test(formPass.data.password) },
        { label: "Al menos 1 mayúscula (A-Z)", met: /[A-Z]/.test(formPass.data.password) },
        { label: "Al menos 1 número (0-9)", met: /\d/.test(formPass.data.password) },
        { label: "Al menos 1 carácter especial", met: /[^A-Za-z0-9]/.test(formPass.data.password) },
    ];

    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);

    // Estado para saber qué dropdown de qué cita está abierto
    const [dropdownAbierto, setDropdownAbierto] = useState<number | null>(null);
    const [citaDetalle, setCitaDetalle] = useState<any>(null);

    // Función para cerrar el menú al hacer click afuera
    useEffect(() => {
        const cerrarMenu = () => setDropdownAbierto(null);
        window.addEventListener('click', cerrarMenu);
        return () => window.removeEventListener('click', cerrarMenu);
    }, []);

    //const [cargandoTurnos, ] = useState(false);
    // 1. Estados existentes
    const [turnosDisponibles, setTurnosDisponibles] = useState<any>(null);
    const [cargandoTurnos, setCargandoTurnos] = useState(false);

    // 2. AGREGA ESTO AQUÍ: El estado para la pestaña activa
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");

    // 3. AGREGA ESTO AQUÍ: El efecto para inicializar la primera fecha
    useEffect(() => {
        if (turnosDisponibles && Object.keys(turnosDisponibles).length > 0) {
            // Esto hace que, apenas carguen los datos, se seleccione el primer día disponible
            setFechaSeleccionada(Object.keys(turnosDisponibles)[0]);
        }
    }, [turnosDisponibles]);

    const [seleccion, setSeleccion] = useState<{fecha: string, hora: string, servicio: any} | null>(null);
    // Función para manejar el clic en un servicio específico
    const handleSeleccionarCita = (fecha: string, hora: string, servicio: any) => {
        setSeleccion({ fecha, hora, servicio });
        
        // Seteamos los datos iniciales en el formulario de reserva
        formReserva.setData({
            ...formReserva.data,
            fecha: fecha,
            hora: hora,
            servicioasignado_id: servicio.servicioasignado_id,
            horainicio: servicio.horainicio,
            horafinal: servicio.horafinal,
            precio: servicio.precio,
        });

        // Cerramos el Offcanvas de disponibilidad
        const offcanvasDisp = document.getElementById('offcanvasDisponibilidad');
        if (offcanvasDisp) {
            bootstrap.Offcanvas.getInstance(offcanvasDisp)?.hide();
        }

        // Opcional: Abrir el modal del formulario de reserva
        // Supongamos que tu modal de reserva tiene el id 'modalReserva'    
        setTimeout(() => {
            const modalReserva = document.getElementById('modalReserva');
            if (modalReserva) {
                const modal = new bootstrap.Modal(modalReserva);
                modal.show();
            }
        }, 300);// Pequeño delay para que la animación de cierre no choque con la de apertura
    };

    // Al lado de los otros useForm (formPass, formBloqueo, etc.)
    const formReserva = useForm({
        cliente_id: cliente.id,
        cliente_nombre: '',
        cliente_telefono: cliente.persona.telefonomovil,
        cliente_email: cliente.persona.email,
        servicioasignado_id: '',
        fecha: '',
        hora: '',
        horainicio: '',
        horafinal: '',
        precio: '',
        observaciones: '',
    });

    // 1. Al abrir el Offcanvas, cargamos los servicios
    const [serviciosDisponibles, setServiciosDisponibles] = useState<any[]>([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
    const [especialistaSeleccionado, setEspecialistaSeleccionado] = useState<any>(null);

    // Función para cargar la lista inicial de servicios
    const cargarServiciosBusqueda = async () => {
        setCargandoTurnos(true);
        try {
            const url = route('api.servicios.buscar');
            const response = await axios.get(url);
            setServiciosDisponibles(response.data);
            
            // Reset de pasos previos
            setServicioSeleccionado(null);
            setEspecialistaSeleccionado(null);
            setTurnosDisponibles(null);

            // Abrir Offcanvas
            const element = document.getElementById('offcanvasDisponibilidad');
            if (element) {
                bootstrap.Offcanvas.getOrCreateInstance(element).show();
            }
        } catch (error) {
            console.error("Error cargando servicios", error);
        } finally {
            setCargandoTurnos(false);
        }
    };

    const seleccionarServicioYBuscarEspecialistas = (servicio: any) => {
        // 1. Guardamos el servicio elegido
        setServicioSeleccionado(servicio);
        
        // 2. IMPORTANTE: Resetear el especialista para que el Paso 2 sea visible
        setEspecialistaSeleccionado(null); 
        
        // 3. Limpiar turnos previos
        setTurnosDisponibles(null);
    };

    // Al seleccionar especialista, ahí sí llamamos a la API de turnos
    const manejarSeleccionEspecialista = async (especialista: any) => {
        // especialista aquí es el objeto que viene de "asignaciones" en tu JSON
        setEspecialistaSeleccionado(especialista);
        setCargandoTurnos(true);
        
        try {
            // Usamos el empleado_id que viene en la asignación del JSON
            const url = route('api.disponibilidad.turnos', { 
                empleado: especialista.empleado_id, 
                servicio: servicioSeleccionado.id 
            });
            
            const resp = await axios.get(url);
            setTurnosDisponibles(resp.data);
            
            // Seleccionamos la primera fecha por defecto si hay turnos
            const fechas = Object.keys(resp.data);
            if (fechas.length > 0) {
                setFechaSeleccionada(fechas[0]);
            }
        } catch (error) {
            console.error("Error cargando turnos", error);
        } finally {
            setCargandoTurnos(false);
        }
    };

    const submitReserva = (e: React.FormEvent) => {
        e.preventDefault();
        formReserva.post(route('adcitas.store'), {
            onSuccess: () => {
                // 1. Cerrar el Modal de Confirmación
                const modalElement = document.getElementById('modalReserva');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance?.hide();
                }
                // 2. Limpiamos el formulario
                formReserva.reset();
    
                // 2. Cerrar el Offcanvas de Disponibilidad
                const offcanvasElement = document.getElementById('offcanvasDisponibilidad');
                if (offcanvasElement) {
                    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
                    offcanvasInstance?.hide();
                }
    
                // 3. Limpiar estados
                setServicioSeleccionado(null);
                setEspecialistaSeleccionado(null);
                setTurnosDisponibles(null);
                
                // 4. Notificación de éxito (Opcional si usas SweetAlert)
                // Swal.fire('¡Listo!', 'Tu cita ha sido agendada con éxito', 'success');
            },
            onError: (errors) => {
                console.error("Errores al validar la cita:", errors);
            }
        });
    };

    // 1. Ver Detalle (Puedes abrir un modal con la info extendida)
    // 1. Abrir el Modal POS
    const verDetalleCita = (cita: any) => {
        setCitaDetalle(cita);
        // Pre-llenamos el formulario con datos existentes si los hay
        formPostCita.setData({
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
    // 2. Enviar Recordatorio (Llamada a API para WhatsApp/Email)
    const enviarRecordatorio = async (cita: any) => {
        try {
            await axios.post(route('api.citas.recordatorio', cita.id));
            // Notificación de éxito: "Recordatorio enviado al cliente"
        } catch (error) {
            console.error("Error enviando recordatorio");
        }
    };

    // 3. Cancelar Cita (Cambio de estado)
    const cambiarEstadoCita = (cita: any, nuevoEstado: string) => {
        if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
            router.put(route('api.citas.cambiar-estado', cita.id), {
                estado: nuevoEstado
            }, { preserveScroll: true });
        }
    };

    // 4. Eliminar Cita (Borrado físico de la BD)
    const eliminarCita = (id: number) => {
        if (confirm('Esta acción no se puede deshacer. ¿Eliminar cita permanentemente?')) {
            router.delete(route('api.citas.destroy', id), {
                preserveScroll: true
            });
        }
    };

    // --- ESTADOS PARA EL POS/DETALLE DE CITA ---
    const [buscandoProducto, setBuscandoProducto] = useState(false);
    const [resultadosBusqueda, setResultadosBusqueda] = useState<any[]>([]); // Resultados del buscador
    const [filtroBusqueda, setFiltroBusqueda] = useState(''); // Lo que el usuario escribe

    // Formulario para guardar los cambios de la cita (POS)
    const formPostCita = useForm({
        observaciones: '',
        items: [] as any[], // Aquí irán los nuevos productos/servicios agregados
        total: 0,
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
    

    return (  
    <AppMainLayout>
         <Head title={`Detalle - ${nombreCompleto}`} />
        {/* Header de la página */}
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><Link href={route('dashboard')}>Inicio</Link></li>
                            <li className="breadcrumb-item"><Link href={route('adclientes.index')}>Clientes</Link></li>
                            <li className="breadcrumb-item" aria-current="page">Detalle</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h2 className="mb-0">Perfil del cliente</h2>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            {/* --- COLUMNA IZQUIERDA: TARJETA DE RESUMEN --- */}
            {/* --- LADO IZQUIERDO: PERFIL RÁPIDO --- */}
            <div className="col-lg-3">
                <div className="card border shadow-none">
                    <div className="card-body text-center"> {/* text-center centra el texto y elementos inline */}
                        <div className="d-flex justify-content-center"> {/* Contenedor flex para centrar la imagen perfectamente */}
                            <div className="position-relative d-inline-block">
                                <img 
                                    //src={persona.foto || '/assets/images/user/avatar-1.png'}
                                    src={persona.personasnaturales.sexo_id === 46 ? avatar1 : persona.personasnaturales.sexo_id === 47 ? avatar9 : '' } 
                                    className="img-radius wid-100 mb-3" 
                                    alt="User" 
                                    style={{ border: '3px solid #fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                                />
                            </div>
                        </div>
                        
                        {/* Datos del nombre y cargo */}
                        <h5 className="mb-1 text-uppercase fw-bold" style={{ fontSize: '0.95rem' }}>
                        {nombreCompleto}
                        </h5>
                        {/* Badge de Estado centrado */}
                        <div className="d-flex justify-content-center">
                            <span className={`badge bg-light-${cliente.estado.observacion} text-${cliente.estado.observacion} border border-${cliente.estado.observacion} px-3 py-2`}>
                                {cliente.estado.nombre}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tarjeta de información adicional (ID y Teléfono) */}
                <div className="card border shadow-none">
                    <div className="card-body p-0">
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">ID:</span> <strong>{persona.identificacion}</strong>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Email:</span> <span className="text-end small">{persona.email}</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between">
                                <span className="text-muted">Tel:</span> <strong>{persona.telefonomovil}</strong>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4 animate__animated animate__fadeInUp">
                    <Link 
                        href={route('adclientes.index')} 
                        className="btn btn-outline-secondary"
                    >
                        <i className="ti ti-arrow-left"></i>
                        Volver
                    </Link>
                    <Link 
                        href={route('adclientes.edit',cliente.id)} 
                        className="btn btn-outline-primary"
                    >
                        <i className="ti ti-edit"></i>
                        Editar Cliente
                    </Link>
                </div>
            </div>

            {/* --- COLUMNA DERECHA: PANEL DE PESTAÑAS --- */}
            <div className="col-lg-9 col-md-8">
                <div className="card border shadow-none">
                    <div className="card-header p-0">
                        <ul className="nav nav-tabs card-header-tabs m-0">
                            {Object.keys(icons).map((tab) => (
                                <li className="nav-item" key={tab}>
                                    <button 
                                        className={`nav-link ${activeTab === tab ? 'active' : ''} py-3`}
                                        onClick={() => setActiveTab(tab)}
                                        style={{ display: 'flex', alignItems: 'center' }}
                                    >
                                        <i className={`${icons[tab as keyof typeof icons]} me-2 f-18`}></i>
                                        <span className="text-capitalize">{tab}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                
                    <div className="card-body">
                        {/* --- TAB: PERFIL (GENERAL SETTINGS & SEDES) --- */}
                        {activeTab === 'perfil' && (
                            <div className="animate__animated animate__fadeIn">
                                <div className="card border shadow-none mb-0">
                                    <div className="card-header bg-transparent border-bottom py-3">
                                        <h5 className="mb-0 text-dark">Configuración de la cuenta</h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={submitPerfil}>
                                            <div className="row g-4">
                                                {/* Account username */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted mb-1 small">Usuario / ID</label>
                                                    <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={data.username} 
                                                        onChange={e => setData('username', e.target.value)}
                                                        placeholder="Nombre de usuario"
                                                        disabled // <--- Bloqueado
                                                    />
                                                    {errors.username && <div className="text-danger small mt-1">{errors.username}</div>}
                                                </div>

                                                {/* Account Email */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted mb-1 small">Email</label>
                                                    <input 
                                                        type="email" 
                                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                        value={data.email}
                                                        placeholder="correo@ejemplo.com"
                                                        onChange={e => {
                                                            setData('email', e.target.value);
                                                            //validateField('email', e.target.value); // <--- Validación en tiempo real
                                                        }}
                                                    />
                                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                                </div>

                                                {/* Telephone */}
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted mb-1 small">Teléfono</label>
                                                    <input 
                                                        type="text" 
                                                        className={`form-control ${errors.telefonomovil ? 'is-invalid' : ''}`}
                                                        value={data.telefonomovil}
                                                        placeholder="Teléfono de la cuenta"
                                                        onChange={e => {
                                                            setData('telefonomovil', e.target.value);
                                                            //validateField('telefonomovil', e.target.value); // <--- Validación en tiempo real
                                                        }}
                                                    />
                                                    {errors.telefonomovil && <div className="invalid-feedback">{errors.telefonomovil}</div>}
                                                </div>

                                                {/* Perfil / Rol (Usando perfilesList del controlador) */}

                                                <div className="col-md-6">
                                                    <label className="form-label text-muted mb-1 small">Perfil / Rol</label>
                                                    <select
                                                        className={`form-select ${errors.perfil_id ? 'is-invalid' : ''}`}
                                                        value={data.perfil_id} // Este es el que manda la selección
                                                        onChange={e => setData('perfil_id', e.target.value)}
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <option value="">Seleccione un perfil...</option>
                                                        {Object.entries(perfilesList).map(([key, label]) => (
                                                            <option key={key} value={key}>
                                                                {label as string}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.perfil_id && <div className="invalid-feedback">{errors.perfil_id}</div>}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end mt-3">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary px-4" 
                                                    disabled={processing}
                                                >
                                                    {processing ? (
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                    ) : (
                                                        <i className="ti ti-device-floppy me-2"></i>
                                                    )}
                                                    Actualizar Perfil
                                                </button>
                                            </div>
                                        </form>
                                        <hr className="my-4" />
                                        {/* --- SECCIÓN DE SEDES DINÁMICAS --- */}
                                        <div className="row mt-4 g-4">
                                            {/* LISTA IZQUIERDA: Sedes del Comercio */}
                                            <div className="col-md-6">
                                                <div className="card border shadow-none">
                                                    <div className="card-header bg-transparent py-3">
                                                        <h6 className="mb-0">Sedes habilitadas para el usuario</h6>
                                                    </div>
                                                    <div className="card-body p-0">
                                                        <ul className="list-group list-group-flush">
                                                            {sedesComercio.map((sede: any) => {
                                                                const isHabilitada = sedesAsignadasIds.includes(sede.id);
                                                                return (
                                                                    <li key={sede.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                                                        <div>
                                                                            <h6 className="mb-0 text-uppercase" style={{ fontSize: '0.8rem' }}>{sede.nombre}</h6>
                                                                            <small className="text-muted">{sede.direccion}</small>
                                                                        </div>
                                                                        <div className="form-check form-switch">
                                                                            <input 
                                                                                className="form-check-input" 
                                                                                type="checkbox" 
                                                                                checked={isHabilitada}
                                                                                onChange={() => handleToggleSede(sede.id, isHabilitada)}
                                                                                style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                                                                            />
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* LISTA DERECHA: Sede Predeterminada (Solo muestra las habilitadas) */}
                                            <div className="col-md-6">
                                                <div className="card border shadow-none">
                                                    <div className="card-header bg-transparent py-3">
                                                        <h6 className="mb-0">Sede predeterminada</h6>
                                                    </div>
                                                    <div className="card-body p-0">
                                                        <ul className="list-group list-group-flush">
                                                            {/* LISTA DERECHA: Sede Predeterminada */}
                                                            {sedesComercio
                                                                .filter((s: any) => sedesAsignadasIds.includes(s.id)) // Solo muestra las que tienen estado_id activo
                                                                .map((sede: any) => (
                                                                    <li 
                                                                        key={`def-${sede.id}`} 
                                                                        className="list-group-item d-flex justify-content-between align-items-center py-3"
                                                                        onClick={() => handleSetDefault(sede.id)}
                                                                        style={{ 
                                                                            cursor: 'pointer', 
                                                                            backgroundColor: sedePredeterminadaId?.toString() === sede.id.toString() ? '#f0f9ff' : '' 
                                                                        }}
                                                                    >
                                                                        <div className="d-flex align-items-center">
                                                                        <input 
                                                                            className="form-check-input" 
                                                                            type="radio" 
                                                                            checked={sedePredeterminadaId === sede.id}
                                                                            readOnly 
                                                                        />
                                                                        <div className="ms-3">
                                                                            <h6 className="mb-0 text-uppercase" style={{ fontSize: '0.8rem' }}>{sede.nombre}</h6>
                                                                            <small className="text-muted">
                                                                                {sedePredeterminadaId === sede.id ? 'Sede de inicio' : 'Alternativa'}
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                    {sedePredeterminadaId === sede.id && (
                                                                        <span className="badge bg-light-success text-success">Activa</span>
                                                                    )}
                                                                    </li>
                                                                ))
                                                            }
                                                            
                                                        </ul>
                                                        {sedesAsignadasIds.length === 0 && (
                                                            <div className="p-4 text-center text-muted small">Habilita una sede a la izquierda primero.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'agenda' && (
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold">Historial de citas</h5>
                                    <button 
                                        className="btn btn-primary px-4"
                                        onClick={() => cargarServiciosBusqueda()}
                                        disabled={cargandoTurnos}
                                    >
                                        {cargandoTurnos ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <i className="ti ti-clock me-2 fs-4"></i>
                                        )}
                                        Nueva Cita
                                    </button>
                                </div>
                                
                                <div className="card-body p-0">
                                    
                                    <table ref={tableRef} className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th className="text-center" style={{ width: '5%' }}>Código</th>
                                                <th className="text-center" style={{ width: '10%' }}>Fecha y hora</th>
                                                <th className="text-center" style={{ width: '80%' }}>Servicios</th>
                                                <th className="text-center" style={{ width: '5%' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody> 
                                            {cliente.citas && cliente.citas.length > 0 ? (
                                                cliente.citas.map((cita: any) => (
                                                <tr key={cita.id}>
                                                    <td className="text-center"><span className="fw-bold text-primary">#{cita.codigo}</span></td>
                                                    <td>
                                                        <div className="fw-medium">
                                                            {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                                weekday: 'long', 
                                                                day: 'numeric', 
                                                                month: 'long' 
                                                            })}
                                                        </div>
                                                        <small className="text-muted">{cita.horainicio} - {cita.horafinal}</small>
                                                        <span 
                                                            className={`badge bg-light-${cita.estado.observacion} text-${cita.estado.observacion}`} 
                                                            style={{  minWidth: '90px',  padding: '5px 10px', borderRadius: '4px', fontWeight: '600',textTransform: 'capitalize'}}>
                                                            {cita.estado?.nombre}
                                                        </span>
                                                    </td>
                                                    <td>
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
                                                                    <br></br>
                                                                    <span 
                                                                        className={`badge bg-light-${detalle.estado.observacion} text-${detalle.estado.observacion}`} 
                                                                        style={{  minWidth: '90px',  padding: '5px 10px', borderRadius: '4px', fontWeight: '600',textTransform: 'capitalize'}}>
                                                                        {detalle.estado?.nombre}
                                                                    </span>
                                                                </div>
                                                                <br></br>
                                                                
                                                           
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
                                                            
                                                            {/* BOTÓN PRINCIPAL: VER DETALLE */}
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-outline-primary btn-sm px-3 d-flex align-items-center gap-2"
                                                                style={{ 
                                                                    borderTopRightRadius: 0, 
                                                                    borderBottomRightRadius: 0,
                                                                    fontSize: '0.75rem',
                                                                    fontWeight: 600
                                                                }}
                                                                onClick={() => verDetalleCita(cita)}
                                                            >
                                                                <i className="ti ti-receipt fs-5"></i>
                                                                <span>Resumen</span>
                                                            </button>

                                                            {/* BOTÓN SPLIT: FLECHA */}
                                                            <button 
                                                                type="button" 
                                                                className={`btn btn-sm dropdown-toggle-split d-flex align-items-center justify-content-center ${dropdownAbierto === cita.id ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                                                                style={{ 
                                                                    borderTopLeftRadius: 0, 
                                                                    borderBottomLeftRadius: 0,
                                                                    borderLeft: 'none', // Quita la línea doble en medio
                                                                    width: '32px'
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDropdownAbierto(dropdownAbierto === cita.id ? null : cita.id);
                                                                }}
                                                            >
                                                                <i className={`ti ti-chevron-down transition-all ${dropdownAbierto === cita.id ? 'rotate-180' : ''}`}></i>
                                                            </button>

                                                            {/* MENÚ DESPLEGABLE PERSONALIZADO */}
                                                            {dropdownAbierto === cita.id && (
                                                                <ul className="dropdown-menu show dropdown-menu-end shadow-lg border-0 m-0 py-2 animate__animated animate__fadeInUp" 
                                                                    style={{ 
                                                                        position: 'absolute', 
                                                                        right: 0, 
                                                                        top: '110%', 
                                                                        zIndex: 1050, 
                                                                        display: 'block',
                                                                        minWidth: '200px',
                                                                        borderRadius: '8px'
                                                                    }}>
                                                                    <li className="px-3 py-2">
                                                                        <span className="text-uppercase text-muted fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                                            Gestión de Cita
                                                                        </span>
                                                                    </li>
                                                                    <li><hr className="dropdown-divider opacity-50" /></li>
                                                                    <li>
                                                                        <button className="dropdown-item d-flex align-items-center py-2 px-3 text-warning" onClick={() => eliminarCita(cita.id)}>
                                                                            <i className="ti ti-ban me-3 fs-5"></i>
                                                                            <span className="small fw-medium">Cancelar Cita</span>
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                ))
                                            ): (
                                                <tr>
                                                    <td colSpan={6} className="text-center py-5 text-muted">
                                                        <i className="ti ti-calendar-x fs-1 d-block mb-2 opacity-25"></i>
                                                        Este cliente aún no tiene citas registradas.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                   
                                </div>
                            </div>
                        )}

                        {/* --- TAB: SEGURIDAD --- */}
                        {activeTab === 'seguridad' && (
                            <div className="animate__animated animate__fadeIn">
                                <form onSubmit={handlePasswordSubmit} className="card border shadow-none">
                                    <div className="card-header bg-transparent border-bottom py-3">
                                        <h5 className="mb-0 text-dark">Cambiar Contraseña</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-7 border-end">
                                                
                                                {/* Contraseña Actual */}
                                                <div className="mb-3">
                                                    <label className="form-label text-muted small">Contraseña Actual</label>
                                                    <div className="input-group">
                                                        <input 
                                                            type={showPass.current ? "text" : "password"} 
                                                            className={`form-control ${formPass.errors.current_password ? 'is-invalid' : ''}`}
                                                            value={formPass.data.current_password}
                                                            onChange={e => formPass.setData('current_password', e.target.value)}
                                                        />
                                                        <button className="btn btn-outline-secondary" type="button" 
                                                            onClick={() => setShowPass({...showPass, current: !showPass.current})}>
                                                            <i className={`ti ti-eye${showPass.current ? '-off' : ''}`}></i>
                                                        </button>
                                                    </div>
                                                    {formPass.errors.current_password && <div className="invalid-feedback d-block">{formPass.errors.current_password}</div>}
                                                </div>

                                                {/* Nueva Contraseña */}
                                                <div className="mb-3">
                                                    <label className="form-label text-muted small">Nueva Contraseña</label>
                                                    <div className="input-group">
                                                        <input 
                                                            type={showPass.new ? "text" : "password"} 
                                                            className={`form-control ${formPass.errors.password ? 'is-invalid' : ''}`}
                                                            value={formPass.data.password}
                                                            onChange={e => formPass.setData('password', e.target.value)}
                                                        />
                                                        <button className="btn btn-outline-secondary" type="button" 
                                                            onClick={() => setShowPass({...showPass, new: !showPass.new})}>
                                                            <i className={`ti ti-eye${showPass.new ? '-off' : ''}`}></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Confirmar Contraseña */}
                                                <div className="mb-3">
                                                    <label className="form-label text-muted small">Confirmar Nueva Contraseña</label>
                                                    <div className="input-group">
                                                        <input 
                                                            type={showPass.confirm ? "text" : "password"} 
                                                            className="form-control"
                                                            value={formPass.data.password_confirmation}
                                                            onChange={e => formPass.setData('password_confirmation', e.target.value)}
                                                        />
                                                        <button className="btn btn-outline-secondary" type="button" 
                                                            onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}>
                                                            <i className={`ti ti-eye${showPass.confirm ? '-off' : ''}`}></i>
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="col-md-5 ps-md-4">
                                                <h6 className="mb-3 small fw-bold text-dark">Requisitos de seguridad:</h6>
                                                <ul className="list-unstyled">
                                                    {requirements.map((req, i) => (
                                                        <li key={i} className={`mb-2 small d-flex align-items-center ${req.met ? 'text-success fw-bold' : 'text-muted'}`}>
                                                            <i className={`ti ti-${req.met ? 'circle-check' : 'minus'} me-2 f-16`}></i>
                                                            {req.label}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-transparent border-top d-flex justify-content-end">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary px-4 shadow-none" 
                                            disabled={formPass.processing || !requirements.every(r => r.met)}
                                        >
                                            {formPass.processing ? (
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                            ) : (
                                                <i className="ti ti-lock-check me-2"></i>
                                            )}
                                            Guardar Contraseña
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="offcanvas offcanvas-end border-0 shadow" style={{ width: '460px' }} tabIndex={-1} id="offcanvasDisponibilidad">
            <div className="offcanvas-header bg-primary text-white py-4">
                <div>
                    <h4 className="offcanvas-title fw-bold text-white mb-1">📅 Reservar Cita</h4>
                </div>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
            </div>

            <div className="offcanvas-body p-0 bg-light-subtle d-flex flex-column">
                {/* PASO 1: SELECCIÓN DE SERVICIO */}
                {!servicioSeleccionado && (
                    <div className="p-4">
                        <h6 className="fw-bold text-muted small text-uppercase mb-3">1. Selecciona un Servicio</h6>
                        <div className="row g-2">
                            {serviciosDisponibles.map((s) => (
                                <div key={s.id} className="col-12">
                                    <div 
                                        className="card shadow-none hover-border-primary cursor-pointer mb-0"
                                        onClick={() => seleccionarServicioYBuscarEspecialistas(s)} 
                                        style={{ transition: 'all 0.3s' }}
                                    >
                                        <div className="card-body p-3 d-flex align-items-center">
                                            <div className="bg-light-primary rounded p-2 me-3"><i className="ti ti-cut text-primary"></i></div>
                                            <div className="flex-grow-1">
                                                <div className="fw-bold">{s.nombre}</div>
                                                <small className="text-muted">Múltiples especialistas</small>
                                            </div>
                                            <i className="ti ti-chevron-right text-muted"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PASO 2: SELECCIONAR ESPECIALISTA */}
                {servicioSeleccionado && !especialistaSeleccionado && (
                    <div className="p-4 animated fadeIn">
                        <button className="btn btn-link btn-sm p-0 mb-3 text-decoration-none text-primary" onClick={() => setServicioSeleccionado(null)}>
                            <i className="ti ti-arrow-left me-1"></i> Volver a servicios
                        </button>
                        <h6 className="fw-bold text-muted small text-uppercase mb-3">2. Selecciona un especialista</h6>
                        
                        <div className="row g-2">
                            {servicioSeleccionado.asignaciones?.map((esp: any) => (
                                <div key={esp.empleado_id} className="col-12">
                                    <div className="card border shadow-none cursor-pointer hover-border-primary mb-0"
                                        onClick={() => manejarSeleccionEspecialista(esp)}>
                                        <div className="card-body p-3 d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold">
                                                    {esp.nombre?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{esp.nombre}</div>
                                                    <small className="text-muted">
                                                        <i className="ti ti-clock me-1"></i>{esp.duracionpersonalizado} min
                                                    </small>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <span className="fw-bold text-primary d-block">${esp.preciopersonalizado}</span>
                                                <span className="badge bg-light-primary text-primary" style={{fontSize: '0.65rem'}}>Elegir</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {(!servicioSeleccionado.asignaciones || servicioSeleccionado.asignaciones.length === 0) && (
                            <div className="text-center py-4">
                                <i className="ti ti-info-circle fs-2 text-warning opacity-50"></i>
                                <p className="small text-muted mt-2">No hay especialistas para este servicio.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* EFECTO DE CARGA (SKELETON) */}
                {cargandoTurnos && (
                    <div className="p-4">
                        <div className="placeholder-glow">
                            <div className="placeholder col-4 mb-3 rounded py-2"></div>
                            <div className="d-flex gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="placeholder rounded shadow-sm" style={{ width: '70px', height: '60px' }}></div>
                                ))}
                            </div>
                            <div className="placeholder col-3 mb-3 rounded py-1"></div>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="placeholder col-12 mb-2 rounded py-4"></div>
                            ))}
                        </div>
                    </div>
                )}
                {/* PASO 3: CALENDARIO DE TURNOS (Ya lo tienes implementado, solo asegúrate de mostrarlo cuando haya especialista seleccionado) */}
                {especialistaSeleccionado && turnosDisponibles && (
                    <div className="animated fadeIn">
                        <button className="btn btn-link btn-sm mx-4 mt-3 p-0 text-decoration-none" onClick={() => {setEspecialistaSeleccionado(null); setTurnosDisponibles(null);}}>
                            <i className="ti ti-arrow-left"></i> Cambiar especialista
                        </button>
                        {/* Aquí va tu código actual del Selector de Días y Listado de Turnos */}
                        {turnosDisponibles && Object.keys(turnosDisponibles).length > 0 ? (
                            <>
                                {/* SELECTOR DE DÍAS HORIZONTAL */}
                                <div className="bg-white border-bottom p-2 sticky-top">
                                    <div className="d-flex gap-2 overflow-x-auto pb-2 custom-scrollbar px-2">
                                        {Object.keys(turnosDisponibles).map((fecha) => (
                                            <button
                                                key={fecha}
                                                onClick={() => setFechaSeleccionada(fecha)}
                                                className={`btn btn-sm px-3 flex-shrink-0 transition-all ${fechaSeleccionada === fecha ? 'btn-primary shadow' : 'btn-outline-light text-dark border'}`}
                                                style={{ minWidth: '70px' }}
                                            >
                                                <div className="small text-uppercase opacity-75" style={{ fontSize: '0.6rem' }}>
                                                    {new Date(fecha + 'T00:00:00').toLocaleDateString('es', { weekday: 'short' })}
                                                </div>
                                                <div className="fw-bold fs-5">{new Date(fecha + 'T00:00:00').getDate()}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
        
                                {/* LISTADO DE TURNOS */}
                                <div className="p-3 overflow-y-auto flex-grow-1">
                                    {['Mañana', 'Tarde'].map((jornada) => {
                                        const turnosJornada = turnosDisponibles[fechaSeleccionada]?.filter((t: any) => {
                                            const hora = parseInt(t.hora.split(':')[0]);
                                            return jornada === 'Mañana' ? hora < 12 : hora >= 12;
                                        });
        
                                        if (!turnosJornada?.length) return null;
        
                                        return (
                                            <div key={jornada} className="mb-4">
                                                <div className="d-flex align-items-center mb-3">
                                                    <h6 className="mb-0 fw-bold text-uppercase small text-muted tracking-wider">{jornada}</h6>
                                                    <div className="flex-grow-1 border-bottom ms-3 opacity-25"></div>
                                                </div>
        
                                                <div className="row g-2">
                                                    {turnosJornada.map((bloque: any, bIdx: number) => (
                                                        <div key={bIdx} className="col-12">
                                                            <div className="card border-0 shadow-sm mb-1 hover-shadow-md">
                                                                <div className="card-body p-2 d-flex align-items-center gap-3">
                                                                    <div className="bg-light rounded-2 px-3 py-2 fw-bold text-primary border border-primary-subtle">
                                                                        {bloque.hora}
                                                                    </div>
                                                                    <div className="d-flex flex-wrap gap-1">
                                                                        {bloque.servicios_que_caben.map((serv: any, sIdx: number) => (
                                                                            <button 
                                                                                key={sIdx}
                                                                                onClick={() => handleSeleccionarCita(fechaSeleccionada, bloque.hora, serv)}
                                                                                className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-medium"
                                                                            >
                                                                                <i className="ti ti-plus me-1"></i>{serv.nombre}
                                                                                
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <i className="ti ti-calendar-off fs-1 text-muted opacity-25"></i>
                                <p className="mt-2 text-muted">No hay disponibilidad para los criterios seleccionados.</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>

        {/* --- MODAL DE RESERVA (CONFIRMACIÓN) --- */}
        <div className="modal fade" id="modalReserva" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-bottom bg-light p-3">
                        <div>
                            <h5 className="modal-title fw-bold text-dark">
                                <i className="ti ti-calendar-check me-2 text-primary fs-4"></i>
                                Confirmar Cita
                            </h5>
                            <small className="text-muted">Verifica los detalles antes de agendar</small>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
                        {/* Resumen del Turno */}
                        {seleccion && (
                            <div className="card border-primary-subtle bg-primary-subtle mb-4">
                                <div className="card-body">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-white rounded-circle p-2 text-primary shadow-sm">
                                            <i className="ti ti-clock fs-3"></i>
                                        </div>
                                        <div>
                                            <h6 className="mb-0 fw-bold text-dark">
                                                {new Date(seleccion.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                    weekday: 'long', day: 'numeric', month: 'long' 
                                                })}
                                            </h6>
                                            <span className="badge bg-primary me-2">{seleccion.hora}</span>
                                            <small className="text-muted fw-bold">{seleccion.servicio.nombre}</small>
                                        </div>
                                    </div>
                                    <hr className="my-2 opacity-10" />
                                    <div className="small text-dark">
                                        <i className="ti ti-user-check me-1"></i> Especialista: <strong>{especialistaSeleccionado?.nombre}</strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form id="formConfirmarCita" onSubmit={submitReserva}>
                            {/* Info del Cliente (Solo lectura ya que estamos en su perfil) */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold small text-muted text-uppercase">Cliente</label>
                                <div className="d-flex align-items-center p-2 border rounded bg-light">
                                <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-3 d-flex align-items-center justify-content-center fw-bold">
                                        {nombreCompleto.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="fw-bold small">{nombreCompleto}</div>
                                        <div className="text-muted" style={{fontSize:'10px'}}>{persona.email}</div>
                                    </div>
                                </div>
                            </div>
                            

                            <div className="mb-3">
                                <label htmlFor="observaciones" className="form-label fw-semibold small text-muted text-uppercase">Notas para el especialista</label>
                                <textarea 
                                    className="form-control" 
                                    id="observaciones" 
                                    rows={2}
                                    value={formReserva.data.observaciones}
                                    onChange={(e) => formReserva.setData('observaciones', e.target.value)}
                                    placeholder="¿Algún detalle adicional para tu cita?"
                                ></textarea>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer border-top bg-light p-3">
                        <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                            Regresar
                        </button>
                        <button 
                            type="submit" 
                            form="formConfirmarCita" 
                            className="btn btn-primary px-4 shadow"
                            disabled={formReserva.processing}
                        >
                            {formReserva.processing ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                <i className="ti ti-check me-2"></i>
                            )}
                            Agendar Cita
                        </button>
                    </div>
                </div>
            </div>
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
                                <small className="opacity-75">Cliente: {nombreCompleto}</small>
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
                                                        {detalle.empleadoservicio?.empleado?.persona?.personasnaturales?.nombres}
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
                                                <div className="col-1 text-center text-muted small">{(citaDetalle?.detalle_con_empleadoservicio?.length || 0) + index + 1}</div>
                                                <div className="col-5">
                                                    {detalle.producto?.map((p: any) => ( 
                                                        <div key={p.id}>
                                                            <div className="fw-bold text-dark">{p.nombre}</div>
                                                            <span className="badge bg-light-secondary text-secondary f-10 text-uppercase" style={{fontSize:'9px'}}>{p.tipo}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="col-2 text-center">{detalle.cantidad}</div>
                                                <div className="col-2 text-end fw-medium">${Number(detalle.preciofinal / detalle.cantidad).toLocaleString()}</div>
                                                <div className="col-2 text-end fw-bold text-dark">${Number(detalle.preciofinal).toLocaleString()}</div>
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
                                        {resultadosBusqueda.length > 0 && (
                                            <div className="position-absolute w-50 shadow-lg z-3 mt-1">
                                                <ul className="list-group rounded-3 overflow-hidden">
                                                    {resultadosBusqueda.map((res: any) => (
                                                        <li key={res.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center cursor-pointer" onClick={() => agregarItemACita(res)}>
                                                            <div><strong>{res.nombre}</strong> <small className="text-muted ms-2">${Number(res.precio).toLocaleString()}</small></div>
                                                            <i className="ti ti-plus text-primary"></i>
                                                        </li>
                                                    ))}
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
    </AppMainLayout> 
    );
}