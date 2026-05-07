import { router } from '@inertiajs/react';

interface Props {
    cfpersonascomercios: any[]; 
}

export default function GestionAccesosLista({ cfpersonascomercios }: Props) {

    const toggleEstado = (id: number) => {
        router.post(route('cfpersonascomercios.toggle', id), {
            //onSuccess: () => {}, // Opcional: Notificación de éxito
        }, {
            preserveScroll: true,
        });
    };

    return (
        <div className="d-flex flex-column gap-3">
            {cfpersonascomercios.map((item) => (
                <div 
                    key={item.id} 
                    className="card mb-0 border shadow-none rounded-3 overflow-hidden transition-all hover-border-primary"
                >
                    <div className="card-body p-3">
                        <div className="row align-items-center g-3">
                            
                            {/* 1. PERFIL Y DATOS BÁSICOS */}
                            <div className="col-lg-4 col-md-6">
                                <div className="d-flex align-items-center">
                                    <div className="position-relative">
                                        <div className="avtar avtar-lg bg-light-primary text-primary rounded-3">
                                            {item.personasnaturales?.nombre?.charAt(0)}
                                            {item.personasnaturales?.apellido?.charAt(0)}
                                        </div>
                                        <span className={`position-absolute top-0 start-100 translate-middle p-1 border border-light rounded-circle ${item.admincomercios?.activo === 1 ? 'bg-success' : 'bg-danger'}`}>
                                            <span className="visually-hidden">Estado</span>
                                        </span>
                                    </div>
                                    <div className="ms-3">
                                        <h6 className="mb-0 fw-bold">{item.personasnaturales?.nombrecompleto}</h6>
                                        <div className="text-muted small d-flex align-items-center">
                                            <i className="ti ti-mail me-1"></i> {item.email}
                                        </div>
                                        <div className="text-muted small">
                                            <i className="ti ti-phone me-1"></i> {item.telefonomovil}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. COMERCIO ASIGNADO */}
                            <div className="col-lg-4 col-md-6 border-start-lg border-light">
                                <div className="ps-lg-3">
                                    <span className="text-muted small d-block mb-1 text-uppercase fw-semibold tracking-wider">Negocio Vinculado</span>
                                    {item.admincomercios ? (
                                        <div className="d-flex align-items-center">
                                            <div className="bg-light-secondary rounded-2 p-2 me-2">
                                                <i className="ti ti-building-store text-dark fs-5"></i>
                                            </div>
                                            <div>
                                                <span className="fw-bold text-dark d-block">{item.admincomercios.comercios?.nombre}</span>
                                                <span className="text-muted extra-small">Token ID: {item.admincomercios.comercios?.token.slice(0, 12)}...</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-warning small italic"><i className="ti ti-info-circle"></i> Sin asignación</span>
                                    )}
                                </div>
                            </div>

                            {/* 3. SWITCH DE ACCESO */}
                            <div className="col-lg-2 col-md-6 text-lg-center">
                                <span className="text-muted small d-block mb-2">Acceso al Panel</span>
                                {item.admincomercios && (
                                    <div className="form-check form-switch d-inline-flex align-items-center justify-content-center p-0 m-0">
                                        <span className={`me-2 small fw-bold ${item.admincomercios.activo === 1 ? 'text-success' : 'text-muted'}`}>
                                            {item.admincomercios.activo === 1 ? 'Activo' : 'Off'}
                                        </span>
                                        <input
                                            className="form-check-input ms-0 cursor-pointer"
                                            type="checkbox"
                                            role="switch"
                                            checked={item.admincomercios.activo === 1}
                                            onChange={() => toggleEstado(item.admincomercios.id)}
                                            style={{ width: '40px', height: '20px' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* 4. ACCIONES */}
                            <div className="col-lg-2 col-md-6 text-end">
                                <div className="dropdown d-inline-block">
                                    <button 
                                        className="btn btn-light-secondary btn-sm rounded-2 me-2"
                                        onClick={() => router.visit(route('personas.show', item.id))}
                                    >
                                        <i className="ti ti-user-edit me-1"></i> Perfil
                                    </button>
                                    <button className="btn btn-icon btn-sm btn-light-danger border-0">
                                        <i className="ti ti-trash"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ))}

            
        </div>
    );
}