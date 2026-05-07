import { useState, useMemo } from 'react';
import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router, useForm } from '@inertiajs/react';

interface Props {
    cfpersonascomercios: any[];
    todosLosComercios: any[];
}

export default function Index({ cfpersonascomercios, todosLosComercios }: Props) {
    // --- ESTADOS PARA FILTROS ---
    const [search, setSearch] = useState('');
    const [filterComercio, setFilterComercio] = useState('all');
    const [filterPerfil, setFilterPerfil] = useState('all');
    const [filterAsignado, setFilterAsignado] = useState('all');
    const [personaSeleccionada, setPersonaSeleccionada] = useState<any>(null);

    const { data, setData, post, processing, reset } = useForm({
        persona_id: '',
        comercio_id: '',
    });

    // --- LÓGICA DE FILTRADO ---
    const filteredData = useMemo(() => {
        return cfpersonascomercios.filter(item => {
            const accesos = Array.isArray(item.admincomercios) 
                ? item.admincomercios 
                : (item.admincomercios ? [item.admincomercios] : []);

            const matchesSearch = 
                item.personasnaturales?.nombrecompleto?.toLowerCase().includes(search.toLowerCase()) ||
                item.identificacion?.includes(search);
            
            const matchesComercio = filterComercio === 'all' || 
                accesos.some((acc: any) => acc.comercios?.id.toString() === filterComercio);

            const matchesPerfil = filterPerfil === 'all' || 
                item.user?.perfil?.nombre === filterPerfil;

            const matchesAsignado = filterAsignado === 'all' || 
                (filterAsignado === 'si' ? accesos.length > 0 : accesos.length === 0);

            return matchesSearch && matchesComercio && matchesPerfil && matchesAsignado;
        });
    }, [search, filterComercio, filterPerfil, filterAsignado, cfpersonascomercios]);

    // --- OBTENER PERFILES ÚNICOS PARA EL FILTRO ---
    const perfilesUnicos = useMemo(() => {
        return Array.from(new Set(cfpersonascomercios
            .filter(i => i.user?.perfil)
            .map(i => i.user.perfil.nombre)
        ));
    }, [cfpersonascomercios]);

    // --- COMERCIOS DISPONIBLES PARA LA MODAL ---
    const comerciosDisponiblesParaModal = useMemo(() => {
        if (!personaSeleccionada) return [];
        const idsAsociados = (Array.isArray(personaSeleccionada.admincomercios) 
            ? personaSeleccionada.admincomercios 
            : (personaSeleccionada.admincomercios ? [personaSeleccionada.admincomercios] : [])
        ).map((acc: any) => acc.comercio_id);

        return todosLosComercios.filter(c => !idsAsociados.includes(c.id));
    }, [personaSeleccionada, todosLosComercios]);

    // --- ACCIONES ---
    const abrirModal = (persona: any) => {
        setPersonaSeleccionada(persona);
        setData({ persona_id: persona.id.toString(), comercio_id: '' });
    };

    const handleVincular = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cfpersonascomercios.store'), {
            onSuccess: () => {
                reset();
                const closeBtn = document.getElementById('btnCloseModal');
                closeBtn?.click();
            },
        });
    };

    const toggleEstado = (id: number) => {
        router.post(route('cfpersonascomercios.toggle', id), {}, { preserveScroll: true });
    };

    return (
        <AppMainLayout>
            <Head title="Gestión de Accesos" />

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href="#">Gestión de Accesos</a></li>
                                <li className="breadcrumb-item" aria-current="page">Listado</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <div className="page-header-title"><h2 className="mb-0">Administra las vinculaciones de personal a tus comercios.</h2></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BARRA DE FILTROS AVANZADA */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
                <div className="card-body p-3">
                    <div className="row g-2">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><i className="ti ti-search text-muted"></i></span>
                                <input 
                                    type="text" className="form-control bg-light border-0" 
                                    placeholder="Nombre o identificación..." 
                                    value={search} onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select bg-light border-0 text-muted" value={filterComercio} onChange={e => setFilterComercio(e.target.value)}>
                                <option value="all">Comercios: Todos</option>
                                {todosLosComercios.map((c: any) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select bg-light border-0 text-muted" value={filterPerfil} onChange={e => setFilterPerfil(e.target.value)}>
                                <option value="all">Perfiles: Todos</option>
                                {perfilesUnicos.map((p: any) => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select bg-light border-0 text-muted" value={filterAsignado} onChange={e => setFilterAsignado(e.target.value)}>
                                <option value="all">Asignación: Todas</option>
                                <option value="si">Con Comercio</option>
                                <option value="no">Sin Comercio</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-light-secondary w-100" onClick={() => {setSearch(''); setFilterComercio('all'); setFilterPerfil('all'); setFilterAsignado('all');}}>
                                <i className="ti ti-refresh"></i> Limpiar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* GRID DE RESULTADOS */}
            <div className="row g-4">
                {filteredData.map((persona) => {
                    const accesos = Array.isArray(persona.admincomercios) 
                        ? persona.admincomercios 
                        : (persona.admincomercios ? [persona.admincomercios] : []);

                    return (
                        <div className="col-xl-6 col-xxl-4" key={persona.id}>
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '15px' }}>
                                <div className="card-body">
                                    {/* Encabezado Principal */}
                                    <div className="d-flex align-items-start mb-3">
                                        <div className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold shadow-sm" 
                                            style={{ width: '60px', height: '60px', backgroundColor: 'rgba(var(--bs-primary-rgb), 0.1)', fontSize: '1.4rem', flexShrink: 0 }}>
                                            {persona.personasnaturales?.nombre?.charAt(0)}{persona.personasnaturales?.apellido?.charAt(0)}
                                        </div>
                                        <div className="ms-3 flex-grow-1">
                                            <h6 className="mb-0 fw-bold text-dark fs-5">{persona.personasnaturales?.nombrecompleto}</h6>
                                            <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                                                <span className="badge bg-light-secondary text-muted border" style={{ fontSize: '0.65rem' }}>
                                                    <i className="ti ti-id me-1"></i>{persona.identificacion}
                                                </span>
                                                <span className="badge bg-light-info text-info border border-info-subtle" style={{ fontSize: '0.65rem' }}>
                                                    {persona.user?.perfil?.nombre}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="btn btn-sm btn-light-secondary rounded-circle p-2">
                                            <i className="ti ti-settings fs-5"></i>
                                        </button>
                                    </div>

                                    {/* Información de Contacto y Usuario (NUEVA SECCIÓN) */}
                                    <div className="row g-2 mb-4 p-3 rounded-3" style={{ backgroundColor: '#f9f9fb' }}>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center text-muted small">
                                                <i className="ti ti-user-circle me-2 text-primary fs-6"></i>
                                                <span className="fw-semibold me-1">Username:</span> {persona.user?.username || 'N/A'}
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center text-muted small">
                                                <i className="ti ti-mail me-2 text-primary fs-6"></i>
                                                <span className="text-truncate">{persona.email}</span>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="d-flex align-items-center text-muted small">
                                                <i className="ti ti-device-mobile me-2 text-primary fs-6"></i>
                                                <span>{persona.telefonomovil || 'Sin teléfono'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sección de Comercios */}
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="small fw-bold text-muted mb-0" style={{ letterSpacing: '0.05em' }}>
                                            <i className="ti ti-key me-1"></i> ACCESO COMERCIAL ({accesos.length})
                                        </h6>
                                        <button 
                                            className="btn btn-sm btn-primary rounded-pill px-3 py-1 fw-bold shadow-sm"
                                            onClick={() => abrirModal(persona)}
                                            data-bs-toggle="modal" data-bs-target="#modalVinculacion"
                                            style={{ fontSize: '0.7rem' }}
                                        >
                                            <i className="ti ti-plus me-1"></i> Vincular
                                        </button>
                                    </div>

                                    <div className="d-flex flex-column gap-2">
                                        {accesos.length > 0 ? accesos.map((acceso: any) => (
                                            <div key={acceso.id} className="p-3 rounded-3 border d-flex align-items-center justify-content-between transition-all" 
                                                style={{ 
                                                    backgroundColor: acceso.activo ? 'rgba(40, 167, 69, 0.05)' : '#ffffff',
                                                    borderColor: acceso.activo ? 'rgba(40, 167, 69, 0.2)' : '#ebedef',
                                                    boxShadow: acceso.activo ? '0 2px 4px rgba(40, 167, 69, 0.05)' : 'none'
                                                }}>
                                                <div className="d-flex align-items-center">
                                                    <div className={`rounded-2 p-2 me-3 shadow-sm text-center ${acceso.activo ? 'bg-success text-white' : 'bg-light text-muted'}`} style={{ width: '40px' }}>
                                                        <i className="ti ti-building-store fs-5"></i>
                                                    </div>
                                                    <div>
                                                        <span className="d-block fw-bold text-dark small">{acceso.comercios?.nombre}</span>
                                                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>Ref: #{acceso.id}</span>
                                                    </div>
                                                </div>
                                                <div className="form-check form-switch m-0">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="checkbox" 
                                                        style={{ cursor: 'pointer', width: '2.5em' }}
                                                        checked={acceso.activo === 1}
                                                        onChange={() => toggleEstado(acceso.id)}
                                                    />
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-3 border border-dashed rounded-3 bg-light">
                                                <span className="text-muted small italic">Sin comercios asociados</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer con Acciones de Comunicación */}
                                <div className="card-footer bg-white border-top-0 py-3 px-4" style={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}>
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <a href={`tel:${persona.telefonomovil}`} className="btn btn-outline-light border w-100 btn-sm text-dark d-flex align-items-center justify-content-center py-2 rounded-3">
                                                <i className="ti ti-phone-call me-2 text-primary"></i> Llamar
                                            </a>
                                        </div>
                                        <div className="col-6">
                                            <a href={`mailto:${persona.email}`} className="btn btn-outline-light border w-100 btn-sm text-dark d-flex align-items-center justify-content-center py-2 rounded-3">
                                                <i className="ti ti-mail-forward me-2 text-primary"></i> Email
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL DE VINCULACIÓN */}
            <div className="modal fade" id="modalVinculacion" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pb-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold">Nueva Vinculación</h5>
                            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" id="btnCloseModal"></button>
                        </div>
                        <form onSubmit={handleVincular}>
                            <div className="modal-body p-4 text-center">
                                <p className="text-muted mb-4">Vincular a <strong>{personaSeleccionada?.personasnaturales?.nombrecompleto}</strong> con un establecimiento.</p>
                                
                                <div className="text-start">
                                    <label className="form-label small fw-bold text-muted">SELECCIONAR COMERCIO</label>
                                    <select 
                                        className="form-select border-2 py-2" required
                                        value={data.comercio_id} onChange={e => setData('comercio_id', e.target.value)}
                                    >
                                        <option value="">-- Elige un comercio --</option>
                                        {comerciosDisponiblesParaModal.map((c: any) => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                    {comerciosDisponiblesParaModal.length === 0 && (
                                        <div className="alert alert-warning mt-3 py-2 small border-0">
                                            No hay más comercios disponibles para este usuario.
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="button" className="btn btn-light px-4" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm" disabled={processing || !data.comercio_id}>
                                    {processing ? '...' : 'Confirmar Acceso'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppMainLayout>
    );
}