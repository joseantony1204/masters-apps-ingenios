import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import photo_default from '/public/assets/images/user/default.png';  
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react'; // Importamos el hook para el estado

export default function AppMasterHeader() {
    const cleanup = useMobileNavigation();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Estado para el menú
    
    const { auth } = usePage().props as any;
    const user = auth?.user;

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        cleanup();
        router.post(route('logout'));
    };

    const toggleSidebar = (e: React.MouseEvent) => {
        e.preventDefault();
        document.body.classList.toggle('pc-sidebar-hide');
    };

    const toggleMobileMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        document.body.classList.toggle('mob-sidebar-active');
    };

    // Nueva función para el menú del usuario
    const toggleUserMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    return (
        <header className="pc-header">
            <div className="header-wrapper">
                <div className="me-auto pc-mob-drp">
                    <ul className="list-unstyled">
                      
                        {/* ICONO PARA ESCRITORIO (Desaparece en móviles por CSS de la plantilla) */}
                        <li className="pc-h-item pc-sidebar-collapse">
                            <a href="#" className="pc-head-link ms-0" id="sidebar-hide" onClick={toggleSidebar}>
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>

                        {/* ICONO PARA MÓVIL (Aparece solo en dispositivos pequeños) */}
                        <li className="pc-h-item pc-sidebar-popup">
                            <a href="#" className="pc-head-link ms-0" id="mobile-collapse" onClick={toggleMobileMenu}>
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
                        <li className={`dropdown pc-h-item header-user-profile ${isUserMenuOpen ? 'show' : ''}`}>
                            <a
                                className="pc-head-link dropdown-toggle arrow-none me-0"
                                href="#"
                                role="button"
                                onClick={toggleUserMenu} // Manejador de clic de React
                            >
                                <img 
                                    src={user?.foto || photo_default} 
                                    alt="user-image" 
                                    className="user-avtar" 
                                    style={{ objectFit: 'cover' }}
                                />
                                <span>{user?.nombreCompleto || user?.username}</span>
                            </a>
                            
                            {/* El menú ahora reacciona a la clase 'show' basada en el estado de React */}
                            <div className={`dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown ${isUserMenuOpen ? 'show' : ''}`} 
                                 style={{ position: 'absolute', inset: '0px 0px auto auto', margin: '0px', transform: isUserMenuOpen ? 'translate3d(-20px, 70px, 0px)' : 'none' }}>
                                
                                <div className="dropdown-header">
                                    <div className="d-flex mb-1">
                                        <div className="flex-shrink-0" style={{ width: '40px', height: '40px' }}> 
                                            <img 
                                                src={user?.foto || photo_default} 
                                                className="w-100 h-100 rounded-circle object-fit-cover" 
                                                alt="Foto perfil" 
                                            />
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-1">{user?.nombreCompleto || user?.username}</h6>
                                            <span className="f-12">{user?.personas?.email}</span>
                                        </div>
                                        <button onClick={handleLogout} className="btn btn-icon btn-link-danger">
                                            <i className="ti ti-power"></i>
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