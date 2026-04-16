import { Link, router, usePage } from '@inertiajs/react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import photo_default from '/public/assets/images/user/default.png';  

export default function AppMasterHeader() {
    const cleanup = useMobileNavigation();
    
    // Obtenemos el usuario autenticado desde los props compartidos de Inertia
    const { auth } = usePage().props as any;
    const user = auth?.user;
    //console.log("mostrando",user)

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        cleanup();
        // Usamos el router de Inertia para hacer el POST de logout
        router.post(route('logout'));
    };

    const toggleSidebar = (e: React.MouseEvent) => {
        e.preventDefault();
        document.body.classList.toggle('pc-sidebar-hide');
    };

    return (
        <header className="pc-header">
            <div className="header-wrapper">
                <div className="me-auto pc-mob-drp">
                    <ul className="list-unstyled">
                        <li className="pc-h-item pc-sidebar-collapse">
                            <a href="#" className="pc-head-link ms-0" onClick={toggleSidebar}>
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>
                        <li className="pc-h-item d-none d-md-inline-flex">
                            <form className="header-search">
                                <i data-feather="search" className="icon-search"></i>
                                <input type="search" className="form-control" placeholder="Búsqueda aquí. . ." />
                            </form>
                        </li>
                    </ul>
                </div>

                <div className="ms-auto">
                    <ul className="list-unstyled">
                        {/* Notificaciones (Opcional, lo dejé igual) */}
                        <li className="dropdown pc-h-item">
                            <a className="pc-head-link dropdown-toggle arrow-none me-0" data-bs-toggle="dropdown" href="#" role="button">
                                <i className="ti ti-mail"></i>
                            </a>
                        </li>

                        {/* PERFIL DE USUARIO */}
                        <li className="dropdown pc-h-item header-user-profile">
                            <a
                                className="pc-head-link dropdown-toggle arrow-none me-0"
                                data-bs-toggle="dropdown"
                                href="#"
                                role="button"
                                aria-haspopup="false"
                                data-bs-auto-close="outside"
                                aria-expanded="false"
                            >
                                {user?.foto ? (
                                    // 2. Si hay una foto guardada en el servidor
                                    <img 
                                        src={`${user?.foto}`} 
                                        className="w-100 h-100 object-fit-cover" 
                                        alt="Foto perfil" 
                                    />
                                ) : (
                                    // 3. FALLBACK: Si no hay nada, usamos la lógica de sexo o el default (avatar10)
                                    <img src={photo_default} alt="user-image" className="user-avtar" />
                                    
                                )}
                                {/* NOMBRE DEL USUARIO LOGUEADO */}
                                <span>{user?.nombreCompleto || user?.username}</span>
                            </a>
                            <div className="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
                                <div className="dropdown-header">
                                    <div className="d-flex mb-1">
                                        <div className="flex-shrink-0" style={{ width: '48px', height: '48px' }}> 
                                            {user?.foto ? (
                                                // 2. Si hay una foto guardada en el servidor
                                                <img 
                                                    src={`${user?.foto}`} 
                                                    className="w-100 h-100 object-fit-cover" 
                                                    alt="Foto perfil" 
                                                />
                                            ) : (
                                                // 3. FALLBACK: Si no hay nada, usamos la lógica de sexo o el default (avatar10)
                                                <img src={photo_default} alt="user-image" className="user-avtar" />
                                                
                                            )}
                                        </div>
                                        
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-1">{user?.nombreCompleto || user?.username}</h6>
                                            <span>{user?.personas.email}</span>
                                        </div>
                                        {/* BOTÓN LOGOUT RÁPIDO */}
                                        <button onClick={handleLogout} className="pc-head-link bg-transparent border-0">
                                            <i className="ti ti-power text-danger"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <ul className="nav drp-tabs nav-fill nav-tabs" id="mydrpTab" role="tablist">
                                    <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#drp-tab-1" type="button" role="tab">
                                            <i className="ti ti-user"></i> Perfil
                                        </button>
                                    </li>
                                    <li className="nav-item">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#drp-tab-2" type="button" role="tab">
                                            <i className="ti ti-settings"></i> Ajustes
                                        </button>
                                    </li>
                                </ul>

                                <div className="tab-content" id="mysrpTabContent">
                                    <div className="tab-pane fade show active" id="drp-tab-1" role="tabpanel">
                                        <a href="#!" className="dropdown-item">
                                            <i className="ti ti-user"></i>
                                            <span>Mi Perfil</span>
                                        </a>
                                        <a href="#!" className="dropdown-item">
                                            <i className="ti ti-wallet"></i>
                                            <span>Facturación</span>
                                        </a>
                                        {/* LOGOUT FINAL ABAJO */}
                                        <button onClick={handleLogout} className="dropdown-item text-danger border-0 bg-transparent w-100 text-start">
                                            <i className="ti ti-power"></i>
                                            <span>Cerrar Sesión</span>
                                        </button>
                                    </div>
                                    <div className="tab-pane fade" id="drp-tab-2" role="tabpanel">
                                        <a href="#!" className="dropdown-item">
                                            <i className="ti ti-lock"></i>
                                            <span>Privacidad</span>
                                        </a>
                                        <a href="#!" className="dropdown-item">
                                            <i className="ti ti-messages"></i>
                                            <span>Soporte</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}