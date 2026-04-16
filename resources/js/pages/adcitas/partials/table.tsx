import { useEffect, useRef, useState } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Adcitas  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import $ from 'jquery'; // <--- AGREGA ESTA LÍNEA
import CitasModalPos from '@/components/global/citas-modal-pos';
import CitasModalCancelar from '@/components/global/citas-modal-cancelar';

interface Props {
    citas: any[];
    sedePredeterminada: any;
    turnoActivo: any;
    estadosList: Record<string, string>;
    metodospagosList: Record<string, string>;
    turnosList: Record<string, string>;
}

export default function Table({ citas, estadosList, turnoActivo, turnosList, metodospagosList, sedePredeterminada}: Props) {
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


    const handleView = (id: number) => {
        router.visit(route('adcitas.show', id));
    };
    
    // Estado para saber qué dropdown de qué cita está abierto
    const [dropdownAbierto, setDropdownAbierto] = useState<number | null>(null);
    const [citaDetalle, setCitaDetalle] = useState<any>(null);
    const [citaCancelar, setCitaCancelar] = useState<any>(null);


    // Función para cerrar el menú al hacer click afuera
    useEffect(() => {
        const cerrarMenu = () => setDropdownAbierto(null);
        window.addEventListener('click', cerrarMenu);
        return () => window.removeEventListener('click', cerrarMenu);
    }, []);

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

    const handleFacturar = (id: number) => {
        router.visit(route('ftfacturas.create',{ cita: id }));
    };


    return (
        <>
            <div className="table-responsive" key={citas.length}> 
                <table ref={tableRef} className="table table-hover align-middle">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '15%' }}>Fecha y hora</th>
                            <th className="text-center" style={{ width: '20%' }}>Cliente</th>
                            <th className="text-center" style={{ width: '45%' }}>Servicios / Especialista</th>
                            <th className="text-center" style={{ width: '15%' }}>Detalles / Total</th>
                            <th className="text-center" style={{ width: '5%' }}>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {citas.map((cita: any) => {
                            // 1. Declaramos la lógica de bloqueo (Ajusta los códigos 'CA', 'RE' según tu BD)
                            const totalServicios = cita.detalle_con_empleadoservicio?.reduce(
                                (acc: number, item: any) => acc + Number(item.preciofinal || 0), 0
                            ) || 0;
                        
                            const totalProductos = cita.detalle_con_producto?.reduce(
                                (acc: number, item: any) => acc + Number(item.preciofinal || 0), 0
                            ) || 0;
                            const totalGeneral = totalServicios + totalProductos;
                            const esInactiva = ['CA', 'RE'].includes(cita.estado_codigo?.toUpperCase());
                            const esPagada = ['AS'].includes(cita.estado_codigo?.toUpperCase());
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
                                                className={`btn btn-outline-${cita.estado_observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: '0.75rem', fontWeight: 600 }}
                                                disabled={esInactiva || esPagada}
                                            >
                                                <i className="ti ti-list-search fs-5"></i>
                                            </button>
                                            
                                            <button 
                                                type="button" 
                                                className={`btn btn-outline-${cita.estado_observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                style={{ borderRadius: 0, borderLeft: 'none' }}
                                                onClick={() => handleFacturar(cita.id)}
                                                disabled={esInactiva || esPagada} 
                                            >
                                                
                                                <i className="ti ti-coin fs-5"></i>
                                            </button>

                                            {/* BOTÓN FLECHA DROPDOWN */}
                                            <button 
                                                type="button" 
                                                className={`btn btn-sm dropdown-toggle-split d-flex align-items-center justify-content-center ${dropdownAbierto === cita.id ? 'btn-primary text-white' : `btn btn-outline-${cita.estado_observacion} btn-sm px-3 d-flex align-items-center gap-2`}`}
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
                sedePredeterminada={sedePredeterminada}
                turnoActivo={turnoActivo}
                turnosList={turnosList}
                show={!!citaDetalle} 
                onClose={() => setCitaDetalle(null)} 
            />
        </> 
    );
  }