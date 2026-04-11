import { Link, usePage } from '@inertiajs/react';
import AppMasterLogo from './app-master-logo';
import { useEffect, useState } from 'react'; // 1. Agregamos useState
import { type User } from '@/types';

// 1. SOLUCIÓN AL ERROR DE TYPESCRIPT: 
// Declaramos la propiedad feather para que TS no se queje
declare global {
    interface Window {
        feather: any;
    }
}

export default function AppMasterSidebar() {
    const { props } = usePage<{ user: User }>();
    const user = props.user;
    const currentRoute = route().current();
  
    // Detectamos si es la ruta exacta 'dashboard' O cualquier sub-ruta 'dashboard.*'
    const [isOpen, setIsOpen] = useState(route().current('dashboard') || route().current('dashboard.*'));

    // O si quieres ser más específico:
    // const [isOpen, setIsOpen] = useState(route().current('dashboard') || route().current('dashboard.analytics'));

    // 2. Estado para controlar qué módulo está desplegado
    const [openModulo, setOpenModulo] = useState<number | null>(null);

    useEffect(() => {
        if (window.feather) {
            window.feather.replace();
        }
        // Inicializar el módulo abierto si la ruta actual está dentro de uno
        user?.modulos?.forEach((modulo) => {
            if (modulo.roles.some(rol => rol.ruta_name === currentRoute)) {
                setOpenModulo(modulo.id);
            }
        });
    }, [currentRoute, user]);

    // 3. Función para alternar el menú
    const toggleMenu = (e: React.MouseEvent, moduloId: number) => {
        e.preventDefault();
        setOpenModulo(openModulo === moduloId ? null : moduloId);
    };

    return (
        <nav className="pc-sidebar">
            <div className="navbar-wrapper">
                <div className="m-header">
                    <Link href={route('dashboard')} prefetch>
                        <AppMasterLogo className="custom-class" alt="Masters Apps Ingenios" />
                    </Link>
                </div>
                <div className="navbar-content">
                    <ul className="pc-navbar">
                       
                        <li className={`pc-item pc-hasmenu ${(route().current('dashboard') || route().current('dashboard.*')) ? 'active pc-trigger' : ''} ${isOpen ? 'pc-trigger' : ''}`}>
                            <a 
                                href="#!" 
                                className="pc-link" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsOpen(!isOpen);
                                }}
                            >
                                <span className="pc-micon">
                                    <i className="ti ti-dashboard"></i>
                                </span>
                                <span className="pc-mtext">Dashboard</span>
                                <span className="pc-arrow">
                                    {/* Usamos el estado isOpen para rotar la flecha */}
                                    <i className={`ti ${isOpen ? 'ti-chevron-down' : 'ti-chevron-right'}`}></i>
                                </span>
                            </a>

                            <ul className="pc-submenu" style={{ display: isOpen ? 'block' : 'none' }}>
                                {/* Aquí es donde se activa "Default" cuando entras a Dashboard */}
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

                        {user?.modulos?.map((modulo) => {
                            const isModuloActive = modulo.roles.some(rol => rol.ruta_name === currentRoute);
                            const isMenuOpen = openModulo === modulo.id;

                            return (
                                <li 
                                    key={modulo.id} 
                                    className={`pc-item pc-hasmenu ${isMenuOpen ? 'pc-trigger active' : ''} ${isModuloActive ? 'pc-active' : ''}`}
                                >
                                    {/* 4. Agregamos el onClick aquí */}
                                    <a href="#" className="pc-link" onClick={(e) => toggleMenu(e, modulo.id)}>
                                        <span className="pc-micon"><i className="ti ti-menu"></i></span>
                                        <span className="pc-mtext">{modulo?.nombre}</span>
                                        <span className="pc-arrow">
                                            <i className={`ti ${isMenuOpen ? 'ti-chevron-down' : 'ti-chevron-right'}`}></i>
                                        </span>
                                    </a>
                                    
                                    {/* 5. Controlamos la visibilidad con el estado */}
                                    <ul className="pc-submenu" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                                        {modulo.roles.map((rol) => {
                                            const isActive = rol.ruta_name === currentRoute;
                                            return (
                                                <li key={rol.ruta} className={`pc-item ${isActive ? 'active' : ''}`}>
                                                    <Link href={rol.ruta} className="pc-link">
                                                        <span className="pc-micon"><i className={rol.icon}></i></span>
                                                        <span className="pc-mtext">{rol?.nombre}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </li>
                            );
                        })}

                        <li className={`pc-item ${currentRoute === 'cfmaestra.index' ? 'active' : ''}`}>
                            <Link href={route('cfmaestra.index')} className="pc-link">
                                <span className="pc-micon"><i className="ti ti-brand-chrome"></i></span>
                                <span className="pc-mtext">Maestra</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}