import React, { useState, useRef} from 'react';
import { Head } from '@inertiajs/react';
import AppMainLayout from '@/layouts/app-main-layout';

// Componentes de sección
import FormComercio from './sections/FormComercio';
import Sedes from './sections/Sedes';
import Resoluciones from './sections/Resoluciones';
import Terminales from './sections/Terminales';
import Turnos from './sections/Turnos';

interface Props {
    comercio: any;
    sedesInitial: any[];
    resolucionesInitial: any[];
    terminalesInitial: any[];
    turnosInitial: any[];
    sedes: any[];         // La lista simple para el <select>
    resoluciones: any[];  // La lista simple para el <select>
    terminales: any[];  // La lista simple para el <select>
    [key: string]: any;   // Firma de índice para mayor flexibilidad
}

export default function Index({ comercio, sedesInitial, resolucionesInitial, terminalesInitial, sedes, resoluciones, turnosInitial, terminales }: Props) {
    const [tabActiva, setTabActiva] = useState('comercio');

    // Referencia para conectar con el formulario del hijo
    const comercioFormRef = useRef<{ submitForm: () => void }>(null);

    const handleGlobalSave = () => {
        // Llamamos a la función expuesta por el hijo
        if (tabActiva === 'comercio' && comercioFormRef.current) {
            comercioFormRef.current.submitForm();
        }
    };

    const tabs = [
        { id: 'comercio', label: 'Mi Comercio', icon: 'ti ti-building-store', component: FormComercio, desc: 'Datos principales' },
        { id: 'sedes', label: 'Sedes', icon: 'ti ti-map-pin', component: Sedes, desc: 'Puntos físicos' },
        { id: 'resoluciones', label: 'Resoluciones', icon: 'ti ti-file-text', component: Resoluciones, desc: 'Rangos DIAN' },
        { id: 'terminales', label: 'Terminales', icon: 'ti ti-device-desktop', component: Terminales, desc: 'Equipos POS' },
        { id: 'turnos', label: 'Turnos', icon: 'ti ti-clock', component: Turnos, desc: 'Horarios de trabajo' },
    ];

    const ComponenteActivo = tabs.find(tab => tab.id === tabActiva)?.component || FormComercio;
    const infoTabActiva = tabs.find(tab => tab.id === tabActiva);

    return (
        <AppMainLayout>
            <Head title="Configuración de Comercio" />
            
            {/* Breadcrumbs Estilo App */}
            <div className="page-header">
                <div className="page-block">
                    <div className="row">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item">Configuración</li>
                                <li className="breadcrumb-item" aria-current="page">{infoTabActiva?.label}</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <div className="page-header-title">
                                <h2 className="mb-0">Configuración central</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Sidebar de Navegación Vertical */}
                <div className="col-lg-3 col-md-4">
                    <div className="card border-0 shadow-none bg-transparent">
                        <div className="list-group list-group-flush gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setTabActiva(tab.id)}
                                    className={`list-group-item list-group-item-action border-0 rounded-3 p-3 d-flex align-items-center shadow-sm transition-all ${
                                        tabActiva === tab.id 
                                        ? 'bg-primary text-white active' 
                                        : 'bg-white text-muted mb-2'
                                    }`}
                                >
                                    <div className={`me-3 d-flex align-items-center justify-content-center rounded-2 ${tabActiva === tab.id ? 'bg-white-20 text-white' : 'bg-light-primary text-primary'}`} style={{ width: '40px', height: '40px' }}>
                                        <i className={`${tab.icon} fs-4`}></i>
                                    </div>
                                    <div>
                                        <h6 className={`mb-0 fw-bold ${tabActiva === tab.id ? 'text-white' : 'text-dark'}`}>{tab.label}</h6>
                                        <small className={tabActiva === tab.id ? 'text-white-50' : 'text-muted'}>{tab.desc}</small>
                                    </div>
                                    {tabActiva === tab.id && <i className="ti ti-chevron-right ms-auto"></i>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contenido de la Configuración */} 
                <div className="col-lg-9 col-md-8">
                    <div className="card border-0 shadow-sm rounded-2 overflow-hidden" style={{ borderRadius: '24px' }}>
                        <div className="card-header bg-white py-3 border-bottom-0">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <h5 className="mb-0 fw-bold">{infoTabActiva?.label}</h5>
                                    <p className="text-muted small mb-0">{infoTabActiva?.desc}</p>
                                </div>
                                {/* ESTE ES EL BOTÓN DE LA CABECERA */}
                                {tabActiva === 'comercio' && (
                                    <button 
                                        onClick={handleGlobalSave} // Ejecuta la función del padre
                                        className="btn btn-primary btn-sm rounded-pill px-4 shadow-sm"
                                    >
                                        <i className="ti ti-device-floppy me-1"></i> Guardar Cambios
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="card-body pt-0">
                            <hr className="my-3 opacity-25" />
                            <div className="animate__animated animate__fadeIn">
                                {/* PASAMOS LA REF AL COMPONENTE HIJO */}
                                {tabActiva === 'comercio' && (
                                    <FormComercio 
                                        ref={comercioFormRef} 
                                        comercio={comercio} 
                                    />
                                )}
                                {tabActiva === 'sedes' && <Sedes sedes={sedesInitial} />}
                                {tabActiva === 'resoluciones' && <Resoluciones resolucionesInitial={resolucionesInitial} />}
                                {tabActiva === 'terminales' && (
                                    <Terminales 
                                        terminalesInitial={terminalesInitial} 
                                        sedes={sedes}             // Asegúrate que Laravel envíe 'sedes'
                                        resoluciones={resoluciones} // Asegúrate que Laravel envíe 'resoluciones'
                                    />
                                )}
                                {tabActiva === 'turnos' && <Turnos turnosInitial={turnosInitial} terminales={terminales}  />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppMainLayout>
    );
}