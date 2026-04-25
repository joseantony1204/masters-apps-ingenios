import { Link, usePage, router } from '@inertiajs/react';
import AppMasterLogo from './app-master-logo';
import { useEffect, useState } from 'react';
import { type User } from '@/types';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';

export default function AppMasterSidebar() {
    const { props } = usePage<{ user: User }>();
    const user = props.user;
    const currentRoute = route().current();
    const cleanup = useMobileNavigation();
    
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(route().current('dashboard') || route().current('dashboard.*'));
    const [openModulo, setOpenModulo] = useState<number | null>(null);

    // EFECO PARA MANTENER ABIERTO EL MENÚ SEGÚN LA RUTA ACTUAL
    useEffect(() => {
        if (user?.modulos) {
            // Buscamos si la ruta actual pertenece a algún módulo
            const moduloActivo = user.modulos.find(modulo => 
                modulo.roles.some(rol => route().current(rol.ruta_name))
            );
            
            if (moduloActivo) {
                setOpenModulo(moduloActivo.id);
            }
        }
    }, [currentRoute, user]); // Se dispara cada vez que cambia la ruta

    useEffect(() => {
        const handleToggle = () => setIsMobileOpen(prev => !prev);
        window.addEventListener('toggle-sidebar-react', handleToggle);
        const unbind = router.on('finish', () => setIsMobileOpen(false));
        return () => {
            window.removeEventListener('toggle-sidebar-react', handleToggle);
            unbind();
        };
    }, []);

    const handleMenuClick = (e: React.MouseEvent, toggleFunc: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation(); 
        toggleFunc();
    };

    const toggleMenu = (e: React.MouseEvent, moduloId: number) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation(); // IMPORTANTE: Mantiene el escudo contra pcoded.js
        setOpenModulo(openModulo === moduloId ? null : moduloId);
    };

    return (
        <>
            {/* Overlay */}
            {isMobileOpen && (
                <div 
                    onClick={() => setIsMobileOpen(false)}
                    style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 1025 }}
                />
            )}

            <nav 
                className={`pc-sidebar ${isMobileOpen ? 'mob-sidebar-active' : ''}`}
                style={{
                    // Solo aplicamos left e inline styles si estamos en móvil (< 1025px)
                    left: window.innerWidth < 1025 ? (isMobileOpen ? '0' : '-280px') : undefined,
                    visibility: window.innerWidth < 1025 ? (isMobileOpen ? 'visible' : 'hidden') : 'visible',
                    transition: 'all 0.3s ease-in-out',
                    // Quitamos el display: block fijo para dejar que el CSS de la plantilla actúe en desktop
                    zIndex: 1030
                }}
            >
                <div className="navbar-wrapper">
                    <div className="m-header">
                        <Link href={route('dashboard')}><AppMasterLogo /></Link>
                    </div>
                    <div className="navbar-content">
                        <ul className="pc-navbar">
                            
                            {/* Dashboard */}
                            <li className={`pc-item pc-hasmenu ${(route().current('dashboard') || route().current('dashboard.*')) ? 'active pc-trigger' : ''} ${isOpen ? 'pc-trigger' : ''}`}>
                                <a 
                                    href="#!" 
                                    className="pc-link" 
                                    onClick={(e) => handleMenuClick(e, () => setIsOpen(!isOpen))}
                                >
                                    <span className="pc-micon"><i className="ti ti-dashboard"></i></span>
                                    <span className="pc-mtext">Dashboard</span>
                                    <span className="pc-arrow">
                                        <i className={`ti ${isOpen ? 'ti-chevron-down' : 'ti-chevron-right'}`}></i>
                                    </span>
                                </a>
                                <ul className="pc-submenu" style={{ display: isOpen ? 'block' : 'none' }}>
                                    <li className={`pc-item ${route().current('dashboard') ? 'active' : ''}`}>
                                        <Link href={route('dashboard')} className="pc-link">
                                            <span className="pc-micon"><i className='ti ti-home'></i></span>
                                            <span className="pc-mtext">Inicio</span>
                                        </Link>
                                    </li>
                                    <li className={`pc-item ${route().current('dashboard.analytics') ? 'active' : ''}`}>
                                        <Link href={route('dashboard.analytics')} className="pc-link">
                                            <span className="pc-micon"><i className='ti ti-device-analytics'></i></span>
                                            <span className="pc-mtext">Análisis</span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            {/* Módulos Dinámicos */}
                            {user?.modulos?.map((modulo) => {
                                const isMenuOpen = openModulo === modulo.id;

                                return (
                                    <li 
                                        key={modulo.id} 
                                        className={`pc-item pc-hasmenu ${isMenuOpen ? 'pc-trigger active' : ''}`}
                                    >
                                        <a href="#" className="pc-link" onClick={(e) => toggleMenu(e, modulo.id)}>
                                            <span className="pc-micon"><i className={`ti ${modulo?.icon || 'ti-circle'}`}></i></span>
                                            <span className="pc-mtext">{modulo?.nombre}</span>
                                            <span className="pc-arrow">
                                                <i className={`ti ${isMenuOpen ? 'ti-chevron-down' : 'ti-chevron-right'}`}></i>
                                            </span>
                                        </a>
                                        
                                        <ul className="pc-submenu" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                                            {modulo.roles.map((rol) => (
                                                <li key={rol.ruta_name} className={`pc-item ${route().current(rol.ruta_name) ? 'active' : ''}`}>
                                                    <Link href={route(rol.ruta_name)} className="pc-link">
                                                        <span className="pc-micon"><i className={`ti ${rol.icon || 'ti-circle'}`}></i></span>
                                                        <span className="pc-mtext">{rol.nombre}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                );
                            })}

                            <li className="pc-item mt-2">
                                <button onClick={() => router.post(route('logout'))} className="pc-link border-0 bg-transparent w-100 text-start text-danger">
                                    <span className="pc-micon"><i className="ti ti-power"></i></span>
                                    <span className="pc-mtext">Cerrar Sesión</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 1024px) {
                    .pc-sidebar { position: fixed !important; height: 100vh !important; top: 0; }
                }
                .pc-trigger > .pc-link .pc-arrow { transform: rotate(90deg); transition: all 0.3s; }
            `}} />
        </>
    );
}