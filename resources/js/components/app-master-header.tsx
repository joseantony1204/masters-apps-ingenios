import { Link, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';

export default function AppMasterHeader() {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const toggleSidebar = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log("Cliqued Desktop Toggle");
        const body = document.body;
    
        // Intentaremos las 3 variantes más comunes de Mantis/Dashboard:
        
        // 1. Variante estándar de Mantis (Ocultar por completo)
        if (body.classList.contains('pc-sidebar-hide')) {
            body.classList.remove('pc-sidebar-hide');
        } else {
            body.classList.add('pc-sidebar-hide');
        }
    
        // 2. Variante "Collapsed" (Solo iconos)
        // Algunas versiones usan esta clase para encogerlo en lugar de ocultarlo
        if (body.classList.contains('pc-sidebar-collapsed')) {
            body.classList.remove('pc-sidebar-collapsed');
        } else {
            body.classList.add('pc-sidebar-collapsed');
        }
    
        // 3. Variante "Mantis-Modern" (Afecta al contenedor principal)
        // A veces el estado se controla en un div con id #pc-sidebar
        const sidebar = document.querySelector('.pc-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('pc-sidebar-hide');
        }
    };

    return (
        <>
            <header className="pc-header">
                <div className="header-wrapper"> 
                <div className="me-auto pc-mob-drp">
                <ul className="list-unstyled">
                   
                    <li className="pc-h-item pc-sidebar-collapse">
                    <a href="#" className="pc-head-link ms-0" id="sidebar-hide">
                        <i className="ti ti-menu-2"></i>
                    </a>
                    </li>
                    <li className="pc-h-item pc-sidebar-popup">
                    <a href="#" className="pc-head-link ms-0" id="mobile-collapse">
                        <i className="ti ti-menu-2"></i>
                    </a>
                    </li>
                    <li className="dropdown pc-h-item d-inline-flex d-md-none">
                    <a
                        className="pc-head-link dropdown-toggle arrow-none m-0"
                        data-bs-toggle="dropdown"
                        href="#"
                        role="button"
                        aria-haspopup="false"
                        aria-expanded="false"
                    >
                        <i className="ti ti-search"></i>
                    </a>
                    <div className="dropdown-menu pc-h-dropdown drp-search">
                        <form className="px-3">
                        <div className="form-group mb-0 d-flex align-items-center">
                            <i data-feather="search"></i>
                            <input type="search" className="form-control border-0 shadow-none" placeholder="Busqueda aqui. . ."></input>
                        </div>
                        </form>
                    </div>
                    </li>
                    <li className="pc-h-item d-none d-md-inline-flex">
                    <form className="header-search">
                        <i data-feather="search" className="icon-search"></i>
                        <input type="search" className="form-control" placeholder="Busqueda aqui. . ."></input>
                    </form>
                    </li>
                </ul>
                </div>
             
                <div className="ms-auto">
                <ul className="list-unstyled">
                    <li className="dropdown pc-h-item">
                    <a
                        className="pc-head-link dropdown-toggle arrow-none me-0"
                        data-bs-toggle="dropdown"
                        href="#"
                        role="button"
                        aria-haspopup="false"
                        aria-expanded="false"
                    >
                        <i className="ti ti-mail"></i>
                    </a>
                    <div className="dropdown-menu dropdown-notification dropdown-menu-end pc-h-dropdown">
                        <div className="dropdown-header d-flex align-items-center justify-content-between">
                        <h5 className="m-0">Message</h5>
                        <a href="#!" className="pc-head-link bg-transparent"><i className="ti ti-x text-danger"></i></a>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="dropdown-header px-0 text-wrap header-notification-scroll position-relative">
                        <div className="list-group list-group-flush w-100">
                            <a className="list-group-item list-group-item-action">
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                <img src={avatar1} alt="user-image" className="user-avtar"></img>
                                </div>
                                <div className="flex-grow-1 ms-1">
                                <span className="float-end text-muted">3:00 AM</span>
                                <p className="text-body mb-1">It's <b>Cristina danny's</b> birthday today.</p>
                                <span className="text-muted">2 min ago</span>
                                </div>
                            </div>
                            </a>
                            <a className="list-group-item list-group-item-action">
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <img src={avatar1} alt="user-image" className="user-avtar"></img>
                                </div>
                                <div className="flex-grow-1 ms-1">
                                <span className="float-end text-muted">6:00 PM</span>
                                <p className="text-body mb-1"><b>Aida Burg</b> commented your post.</p>
                                <span className="text-muted">5 August</span>
                                </div>
                            </div>
                            </a>
                            <a className="list-group-item list-group-item-action">
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <img src={avatar1} alt="user-image" className="user-avtar"></img>
                                </div>
                                <div className="flex-grow-1 ms-1">
                                <span className="float-end text-muted">2:45 PM</span>
                                <p className="text-body mb-1"><b>There was a failure to your setup.</b></p>
                                <span className="text-muted">7 hours ago</span>
                                </div>
                            </div>
                            </a>
                            <a className="list-group-item list-group-item-action">
                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <img src={avatar1} alt="user-image" className="user-avtar"></img>
                                </div>
                                <div className="flex-grow-1 ms-1">
                                <span className="float-end text-muted">9:10 PM</span>
                                <p className="text-body mb-1"><b>Cristina Danny </b> invited to join <b> Meeting.</b></p>
                                <span className="text-muted">Daily scrum meeting time</span>
                                </div>
                            </div>
                            </a>
                        </div>
                        </div>
                        <div className="dropdown-divider"></div>
                        <div className="text-center py-2">
                        <a href="#!" className="link-primary">View all</a>
                        </div>
                    </div>
                    </li>
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
                    <img src={avatar1} alt="user-image" className="user-avtar"></img>
                        <span>Stebin Ben</span>
                    </a>
                    <div className="dropdown-menu dropdown-user-profile dropdown-menu-end pc-h-dropdown">
                        <div className="dropdown-header">
                        <div className="d-flex mb-1">
                            <div className="flex-shrink-0">
                            <img src={avatar1}alt="user-image" className="user-avtar"></img>
                            </div>
                            <div className="flex-grow-1 ms-3">
                            <h6 className="mb-1">Stebin Ben</h6>
                            <span>UI/UX Designer</span>
                            </div>
                            <Link className="pc-head-link bg-transparent" method="post" href={route('logout')} onClick={handleLogout}>
                                <i className="ti ti-power text-danger"></i>
                            </Link>
                        </div>
                        </div>
                        <ul className="nav drp-tabs nav-fill nav-tabs" id="mydrpTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button
                            className="nav-link active"
                            id="drp-t1"
                            data-bs-toggle="tab"
                            data-bs-target="#drp-tab-1"
                            type="button"
                            role="tab"
                            aria-controls="drp-tab-1"
                            aria-selected="true"
                            ><i className="ti ti-user"></i> Profile</button >
                        </li>
                        <li className="nav-item" role="presentation">
                            <button
                            className="nav-link"
                            id="drp-t2"
                            data-bs-toggle="tab"
                            data-bs-target="#drp-tab-2"
                            type="button"
                            role="tab"
                            aria-controls="drp-tab-2"
                            aria-selected="false"
                            ><i className="ti ti-settings"></i> Setting</button>
                        </li>
                        </ul>
                        <div className="tab-content" id="mysrpTabContent">
                        <div className="tab-pane fade show active" id="drp-tab-1" role="tabpanel" aria-labelledby="drp-t1">
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-edit-circle"></i>
                            <span>Edit Profile</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-user"></i>
                            <span>View Profile</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-clipboard-list"></i>
                            <span>Social Profile</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-wallet"></i>
                            <span>Billing</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-power"></i>
                            <span>Logout</span>
                            </a>
                        </div>
                        <div className="tab-pane fade" id="drp-tab-2" role="tabpanel" aria-labelledby="drp-t2">
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-help"></i>
                            <span>Support</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-user"></i>
                            <span>Account Settings</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-lock"></i>
                            <span>Privacy Center</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-messages"></i>
                            <span>Feedback</span>
                            </a>
                            <a href="#!" className="dropdown-item">
                            <i className="ti ti-list"></i>
                            <span>History</span>
                            </a>
                        </div>
                        </div>
                    </div>
                    </li>
                </ul>
                </div>
                </div>
                </header>
        </>
    );
}
