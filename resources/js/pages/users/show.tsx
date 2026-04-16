import React, { useState, useEffect, useRef } from 'react';
import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, useForm, usePage} from '@inertiajs/react';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
import avatar9 from '/public/assets/images/user/avatar-9.jpg'; 
import avatar10 from '/public/assets/images/user/default.png';  
import { router } from '@inertiajs/react';


export default function Show({ users, sedesComercio, perfilesList, sedesAsignadasIds, sedePredeterminadaId, estadosList}: any) {
    const { auth } = usePage().props as any;
    const persona = users.personas;
    const nombreCompleto = `${persona.personasnaturales.nombres} ${persona.personasnaturales.apellidos}`;
    const icons = {
        perfil: 'ti ti-user',
        seguridad: 'ti ti-shield-lock'
    };
    const [activeTab, setActiveTab] = useState('perfil');

    // 1. Estados adicionales para visibilidad (puedes usar un objeto para manejar varios)
    const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

    // 1. Buscamos el objeto de soporte dentro del array de soportes que ahora sí viene cargado
    const logoSoporte = users?.soportes[0];
    // Extraemos solo la ruta
    const rutaLogo = logoSoporte ? logoSoporte.ruta : null;

    // 1. Formulario para la información de la cuenta (Perfil)
    const { data, setData, put, processing, errors, clearErrors} = useForm({
        id: users?.id || '',
        username: users?.username || '',
        email: users.personas?.email || '',
        telefonomovil: users?.personas?.telefonomovil || '',
        perfil_id: users?.perfil_id?.toString() || '',
        estado_id: users?.estado_id?.toString() || '',
        logo: null as File | null,
        current_logo_path: rutaLogo || null, 
    });

    const submitPerfil = (e: React.FormEvent) => {
        e.preventDefault();
    
        // IMPORTANTE: Cambiamos .put por .post y añadimos _method: 'put'
        // Esto es necesario para que Laravel reciba los archivos correctamente
        router.post(route('users.updateperfil', users.id), {
            _method: 'put', // Spoofing para que Laravel lo trate como PUT
            ...data         // Enviamos todo el objeto data que incluye el archivo 'logo'
        }, {
            forceFormData: true, // Asegura que se envíe como multipart/form-data
            preserveScroll: true,
            onSuccess: () => {
                // Notificación de éxito opcional
            }
        });
    };

    // Funciones de acción
    const handleToggleSede = (sedeId: number, isActivo: boolean) => {
        router.put(route('users.toggle-permiso', { user: users.id, sede: sedeId }), {
            activo: !isActivo
        }, { preserveScroll: true });
    };

    const handleSetDefault = (sedeId: number) => {
        router.put(route('users.set-default', { user: users.id, sede: sedeId }), {}, { 
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
    
        formPass.put(route('users.updatepassword', users.id), {
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
                            <li className="breadcrumb-item"><Link href={route('adclientes.index')}>Usuarios</Link></li>
                            <li className="breadcrumb-item" aria-current="page">Detalle</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title">
                            <h2 className="mb-0">Perfil del usuario</h2>
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

                <div className="card-body">
                    <div className="text-center">
                        {/* Contenedor Principal del Avatar */}
                        <div className="position-relative d-inline-flex mb-4">
                            <div 
                                className="avatar avatar-xxl rounded-circle border border-white shadow-sm overflow-hidden bg-light d-flex align-items-center justify-content-center"
                                style={{ width: '120px', height: '120px' }}
                            >
                                {/* LÓGICA DE VISUALIZACIÓN PRIORIZADA */}
                                {data.logo ? (
                                    // 1. Si el usuario acaba de seleccionar una foto nueva
                                    <img 
                                        src={URL.createObjectURL(data.logo as any)} 
                                        className="w-100 h-100 object-fit-cover animate__animated animate__fadeIn" 
                                        alt="Previsualización" 
                                    />
                                ) : data.current_logo_path ? (
                                    // 2. Si hay una foto guardada en el servidor
                                    <img 
                                        src={`..//storage/${data.current_logo_path}`} 
                                        className="w-100 h-100 object-fit-cover" 
                                        alt="Logo Actual" 
                                    />
                                ) : (
                                    // 3. FALLBACK: Si no hay nada, usamos la lógica de sexo o el default (avatar10)
                                    <img 
                                        src={
                                            persona.personasnaturales.sexo_id === 46 ? avatar1 : 
                                            persona.personasnaturales.sexo_id === 47 ? avatar9 : avatar10
                                        } 
                                        className="w-100 h-100 object-fit-cover opacity-75" 
                                        alt="Avatar por defecto" 
                                    />
                                )}
                            </div>

                            {/* Botón de Acción (Cámara) */}
                            <label 
                                className="btn btn-icon btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle shadow-sm border border-white" 
                                style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                                title="Cambiar imagen"
                            >
                                <i className="ti ti-camera fs-6"></i>
                                <input 
                                    type="file" 
                                    className="d-none" 
                                    accept="image/*"
                                    onChange={e => setData('logo', e.target.files?.[0] || null)} 
                                />
                            </label>
                        </div>

                        {/* Textos Informativos */}
                        <div className="mb-3">
                            <h5 className="mb-1 text-uppercase fw-bold" style={{ fontSize: '0.95rem' }}>{nombreCompleto}</h5>
                            <p className="text-muted small mb-0">
                                {data.logo ? (
                                    <span className="text-success fw-medium animate__animated animate__flash">
                                        <i className="ti ti-check me-1"></i>Imagen lista para subir
                                    </span>
                                ) : (
                                    "Formatos sugeridos: PNG, JPG o WEBP"
                                )}
                            </p>
                        </div>

                        {/* Badge de Estado (Unificado) */}
                        <div className="d-flex justify-content-center">
                            <span className={`badge bg-light-${users.estado.observacion} text-${users.estado.observacion} border border-${users.estado.observacion} rounded-pill px-3 py-2`}>
                                <i className="ti ti-point-filled me-1"></i>
                                {users.estado.nombre}
                            </span>
                        </div>
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
                        href={route('users.index')} 
                        className="btn btn-outline-secondary"
                    >
                        <i className="ti ti-arrow-left"></i>
                        Volver
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
                                                <div className="col-md-4">
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
                                                <div className="col-md-4">
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

                                                <div className="col-md-4">
                                                    <label className="form-label text-muted mb-1 small">Estado</label>
                                                    <select
                                                        className={`form-select ${errors.estado_id ? 'is-invalid' : ''}`}
                                                        value={data.estado_id} // Este es el que manda la selección
                                                        onChange={e => setData('estado_id', e.target.value)}
                                                        style={{ backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <option value="">Seleccione un estado...</option>
                                                        {Object.entries(estadosList).map(([key, label]) => (
                                                            <option key={key} value={key}>
                                                                {label as string}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.estado_id && <div className="invalid-feedback">{errors.estado_id}</div>}
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
                                                    Actualizar información e imagen de perfil
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


    </AppMainLayout> 
    );
}