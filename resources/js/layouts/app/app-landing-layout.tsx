import { Link, usePage } from '@inertiajs/react';
interface AppLandingLayoutProps {
    children: React.ReactNode;
    comercio: any; 
}

export default function AppLandingLayout({ children, comercio }: AppLandingLayoutProps) {
    const sedePrincipal = comercio.sedes?.[0];
    const { url } = usePage();
    
    // 1. Extraemos los parámetros de la URL actual
    const params = new URLSearchParams(window.location.search);
    const empleadoId = params.get('empleado');
    const token = comercio.token;

    // 2. Definimos la lógica de la ruta "Home"
    // Si hay empleadoId, el destino principal es la agenda de citas
    const rutaHome = empleadoId 
        ? route('public.appointments', { token, empleado: empleadoId }) 
        : route('public.landing', { token });

    // 3. Verificamos si estamos en la página que corresponde al "Home" actual
    // Para iluminar el icono correctamente
    const esPaginaActiva = empleadoId 
        ? url.includes('/appointments') 
        : url.includes('/landing');

    return (
        <div className="layout-wrapper" style={{ backgroundColor: '#F2F2F2', minHeight: '100vh' }}>
            <div className="container-fluid p-0 d-flex justify-content-center">
                <div className="mobile-canvas shadow-lg" style={{ 
                    width: '100%', 
                    maxWidth: '500px', 
                    backgroundColor: '#F8F9FA', 
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    paddingBottom: '100px' // ESPACIO CRÍTICO: Evita que el contenido y el botón choquen con la nav
                }}>
                    

                    {/* HEADER: MODERN APP BAR STYLE */}
                    <div className="header-app-bar" style={{
                        background: 'linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%)',
                        borderBottomLeftRadius: '25px',
                        borderBottomRightRadius: '25px',
                        padding: '12px 20px',
                        boxShadow: '0 8px 20px rgba(36, 210, 219, 0.15)',
                        position: 'relative',
                        zIndex: 100
                    }}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-3" style={{ maxWidth: '80%' }}>
                                {/* Avatar circular con borde blanco sutil */}
                                <div className="flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm" style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#FFFFFF', // Fondo blanco sólido
                                    borderRadius: '50%',
                                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                                    color: '#1FBCC5', // Letra en el tono verde/turquesa del header
                                    fontWeight: '800',
                                    fontSize: '16px',
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)' // Sombra sutil para resaltar sobre el azul
                                }}>
                                    {comercio.nombre?.charAt(0)}
                                </div>

                                <div className="flex-grow-1 overflow-hidden">
                                    <div className="d-flex align-items-center gap-2">
                                        <h1 className="fw-bold text-white mb-0 text-truncate" style={{ 
                                            fontSize: '17px', 
                                            letterSpacing: '-0.3px' 
                                        }}>
                                            {comercio.nombre}👋
                                        </h1>
                                        <i className="ti ti-circle-check-filled text-white" style={{ fontSize: '14px', opacity: 0.8 }}></i>
                                    </div>
                                    
                                    {/* Info secundaria en una sola línea condensada */}
                                    <div className="d-flex align-items-center text-white-50" style={{ fontSize: '11px', marginTop: '1px' }}>
                                        <i className="ti ti-map-pin me-1" style={{ fontSize: '12px' }}></i>
                                        <span className="text-truncate" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                            {sedePrincipal?.ciudad} • {sedePrincipal?.direccion} • {sedePrincipal?.telefono}
                                        </span>  
                                    </div>
                                </div>
                            </div>

                            {/* Botón de acción rápido (Badge de tipo o icono de notificación) */}
                            <div className="d-flex align-items-center justify-content-center rounded-pill" style={{
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                padding: '4px 10px',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}>
                                <span className="text-white fw-bold" style={{ fontSize: '9px', textTransform: 'uppercase' }}>
                                {comercio.tipo || 'Comercio Aliado'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* CUERPO DE LA APP */}
                    <main className="app-body flex-grow-1" style={{ padding: '25px 20px', marginTop: '-20px', zIndex: 10 }}>
                        {children}
                    </main>


                    <div className="nav-container fixed-bottom mx-auto" style={{ maxWidth: '500px', zIndex: 1100 }}>
                        <nav style={{
                            backgroundColor: '#FFFFFF',
                            padding: '12px 10px 10px 10px',
                            borderTopLeftRadius: '25px',
                            borderTopRightRadius: '25px',
                            display: 'flex',
                            // Si hay empleado, usamos space-around para separar los dos botones
                            justifyContent: empleadoId ? 'space-around' : 'center',
                            alignItems: 'center',
                            boxShadow: '0 -8px 30px rgba(0,0,0,0.06)',
                            borderTop: '1px solid rgba(0,0,0,0.02)'
                        }}>
                            
                            {/* BOTÓN 1: HOME (Inicio o Agenda) */}
                            <Link 
                                href={rutaHome} 
                                className="d-flex flex-column align-items-center text-decoration-none"
                                style={{ 
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    width: '100px'
                                }}
                            >
                                <div style={{
                                    width: '15px', 
                                    height: '15px',
                                    borderRadius: '14px',
                                    backgroundColor: esPaginaActiva ? 'rgba(36, 210, 219, 0.12)' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    transform: esPaginaActiva ? 'scale(1.1)' : 'scale(1)',
                                    position: 'relative'
                                }}>
                                    <i className={empleadoId ? "ti ti-calendar-week" : "ti ti-smart-home"} 
                                    style={{ 
                                        color: esPaginaActiva ? '#24D2DB' : '#A0A0A0', 
                                        fontSize: '24px' 
                                    }}></i>
                                    
                                    {esPaginaActiva && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-20px',
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            backgroundColor: '#24D2DB'
                                        }}></div>
                                    )}
                                </div>
                                <span style={{ 
                                    fontSize: '10px', 
                                    fontWeight: '750', 
                                    color: esPaginaActiva ? '#24D2DB' : '#A0A0A0',
                                    marginTop: '4px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3px'
                                }}>
                                    {empleadoId ? 'Agenda' : 'Inicio'}
                                </span>
                            </Link>

                            {/* BOTÓN 2: LIQUIDACIÓN (Solo si es empleado) */}
                            {empleadoId && (
                                <Link 
                                    href={route('public.facturations', { token: token, empleado: empleadoId })} 
                                    className="d-flex flex-column align-items-center text-decoration-none"
                                    style={{ 
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        width: '100px'
                                    }}
                                >
                                    {/* Asumiendo que definas 'esPaginaLiquidacion' arriba con url.includes('/facturations') */}
                                    <div style={{
                                        width: '15px', 
                                        height: '15px',
                                        borderRadius: '14px',
                                        backgroundColor: url.includes('/facturations') ? 'rgba(36, 210, 219, 0.12)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s ease',
                                        transform: url.includes('/facturations') ? 'scale(1.1)' : 'scale(1)',
                                        position: 'relative'
                                    }}>
                                        <i className="ti ti-wallet" 
                                        style={{ 
                                            color: url.includes('/facturations') ? '#24D2DB' : '#A0A0A0', 
                                            fontSize: '24px' 
                                        }}></i>
                                        
                                        {url.includes('/facturations') && (
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '-20px',
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                backgroundColor: '#24D2DB'
                                            }}></div>
                                        )}
                                    </div>
                                    <span style={{ 
                                        fontSize: '10px', 
                                        fontWeight: '750', 
                                        color: url.includes('/facturations') ? '#24D2DB' : '#A0A0A0',
                                        marginTop: '4px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.3px'
                                    }}>
                                        Facturación
                                    </span>
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </div> 

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700;800&display=swap');
                
                body { background-color: #F2F2F2; font-family: 'Public Sans', sans-serif; margin: 0; }
                
                /* Ajuste para el botón de "Confirmar Cita" del componente hijo */
                .fixed-bottom.bg-white.p-3 {
                    bottom: 85px !important; /* Eleva el botón de reserva por encima de la nav */
                    width: 90% !important;
                    left: 5% !important;
                    right: 5% !important;
                    border-radius: 25px !important;
                    border: 1px solid rgba(0,0,0,0.05) !important;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                }

                .nav-link-home:active { transform: scale(0.9); }
                
                @media (max-width: 500px) {
                    .mobile-canvas { max-width: 100%; box-shadow: none; }
                }
            `}} />
        </div>
    );
}