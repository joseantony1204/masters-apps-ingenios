import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link } from '@inertiajs/react';
import Table from './partials/table';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { Offcanvas } from 'bootstrap';

const today = new Date().toISOString().split('T')[0];
interface Props {
    citas: any[];
    estadosList: Record<string, string>;
    serviciosList: Record<string, string>;
    empleadosList: Record<string, string>;
}

export default function Index({ citas, estadosList, serviciosList, empleadosList }: Props) {
    // 1. Definimos el periodo actual para comparar
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    // Función auxiliar para validar si una fecha pertenece al mes actual
    const esMesActual = (fechaString: any) => {
        if (!fechaString) return false;
        const f = new Date(fechaString + 'T00:00:00');
        return f.getMonth() === mesActual && f.getFullYear() === anioActual;
    };

    // 2. Filtrar el universo de citas al mes actual una sola vez (más eficiente)
    const citasDelMes = (citas || []).filter(c => esMesActual(c.fecha));
    // 3. Cálculos basados SOLAMENTE en las citas de este mes
    const totalCitas = citasDelMes.length;

    const ingresosMes = citasDelMes.reduce((acc, c) => acc + Number(c.total || 0), 0);

    const citasPendientes = citasDelMes.filter(c => 
        c.estado_codigo?.toUpperCase() === 'AC'
    ).length;

    // Indicador extra opcional: Citas de hoy (que por lógica están dentro del mes)
    const hoyISO = ahora.toISOString().slice(0, 10);
    const citasHoy = citasDelMes.filter(c => c.fecha === hoyISO).length;

    // --- FORMULARIOS INERTIA ---
    const { data: filterData, setData: setFilterData, get: fetchFilters, processing: filtering, reset: resetFilters } = useForm({
        fecha: today,
        servicio_id: '',
        identificacion: '',
        nombre: '',
        apellido: '',
        empleado_id: '',
        estado: '',
    });

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
        observaciones: '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Usamos fetchFilters (que es el "get" renonbrado)
        fetchFilters(route('adcitas.index'), { 
            preserveState: true,
            replace: true,
        });
    };

    const [buscando, setBuscando] = useState(false);
    const [resultadosClientes, setResultadosClientes] = useState([]);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [turnosDisponibles, setTurnosDisponibles] = useState<any>(null);
    const [cargandoTurnos, setCargandoTurnos] = useState(false);

    // 1. Al abrir el Offcanvas, cargamos los servicios
    const [serviciosDisponibles, setServiciosDisponibles] = useState<any[]>([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
    const [especialistaSeleccionado, setEspecialistaSeleccionado] = useState<any>(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");

    const [seleccion, setSeleccion] = useState<{fecha: string, hora: string, servicio: any} | null>(null);
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
    // 3. AGREGA ESTO AQUÍ: El efecto para inicializar la primera fecha
    useEffect(() => {
        if (turnosDisponibles && Object.keys(turnosDisponibles).length > 0) {
            // Esto hace que, apenas carguen los datos, se seleccione el primer día disponible
            setFechaSeleccionada(Object.keys(turnosDisponibles)[0]);
        }
    }, [turnosDisponibles]);

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
        <Head title="Gestión de Citas" />

        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('adcitas.index')}> Citas</a></li>
                            <li className="breadcrumb-item" aria-current="page">Listado</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title"><h2 className="mb-0">Listado</h2></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Cards de Resumen (Estilo superior de la imagen) */}
        <div className="row g-3 mb-4">
            {[
                { title: 'Total citas mes', value: totalCitas, icon: 'ti ti-calendar-event', color: 'primary' },
                { title: 'Citas Hoy', value: citasHoy, icon: 'ti ti-star', color: 'success' },
                { title: 'Citas pendientes', value: citasPendientes, icon: 'ti ti-clock', color: 'warning' },
                { title: 'Ingresos mes', value: `$${ingresosMes.toLocaleString()}`, icon: 'ti ti-currency-dollar', color: 'info' },
            ].map((card, idx) => (
                <div key={idx} className="col-md-3">
                    <div className={`card border-0 shadow-sm border-start border-${card.color} border-3 h-100`}>
                        <div className="card-body p-4 d-flex align-items-center justify-content-between">
                            <div>
                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px' }}>{card.title}</small>
                                <h3 className="fw-bold mb-0 text-dark mt-1">{card.value}</h3>
                            </div>
                            <div className={`bg-light-${card.color} text-${card.color} rounded-circle p-3`}>
                                <i className={`${card.icon} fs-3`}></i>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: '15px' }}>
                        {/* HEADER DEL PANEL */}
                        <div className="card-header bg-white border-0 py-3 px-4">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <div className="bg-light-primary text-primary p-2 rounded-3 me-3">
                                        <i className="ti ti-adjustments-horizontal fs-6"></i>
                                    </div>
                                    <div>
                                        <h5 className="mb-0 fw-bold text-dark">Filtros Avanzados</h5>
                                        <small className="text-muted">Optimiza la búsqueda de citas y pacientes</small>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-danger btn-sm px-4 fw-bold rounded-2 shadow-sm"
                                        onClick={() => resetFilters()}
                                    >
                                        <i className="ti ti-refresh me-1"></i> Limpiar
                                    </button>
                                    <button 
                                        className="btn btn-outline-primary btn-sm px-4 fw-bold rounded-2 shadow-sm"
                                        onClick={handleSearch}
                                        disabled={filtering}
                                    >
                                        {filtering ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <i className="ti ti-search me-1"></i>
                                        )}
                                        Aplicar Filtros
                                    </button>

                                    <button 
                                        className="btn btn-outline-success btn-sm shadow-sm d-flex align-items-center"
                                        onClick={() => cargarServiciosBusqueda()}
                                        disabled={cargandoTurnos}
                                    >
                                        {cargandoTurnos ? (
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                        ) : (
                                            <i className="ti ti-clock me-1"></i>
                                        )}
                                        Nueva cita
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* CUERPO DEL PANEL */}
                        <div className="card-body bg-white pt-2 pb-4 px-4">
                            <form onSubmit={handleSearch} className="row g-4">
                                
                                {/* COLUMNA 1: GENERALES */}
                                <div className="col-lg-4">
                                    <div>
                                        <h6 className="fw-bold mb-0">Información General</h6>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>Fecha de Cita</label>
                                        <div className="input-group input-group-merge border-bottom">
                                            <span className="input-group-text bg-transparent border-0 ps-0"><i className="ti ti-calendar text-primary"></i></span>
                                            <input 
                                                type="date" 
                                                className="form-control border-0 bg-transparent shadow-none ps-2"
                                                value={filterData.fecha}
                                                onChange={e => setFilterData('fecha', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>Servicio Ofrecido</label>
                                        <div className="input-group input-group-merge border-bottom">
                                            <span className="input-group-text bg-transparent border-0 ps-0"><i className="ti ti-cut text-primary"></i></span>
                                            <select 
                                                className="form-select border-0 bg-transparent shadow-none ps-2"
                                                value={filterData.servicio_id}
                                                onChange={e => setFilterData('servicio_id', e.target.value)}
                                            >
                                                <option value="">Todos los servicios</option>
                                                {Object.entries(serviciosList).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA 2: CLIENTE */}
                                <div className="col-lg-4 border-start border-end px-lg-4">
                                    <div>
                                        <h6 className="fw-bold mb-0">Datos del cliente</h6>
                                    </div>
                                    <div className="mb-3">
                                        <div className="input-group input-group-merge border-bottom mb-2">
                                            <span className="input-group-text bg-transparent border-0 ps-0"><i className="ti ti-id text-success"></i></span>
                                            <input 
                                                type="text" 
                                                className="form-control border-0 bg-transparent shadow-none ps-2"
                                                placeholder="N° Identificación"
                                                value={filterData.identificacion}
                                                onChange={e => setFilterData('identificacion', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <div className="input-group input-group-merge border-bottom">
                                            <input 
                                                type="text" 
                                                className="form-control border-0 bg-transparent shadow-none"
                                                placeholder="Nombre(s)"
                                                value={filterData.nombre}
                                                onChange={e => setFilterData('nombre', e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group input-group-merge border-bottom">
                                            <input 
                                                type="text" 
                                                className="form-control border-0 bg-transparent shadow-none"
                                                placeholder="Apellido(s)"
                                                value={filterData.apellido}
                                                onChange={e => setFilterData('apellido', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* COLUMNA 3: ASIGNACIÓN Y ESTADO */}
                                <div className="col-lg-4 px-lg-4">
                                    <div>
                                        <h6 className="fw-bold mb-0">Asignación y Estado</h6>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>Especialista Asignado</label>
                                        <select 
                                            className="form-select form-select-sm border-0 border-bottom bg-transparent shadow-none"
                                            value={filterData.empleado_id}
                                            onChange={e => setFilterData('empleado_id', e.target.value)}
                                        >
                                            <option value="">Cualquier especialista</option>
                                            {Object.entries(empleadosList).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label small fw-bold text-uppercase text-muted" style={{ fontSize: '10px' }}>Estado de Cita</label>
                                        <div className="d-flex flex-wrap gap-2 mt-1">
                                            {['AC', 'CA', 'RE', 'FA'].map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    className={`btn btn-xs rounded-pill px-3 py-1 ${filterData.estado === status ? 'btn-primary' : 'btn-light-secondary text-muted'}`}
                                                    style={{ fontSize: '11px', fontWeight: '700' }}
                                                    onClick={() => setFilterData('estado', filterData.estado === status ? '' : status)}
                                                >
                                                    {status === 'AC' ? 'ACTIVA' : status === 'CA' ? 'CANCELADA' : status === 'FA' ? 'FACTURADA': 'REPROG.'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <Table citas={citas} estadosList={estadosList}/>
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