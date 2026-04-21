import { Link } from '@inertiajs/react';

interface AppLandingLayoutProps {
    children: React.ReactNode;
    comercio: any; 
}

export default function AppLandingLayout({ children, comercio }: AppLandingLayoutProps) {
    const sedePrincipal = comercio.sedes?.[0];

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
                    
                    {/* HEADER */}
                    <div className="header-barber" style={{
                        background: 'linear-gradient(180deg, #24D2DB 0%, #1FBCC5 100%)',
                        borderBottomLeftRadius: '40px',
                        borderBottomRightRadius: '40px',
                        padding: '20px 25px 20px 25px',
                        boxShadow: '0 10px 30px rgba(36, 210, 219, 0.25)',
                        position: 'relative',
                        zIndex: 5
                    }}>
                        <div className="business-info">
                            <span className="badge mb-2" style={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.25)', 
                                backdropFilter: 'blur(8px)',
                                color: '#FFFFFF', padding: '6px 14px', borderRadius: '10px', fontSize: '10px'
                            }}>
                                {comercio.tipo || 'Comercio Aliado'}
                            </span>
                            <h2 className="fw-bold text-white mb-2" style={{ fontSize: '30px' }}>
                                {comercio.nombre} 👋
                            </h2>
                            <div className="d-flex align-items-center flex-wrap gap-3" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px' }}>
                                <div className="d-flex align-items-center">
                                    <i className="ti ti-map-pin me-1"></i>
                                    <span className="text-truncate" style={{ maxWidth: '140px' }}>{sedePrincipal?.direccion}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="ti ti-building-skyscraper me-1"></i>
                                    <span>{sedePrincipal?.ciudad}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <i className="ti ti-phone me-1"></i>
                                    <span>{sedePrincipal?.telefono}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CUERPO DE LA APP */}
                    <main className="app-body flex-grow-1" style={{ padding: '25px 20px', marginTop: '-20px', zIndex: 10 }}>
                        {children}
                    </main>

                    {/* NAVEGACIÓN INFERIOR ESTILO "FLOTANTE" */}
                    <div className="nav-container fixed-bottom mx-auto" style={{ maxWidth: '500px', zIndex: 1100 }}>
                        <nav style={{
                            backgroundColor: '#FFFFFF',
                            margin: '0 0px',
                            padding: '25px 10px 25px 10px',
                            borderTopLeftRadius: '30px',
                            borderTopRightRadius: '30px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.08)',
                            borderTop: '1px solid rgba(0,0,0,0.03)'
                        }}>
                            <Link href={route('public.landing', { token: comercio.token })} 
                                  className="nav-link-home d-flex align-items-center justify-content-center"
                                  style={{
                                      width: '55px',
                                      height: '5px',
                                      borderRadius: '20px',
                                      backgroundColor: 'rgba(36, 210, 219, 0.08)',
                                      transition: '0.3s ease'
                                  }}>
                                <i className="ti ti-home-2" style={{ color: '#24D2DB', fontSize: '28px' }}></i>
                            </Link>
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