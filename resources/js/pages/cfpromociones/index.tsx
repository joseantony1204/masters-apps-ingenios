import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState, useMemo, useCallback } from 'react';

// Componentes de Secciones (Modales)
import Create from './sections/Create';
import AsignarVip from './sections/AsignarVip';
import GenerarLote from './sections/GenerarLote';
import GestionarCupones from './sections/GestionarCupones';

// --- INTERFACES ---
interface Promo {
    id: number;
    nombre: string;
    descripcion: string;
    valor: number;
    tipo_descuento: 'porcentaje' | 'fijo';
    categoria: 'flash' | 'cumple' | 'vip' | 'general' | 'recurrente';
    estado: boolean;
    cupones?: Array<{
        usos_actuales: number;
        limite_uso_total: number;
    }>;
}

interface Props {
    promociones: Promo[];
}

// --- CONFIGURACIÓN DE CATEGORÍAS (UI) ---
const CATEGORY_CONFIG: Record<string, any> = {
    cumple: { color: 'info', icon: 'ti-gift', label: 'Cumpleaños' },
    recurrente: { color: 'primary', icon: 'ti-recycle', label: 'Recurrente' },
    flash: { color: 'warning', icon: 'ti-bolt', label: 'Relámpago' },
    vip: { color: 'danger', icon: 'ti-diamond', label: 'VIP', dark: true },
    general: { color: 'primary', icon: 'ti-ticket', label: 'General' },
};

export default function Index({ promociones = [] }: Props) {
    const [filter, setFilter] = useState('todas');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [modal, setModal] = useState<{
        type: 'create' | 'lote' | 'vip' | 'manage' | null;
        data: Promo | null;
    }>({ type: null, data: null });

    const filteredPromos = useMemo(() => 
        filter === 'todas' ? promociones : promociones.filter(p => p.categoria === filter),
    [filter, promociones]);

    const handleToggleEstado = useCallback((id: number) => {
        router.patch(route('cfpromociones.toggle', id), {}, { preserveScroll: true });
    }, []);

    const handleDelete = useCallback((id: number) => {
        if (confirm('¿Eliminar esta campaña? Esto inactivará los cupones asociados.')) {
            router.delete(route('cfpromociones.destroy', id));
        }
    }, []);

    const actions = {
        onEdit: (p: Promo) => setModal({ type: 'create', data: p }),
        onDelete: (id: number) => handleDelete(id),
        onManage: (p: Promo) => setModal({ type: 'manage', data: p }),
        onAsignarVip: (p: Promo) => setModal({ type: 'vip', data: p }),
        onToggle: handleToggleEstado
    };

    return (
        <AppMainLayout>
            <Head title="Gestión de Campañas" />

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href="#">Marketing</a></li>
                                <li className="breadcrumb-item" aria-current="page">Listado</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <div className="page-header-title"><h2 className="mb-0">Gestión de campañas</h2></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <div className="col-md-12 d-flex justify-content-between align-items-center mt-2">
                                <h2 className="mb-0 fw-bold"></h2>
                                <button className="btn btn-primary shadow-sm d-flex align-items-center gap-2" onClick={() => setModal({ type: 'create', data: null })}>
                                    <i className="ti ti-plus fs-5"></i> Nueva Promoción
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3 text-uppercase">
                <div className="d-flex align-items-center gap-1 bg-white p-1 rounded-pill shadow-sm border overflow-auto">
                    <FilterBtn active={filter === 'todas'} icon="ti ti-layout-grid" label="Todas" onClick={() => setFilter('todas')} />
                    {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
                        <FilterBtn key={key} active={filter === key} icon={`ti ${cfg.icon}`} label={cfg.label} onClick={() => setFilter(key)} />
                    ))}
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className="btn-group shadow-sm bg-white rounded">
                        <button className={`btn ${viewMode === 'grid' ? 'btn-primary text-white' : 'btn-light text-muted'}`} onClick={() => setViewMode('grid')}><i className="ti ti-layout-grid"></i></button>
                        <button className={`btn ${viewMode === 'list' ? 'btn-primary text-white' : 'btn-light text-muted'}`} onClick={() => setViewMode('list')}><i className="ti ti-list"></i></button>
                    </div>
                    <button className="btn btn-dark d-flex align-items-center gap-2" onClick={() => setModal({ type: 'lote', data: null })}>
                        <i className="ti ti-layers-intersect"></i>Generar Lote
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {filteredPromos.length > 0 ? filteredPromos.map((promo) => (
                    <div className={viewMode === 'grid' ? "col-md-6 col-xl-4" : "col-12"} key={promo.id}>
                        <PromoDispatcher promo={promo} viewMode={viewMode} actions={actions} />
                    </div>
                )) : (
                    <div className="col-12 text-center py-5">
                        <div className="text-muted opacity-25 mb-3"><i className="ti ti-ticket fs-1" style={{fontSize: '5rem'}}></i></div>
                        <h4 className="text-muted text-uppercase">No hay campañas activas</h4>
                    </div>
                )}
            </div>

            {modal.type === 'create' && <Create promo={modal.data} onClose={() => setModal({ type: null, data: null })} />}
            {modal.type === 'vip' && <AsignarVip promo={modal.data!} onClose={() => setModal({ type: null, data: null })} />}
            {modal.type === 'lote' && <GenerarLote promociones={promociones} onClose={() => setModal({ type: null, data: null })} />}
            {modal.type === 'manage' && <GestionarCupones promo={modal.data!} onClose={() => setModal({ type: null, data: null })} />}
        </AppMainLayout>
    );
}

// --- SUB-COMPONENTES ---

const PromoDispatcher = ({ promo, viewMode, actions }: any) => {
    const config = CATEGORY_CONFIG[promo.categoria] || CATEGORY_CONFIG.general;
    return viewMode === 'list' 
        ? <PromoRow promo={promo} actions={actions} config={config} /> 
        : <PromoCard promo={promo} actions={actions} config={config} />;
};

const ProgressBar = React.memo(({ promo }: { promo: any }) => {
    const actual = promo.cupones?.reduce((acc: number, cup: any) => acc + (cup.usos_actuales || 0), 0) || 0;
    const total = promo.cupones?.reduce((acc: number, cup: any) => acc + (cup.limite_uso_total || 1), 0) || 1;
    const porcentaje = Math.min((actual / total) * 100, 100);

    return (
        <div className="mt-3 w-100">
            <div className="d-flex justify-content-between x-small mb-1 fw-bold opacity-75">
                <span>USOS: {actual} / {total}</span>
                <span>{Math.round(porcentaje)}%</span>
            </div>
            <div className="progress bg-light" style={{ height: '6px', borderRadius: '10px' }}>
                <div className={`progress-bar ${porcentaje >= 90 ? 'bg-danger' : 'bg-primary'}`} style={{ width: `${porcentaje}%`, borderRadius: '10px' }}></div>
            </div>
        </div>
    );
});

const PromoCard = ({ promo, actions, config }: any) => (
    <div className={`card border-0 shadow-sm h-100 border-top border-4 border-${config.color} ${config.dark ? 'bg-dark text-white' : 'bg-white'}`}>
        <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className={`p-2 bg-${config.color} bg-opacity-10 rounded text-${config.color}`}>
                    <i className={`ti ${config.icon} fs-3`}></i>
                </div>
                <div className="d-flex align-items-center gap-2">
                    <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" checked={!!promo.estado} onChange={() => actions.onToggle(promo.id)} />
                    </div>
                    <PromoActionsDropdown promo={promo} actions={actions} light={config.dark} />
                </div>
            </div>
            
            <h6 className={`${config.dark ? 'text-white-50' : 'text-muted'} x-small fw-bold text-uppercase mb-1`}>{config.label}</h6>
            <h5 className="fw-black text-uppercase mb-2 text-truncate">{promo.nombre}</h5>
            
            {/* AQUÍ ESTÁ LA DESCRIPCIÓN AGREGADA */}
            <p className={`${config.dark ? 'text-white-50' : 'text-muted'} small mb-3 text-uppercase`} 
               style={{ 
                   display: '-webkit-box', 
                   WebkitLineClamp: '2', 
                   WebkitBoxOrient: 'vertical', 
                   overflow: 'hidden', 
                   minHeight: '2.8em',
                   lineHeight: '1.4'
               }}>
                {promo.descripcion || 'Sin descripción detallada para esta campaña.'}
            </p>

            <div className={`p-3 rounded-3 mb-3 ${config.dark ? 'bg-secondary bg-opacity-25' : 'bg-light'}`}>
                <div className="d-flex align-items-baseline">
                    <h2 className={`fw-black mb-0 text-${config.color}`}>{Number(promo.valor).toFixed(0)}%</h2>
                    <span className="ms-2 fw-bold opacity-50 x-small text-uppercase">Descuento</span>
                </div>
            </div>
            
            <ProgressBar promo={promo} />
        </div>
        <div className="card-footer bg-transparent border-0 pb-4 px-4">
            <button 
                className={`btn w-100 fw-bold text-uppercase ${promo.categoria === 'vip' ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={() => promo.categoria === 'vip' ? actions.onAsignarVip(promo) : actions.onManage(promo)}
            >
                {promo.categoria === 'vip' ? 'Asignar Cliente' : 'Gestionar Campaña'}
            </button>
        </div>
    </div>
);

const PromoRow = React.memo(({ promo, actions, config }: any) => (
    <div className="card border-0 shadow-sm mb-2 overflow-hidden border-start border-4 bg-white" style={{ borderColor: `var(--bs-${config.color})` }}>
        <div className="card-body py-2">
            <div className="row align-items-center">
                <div className="col-auto">
                    <div className={`p-2 bg-${config.color} bg-opacity-10 rounded text-${config.color}`}><i className={`ti ${config.icon} fs-4`}></i></div>
                </div>
                <div className="col">
                    <h6 className="mb-0 fw-bold text-uppercase">{promo.nombre}</h6>
                    <small className="text-muted x-small text-uppercase">
                        {promo.descripcion ? promo.descripcion.substring(0, 50) + '...' : `Categoría: ${config.label}`}
                    </small>
                </div>
                <div className="col-auto text-center px-4 border-end border-start d-none d-sm-block">
                    <h5 className={`mb-0 fw-black text-${config.color}`}>{Number(promo.valor).toFixed(0)}%</h5>
                    <small className="text-muted x-small fw-bold text-uppercase">Valor</small>
                </div>
                <div className="col-2 d-none d-md-block"><ProgressBar promo={promo} /></div>
                <div className="col-auto d-flex align-items-center gap-2 ms-auto">
                    {promo.categoria === 'vip' && (
                        <button className="btn btn-sm btn-icon btn-link-danger shadow-none border-0" onClick={() => actions.onAsignarVip(promo)} title="Asignar Cliente">
                            <i className="ti ti-user-plus fs-5"></i>
                        </button>
                    )}
                    <div className="form-check form-switch m-0 d-none d-sm-block">
                        <input className="form-check-input" type="checkbox" checked={!!promo.estado} onChange={() => actions.onToggle(promo.id)} />
                    </div>
                    <button className="btn btn-sm btn-light-secondary border-0" onClick={() => actions.onManage(promo)} title="Gestionar"><i className="ti ti-ticket fs-5"></i></button>
                </div>
            </div>
        </div>
    </div>
));

const FilterBtn = React.memo(({ active, icon, label, onClick }: any) => (
    <button onClick={onClick} className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 border-0 fw-bold ${active ? 'btn-primary text-white shadow' : 'text-muted'}`}>
        <i className={icon}></i> <span className="d-none d-xl-inline">{label}</span>
    </button>
));

const PromoActionsDropdown = ({ promo, actions, light = false }: any) => (
    <div className="dropdown">
        <button className={`btn btn-link ${light ? 'text-white' : 'text-muted'} p-0 border-0 shadow-none`} data-bs-toggle="dropdown" type="button"><i className="ti ti-dots-vertical fs-4"></i></button>
        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 text-uppercase" style={{fontSize: '12px'}}>
            <li><button className="dropdown-item py-2 fw-bold" onClick={() => actions.onEdit(promo)}><i className="ti ti-settings me-2"></i>Editar Regla</button></li>
            <li><button className="dropdown-item py-2 fw-bold" onClick={() => actions.onManage(promo)}><i className="ti ti-chart-bar me-2"></i>Rendimiento</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item py-2 fw-bold text-danger" onClick={() => actions.onDelete(promo.id)}><i className="ti ti-trash me-2"></i>Eliminar</button></li>
        </ul>
    </div>
);