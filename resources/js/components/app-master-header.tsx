import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react'; 
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import photo_default from '/public/assets/images/user/default.png';  

export default function AppMasterHeader() {
    const cleanup = useMobileNavigation();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const menuRef = useRef<HTMLLIElement>(null);

    const { auth } = usePage().props as any;
    const user = auth?.user;

    // Cierra el menú de usuario si haces clic fuera de él
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isUserMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    /**
     * Colapso de Sidebar en Escritorio
     */
    const toggleSidebar = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Detenemos el evento inmediato para que scripts externos no lo reviertan
        e.nativeEvent.stopImmediatePropagation();
        document.body.classList.toggle('pc-sidebar-hide');
    };

    /**
     * Apertura de Sidebar en Móvil
     * Enviamos un CustomEvent que escucha el AppMasterSidebar
     */
    const toggleMobileMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); 
        e.nativeEvent.stopImmediatePropagation(); 
        
        // Disparamos el evento que nuestro Sidebar (React) entiende
        window.dispatchEvent(new CustomEvent('toggle-sidebar-react'));
    };

    const toggleUserMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        cleanup();
        setIsUserMenuOpen(false);
        router.post(route('logout'));
    };

    return (
        <header className="pc-header">
            <div className="header-wrapper">
                <div className="me-auto pc-mob-drp">
                    <ul className="list-unstyled">
                      
                        {/* ICONO PARA ESCRITORIO (Collapse) */}
                        <li className="pc-h-item pc-sidebar-collapse">
                            <a href="#" className="pc-head-link ms-0" onClick={toggleSidebar}>
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>

                        {/* ICONO PARA MÓVIL (Popup) */}
                        <li className="pc-h-item pc-sidebar-popup">
                            <a href="#" className="pc-head-link ms-0" onClick={toggleMobileMenu}>
                                <i className="ti ti-menu-2"></i>
                            </a>
                        </li>
                        <li className="pc-h-item d-none d-md-inline-flex">
                            <form className="header-search">
                                {/* Cambiamos data-feather por la clase de Tabler Icons */}
                                <i className="ph-duotone ph-magnifying-glass icon-search"></i>
                                <input type="search" className="form-control" placeholder="Búsqueda aquí. . ." />
                            </form>
                        </li>

                    </ul>
                </div>

                <div className="ms-auto">
                    <ul className="list-unstyled">
                        {/* Home / Links rápidos */}
                        <li className="dropdown pc-h-item">
                            <Link className="pc-head-link arrow-none me-0" href={route('dashboard')}>
                                <i className="ti ti-home"></i>
                            </Link>
                        </li>

                        {/* MENÚ DE PERFIL DE USUARIO */}
                        <li 
                            ref={menuRef}
                            className={`dropdown pc-h-item header-user-profile ${isUserMenuOpen ? 'show' : ''}`}
                        >
                            <a
                                className="pc-head-link dropdown-toggle arrow-none me-0"
                                href="#"
                                onClick={toggleUserMenu}
                            >
                                <img src={user?.foto || photo_default} className="user-avtar" alt="user" />
                                <span>{user?.nombreCompleto}</span>
                            </a>
                            
                            <div 
                                className={`dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown ${isUserMenuOpen ? 'show' : ''}`} 
                                style={{ 
                                    display: isUserMenuOpen ? 'block' : 'none',
                                    position: 'absolute',
                                    inset: '0px 0px auto auto',
                                    transform: 'translate3d(-20px, 70px, 0px)'
                                }}
                            >
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
                                            <h6 className="mb-1">{user?.nombreCompleto}</h6>
                                            <span className="f-12">{user?.personas?.email}</span>
                                        </div>
                                        <button onClick={handleLogout} className="btn btn-icon btn-link-danger border-0 bg-transparent">
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
                                        <Link href={route('scsuscripciones.index')} className="dropdown-item">
                                            <i className="ti ti-wallet"></i>
                                            <span>Facturación</span>
                                        </Link>
                                        <div className="dropdown-divider"></div>
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