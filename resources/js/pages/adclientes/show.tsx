import React, { useState, useEffect, useRef } from 'react';
import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, useForm, usePage} from '@inertiajs/react';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
import avatar9 from '/public/assets/images/user/avatar-9.jpg';  
import { router } from '@inertiajs/react';
import { initDataTable } from '@/utils/initDataTable';
import { Offcanvas } from 'bootstrap';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { toast } from 'react-hot-toast';

import CitasModalPos from '@/components/global/citas-modal-pos';
import CitasModalCancelar from '@/components/global/citas-modal-cancelar';

export default function Show({ cliente, sedesComercio, perfilesList, sedesAsignadasIds, sedePredeterminadaId, turnoActivo, turnosList, metodospagosList, sedePredeterminadaPos, estadosList}: any) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const persona = cliente.persona;
    const nombreCompleto = `${persona.personasnaturales.nombres} ${persona.personasnaturales.apellidos}`;
    const icons = {
        perfil: 'ti ti-user',
        agenda: 'ti ti-calendar-event',
        cupones: 'ti ti-ticket', 
        seguridad: 'ti ti-shield-lock'
    };
    const [activeTab, setActiveTab] = useState('perfil');
    const [jornadaActiva, setJornadaActiva] = useState('Mañana');
    const [citaCancelar, setCitaCancelar] = useState<any>(null);

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
        cliente_nombre:  `${persona.personasnaturales.nombre} ${persona.personasnaturales.apellido}`,
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
                token: user.personas.comercios.token,
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

    const handleFacturar = (id: number) => {
        router.visit(route('ftfacturas.create',{ cita: id }));
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
                                                <th className="text-center" style={{ width: '20%' }}>Código / Fecha Hora</th>
                                                <th className="text-center" style={{ width: '50%' }}>Servicios / Especialista</th>
                                                <th className="text-center" style={{ width: '20%' }}>Detalle / Total</th>
                                                <th className="text-center" style={{ width: '10%' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody> 
                                            {cliente.citas.map((cita: any) => {
                                                // Aquí ya no necesitas el .filter() ni el .sort()
                                                // Solo la lógica de cálculos de totales y el renderizado del <tr>
                                                const totalServicios = cita.detalle_con_empleadoservicio?.reduce(
                                                    (acc: number, item: any) => acc + Number(item.preciofinal || 0), 0
                                                ) || 0;
                                            
                                                const totalProductos = cita.detalle_con_producto?.reduce(
                                                    (acc: number, item: any) => acc + Number(item.preciofinal || 0), 0
                                                ) || 0;
                                                const totalGeneral = totalServicios + totalProductos;
                                                const esInactiva = ['CA', 'RE'].includes(cita.estado.codigo?.toUpperCase());
                                                const esPagada = ['AS'].includes(cita.estado.codigo?.toUpperCase());
                                                return (
                                                    <tr key={cita.id}>
                                                        <td className="text-left pe-4">
                                                            <div className="d-flex align-items-center">
                                                                <div>
                                                                    <span className="fw-bold text-primary">#{cita.codigo}</span>
                                                                    <div className="fw-medium text-capitalize">
                                                                        {new Date(cita.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                                            weekday: 'long', 
                                                                            day: 'numeric', 
                                                                            month: 'long' 
                                                                        })}
                                                                    </div>
                                                                    <small className="text-muted">{cita.horainicio} - {cita.horafinal}</small>
                                                                    <br/>
                                                                    <span 
                                                                        className={`badge bg-light-${cita.estado?.observacion} text-${cita.estado?.observacion}`} 
                                                                        style={{ minWidth: '90px', padding: '5px 10px', borderRadius: '4px', fontWeight: '600', textTransform: 'capitalize' }}>
                                                                        {cita.estado?.nombre}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td>
                                                            {/* SERVICIOS */}
                                                            {cita.detalle_con_empleadoservicio?.map((detalle: any) => (
                                                                <div key={detalle.id} className="d-flex align-items-center mb-1">
                                                                    <div className="bg-light-primary rounded p-2 me-2">
                                                                        <i className="ti ti-clipboard-list text-primary"></i>
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <div className="fw-semibold">{detalle.empleadoservicio?.servicio?.nombre || 'Servicio N/A'}</div>
                                                                        <small className="text-muted d-block">Total: ${Number(detalle?.preciofinal).toLocaleString()}</small>
                                                                    </div>
                                                                    <div className="d-flex align-items-left mt-1">
                                                                        {/* Avatar pequeño opcional */}
                                                                        <div className="avatar avatar-xs bg-light-primary text-primary rounded-circle me-1 d-flex align-items-center justify-content-center fw-bold" style={{ width: '20px', height: '20px', fontSize: '9px' }}>
                                                                            {detalle.empleadoservicio?.empleado?.persona?.personasnaturales?.nombres?.charAt(0) || 'E'}
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

                                                            {/* PRODUCTOS ADICIONALES */}
                                                            {cita.detalle_con_producto?.map((d: any) => (
                                                                <div key={d.id} className="d-flex align-items-center mb-2">
                                                                    <div className="bg-light-success rounded p-2 me-2">
                                                                        <i className="ti ti-shopping-cart text-success"></i>
                                                                    </div>
                                                                    <div>
                                                                        <div className="fw-semibold">{d.producto?.[0]?.nombre || 'Producto'}</div>
                                                                        <small className="text-muted">Cant: {d.cantidad} • Total: ${Number(d?.preciofinal).toLocaleString()}</small>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </td>
                                                        
                                                        <td className="text-center" title={`Servicios: $${totalServicios} | Productos: $${totalProductos}`}>
                                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                {`Servicios: $${totalServicios}`}
                                                            </small>
                                                            <br/>
                                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                {`Adicionales: $${totalProductos}`}
                                                            </small>
                                                            <br/>
                                                            <span className="fw-bold text-success">Total: ${totalGeneral.toLocaleString()}</span>
                                                        </td>

                                                        <td className="text-end pe-4">
                                                            <div className="btn-group shadow-sm" style={{ borderRadius: '6px' }}>
                                                                
                                                            {/* BOTÓN ESTADO: Si está pagada, podrías poner un icono de check */}
                                                            <button 
                                                                    type="button"
                                                                    onClick={() => setCitaDetalle(cita)}
                                                                    className={`btn btn-outline-${cita.estado.observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: '0.75rem', fontWeight: 600 }}
                                                                    disabled={esInactiva || esPagada}
                                                                >
                                                                    <i className="ti ti-list-search fs-5"></i>
                                                                </button>
                                                                
                                                                <button 
                                                                    type="button" 
                                                                    className={`btn btn-outline-${cita.estado.observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                                    style={{ borderRadius: 0, borderLeft: 'none' }}
                                                                    onClick={() => handleFacturar(cita.id)}
                                                                    disabled={esInactiva || esPagada} 
                                                                >
                                                                    
                                                                    <i className="ti ti-coin fs-5"></i>
                                                                </button>

                                                                {/* BOTÓN FLECHA DROPDOWN */}
                                                                <button 
                                                                    type="button" 
                                                                    className={`btn btn-sm dropdown-toggle-split d-flex align-items-center justify-content-center ${dropdownAbierto === cita.id ? 'btn-primary text-white' : `btn btn-outline-${cita.estado.observacion} btn-sm px-3 d-flex align-items-center gap-2`}`}
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
                                                                                    onClick={() => {
                                                                                        router.visit(route('ftfacturas.show', cita.factura_id))
                                                                                    }}
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
                                                                                            className="dropdown-item d-flex align-items-center py-2 px-3 text-danger" 
                                                                                            onClick={() => {setCitaCancelar(cita)}}
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
                            </div>
                        )}

                        {/* --- TAB: CUPONES --- */}
                        {activeTab === 'cupones' && (
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white py-3">
                                    <h5 className="mb-0 fw-bold text-dark">Mis Cupones y Promociones</h5>
                                    <small className="text-muted">Lista de códigos promocionales asignados a este cliente</small>
                                </div>
                                <div className="card-body p-0">
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-4">Código</th>
                                                    <th>Promoción</th>
                                                    <th>Descuento</th>
                                                    <th>Estado</th>
                                                    <th>Vencimiento</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* Asumiendo que los cupones vienen en la relación del cliente */}
                                                {cliente.persona.cupones && cliente.persona.cupones.length > 0 ? (
                                                    cliente.persona.cupones.map((cupon: any) => (
                                                        <tr key={cupon.id}>
                                                            <td className="ps-4">
                                                                <div className="d-flex align-items-center justify-content-between">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="bg-light-primary text-primary p-2 rounded me-3">
                                                                            <i className="ti ti-ticket fs-4"></i>
                                                                        </div>
                                                                        <code className="fw-bold fs-5 text-primary">{cupon.codigo}</code>
                                                                    </div>
                                                                    
                                                                    {/* Botón de copiar icono */}
                                                                    <button 
                                                                        type="button"
                                                                        className="btn btn-sm btn-icon btn-link-primary border-0 ms-2"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(cupon.codigo);
                                                                            // Si usas react-hot-toast o similar:
                                                                            toast.success(`Copiado: ${cupon.codigo}`);
                                                                        }}
                                                                        title="Copiar código"
                                                                    >
                                                                        <i className="ti ti-copy fs-5"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="fw-semibold">{cupon.promociones?.nombre || 'Descuento Especial'}</div>
                                                                <small className="text-muted">{cupon.promociones?.descripcion?.substring(0, 30)}...</small>
                                                            </td>
                                                            <td>
                                                                <span className="fw-bold text-success">
                                                                    {cupon.promociones?.valor}% OFF
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {cupon.usos_actuales >= (cupon.limite_uso_total || 1) ? (
                                                                    <span className="badge bg-light-secondary text-secondary">Redimido</span>
                                                                ) : (
                                                                    <span className="badge bg-light-success text-success">Disponible</span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                <div className="small">
                                                                    {cupon.fechavence ? (
                                                                        new Date(cupon.fechavence) < new Date() ? 
                                                                        <span className="text-danger">Expirado</span> : 
                                                                        cupon.fechavence
                                                                    ) : 'Sin límite'}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-5">
                                                            <div className="text-muted">
                                                                <i className="ti ti-ticket-off fs-1 d-block mb-2"></i>
                                                                <p className="mb-0">Este cliente no tiene cupones disponibles actualmente.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
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
                    <div className="animated fadeIn d-flex flex-column h-100">
                        <div className="px-4 pt-3 pb-2 border-bottom bg-white">
                            <button className="btn btn-link btn-sm p-0 text-decoration-none mb-3" onClick={() => {setEspecialistaSeleccionado(null); setTurnosDisponibles(null);}}>
                                <i className="ti ti-arrow-left me-1"></i> Cambiar especialista
                            </button>
                            
                            {/* SELECTOR DE DÍAS HORIZONTAL */}
                            <div className="d-flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
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

                        {/* NAVEGACIÓN DE JORNADAS (TABS HORIZONTALES) */}
                        <div className="bg-white border-bottom px-4">
                            <ul className="nav nav-pills nav-fill py-2 gap-2">
                                {['Mañana', 'Tarde', 'Noche'].map((j) => (
                                    <li className="nav-item" key={j}>
                                        <button 
                                            className={`nav-link py-2 border-0 small fw-bold ${jornadaActiva === j ? 'active bg-primary' : 'bg-light text-muted'}`}
                                            onClick={() => setJornadaActiva(j)}
                                        >
                                            {j === 'Mañana' && <i className="fa fa-sun me-1"></i>}
                                            {j === 'Tarde' && <i className="ti ti-sun me-1"></i>}
                                            {j === 'Noche' && <i className="ti ti-moon me-1"></i>}
                                            {j}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* LISTADO DE TURNOS FILTRADOS POR JORNADA */}
                        <div className="p-4 overflow-y-auto flex-grow-1">
                            {(() => {
                                const turnosFiltrados = turnosDisponibles[fechaSeleccionada]?.filter((t: any) => {
                                    const horaInt = parseInt(t.hora.split(':')[0]);
                                    const minutosInt = parseInt(t.hora.split(':')[1]);
                                    const tiempoTotal = horaInt * 60 + minutosInt;

                                    if (jornadaActiva === 'Mañana') {
                                        // 00:00 a 11:59 (0 a 719 minutos)
                                        return tiempoTotal < 720;
                                    } else if (jornadaActiva === 'Tarde') {
                                        // 12:00 a 17:59 (720 a 1079 minutos)
                                        return tiempoTotal >= 720 && tiempoTotal < 1080;
                                    } else {
                                        // 18:00 a 23:59 (1080 a 1439 minutos)
                                        return tiempoTotal >= 1080;
                                    }
                                });

                                if (!turnosFiltrados || turnosFiltrados.length === 0) {
                                    return (
                                        <div className="text-center py-5 opacity-50">
                                            <i className={`ti ti-${jornadaActiva === 'Noche' ? 'moon' : 'sun'} fs-1`}></i>
                                            <p className="mt-2 small">No hay turnos disponibles para la <strong>{jornadaActiva.toLowerCase()}</strong>.</p>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="row g-3">
                                        {turnosFiltrados.map((bloque: any, bIdx: number) => (
                                            <div key={bIdx} className="col-12">
                                                <div className="card border shadow-sm mb-0 hover-border-primary transition-all">
                                                    <div className="card-body p-3 d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            <div className="bg-light-primary text-primary fw-bold rounded px-3 py-2 border border-primary-subtle me-3">
                                                                {bloque.hora}
                                                            </div>
                                                            <div className="text-muted small">
                                                                <i className="ti ti-user-check me-1"></i> Disponible
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-wrap gap-1 justify-content-end">
                                                            {bloque.servicios_que_caben.map((serv: any, sIdx: number) => (
                                                                <button 
                                                                    key={sIdx}
                                                                    onClick={() => handleSeleccionarCita(fechaSeleccionada, bloque.hora, serv)}
                                                                    className="btn btn-sm btn-primary rounded-pill px-3 fw-medium"
                                                                >
                                                                    <i className="ti ti-plus me-1"></i> Reservar
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
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

        {/* --- COMPONENTE GLOBAL DE CANCELACION CITA --- */}
        <CitasModalCancelar
                cita={citaCancelar} 
                show={!!citaCancelar}
                estadosList={estadosList}
                onClose={() => setCitaCancelar(null)} 
            />

        {/* --- COMPONENTE GLOBAL DE FACTURACIÓN --- */}
        <CitasModalPos 
            cita={citaDetalle}
            metodospagosList={metodospagosList}
            sedePredeterminada={sedePredeterminadaPos}
            turnoActivo={turnoActivo}
            turnosList={turnosList}
            show={!!citaDetalle} 
            onClose={() => setCitaDetalle(null)} 
        />

    </AppMainLayout> 
    );
}