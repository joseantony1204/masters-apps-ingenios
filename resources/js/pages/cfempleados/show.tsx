import React, { useState, useEffect } from 'react';
import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
import avatar9 from '/public/assets/images/user/avatar-9.jpg';
import { router } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Offcanvas } from 'bootstrap';
import axios from 'axios';
import * as bootstrap from 'bootstrap';

export default function Show({ 
    perfilesList, 
    empleado, 
    serviciosList, 
    sedesComercio,       
    sedesAsignadasIds,   
    sedePredeterminadaId, 
    motivosList,
    flash
}: any) {
    const [activeTab, setActiveTab] = useState('perfil');
    
    // 1. Estados adicionales para visibilidad (puedes usar un objeto para manejar varios)
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

    // 1. Formulario para la información de la cuenta (Perfil)
    const { data, setData, put, processing, errors, clearErrors} = useForm({
        username: empleado.persona.user?.username || '',
        email: empleado.persona.user?.email || '',
        telefonomovil: empleado.persona.user.telefonomovil || '',
        perfil_id: empleado.persona.user?.perfil_id?.toString() || '',
    });

    const submitPerfil = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('cfempleados.updateperfil', empleado.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Notificación de éxito
            }
        });
    };

    // 2. Formulario para la modal de asignación de servicios (Tabla pivote)
    const formServicios = useForm({
        empleado_id: empleado.id,
        servicio_id: '',
        preciopersonalizado: '',
        duracionpersonalizado: '',
        observaciones: '',
        comision: '',
        estado_id: 858 // Activo por defecto
    });

    // Estado para la modal y el servicio seleccionado internamente
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const persona = empleado.persona;
    const nombreCompleto = `${persona.personasnaturales.nombres} ${persona.personasnaturales.apellidos}`;

    const icons = {
        perfil: 'ti ti-user',
        agenda: 'ti ti-calendar-event',
        bloqueos: 'ti ti-ban',
        horarios: 'ti ti-clock',
        servicios: 'ti ti-scissors',
        seguridad: 'ti ti-shield-lock'
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
    
        formPass.put(route('users.updatepassword', empleado.persona.user.id), {
            preserveScroll: true,
            onSuccess: () => {
                formPass.reset();
                // Aquí podrías disparar un alert de éxito
                alert('¡Contraseña actualizada correctamente!');
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

    const sugerenciasTiempo = [
        { label: '15 min', value: 15 },
        { label: '30 min', value: 30 },
        { label: '45 min', value: 45 },
        { label: '1 h', value: 60 },
        { label: '1.5 h', value: 90 },
        { label: '2 h', value: 120 },
    ];

    // Funciones de acción
    const handleToggleSede = (sedeId: number, isActivo: boolean) => {
        router.put(route('cfempleados.toggle-permiso', { empleado: empleado.id, sede: sedeId }), {
            activo: !isActivo
        }, { preserveScroll: true });
    };

    const handleSetDefault = (sedeId: number) => {
        router.put(route('cfempleados.set-default', { empleado: empleado.id, sede: sedeId }), {}, { 
            preserveScroll: true 
        });
    };

    const handleSelectService = (servicioId: string) => {
        const servicioBase = serviciosList.find((s: any) => s.id.toString() === servicioId);
    
        if (servicioBase) {
            setSelectedProduct(servicioBase);
            
            // Actualizamos individualmente para saltar la restricción de tipos del objeto completo
            formServicios.setData((prevData) => ({
                ...prevData,
                servicio_id: servicioId,
                preciopersonalizado: servicioBase.preciosalida?.toString() || '',
                duracionpersonalizado: servicioBase.duracion?.toString() || '30',
                comision: '0',
                estado_id: 858,
                observaciones: ''
            }));  
        } else {
            setSelectedProduct(null);
            formServicios.setData('servicio_id', '');
        }
    };

    const submitServicio = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            // Ruta para actualizar
            formServicios.put(route('cfempleados.editarservicio', { 
                empleado: empleado.id, 
                servicio: formServicios.data.servicio_id 
            }), {
                onSuccess: () => closeModal(),
            });
        } else {
            // Ruta para crear (la que ya tenías)
            formServicios.post(route('cfempleados.asignarservicio'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDeleteServicio = (servicioId: number | string) => {
        if (confirm('¿Estás seguro de que deseas eliminar este servicio asignado?')) {
            router.delete(route('cfempleados.destroyservicio', { 
                empleado: empleado.id, 
                servicio: servicioId 
            }), {
                preserveScroll: true,
                onSuccess: () => {
                    // Aquí puedes poner una notificación de éxito si usas alguna librería
                }
            });
        }
    };

    const handleToggleEstado = (servicioId: number, estadoActual: boolean) => {
        router.put(route('cfempleados.update-estado', { 
            empleado: empleado.id, 
            servicio: servicioId 
        }), {
            activo: !estadoActual // Enviamos el valor inverso al actual
        }, {
            preserveScroll: true // Evita que la página salte al inicio al actualizar
        });
    };
    const handleNuevoServicio = () => {
        setIsEditing(false); // Asegura que el modo edición esté apagado
        setSelectedProduct(null); // Limpia el producto seleccionado
        
        // Resetea el formulario a sus valores por defecto
        formServicios.reset(); 
        
        // Opcional: Si el reset no limpia campos específicos manualmente:
        formServicios.setData({
            empleado_id: empleado.id,
            servicio_id: '',
            preciopersonalizado: '',
            duracionpersonalizado: '',
            comision: '',
            observaciones: '',
            estado_id: 858
        });
    
        setIsModalOpen(true);
    };


    // Dentro de tu componente Show
    const [isEditing, setIsEditing] = useState(false);

    // Función para abrir la modal en modo edición
    const handleEditClick = (servicio: any) => {
        setIsEditing(true);
        setSelectedProduct(servicio);
        
        // Es vital que el servicio_id sea un String si el value del option es String, o Number si es Number
        formServicios.setData({
            empleado_id: empleado.id,
            servicio_id: servicio.id, // Asegúrate que coincida con el tipo de dato del <option value={...}>
            preciopersonalizado: servicio.pivot.preciopersonalizado,
            duracionpersonalizado: servicio.pivot.duracionpersonalizado,
            comision: servicio.pivot.comision,
            estado_id: servicio.pivot.estado_id,
            observaciones: servicio.observaciones,
        });
        
        setIsModalOpen(true);
    };

    // Resetear al cerrar
    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditing(false);
        formServicios.clearErrors(); // Limpia los mensajes de error de Laravel/Inertia
        formServicios.reset();
    };

    // Dentro de tu componente Show.tsx
    const validateField = (field: string, value: string) => {
        // Limpiamos errores previos del campo mientras escribe
        clearErrors(field as any);

        // Solo validamos si hay contenido
        if (value.length > 3) {
            router.post(route('cfempleados.validar-disponibilidad'), {
                field: field,
                value: value,
                exclude_id: empleado.persona.id // Para que no diga que su propio correo está ocupado
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page: any) => {
                    // Si el controlador detecta que está ocupado, Inertia devolverá los errores
                }
            });
        }
    };

    // Dentro de tu componente Show
    const formHorarios = useForm({
        // Si no hay horarios, mapeamos una estructura por defecto
        horarios: empleado.horarios.length > 0 
            ? empleado.horarios.map((h: any) => ({
                id: h.id,
                dia_id: h.dia_id,
                nombre_dia: h.dias?.nombre || '',
                horainicio: h.horainicio,
                horafinal: h.horafinal,
                estado: h.estado === 1
            })) 
            : [896, 897, 898, 899, 900, 901, 902].map(id => ({ // IDs de tus días L-V según tu JSON
                dia_id: id,
                nombre_dia: id === 896 ? 'LUNES' : id === 897 ? 'MARTES' : id === 898 ? 'MIERCOLES' : id === 899 ? 'JUEVES' : id === 900 ? 'VIERNES' : id === 901 ? 'SABADO' : id === 902 ? 'DOMINGO' : '', 
                horainicio: '08:00:00',
                horafinal: '18:00:00',
                estado: false
            }))
    });

    const submitHorarios = (e: React.FormEvent) => {
        e.preventDefault();
        formHorarios.put(route('cfempleados.update-horarios', empleado.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Tu AppMasterToasthMessage capturará el flash.success automáticamente
            }
        });
    };

    const formBloqueo = useForm({
        empleado_id: empleado.id,
        fecha: new Date().toISOString().split('T')[0],
        horainicio: '08:00',
        horafinal: '09:00',
        motivo_id: '',
        observaciones: '',
    });
    
    const submitBloqueo = (e: React.FormEvent) => {
        e.preventDefault();
        formBloqueo.post(route('cfbloqueosagendas.store'), {
            preserveScroll: true,
            onSuccess: () => formBloqueo.reset('motivo_id', 'observaciones', 'horainicio', 'horafinal'),
        });
    };

    // En tu show.tsx, calcula las horas laborales
    const businessHours = empleado.horarios
    .filter((h: any) => h.estado === 1) // Solo días activos
    .map((h: any) => ({
        daysOfWeek: [h.dia_id === 902 ? 0 : h.dia_id - 895], // Ajuste según tus IDs (Lunes=896=1, Domingo=902=0)
        startTime: h.horainicio,
        endTime: h.horafinal,
    }));

    const [filtros, setFiltros] = useState({ citas: true, bloqueos: true });
    const [eventoSeleccionado, setEventoSeleccionado] = useState<any>(null);
    // Función al hacer clic en evento
    const handleEventClick = (event: any) => {
        setEventoSeleccionado(event);
        
        const element = document.getElementById('offcanvasCita');
        if (element) {
            // Usamos directamente la clase Offcanvas que importamos
            const bsOffcanvas = Offcanvas.getOrCreateInstance(element);
            bsOffcanvas.show();
        }
    };

    // 1. Mapeamos las CITAS recorriendo la cadena que definimos
    const eventosCitas = (empleado.detallescitas || []).map((detalle: any) => ({
        id: `c-${detalle.id}`,
        // Traemos nombre del cliente y servicio desde la cadena de relaciones
        title: `${detalle.cita?.cliente?.persona?.personasnaturales?.nombre || ''} ${detalle.cita?.cliente?.persona?.personasnaturales?.apellido || ''}`.trim() 
        ? `${detalle.cita.cliente.persona.personasnaturales.nombre} ${detalle.cita.cliente.persona.personasnaturales.apellido} - ${detalle.empleadoservicio?.servicio?.nombre || 'Servicio'}`
        : `Cliente - ${detalle.empleadoservicio?.servicio?.nombre || 'Servicio'}`,
        start: `${detalle.cita?.fecha}T${detalle.cita?.horainicio}`,
        end: `${detalle.cita?.fecha}T${detalle.cita?.horafinal}`,
        backgroundColor: '#e3f2fd',
        borderColor: '#2196f3',
        textColor: '#0d47a1',
        extendedProps: {
            observaciones: detalle.cita.descripcion,
            estado: detalle.cita.estado.nombre
        }
    }));

    // 2. Mapeamos los BLOQUEOS
    const eventosBloqueos = (empleado.bloqueos || []).map((b: any) => ({
        id: `b-${b.id}`, // Prefijo 'b-' para el filtro de bloqueos
        title: `🚫 ${b.motivo?.nombre || 'Bloqueo'}`,
        start: `${b.fecha}T${b.horainicio}`,
        end: `${b.fecha}T${b.horafinal}`,
        backgroundColor: '#f8f9fa',
        borderColor: '#ddd',
        textColor: '#666',
        extendedProps: { tipo: 'bloqueo' }
    }));

    // 3. Unimos todo y APLICAMOS EL FILTRO
    const eventosMostrados = [...eventosCitas, ...eventosBloqueos].filter(evento => {
        if (evento.id.startsWith('c-') && !filtros.citas) return false;
        if (evento.id.startsWith('b-') && !filtros.bloqueos) return false;
        return true;
    });
    
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

    // 4. Tus funciones (obtenerDisponibilidad, etc.)
    const obtenerDisponibilidad = async (servicioId = '') => {
        setCargandoTurnos(true);
        try {
            const url = route('api.disponibilidad.turnos', { empleado: empleado.id, servicio: servicioId });
            const response = await axios.get(url);
            
            setTurnosDisponibles(response.data);
    
            // CONFIGURAR DÍA POR DEFECTO:
            const fechas = Object.keys(response.data);
            if (fechas.length > 0) {
                setFechaSeleccionada(fechas[0]); 
            }
    
            const element = document.getElementById('offcanvasDisponibilidad');
            if (element) {
                const instance = bootstrap.Offcanvas.getOrCreateInstance(element);
                instance.show();
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargandoTurnos(false);
        }
    };
  
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
            servicio_id: servicio.id,
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

    const [buscando, setBuscando] = useState(false);
    const [resultadosClientes, setResultadosClientes] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    
    const buscarCliente = async (query: string) => {
        if (query.length < 3) {
            setResultadosClientes([]);
            setMostrarSugerencias(false);
            return;
        }
    
        setBuscando(true);
        try {
            const response = await axios.get(route('api.clientes.buscar', { term: query }));
            setResultadosClientes(response.data);
            setMostrarSugerencias(true);
        } catch (error) {
            console.error("Error buscando cliente", error);
        } finally {
            setBuscando(false);
        }
    };

    // Al lado de los otros useForm (formPass, formBloqueo, etc.)
    const formReserva = useForm({
        cliente_id: '',
        cliente_nombre: '',
        cliente_telefono: '',
        cliente_email: '',
        servicioasignado_id: '',
        fecha: '',
        hora: '',
        horainicio: '',
        horafinal: '',
        precio: '',
        servicio_id: '',
        empleado_id: empleado.id,
        observaciones: '',
    });

    const seleccionarCliente = (cliente: any) => {
        formReserva.setData({
            ...formReserva.data, // Mantenemos fecha, hora y servicio que ya se setearon
            cliente_id: cliente.id,
            cliente_nombre: `${cliente.nombres} ${cliente.apellidos}`,
            cliente_telefono: cliente.telefonomovil || '',
            cliente_email: cliente.email || '',
        });
        
        setMostrarSugerencias(false);
    };

    const submitReserva = (e: React.FormEvent) => {
        e.preventDefault();
    
        formReserva.post(route('adcitas.store'), {
            onSuccess: () => {
                // Si se guarda con éxito:
                // 1. Cerramos el modal
                const modalElement = document.getElementById('modalReserva');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance?.hide();
                }
                // 2. Limpiamos el formulario
                formReserva.reset();
                // 3. Opcional: Refrescar el calendario principal
                // router.reload(); 
            },
            onError: (errors) => {
                console.error("Errores al validar la cita:", errors);
            }
        });
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
                                <li className="breadcrumb-item"><Link href={route('cfempleados.index')}>Empleados</Link></li>
                                <li className="breadcrumb-item" aria-current="page">Detalle</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <div className="page-header-title">
                                <h2 className="mb-0">Perfil del empleado</h2>
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
                            <p className="text-muted small mb-3">
                                {empleado.cargo || 'Staff / Colaborador'}
                            </p>
                            {/* Badge de Estado centrado */}
                            <div className="d-flex justify-content-center">
                                <span className={`badge bg-light-${empleado.estado.observacion} text-${empleado.estado.observacion} border border-${empleado.estado.observacion} px-3 py-2`}>
                                    {empleado.estado.nombre}
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
                            href={route('cfempleados.index')} 
                            className="btn btn-outline-secondary"
                        >
                            <i className="ti ti-arrow-left"></i>
                            Volver
                        </Link>
                        <Link 
                            href={route('cfempleados.edit',empleado.id)} 
                            className="btn btn-outline-primary"
                        >
                            <i className="ti ti-edit"></i>
                            Editar Empleado
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
                                <div className="card border shadow-none animate__animated animate__fadeIn">
                                    <div className="card-body">
                                        <div className="d-flex align-items-center justify-content-between mb-4">
                                        <div className="btn-group shadow-sm" role="group" aria-label="Filtros de Agenda">
                                            {/* Botón de Citas */}
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="btnCitas"
                                                checked={filtros.citas}
                                                onChange={() => setFiltros({ ...filtros, citas: !filtros.citas })}
                                            />
                                            <label 
                                                className={`btn btn-sm d-flex align-items-center px-3 ${filtros.citas ? 'btn-primary' : 'btn-outline-primary text-primary'}`} 
                                                htmlFor="btnCitas"
                                            >
                                                {/* Si está seleccionado, la clase es 'text-white'; si no, 'text-primary' */}
                                                <i className={`ti ${filtros.citas ? 'ti-calendar text-white' : 'ti-calendar text-primary'} me-2 fs-5`}></i>
                                                Citas
                                            </label>

                                            {/* Botón de Bloqueos */}
                                            <input
                                                type="checkbox"
                                                className="btn-check"
                                                id="btnBloqueos"
                                                checked={filtros.bloqueos}
                                                onChange={() => setFiltros({ ...filtros, bloqueos: !filtros.bloqueos })}
                                            />
                                            <label 
                                                className={`btn btn-sm d-flex align-items-center px-3 ${filtros.bloqueos ? 'btn-secondary' : 'btn-outline-secondary text-secondary'}`} 
                                                htmlFor="btnBloqueos"
                                            >
                                                {/* Si está seleccionado, la clase es 'text-white'; si no, 'text-secondary' */}
                                                <i className={`ti ${filtros.bloqueos ? 'ti-lock text-white' : 'ti-lock text-secondary'} me-2 fs-5`}></i>
                                                Bloqueos
                                            </label>
                                            <button 
                                                className="btn btn-outline-success btn-sm shadow-sm d-flex align-items-center"
                                                onClick={() => obtenerDisponibilidad()}
                                                disabled={cargandoTurnos}
                                            >
                                                {cargandoTurnos ? (
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                ) : (
                                                    <i className="ti ti-clock me-2 fs-4"></i>
                                                )}
                                                Ver disponibilidad
                                            </button>
                                        </div>


                                        {/* Opcional: Indicador de vista actual */}
                                        <span className="badge bg-light text-muted border py-2 px-3 rounded-pill">
                                            <i className="ti ti-info-circle me-1"></i>
                                            Mostrando {eventosMostrados.length} eventos
                                        </span>
                                    </div>
                                        <FullCalendar
                                            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                                            initialView="timeGridDay" // Por defecto ver el día actual
                                            headerToolbar={{
                                                left: 'prev,next today',
                                                center: 'title',
                                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                            }}
                                            events={eventosMostrados}
                                            locale={esLocale}
                                            slotMinTime="06:00:00"
                                            slotMaxTime="22:00:00"
                                            allDaySlot={false}
                                            height="600px"
                                            nowIndicator={true}
                                            editable={false}
                                            selectable={true}
                                            //height="auto"
                                            // Al hacer clic en un espacio vacío, podríamos abrir el modal de nueva cita
                                            select={(info) => console.log('Espacio seleccionado:', info)}
                                            eventClick={(info) => {
                                                handleEventClick(info.event)// Aquí podrías abrir un modal con el detalle completo del cliente
                                                console.log("Datos de la cita:", info.event.extendedProps);
                                            }}
                                            businessHours={businessHours}
                                            selectConstraint="businessHours" // Impide seleccionar citas fuera de horario
                                        />
                                        <div className="offcanvas offcanvas-end" id="offcanvasCita" tabIndex={-1}>
                                            <div className="offcanvas-header border-bottom">
                                                <h5 className="offcanvas-title">Detalle de la Cita</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
                                            </div>
                                            <div className="offcanvas-body">
                                                {eventoSeleccionado && (
                                                    <div>
                                                        <h4 className="text-primary">{eventoSeleccionado.title}</h4>
                                                        <p className="text-muted"><i className="ti ti-clock me-1"></i> {eventoSeleccionado.start.toLocaleTimeString()}</p>
                                                        <hr />
                                                        <div className="d-grid gap-2">
                                                            <button className="btn btn-success">
                                                                <i className="ti ti-player-play me-1"></i> Iniciar Servicio
                                                            </button>
                                                            <button className="btn btn-outline-danger">
                                                                <i className="ti ti-x me-1"></i> Cancelar Cita
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'bloqueos' && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="row">
                                        {/* Formulario de creación */}
                                        <div className="col-md-4">
                                            <div className="card border shadow-none pb-2">
                                                <div className="card-header bg-transparent border-bottom py-3 d-flex align-items-center">
                                                    <i className="ti ti-lock-square-rounded me-2 text-primary fs-4"></i>
                                                    <h6 className="mb-0 fw-bold text-dark">Bloquear nuevo espacio</h6>
                                                </div>
                                                <div className="card-body">
                                                    <form onSubmit={submitBloqueo}>
                                                        {/* Campo Fecha */}
                                                        <div className="mb-3">
                                                            <label className="form-label text-muted small fw-bold">FECHA DEL BLOQUEO</label>
                                                            <div className="input-group input-group-sm">
                                                                <span className="input-group-text bg-light border-end-0">
                                                                    <i className="ti ti-calendar-event text-muted"></i>
                                                                </span>
                                                                <input 
                                                                    type="date" 
                                                                    className={`form-control border-start-0 ps-0 shadow-none ${formBloqueo.errors.fecha ? 'is-invalid' : ''}`} 
                                                                    value={formBloqueo.data.fecha} 
                                                                    onChange={e => formBloqueo.setData('fecha', e.target.value)} 
                                                                />
                                                            </div>
                                                            {formBloqueo.errors.fecha && <div className="text-danger small mt-1">{formBloqueo.errors.fecha}</div>}
                                                        </div>

                                                        {/* Campo Motivo */}
                                                        <div className="mb-3">
                                                            <label className="form-label text-muted small fw-bold">MOTIVO</label>
                                                            <select
                                                                className={`form-select form-select-sm shadow-none ${formBloqueo.errors.motivo_id ? 'is-invalid' : ''}`}
                                                                value={formBloqueo.data.motivo_id}
                                                                onChange={e => formBloqueo.setData('motivo_id', e.target.value)}
                                                                style={{ backgroundColor: '#fdfdfd' }}
                                                                required
                                                            >
                                                                <option value="">Seleccione un motivo...</option>
                                                                {Object.entries(motivosList).map(([key, label]) => (
                                                                    <option key={key} value={key}>
                                                                        {label as string}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {formBloqueo.errors.motivo_id && <div className="invalid-feedback">{formBloqueo.errors.motivo_id}</div>}
                                                        </div>

                                                        {/* Rango de Horas */}
                                                        <div className="row g-2 mb-3">
                                                            <div className="col-6">
                                                                <label className="form-label text-muted small fw-bold">DESDE</label>
                                                                <input 
                                                                    type="time" 
                                                                    className={`form-control form-control-sm shadow-none ${formBloqueo.errors.horainicio ? 'is-invalid' : ''}`} 
                                                                    value={formBloqueo.data.horainicio} 
                                                                    onChange={e => formBloqueo.setData('horainicio', e.target.value)} 
                                                                />
                                                                {formBloqueo.errors.horainicio && <div className="text-danger" style={{fontSize: '10px'}}>{formBloqueo.errors.horainicio}</div>}
                                                            </div>
                                                            <div className="col-6">
                                                                <label className="form-label text-muted small fw-bold">HASTA</label>
                                                                <input 
                                                                    type="time" 
                                                                    className={`form-control form-control-sm shadow-none ${formBloqueo.errors.horafinal ? 'is-invalid' : ''}`} 
                                                                    value={formBloqueo.data.horafinal} 
                                                                    onChange={e => formBloqueo.setData('horafinal', e.target.value)} 
                                                                />
                                                                {formBloqueo.errors.horafinal && <div className="text-danger" style={{fontSize: '10px'}}>{formBloqueo.errors.horafinal}</div>}
                                                            </div>
                                                        </div>

                                                        {/* Observaciones */}
                                                        <div className="mb-4">
                                                            <label className="form-label text-muted small fw-bold text-uppercase">Observaciones adicionales</label>
                                                            <textarea 
                                                                className="form-control form-control-sm shadow-none" 
                                                                rows={3} 
                                                                placeholder="Ej: Cita médica, Almuerzo extendido..." 
                                                                value={formBloqueo.data.observaciones} 
                                                                onChange={e => formBloqueo.setData('observaciones', e.target.value)}
                                                                style={{ resize: 'none' }}
                                                            ></textarea>
                                                        </div>

                                                        <button type="submit" className="btn btn-primary w-100 shadow-sm" disabled={formBloqueo.processing}>
                                                            {formBloqueo.processing ? (
                                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                            ) : (
                                                                <i className="ti ti-lock me-1"></i>
                                                            )}
                                                            Confirmar bloqueo
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Listado de bloqueos activos */}
                                        <div className="col-md-8">
                                            <div className="card border shadow-none">
                                                <div className="card-header bg-transparent border-bottom py-3">
                                                    <h6 className="mb-0">Espacios bloqueados actuales</h6>
                                                </div>
                                                <div className="table-responsive">
                                                    <table className="table table-hover align-middle mb-0">
                                                        <thead className="bg-light">
                                                            <tr className="small text-uppercase">
                                                                <th>Fecha</th>
                                                                <th>Horario</th>
                                                                <th>Motivo</th>
                                                                <th>Observaciones</th>
                                                                <th className="text-end">Acciones</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {empleado.bloqueos?.length > 0 ? (
                                                                empleado.bloqueos.map((b: any) => (
                                                                    <tr key={b.id}>
                                                                        <td className="small fw-bold">{b.fecha}</td>
                                                                        <td className="small">{b.horainicio} - {b.horafinal}</td>
                                                                        <td className="small text-muted">{b.motivo.nombre}</td>
                                                                        <td className="small text-muted">{b.observaciones || 'Sin descripción'}</td>
                                                                        <td className="text-end">
                                                                            <button 
                                                                                className="avtar avtar-s btn-link-danger btn-pc-default"
                                                                                onClick={() => router.delete(route('cfbloqueosagendas.destroy', b.id))}
                                                                            >
                                                                                <i className="ti ti-trash f-20"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan={4} className="text-center py-4 text-muted small">
                                                                        No hay espacios bloqueados registrados.
                                                                    </td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'horarios' && (
                                <div className="animate__animated animate__fadeIn">
                                    <form onSubmit={submitHorarios} className="card border shadow-none">
                                        <div className="card-header bg-transparent border-bottom py-3 d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-0 text-dark">Gestión de Horarios</h5>
                                                <p className="text-muted small mb-0">Configure las horas de inicio y fin para cada día laboral.</p>
                                            </div>
                                            <button type="submit" className="btn btn-primary shadow-none" disabled={formHorarios.processing}>
                                                <i className="ti ti-device-floppy me-2"></i> Guardar Jornada
                                            </button>
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover align-middle mb-0">
                                                    <thead className="bg-light">
                                                        <tr>
                                                            <th className="ps-4" style={{ width: '200px' }}>Día</th>
                                                            <th className="text-center" style={{ width: '100px' }}>Estado</th>
                                                            <th>Hora inicio</th>
                                                            <th>Hora final</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formHorarios.data.horarios.map((h: any, index: number) => (
                                                            <tr key={h.dia_id} className={!h.estado ? 'bg-light-secondary opacity-75' : ''}>
                                                                <td className="ps-4">
                                                                    <div className="d-flex align-items-center">
                                                                        <i className="ti ti-calendar-week me-2 text-primary fs-4"></i>
                                                                        <span className="fw-bold text-dark">{h.nombre_dia}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center">
                                                                    <div className="form-check form-switch d-inline-block">
                                                                        <input 
                                                                            className="form-check-input cursor-pointer" 
                                                                            type="checkbox" 
                                                                            checked={h.estado}
                                                                            onChange={(e) => {
                                                                                const nuevos = [...formHorarios.data.horarios];
                                                                                nuevos[index].estado = e.target.checked;
                                                                                formHorarios.setData('horarios', nuevos);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                        type="time" 
                                                                        step="1" // Permite segundos como en tu JSON
                                                                        className="form-control form-control-sm shadow-none"
                                                                        value={h.horainicio}
                                                                        disabled={!h.estado}
                                                                        onChange={(e) => {
                                                                            const nuevos = [...formHorarios.data.horarios];
                                                                            nuevos[index].horainicio = e.target.value;
                                                                            formHorarios.setData('horarios', nuevos);
                                                                        }}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <input 
                                                                        type="time" 
                                                                        step="1"
                                                                        className="form-control form-control-sm shadow-none"
                                                                        value={h.horafinal}
                                                                        disabled={!h.estado}
                                                                        onChange={(e) => {
                                                                            const nuevos = [...formHorarios.data.horarios];
                                                                            nuevos[index].horafinal = e.target.value;
                                                                            formHorarios.setData('horarios', nuevos);
                                                                        }}
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {activeTab === 'servicios' && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="card border shadow-none">
                                        <div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
                                            <div>
                                                <h5 className="mb-0">Servicios Vinculados</h5>
                                                <p className="text-muted small mb-0">Habilita los servicios que este colaborador puede realizar.</p>
                                            </div>
                                            
                                            <button 
                                                className="btn btn-primary btn-sm shadow-none" 
                                                onClick={handleNuevoServicio} // <--- Cambia esto
                                            >
                                                <i className="ti ti-plus me-1"></i> Asignar Servicio
                                            </button>
                                        </div>
                                        <div className="card-body">
                                            {/* Buscador rápido de servicios (Opcional, pero recomendado por tu diseño) */}
                                            <div className="mb-4">
                                                <div className="input-group">
                                                    <span className="input-group-text bg-transparent border-end-0">
                                                        <i className="ti ti-search text-muted"></i>
                                                    </span>
                                                    <input 
                                                        type="text" 
                                                        className="form-control border-start-0 ps-0" 
                                                        placeholder="Buscar servicio por nombre o categoría..." 
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="row g-3">
                                                {/* Validación: Si existen servicios asignados, se mapean; de lo contrario, se muestra el mensaje vacío */}
                                                {empleado.serviciosasignados && empleado.serviciosasignados.length > 0 ? (
                                                    empleado.serviciosasignados.map((servicio: any) => {
                                                        const isActivo = servicio.pivot.estado_id === 858; // Ajusta el ID según tu base de datos

                                                        return (
                                                            <div className="col-12" key={servicio.id}>
                                                                <div className={`border rounded p-3 d-flex justify-content-between align-items-center ${isActivo ? 'bg-light-primary-subtle' : 'bg-light-secondary'}`}>
                                                                    <div className="d-flex align-items-center">
                                                                        <div className={`avtar avtar-s border me-3 ${isActivo ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>
                                                                            <i className="ti ti-clipboard-list f-18"></i>
                                                                        </div>
                                                                        <div>
                                                                            <h6 className={`mb-0 text-uppercase ${!isActivo && 'text-muted'}`} style={{ fontSize: '0.85rem' }}>
                                                                                {servicio.nombre}
                                                                            </h6>
                                                                            <span className="text-muted small">
                                                                                {/* Añadimos la Sede aquí */}
                                                                                <span className="badge bg-light-secondary text-primary me-2" style={{ fontSize: '10px' }}>
                                                                                    <i className="ti ti-map-pin me-1"></i>{servicio.sede?.nombre}
                                                                                </span>
                                                                                ${servicio.pivot.preciopersonalizado} • <i className="ti ti-clock me-1"></i>{servicio.pivot.duracionpersonalizado} min
                                                                                {servicio.pivot.comision > 0 && ` • Com: ${servicio.pivot.comision}%`}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="d-flex align-items-center gap-3">
                                                                        <div className="form-check form-switch m-0">
                                                                            <input 
                                                                                className="form-check-input" 
                                                                                type="checkbox" 
                                                                                role="switch" 
                                                                                checked={isActivo}
                                                                                onChange={() => handleToggleEstado(servicio.id, isActivo)} // Función de switch
                                                                                style={{ width: '40px', height: '20px', cursor: 'pointer' }}
                                                                            />
                                                                        </div>
                                                                        <button
                                                                            onClick={() => handleEditClick(servicio)}
                                                                            className="avtar avtar-s btn-link-success btn-pc-default">
                                                                            <i className="ti ti-edit f-20"></i>
                                                                        </button>
                                                                        {<li className="list-inline-item">
                                                                            <button
                                                                                onClick={() => handleDeleteServicio(servicio.id)}
                                                                                className="avtar avtar-s btn-link-danger btn-pc-default">
                                                                                <i className="ti ti-trash f-20"></i>
                                                                            </button>
                                                                        </li>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    /* --- ESTA ES LA PARTE QUE SOLICITASTE --- */
                                                    <div className="text-center py-5 animate__animated animate__fadeIn">
                                                        <div className="mb-3">
                                                            <i className="ti ti-scissors-off text-muted opacity-50" style={{ fontSize: '3rem' }}></i>
                                                        </div>
                                                        <h6 className="text-muted fw-normal">No hay servicios asignados</h6>
                                                        <p className="text-muted small">Este empleado aún no tiene servicios vinculados a su perfil.</p>
                                                        <button 
                                                            className="btn btn-primary btn-sm mt-2" 
                                                            onClick={() => setIsModalOpen(true)}
                                                        >
                                                            <i className="ti ti-plus me-1"></i> Asignar mi primer servicio
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
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

            {/* --- MODAL ASIGNAR SERVICIO --- */}
            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow">
                            <form onSubmit={submitServicio}>
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {isEditing ? `Editando: ${selectedProduct?.nombre}` : 'Asignar Nuevo Servicio'}
                                    </h5>
                                    <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
                                </div>
                                
                                <div className="modal-body">

                                    <div className="mb-3">
                                        <label className="form-label small text-muted">Seleccionar Servicio</label>
                                        <select 
                                            className={`form-select ${formServicios.errors.servicio_id ? 'is-invalid' : ''}`}
                                            value={formServicios.data.servicio_id}
                                            onChange={e => handleSelectService(e.target.value)}
                                            disabled={isEditing}
                                        >
                                            <option value="">-- Buscar servicio --</option>
                                            {serviciosList.map((s: any) => (
                                                <option key={s.id} value={s.id}>
                                                    {/* Formato: "NOMBRE SERVICIO | SEDE" */}
                                                    {s.nombre.toUpperCase()} | {s.sede.nombre}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedProduct && (
                                            <div className="mt-2 animate__animated animate__fadeIn">
                                                <small className="text-muted">
                                                    Este servicio pertenece a: <strong>{selectedProduct.sede?.nombre}</strong>
                                                </small>
                                            </div>
                                        )}
                                        {formServicios.errors.servicio_id && <div className="invalid-feedback">{formServicios.errors.servicio_id}</div>}
                                    </div>

                                    {selectedProduct && (
                                        <div className="row g-3 animate__animated animate__fadeIn p-3 bg-light rounded">
                                            <div className="col-6">
                                                <label className="form-label small">Precio Personalizado</label>
                                                <input type="number" className="form-control" value={formServicios.data.preciopersonalizado} onChange={e => formServicios.setData('preciopersonalizado', e.target.value)} />
                                            </div>
                                            <div className="col-6">
                                            <label className="form-label small d-flex justify-content-between">
                                                Duración (min)
                                                <span className="text-primary" style={{ fontSize: '10px' }}>Sugeridos</span>
                                            </label>
                                            
                                            <input 
                                                type="number" 
                                                className={`form-control ${formServicios.errors.duracionpersonalizado ? 'is-invalid' : ''}`} 
                                                value={formServicios.data.duracionpersonalizado} 
                                                onChange={e => formServicios.setData('duracionpersonalizado', e.target.value)}
                                                placeholder="Ej: 30"
                                            />

                                            {/* Selectores rápidos (Quick Select) */}
                                            <div className="d-flex flex-wrap gap-1 mt-2">
                                            {sugerenciasTiempo.map((tiempo) => (
                                                <button
                                                    key={tiempo.value}
                                                    type="button"
                                                    className={`btn btn-sm py-0 px-2 ${
                                                        Number(formServicios.data.duracionpersonalizado) === tiempo.value 
                                                        ? 'btn-primary' 
                                                        : 'btn-outline-secondary'
                                                    }`}
                                                    style={{ fontSize: '11px', borderRadius: '10px' }}
                                                    onClick={() => formServicios.setData('duracionpersonalizado', tiempo.value.toString())}
                                                >
                                                    {tiempo.label}
                                                </button>
                                            ))}
                                            </div>

                                                {formServicios.errors.duracionpersonalizado && (
                                                    <div className="invalid-feedback d-block">
                                                        {formServicios.errors.duracionpersonalizado}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small">Comisión (%)</label>
                                                <input type="number" className="form-control" value={formServicios.data.comision} onChange={e => formServicios.setData('comision', e.target.value)} />
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label small">Observaciones</label>
                                                <input type="text" className="form-control" value={formServicios.data.observaciones} onChange={e => formServicios.setData('observaciones', e.target.value)} />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-footer">
                                    <div className="col-12">
                                        <div className="row align-items-end justify-content-between g-3">
                                            <div className="col-sm-auto">
                                                {/* El botón de eliminar solo se muestra si isEditing es true */}
                                                {isEditing ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger d-flex align-items-center"
                                                        onClick={() => {
                                                            // Cerramos la modal antes de disparar la confirmación
                                                            setIsModalOpen(false);
                                                            handleDeleteServicio(formServicios.data.servicio_id);
                                                        }}
                                                    >
                                                        <i className="fa fa-fw fa-trash"></i> Desvincular
                                                    </button>
                                                ) : (
                                                    <div></div> // Espaciador para mantener el diseño si no es edición
                                                )}
                                            </div>
                                            <div className="col-sm-auto btn-page">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-light" 
                                                    onClick={() => setIsModalOpen(false)}
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-light-primary" 
                                                    disabled={formServicios.processing || !selectedProduct || !formServicios.data.preciopersonalizado || !formServicios.data.duracionpersonalizado}
                                                >
                                                    {isEditing ? 'Actualizar registro' : 'Asignar al empleado'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="offcanvas offcanvas-end border-0 shadow" style={{ width: '460px' }} tabIndex={-1} id="offcanvasDisponibilidad">
                <div className="offcanvas-header bg-primary text-white py-4">
                    <div>
                        <h4 className="offcanvas-title fw-bold text-white mb-1">📅 Reservar Cita</h4>
                        <small className="opacity-75">Empleado: {empleado.persona.nombres}</small>
                    </div>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
                </div>

                <div className="offcanvas-body p-0 bg-light-subtle d-flex flex-column">
                    {/* FILTRO DE SERVICIO */}
                    <div className="p-3 bg-white border-bottom shadow-sm">
                        <label className="form-label fw-bold text-muted small text-uppercase mb-2">Filtrar por Servicio</label>
                        <select className="form-select border-2" onChange={(e) => obtenerDisponibilidad(e.target.value)}>
                            <option value="">Todos los servicios</option>
                            {empleado.serviciosasignados?.map((s: any) => (
                                <option key={s.id} value={s.id}>{s.nombre} ({s.pivot.duracionpersonalizado}')</option>
                            ))}
                        </select>
                    </div>

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
            </div>

            {/* --- MODAL DE RESERVA --- */}
            <div className="modal fade" id="modalReserva" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-bottom bg-light p-3">
                            <div>
                                <h5 className="modal-title fw-bold text-dark">
                                    <i className="ti ti-bookmark me-2 text-primary fs-4"></i>
                                    Confirmar cita
                                </h5>
                                <small className="text-muted">Por favor completa los detalles para agendar</small>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4">
                            {/* 1. Resumen visual del Turno Seleccionado */}
                            {seleccion && (
                                <div className="alert bg-primary-subtle border border-primary-subtle rounded-3 mb-4 p-3 shadow-sm">
                                    <div className="d-flex align-items-center gap-3">
                                        {/* Icono de Calendario y Hora */}
                                        <div className="bg-white rounded-circle p-2 border border-primary-subtle text-primary shadow-sm">
                                            <i className="ti ti-calendar-event fs-3"></i>
                                        </div>
                                        
                                        <div className="flex-grow-1">
                                            {/* Fecha Formateada */}
                                            <h6 className="mb-0 fw-bold text-dark">
                                                {new Date(seleccion.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                    weekday: 'long', 
                                                    day: 'numeric', 
                                                    month: 'long' 
                                                })}
                                            </h6>
                                            {/* Hora y Servicio */}
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <span className="badge bg-primary text-white fw-bold px-3 py-1 fs-7 rounded-pill">
                                                    <i className="ti ti-clock-check me-1"></i>
                                                    {seleccion.hora}
                                                </span>
                                                <span className="text-muted small">
                                                    para <strong>{seleccion.servicio.nombre}</strong> ({seleccion.servicio.duracion} min)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2. Formulario de Cita */}
                            <form id="formConfirmarCita" onSubmit={submitReserva}>
                                {/* Cliente con buscador */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label fw-semibold small text-muted text-uppercase">Cliente</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0"><i className="ti ti-user"></i></span>
                                        <input 
                                            type="text" 
                                            className="form-control border-start-0" 
                                            value={formReserva.data.cliente_nombre}
                                            onChange={(e) => {
                                                formReserva.setData('cliente_nombre', e.target.value);
                                                buscarCliente(e.target.value);
                                            }}
                                            placeholder="Escribe para buscar..."
                                            autoComplete="off"
                                        />
                                        {buscando && <span className="input-group-text bg-white"><div className="spinner-border spinner-border-sm text-primary"></div></span>}
                                    </div>

                                    {/* Lista de sugerencias */}
                                    {mostrarSugerencias && resultadosClientes.length > 0 && (
                                        <ul className="list-group position-absolute w-100 shadow-lg z-3" style={{ top: '100%' }}>
                                            {resultadosClientes.map((c: any) => (
                                                <li 
                                                    key={c.id} 
                                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                                    onClick={() => seleccionarCliente(c)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div>
                                                        <div className="fw-bold">{c.nombres} {c.apellidos}</div>
                                                        <small className="text-muted">{c.telefonomovil || 'Sin teléfono'}</small>
                                                    </div>
                                                    <span className="badge bg-light text-primary border">Seleccionar</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="row g-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small text-muted text-uppercase">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            className="form-control" 
                                            value={formReserva.data.cliente_telefono}
                                            onChange={e => formReserva.setData('cliente_telefono', e.target.value)}
                                            placeholder="Ej: 3001234567"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small text-muted text-uppercase">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            value={formReserva.data.cliente_email}
                                            onChange={e => formReserva.setData('cliente_email', e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>

                                    {/* Notas adicionales */}
                                    <div className="mb-0">
                                        <label htmlFor="notas" className="form-label fw-semibold small text-muted text-uppercase">Notas Opcionales</label>
                                        <textarea 
                                            className="form-control" 
                                            id="observaciones" 
                                            name="observaciones" 
                                            rows={2}
                                            value={formReserva.data.observaciones}
                                            onChange={(e) => formReserva.setData('observaciones', e.target.value)} // <--- Captura el cambio
                                            placeholder="Alguna observación importante..."
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer border-top bg-light p-3">
                            <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            
                            {/* En el Footer del Modal */}
                            <button 
                                type="submit" 
                                form="formConfirmarCita" 
                                className="btn btn-primary shadow-sm"
                                disabled={formReserva.processing} // Desactiva el botón mientras envía
                            >
                                {formReserva.processing ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <i className="ti ti-device-floppy me-2"></i>
                                )}
                                Confirmar y Agendar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </AppMainLayout> 
    );
}