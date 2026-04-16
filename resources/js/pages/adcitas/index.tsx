import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, usePage } from '@inertiajs/react';
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

    sedePredeterminada: any;
    turnoActivo: any;
    metodospagosList: Record<string, string>;
    turnosList: Record<string, string>;
}

export default function Index({ citas, estadosList, serviciosList, empleadosList, sedePredeterminada, turnoActivo, metodospagosList, turnosList }: Props) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    //console.log("mostrandos",user.personas.comercios.token)
    // 1. Definimos el periodo actual para comparar
    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();
    const [jornadaActiva, setJornadaActiva] = useState('Mañana');
    const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

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
        fechanacimiento: '',
        sexo_id: '',
        cliente_identificacion: '',
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
            sexo_id: cliente.sexo_id || '',
            fechanacimiento: cliente.fechanacimiento || '',
            cliente_nombre: `${cliente.nombres} ${cliente.apellidos}`,
            cliente_telefono: cliente.telefonomovil || '',
            cliente_email: cliente.email || '',
        });
        
        setMostrarSugerencias(false);
    };

    const submitReserva = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica antes de enviar
        if (!formReserva.data.cliente_nombre) {
            alert("Por favor, selecciona un cliente o crea uno.");
            return;
        }
    
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

        {/* SECCIÓN DE FILTROS AVANZADOS (ACORDEÓN CORREGIDO) */}
        <div className="row">
            <div className="col-sm-12">
                <div className="card border-0 shadow-sm mb-4">
                    <div className="card-header bg-white border-0 py-3 px-4">
                        <div className="d-flex align-items-center justify-content-between">
                            {/* DISPARADOR CONTROLADO POR REACT */}
                            <button 
                                type="button"
                                className="d-flex align-items-center bg-transparent border-0 p-0 text-start" 
                                onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                            >
                                <div className="bg-light-primary text-primary p-2 rounded-3 me-3">
                                    <i className="ti ti-adjustments-horizontal fs-6"></i>
                                </div>
                                <div>
                                    <h5 className="mb-0 fw-bold text-dark">Filtros Avanzados</h5>
                                    <small className="text-muted">
                                        {filtrosAbiertos ? 'Haz clic para contraer' : 'Haz clic para expandir'}
                                    </small>
                                </div>
                            </button>

                            <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-danger btn-sm px-3 fw-bold rounded-2 shadow-sm" onClick={() => resetFilters()}>
                        <i className="ti ti-refresh me-1"></i> Limpiar
                    </button>
                    
                    <button type="button" className="btn btn-primary btn-sm px-3 fw-bold rounded-2 shadow-sm" onClick={handleSearch} disabled={filtering}>
                        {filtering ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="ti ti-search me-1"></i>}
                        Aplicar filtros
                    </button>

                    <button type="button" className="btn btn-outline-success btn-sm px-3 shadow-sm fw-bold d-flex align-items-center" onClick={() => cargarServiciosBusqueda()} disabled={cargandoTurnos}>
                        {cargandoTurnos ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="ti ti-plus me-1"></i>}
                        Nueva cita
                    </button>
                </div>
                        </div>
                    </div>

                    {/* CONTENIDO CONDICIONAL: Solo se renderiza si filtrosAbiertos es true */}
                    {filtrosAbiertos && (
                        <div className="card-body bg-white pt-2 pb-4 px-4 border-top animate__animated animate__fadeIn">
                            <form onSubmit={handleSearch} className="row g-4">
                                <div className="col-lg-4">
                                    <h6 className="fw-bold mb-3 text-primary small text-uppercase">Información General</h6>
                                    <div className="form-group mb-3">
                                        <label className="form-label small fw-bold text-muted">FECHA DE CITA</label>
                                        <input type="date" className="form-control border-0 border-bottom bg-transparent" value={filterData.fecha} onChange={e => setFilterData('fecha', e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label small fw-bold text-muted">SERVICIO</label>
                                        <select className="form-select border-0 border-bottom bg-transparent" value={filterData.servicio_id} onChange={e => setFilterData('servicio_id', e.target.value)}>
                                            <option value="">Todos los servicios</option>
                                            {Object.entries(serviciosList).map(([key, label]) => (
                                                <option key={key} value={key}>{label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="col-lg-4 border-start border-end px-lg-4">
                                    <h6 className="fw-bold mb-3 text-success small text-uppercase">Datos del cliente</h6>
                                    <input type="text" className="form-control border-0 border-bottom bg-transparent mb-3" placeholder="N° Identificación" value={filterData.identificacion} onChange={e => setFilterData('identificacion', e.target.value)} />
                                    <div className="row g-2">
                                        <div className="col-6"><input type="text" className="form-control border-0 border-bottom bg-transparent" placeholder="Nombre" value={filterData.nombre} onChange={e => setFilterData('nombre', e.target.value)} /></div>
                                        <div className="col-6"><input type="text" className="form-control border-0 border-bottom bg-transparent" placeholder="Apellido" value={filterData.apellido} onChange={e => setFilterData('apellido', e.target.value)} /></div>
                                    </div>
                                </div>

                                <div className="col-lg-4">
                                    <h6 className="fw-bold mb-3 text-warning small text-uppercase">Asignación y Estado</h6>
                                    <select className="form-select border-0 border-bottom bg-transparent mb-3" value={filterData.empleado_id} onChange={e => setFilterData('empleado_id', e.target.value)}>
                                        <option value="">Cualquier especialista</option>
                                        {Object.entries(empleadosList).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                    <div className="d-flex flex-wrap gap-1">
                                        {['AC', 'CA', 'RE', 'FA'].map((status) => (
                                            <button
                                                key={status}
                                                type="button"
                                                className={`btn btn-xs rounded-pill px-3 py-1 fw-bold ${filterData.estado === status ? 'btn-primary shadow-sm' : 'btn-light text-muted border'}`}
                                                style={{ fontSize: '10px' }}
                                                onClick={() => setFilterData('estado', filterData.estado === status ? '' : status)}
                                            >
                                                {status === 'AC' ? 'ACTIVA' : status === 'CA' ? 'CANC.' : status === 'RE' ? 'REPROG.' : 'FACT.'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
        

        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    
                    <div className="card-body">
                        <Table 
                        citas={citas} 
                        estadosList={estadosList}
                        metodospagosList={metodospagosList}
                        sedePredeterminada={sedePredeterminada}
                        turnoActivo={turnoActivo}
                        turnosList={turnosList}
                        />
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

        {/* --- MODAL DE RESERVA ACTUALIZADO --- */}
        <div className="modal fade" id="modalReserva" tabIndex={-1} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-bottom bg-light p-3">
                        <div>
                            <h5 className="modal-title fw-bold text-dark">
                                <i className="ti ti-bookmark me-2 text-primary fs-4"></i>
                                Confirmar cita
                            </h5>
                            <small className="text-muted">Busca un cliente o registra uno nuevo</small>
                        </div>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div className="modal-body p-4">
                        {/* Resumen del Turno (Igual al anterior) */}
                        {seleccion && (
                            <div className="alert bg-primary-subtle border border-primary-subtle rounded-3 mb-4 p-3 shadow-sm">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-white rounded-circle p-2 border border-primary-subtle text-primary shadow-sm">
                                        <i className="ti ti-calendar-event fs-3"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-bold text-dark">
                                            {new Date(seleccion.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                weekday: 'long', day: 'numeric', month: 'long' 
                                            })}
                                        </h6>
                                        <div className="d-flex align-items-center gap-2 mt-1">
                                            <span className="badge bg-primary text-white fw-bold px-3 py-1 fs-7 rounded-pill">
                                                <i className="ti ti-clock-check me-1"></i> {seleccion.hora}
                                            </span>
                                            <span className="text-muted small">
                                                para <strong>{seleccion.servicio.nombre}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form id="formConfirmarCita" onSubmit={submitReserva}>
                            {/* Buscador de Cliente con Opción de "Nuevo" */}
                            <div className="mb-3 position-relative">
                                <label className="form-label fw-semibold small text-muted text-uppercase">Cliente</label>
                                <div className="input-group">
                                    <span className="input-group-text bg-light"><i className="ti ti-user"></i></span>
                                    <input 
                                        type="text" 
                                        className={`form-control ${!formReserva.data.cliente_id && formReserva.data.cliente_nombre ? 'border-warning' : ''}`}
                                        value={formReserva.data.cliente_nombre}
                                        onChange={(e) => {
                                            formReserva.setData({
                                                ...formReserva.data,
                                                cliente_nombre: e.target.value,
                                                cliente_id: '' // Limpiamos el ID si el usuario escribe, para marcarlo como "Nuevo"
                                            });
                                            buscarCliente(e.target.value);
                                        }}
                                        placeholder="Buscar cliente por nombre o cédula..."
                                        autoComplete="off"
                                    />
                                </div>
                                
                                {/* Indicador de Nuevo Cliente */}
                                {!formReserva.data.cliente_id && formReserva.data.cliente_nombre.length > 2 && !buscando && (
                                    <div className="form-text text-warning fw-bold">
                                        <i className="ti ti-alert-circle me-1"></i> Se creará como cliente nuevo
                                    </div>
                                )}

                                {/* Lista de sugerencias */}
                                {mostrarSugerencias && (
                                    <ul className="list-group position-absolute w-100 shadow-lg z-3 mt-1" style={{ top: '100%' }}>
                                        {/* Resultados de la DB */}
                                        {resultadosClientes.map((c: any) => (
                                            <li 
                                                key={c.id} 
                                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2"
                                                onClick={() => seleccionarCliente(c)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div>
                                                    <div className="fw-bold">{c.nombres} {c.apellidos}</div>
                                                    <small className="text-muted">{c.telefonomovil || 'Sin teléfono'}</small>
                                                </div>
                                                <i className="ti ti-chevron-right text-muted"></i>
                                            </li>
                                        ))}
                                        
                                        {/* Opción: Crear Nuevo (si no hay resultados exactos) */}
                                        {formReserva.data.cliente_nombre.length > 2 && (
                                            <li 
                                                className="list-group-item list-group-item-action list-group-item-primary d-flex align-items-center py-2"
                                                onClick={() => setMostrarSugerencias(false)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <i className="ti ti-user-plus me-2 fs-5"></i>
                                                <div>
                                                    <div className="fw-bold">Usar "{formReserva.data.cliente_nombre}"</div>
                                                    <small>Registrar como cliente nuevo</small>
                                                </div>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            <div className="row g-3">
                                {/* Identificación (Nueva para cliente nuevo) */}
                                {!formReserva.data.cliente_id && formReserva.data.cliente_nombre && (
                                    <div className="col-12">
                                        <label className="form-label fw-semibold small text-muted text-uppercase">N° Identificación</label>
                                        <input 
                                            type="text" 
                                            className="form-control bg-light-warning border-warning-subtle" 
                                            placeholder="Identificación del nuevo cliente"
                                            value={formReserva.data.cliente_identificacion || ''}
                                            onChange={e => formReserva.setData('cliente_identificacion', e.target.value)}
                                            required
                                        />
                                    </div>
                                )}

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold small text-muted text-uppercase">Teléfono</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        value={formReserva.data.cliente_telefono}
                                        onChange={e => formReserva.setData('cliente_telefono', e.target.value)}
                                        placeholder="Ej: 3001234567"
                                        required={!formReserva.data.cliente_id} // Requerido si es nuevo
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
                                <div className="col-12">
                                    <label className="form-label fw-semibold small text-muted text-uppercase">Notas Opcionales</label>
                                    <textarea 
                                        className="form-control" 
                                        rows={2}
                                        value={formReserva.data.observaciones}
                                        onChange={(e) => formReserva.setData('observaciones', e.target.value)}
                                        placeholder="Alguna observación importante..."
                                    ></textarea>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer border-top bg-light p-3">
                        <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cancelar</button>
                        <button 
                            type="submit" 
                            form="formConfirmarCita" 
                            className={`btn ${formReserva.data.cliente_id ? 'btn-primary' : 'btn-warning'} shadow-sm`}
                            disabled={formReserva.processing}
                        >
                            {formReserva.processing ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                <>
                                    <i className={`ti ${formReserva.data.cliente_id ? 'ti-device-floppy' : 'ti-user-plus'} me-2`}></i>
                                    {formReserva.data.cliente_id ? 'Confirmar cita' : 'Registrar y Agendar'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}