import AppMainLayout from '@/layouts/app-main-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';

// Componentes de Secciones (Modales)
import Create from './sections/Create';
import AsignarVip from './sections/AsignarVip';
import GenerarLote from './sections/GenerarLote';
import GestionarCupones from './sections/GestionarCupones';

// --- INTERFACES ---
interface Promo {
    id: number;
    nombre: string;
    descripcion: string; //
    valor: number;
    tipo_descuento: 'porcentaje' | 'fijo';
    categoria: 'flash' | 'cumple' | 'vip' | 'general' | 'recurrente';
    usos_actuales: number;
    limite_total: number;
    fecha_fin?: string;
    estado: boolean;
    cupones?: any[];
}

interface Props {
    promociones: Promo[];
}

export default function Index({ promociones = [] }: Props) {
    const [filter, setFilter] = useState('todas');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isLoteOpen, setIsLoteOpen] = useState(false);
    const [promoVipSelected, setPromoVipSelected] = useState<Promo | null>(null);
    const [promoToEdit, setPromoToEdit] = useState<Promo | null>(null);
    const [promoToManage, setPromoToManage] = useState<Promo | null>(null);

    const filteredPromos = promociones.filter(p => {
        if (filter === 'todas') return true;
        return p.categoria === filter;
    });

    const handleDelete = (id: number) => {
        if (confirm('¿Eliminar esta campaña? Esto inactivará todos sus cupones asociados.')) {
            router.delete(route('cfpromociones.destroy', id));
        }
    };

    const handleToggleEstado = (id: number) => {
        router.patch(route('cfpromociones.toggle', id), {}, {
            preserveScroll: true,
            onSuccess: () => console.log("Estado actualizado")
        });
    };

    const actions = {
        onEdit: (p: Promo) => setPromoToEdit(p),
        onDelete: (id: number) => handleDelete(id),
        onManage: (p: Promo) => setPromoToManage(p),
        onAsignarVip: (p: Promo) => setPromoVipSelected(p),
        onToggle: (id: number) => handleToggleEstado(id)
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
                                <li className="breadcrumb-item" aria-current="page">campañas</li>
                            </ul>
                        </div>
                        <div className="col-md-12 d-flex justify-content-between align-items-center mt-2">
                            <h2 className="mb-0 fw-bold">Gestión de campañas</h2>
                            <button className="btn btn-primary shadow-sm d-flex align-items-center gap-2" onClick={() => setIsCreateOpen(true)}>
                                <i className="ti ti-plus fs-5"></i> Nueva Promoción
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <div className="d-flex align-items-center gap-2 bg-white p-1 rounded-pill shadow-sm border overflow-auto">
                    <FilterBtn active={filter === 'todas'} icon="ti ti-layout-grid" label="Todas" onClick={() => setFilter('todas')} />
                    <FilterBtn active={filter === 'cumple'} icon="ti ti-gift" label="Cumpleaños" onClick={() => setFilter('cumple')} />
                    <FilterBtn active={filter === 'recurrente'} icon="ti ti-recycle" label="Recurrentes" onClick={() => setFilter('recurrente')} />
                    <FilterBtn active={filter === 'flash'} icon="ti ti-bolt" label="Relámpago" onClick={() => setFilter('flash')} />
                    <FilterBtn active={filter === 'vip'} icon="ti ti-diamond" label="VIP" onClick={() => setFilter('vip')} />
                </div>

                <div className="d-flex align-items-center gap-2">
                    <div className="btn-group shadow-sm bg-white rounded">
                        <button className={`btn ${viewMode === 'grid' ? 'btn-primary text-white' : 'btn-light text-muted'}`} onClick={() => setViewMode('grid')}><i className="ti ti-layout-grid"></i></button>
                        <button className={`btn ${viewMode === 'list' ? 'btn-primary text-white' : 'btn-light text-muted'}`} onClick={() => setViewMode('list')}><i className="ti ti-list"></i></button>
                    </div>
                    <button className="btn btn-dark d-flex align-items-center gap-2" onClick={() => setIsLoteOpen(true)}>
                        <i className="ti ti-layers-intersect"></i> Lote
                    </button>
                </div>
            </div>

            <div className="row">
                {filteredPromos.map((promo) => (
                    <div className={viewMode === 'grid' ? "col-md-6 col-xl-4 mb-4" : "col-12 mb-2"} key={promo.id}>
                        <PromoDispatcher promo={promo} viewMode={viewMode} actions={actions} />
                    </div>
                ))}
            </div>

            {isCreateOpen && <Create onClose={() => setIsCreateOpen(false)} />}
            {promoToEdit && <Create promo={promoToEdit} onClose={() => setPromoToEdit(null)} />}
            {promoVipSelected && <AsignarVip promo={promoVipSelected} onClose={() => setPromoVipSelected(null)} />}
            {isLoteOpen && <GenerarLote promociones={promociones} onClose={() => setIsLoteOpen(false)} />}
            {promoToManage && <GestionarCupones promo={promoToManage} onClose={() => setPromoToManage(null)} />}
        </AppMainLayout>
    );
}

// --- COMPONENTES DE APOYO ---

const PromoActionsDropdown = ({ promo, actions, light = false }: { promo: Promo, actions: any, light?: boolean }) => (
    <div className="dropdown" style={{ zIndex: 10 }}>
        <button 
            className={`btn btn-link ${light ? 'text-white' : 'text-muted'} p-0 shadow-none border-0`} 
            data-bs-toggle="dropdown" 
            data-bs-boundary="viewport"
            type="button"
        >
            <i className="ti ti-dots-vertical fs-4"></i>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
            <li><button className="dropdown-item" onClick={() => actions.onEdit(promo)}><i className="ti ti-edit me-2"></i>Editar Regla</button></li>
            <li><button className="dropdown-item" onClick={() => actions.onManage(promo)}><i className="ti ti-chart-bar me-2"></i>Rendimiento</button></li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item text-danger" onClick={() => actions.onDelete(promo.id)}><i className="ti ti-trash me-2"></i>Eliminar</button></li>
        </ul>
    </div>
);

const ProgressBar = ({ promo }: { promo: any }) => {
    const actual = promo.cupones?.reduce((acc: number, cup: any) => acc + cup.usos_actuales, 0) || 0;
    const total = promo.cupones?.reduce((acc: number, cup: any) => acc + cup.limite_uso_total, 0) || 1;
    const porcentaje = Math.min((actual / total) * 100, 100);

    return (
        <div className="mt-4 w-100">
            <div className="d-flex justify-content-between small mb-1">
                <span className="fw-bold opacity-75 text-uppercase">Progreso de usos</span>
                <span className="fw-bold">{actual} / {total}</span>
            </div>
            <div className="progress" style={{ height: '6px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }}>
                <div 
                    className={`progress-bar ${porcentaje >= 90 ? 'bg-danger' : 'bg-primary'}`} 
                    style={{ width: `${porcentaje}%`, borderRadius: '10px' }}
                ></div>
            </div>
        </div>
    );
};

const FilterBtn = ({ active, icon, label, onClick }: any) => (
    <button onClick={onClick} className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 border-0 ${active ? 'btn-primary text-white shadow' : 'text-muted'}`}>
        <i className={icon}></i> <span>{label}</span>
    </button>
);

const PromoDispatcher = ({ promo, viewMode, actions }: { promo: Promo, viewMode: 'grid' | 'list', actions: any }) => {
    if (viewMode === 'list') return <PromoRow promo={promo} actions={actions} />;
    switch (promo.categoria) {
        case 'flash': return <CardFlash promo={promo} actions={actions} />;
        case 'cumple':  return <CardAuto promo={promo} actions={actions} />;
        case 'vip':   return <CardVip promo={promo} actions={actions} />;
        default:      return <CardGeneral promo={promo} actions={actions} />;
    }
};

// --- VISTA LISTA ---
const PromoRow = ({ promo, actions }: { promo: any, actions: any }) => {
    return (
        <div className="card border-0 shadow-sm mb-0 overflow-hidden">
            <div className="card-body py-3">
                <div className="row align-items-center text-uppercase">
                    <div className="col-auto">
                        <div className="p-2 bg-light rounded text-primary"><i className="ti ti-ticket fs-4"></i></div>
                    </div>
                    <div className="col">
                        <h6 className="mb-0 fw-bold">{promo.nombre}</h6>
                        <small className="text-muted small">{promo.categoria}</small>
                    </div>
                    <div className="col-auto text-center px-4 border-end border-start">
                        <h6 className="mb-0 fw-bold text-primary">{Number(promo.valor).toFixed(2)}%</h6>
                        <small className="text-muted x-small fw-bold">VALOR</small>
                    </div>
                    <div className="col-2 d-none d-md-block">
                        <ProgressBar promo={promo} />
                    </div>
                    <div className="col-auto d-flex align-items-center gap-1">
                        {promo.categoria === 'vip' && (
                            <button className="btn btn-sm btn-icon btn-link-danger shadow-none border-0" onClick={() => actions.onAsignarVip(promo)} title="Asignar Cliente">
                                <i className="ti ti-user-plus fs-5"></i>
                            </button>
                        )}
                        <button className="btn btn-sm btn-icon btn-link-secondary shadow-none border-0" onClick={() => actions.onEdit(promo)} title="Editar"><i className="ti ti-edit fs-5"></i></button>
                        <button className="btn btn-sm btn-icon btn-link-primary shadow-none border-0" onClick={() => actions.onManage(promo)} title="Gestionar"><i className="ti ti-ticket fs-5"></i></button>
                        <PromoActionsDropdown promo={promo} actions={actions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- VISTA GRID ---
const CardFlash = ({ promo, actions }: { promo: Promo, actions: any }) => (
    <div className="card border-0 shadow-sm h-100 border-top border-warning">
        <div className="card-body p-4 text-uppercase">
            <div className="d-flex justify-content-between mb-2">
                <div className="p-2 bg-warning rounded text-white shadow-sm"><i className="ti ti-bolt fs-4"></i></div>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-danger">¡EXPIRES PRONTO!</span>
                    <PromoActionsDropdown promo={promo} actions={actions} />
                </div>
            </div>
            <h6 className="text-muted small fw-bold mb-1">Campaña Temporal</h6>
            <h4 className="fw-bold text-dark mb-1">{promo.nombre}</h4>
            {promo.descripcion && <p className="text-muted small mb-3">{promo.descripcion}</p>}
            <div className="bg-light p-3 rounded-2 border d-flex align-items-center justify-content-between">
                <h2 className="fw-bold text-warning mb-0">{Number(promo.valor).toFixed(2)}%</h2>
                <div className="text-end small text-muted leading-tight">DESCUENTO<br/>LIMITADO</div>
            </div>
            <ProgressBar promo={promo} />
        </div>
        <div className="card-footer bg-white border-0 pt-0 pb-4 px-4 text-uppercase">
            <button className="btn btn-warning w-100 fw-bold text-dark rounded-2 shadow-sm" onClick={() => actions.onManage(promo)}>Gestionar Cupónes</button>
        </div>
    </div>
);

const CardAuto = ({ promo, actions }: { promo: Promo, actions: any }) => (
    <div className="card border-0 shadow-sm h-100 border-top border-primary">
        <div className="card-body p-4 text-center position-relative text-uppercase">
            <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="bg-light-info text-info p-3 rounded-circle shadow-sm mx-auto">
                    <i className="ti ti-gift fs-2"></i>
                </div>
                <div className="position-absolute top-0 end-0 p-3 d-flex align-items-center gap-2">
                    <div className="form-check form-switch m-0">
                        <input className="form-check-input" type="checkbox" role="switch" checked={promo.estado} onChange={() => actions.onToggle(promo.id)} />
                    </div>
                    <PromoActionsDropdown promo={promo} actions={actions} />
                </div>
            </div>
            <h5 className="fw-bold mt-3 mb-1">{promo.nombre}</h5>
            {promo.descripcion && <p className="text-muted small mb-2">{promo.descripcion}</p>}
            <h1 className="fw-bold text-info my-3">{Number(promo.valor).toFixed(2)}%</h1>
            <ProgressBar promo={promo} />
        </div>
        <div className="card-footer bg-white border-0 pt-0 pb-4 px-4 border-top text-uppercase">
             <button className="btn btn-outline-primary w-100 border-0 shadow-none fw-bold" onClick={() => actions.onManage(promo)}>
                {promo.categoria === 'cumple' ? 'Ver Cupones Emitidos' : 'Gestionar Cupones'}
             </button>
        </div>
    </div>
);

const CardVip = ({ promo, actions }: { promo: Promo, actions: any }) => (
    <div className="card border-0 shadow-sm h-100 border-top border-danger bg-dark text-white overflow-hidden">
        <div className="card-body p-4 position-relative z-1 text-uppercase">
            <div className="d-flex justify-content-between mb-3">
                <i className="ti ti-diamond text-danger fs-1"></i>
                <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light-danger text-danger border-0">MEMBRESÍA VIP</span>
                    <PromoActionsDropdown promo={promo} actions={actions} light={true} />
                </div>
            </div>
            <h3 className="fw-bold mb-1">VIP: {promo.nombre}</h3>
            {promo.descripcion && <p className="text-white-50 small mb-4">{promo.descripcion}</p>}
            <div className="d-flex align-items-baseline mb-4">
                <span className="display-4 fw-bold">{Number(promo.valor).toFixed(2)}%</span>
                <span className="text-danger fw-bold ms-2 fs-5">OFF</span>
            </div>
            <div className="p-2 bg-secondary bg-opacity-25 rounded border border-secondary mb-4 text-center">
                <code className="text-white x-small">Uso exclusivo clientes oro</code>
            </div>
            <ProgressBar promo={promo} />
        </div>
        <div className="card-footer bg-dark-subtle border-0 pt-0 pb-4 px-4 d-grid text-uppercase">
            <button className="btn btn-danger btn-sm fw-bold shadow-none" onClick={() => actions.onAsignarVip(promo)}>
                <i className="ti ti-user-plus me-1"></i> Asignar Cliente
            </button>
        </div>
    </div>
);

// --- CARD RECURRENTE / GENERAL ---
const CardGeneral = ({ promo, actions }: { promo: Promo, actions: any }) => (
    <div className="card border-0 shadow-sm h-100 border-top border-primary">
        <div className="card-body p-4 text-uppercase position-relative">
            <div className="d-flex justify-content-between mb-3">
                <div className="bg-light-primary text-primary p-2 rounded shadow-sm">
                    <i className="ti ti-ticket fs-3"></i>
                </div>
                {/* Switch de Activo para Recurrente/General */}
                <div className="d-flex align-items-center gap-2">
                    <div className="form-check form-switch m-0">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch" 
                            checked={promo.estado} 
                            onChange={() => actions.onToggle(promo.id)} 
                        />
                    </div>
                    <PromoActionsDropdown promo={promo} actions={actions} />
                </div>
            </div>
            <h5 className="fw-bold mb-1">{promo.nombre}</h5>
            {promo.descripcion && <p className="text-muted small mb-3">{promo.descripcion}</p>}
            <h1 className="fw-bold text-primary my-3">{Number(promo.valor).toFixed(2)}%</h1>
            <ProgressBar promo={promo} />
        </div>
        <div className="card-footer bg-white border-0 pt-0 pb-4 px-4 border-top text-uppercase">
             <button className="btn btn-outline-primary w-100 border-0 shadow-none fw-bold" onClick={() => actions.onManage(promo)}>
                {promo.categoria === 'recurrente' ? 'Ver Cupones Emitidos' : 'Gestionar Cupones'}
             </button>
        </div>
    </div>
);