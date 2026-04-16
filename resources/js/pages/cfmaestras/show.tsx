import React, { useState } from 'react';
import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, router } from '@inertiajs/react';

interface Props {
    perfil: any;
    roles: any[];
}

export default function Show({ perfil, roles }: Props) {
    // Manejamos el módulo seleccionado actualmente
    const [selectedModule, setSelectedModule] = useState(roles[0]?.id);

    const activeModule = roles.find(r => r.id === selectedModule) || roles[0];

    const setPerfilRol = (perfilId: number, rolId: number) => {
        router.put(route('sgrolesperfiles.setperfilrol'), { perfil: perfilId, rol: rolId }, { preserveScroll: true });
    };

    const updatePermiso = (permisoId: number) => {
        router.put(route('sgrolesperfiles.updatepermiso'), { permiso: permisoId }, { preserveScroll: true });
    };

    return (
        <AppMainLayout>
            <Head title={`Gold Config - ${perfil.nombre}`} />
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('cfmaestras.index')}> Perfiles</a></li>
                                <li className="breadcrumb-item" aria-current="page">Detalle</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <h1 className="h3 fw-bold text-dark mb-1">Centro de control de acceso (<strong>{perfil.nombre}</strong>)</h1>
                            <p className="text-muted mb-0">Define qué módulos y acciones puede realizar este perfil.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container-fluid py-4">
               
                {/* Barra de Acciones - Oculta en impresión */}
                <div className="d-print-none card mb-3">
                    <div className="card-body p-3">
                        <ul className="list-inline ms-auto mb-0 d-flex justify-content-end flex-wrap">
                            <li className="list-inline-item align-bottom me-2">
                                <a href={route('cfmaestras.index')} className="avtar avtar-s btn-link-secondary" title="Regresar">
                                    <i className="ti ti-arrow-back f-22"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="row g-0 shadow-lg overflow-hidden bg-white border">
                    {/* COLUMNA IZQUIERDA: Navegador de Módulos */}
                    <div className="col-md-4 col-lg-3 border-end bg-light-subtle">
                        <div className="p-3 bg-white border-bottom">
                            <input type="text" className="form-control form-control-sm border-0 bg-light" placeholder="Buscar módulo..." />
                        </div>
                        <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '600px' }}>
                            {roles.map((rol) => (
                                <button
                                    key={rol.id}
                                    onClick={() => setSelectedModule(rol.id)}
                                    className={`list-group-item list-group-item-action p-3 border-0 d-flex align-items-center justify-content-between ${selectedModule === rol.id ? 'bg-white shadow-sm z-1' : 'bg-transparent'}`}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className={`status-indicator me-3 ${rol.estado === 1 ? 'bg-success' : 'bg-danger'}`}></div>
                                        <div>
                                            <div className={`fw-bold mb-0 ${selectedModule === rol.id ? 'text-primary' : 'text-dark'}`}>{rol.nombre}</div>
                                            <span className="x-small text-muted">{rol.vistas?.length} acciones definidas</span>
                                        </div>
                                    </div>
                                    {selectedModule === rol.id && <i className="ti ti-chevron-right text-primary"></i>}
                                </button>
                            ))}
                        </div>
                    </div>
                   

                    {/* COLUMNA DERECHA: Detalle de Configuración */}
                    <div className="col-md-8 col-lg-9 bg-white min-vh-50">
                        {activeModule && (
                            <div className="p-5 animate__animated animate__fadeIn">
                                <div className="d-flex align-items-start justify-content-between mb-5">
                                    <div>
                                        <span className="text-primary fw-bold small text-uppercase mb-2 d-block">Configuración del Recurso</span>
                                        <h2 className="fw-black display-6">{activeModule.nombre}</h2>
                                        <p className="text-muted">Gestiona el comportamiento y visibilidad de este módulo.</p>
                                    </div>
                                    
                                    <div className="text-end"> {/* Cambiamos a text-end para mejor alineación */}
                                        <div className="p-3 border bg-light rounded-3 text-center" style={{ minWidth: '150px' }}>
                                            <label className="d-block mb-2 small fw-bold text-muted text-uppercase">Estado Global</label>
                                            <div className="form-check form-switch custom-switch-gold d-inline-block">
                                                <input 
                                                    className="form-check-input" 
                                                    type="checkbox" 
                                                    checked={activeModule.estado === 1}
                                                    onChange={() => setPerfilRol(perfil.id, activeModule.id)}
                                                />
                                            </div>
                                        </div>
                                        {/* Movimos el badge aquí: alineado con el control principal y más sutil */}
                                        <div className="mt-2">
                                            <span className="badge bg-light-primary text-primary border border-primary-subtle rounded-pill px-3 py-2 small" style={{ fontSize: '0.65rem' }}>
                                                <i className="ti ti-cloud-check me-1"></i> Autoguardado activo
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="row g-4">
                                    <div className="col-12">
                                        <h6 className="fw-bold mb-4 d-flex align-items-center">
                                            <i className="ti ti-list-check me-2 text-primary fs-4"></i>
                                            Acciones de Usuario Disponibles
                                        </h6>
                                    </div>
                                    
                                    {activeModule.vistas?.map((vista: any) => (
                                        <div className="col-md-6 col-lg-4" key={vista.vista_id}>
                                            <div className={`permission-card p-4 border transition-all ${vista.estado === 1 && activeModule.estado === 1 ? 'active' : ''}`}>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                        <i className={`ti ti-${getIconForAction(vista.nombre)} text-dark`}></i>
                                                    </div>
                                                    <div className="form-check form-switch">
                                                        <input 
                                                            className="form-check-input" 
                                                            type="checkbox" 
                                                            checked={vista.estado === 1}
                                                            disabled={activeModule.estado !== 1}
                                                            onChange={() => updatePermiso(vista.permiso_id)}
                                                        />
                                                    </div>
                                                </div>
                                                <h6 className="fw-bold mb-1">{vista.nombre}</h6>
                                                <p className="text-muted x-small mb-0">Permite al usuario {vista.nombre.toLowerCase()} registros en este módulo.</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.7rem; }
                .status-indicator { width: 8px; height: 8px; border-radius: 50%; }
                .custom-switch-gold .form-check-input { width: 3rem; height: 1.5rem; cursor: pointer; }
                .permission-card { background: #fcfcfc; border: 1px solid #eee; transition: all 0.2s ease; }
                .permission-card.active { background: #fff; border-color: #0d6efd; box-shadow: 0 10px 20px rgba(13, 110, 253, 0.05); }
                .permission-card.active h6 { color: #0d6efd; }
                .transition-all { transition: all 0.3s ease; }
                .bg-light-subtle { background-color: #f8f9fa !important; }
            `}} />
        </AppMainLayout>
    );
}

// Función auxiliar para iconos premium
function getIconForAction(name: string) {
    const map: any = {
        'LISTAR': 'list',
        'CREAR': 'plus',
        'GUARDAR': 'device-floppy',
        'EDITAR': 'edit',
        'ACTUALIZAR': 'refresh',
        'VISUALIZAR': 'eye'
    };
    return map[name] || 'circle';
}