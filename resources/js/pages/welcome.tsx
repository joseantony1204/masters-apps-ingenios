import LandingMainLayout from '@/layouts/landing-main-layout';
import { Link } from '@inertiajs/react';
import AppMasterLogo from '@/components/app-master-logo';

export default function Welcome() {
    const brandBlue = '#0066ff';
    const deepNavy = '#0f172a';

    return (
        <LandingMainLayout title="Vantify | El Sistema Operativo para tu Comercio">
            
            {/* --- NAVBAR SUPERIOR --- */}
            <nav className="d-flex justify-content-between align-items-center py-4 border-bottom mb-2">
                <div className="d-flex align-items-center gap-2">
                    <Link href={route('dashboard')} prefetch>
                        <AppMasterLogo className="custom-class" alt="Masters Apps Ingenios" />
                    </Link>
                </div>
                <div className="d-flex gap-2">
                    <Link href={route('login')} className="btn btn-link text-dark fw-bold text-decoration-none px-4">INGRESA AQUI</Link>
                    <Link href={route('register')} className="btn btn-primary px-4 rounded-3 fw-900 shadow-sm">
                        REGISTRAR COMERCIO
                    </Link>
                </div>
            </nav>

            {/* --- HERO SECTION: OVERSIZED TYPOGRAPHY (Mezcla Opción 2) --- */}
            <section className="py-5 text-center min-vh-75 d-flex flex-column justify-content-center align-items-center" style={{ background: `radial-gradient(circle at center, #f0f9ff 0%, #ffffff 100%)` }}>
                <div className="mb-4">
                    <span className="badge border border-primary text-primary px-3 py-2 rounded-pill fw-bold" style={{ letterSpacing: '2px' }}>
                        <i className="ti ti-shield-check me-2"></i> INFRAESTRUCTURA OPERATIVA Y LEGAL
                    </span>
                </div>
                <h1 className="display-1 fw-900 text-dark mb-3" style={{ letterSpacing: '-6px', lineHeight: '0.85' }}>
                    ORDEN <br />
                    <span style={{ color: brandBlue }}>AUTOMÁTICO.</span>
                </h1>
                <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '750px', fontSize: '1.4rem' }}>
                    Registra tu comercio y activa en minutos: <strong>Sedes, Resoluciones Legales, Terminales POS y Gestión de Turnos.</strong> El OS que tu negocio necesita para escalar.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                    <Link href={route('register')} className="btn btn-dark btn-lg px-5 py-3 rounded-pill fw-900 shadow-2xl transition-all">Empezar Gratis</Link>
                    <button className="btn btn-outline-dark btn-lg px-5 py-3 rounded-pill fw-bold">Ver Demo de Control</button>
                </div>
            </section>

            {/* --- BENTO GRID: EL CORAZÓN DEL SISTEMA (Mezcla Opción 1) --- */}
            <div className="row g-4 py-5">
                
                {/* Caja Principal: Cerebro Predictivo */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg h-100 overflow-hidden text-white" style={{ borderRadius: '40px', background: deepNavy }}>
                        <div className="card-body p-5 position-relative">
                            <div className="position-absolute top-0 end-0 p-5 opacity-10 d-none d-md-block">
                                <i className="ti ti-brain" style={{ fontSize: '15rem' }}></i>
                            </div>
                            <div className="row z-1 position-relative">
                                <div className="col-md-7">
                                    <h6 className="text-primary fw-900 mb-3" style={{letterSpacing:'2px'}}>INTELIGENCIA DE DATOS</h6>
                                    <h2 className="display-5 fw-900 mb-4">Agenda con <br />Cerebro Propio</h2>
                                    <p className="opacity-75 mb-4 fs-5">
                                        No solo guardamos citas. Detectamos automáticamente el ciclo de consumo de tus clientes y enviamos recordatorios vía <strong>WhatsApp</strong> antes de que olviden regresar.
                                    </p>
                                    <div className="d-flex gap-3">
                                        <span className="badge bg-white bg-opacity-10 p-2 px-3 rounded-pill border border-white border-opacity-10">Algoritmo Predictivo</span>
                                        <span className="badge bg-white bg-opacity-10 p-2 px-3 rounded-pill border border-white border-opacity-10">Fidelización Auto</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Caja: QR & Agendamiento */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-lg h-100 text-center text-white" style={{ borderRadius: '40px', background: `linear-gradient(135deg, ${brandBlue} 0%, #6366f1 100%)` }}>
                        <div className="card-body p-5 d-flex flex-column align-items-center justify-content-center">
                            <div className="bg-white p-3 rounded-4 mb-4 shadow-lg scale-hover transition-all">
                                <i className="ti ti-qrcode text-dark fs-1"></i>
                            </div>
                            <h3 className="fw-900">Agendamiento QR</h3>
                            <p className="opacity-75">Tus clientes agendan en segundos. Confirmación instantánea vía SMS y WhatsApp.</p>
                        </div>
                    </div>
                </div>

                {/* Caja: POS & Staff */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100 p-5 bento-card" style={{ borderRadius: '40px', background: '#f8fafc' }}>
                        <div className="avtar avtar-lg bg-white shadow-sm text-primary mb-4 rounded-3">
                            <i className="ti ti-users fs-2"></i>
                        </div>
                        <h4 className="fw-900">Staff & Comisiones</h4>
                        <p className="text-muted">Gestiona el acceso de tus empleados y liquida comisiones automáticamente por cada servicio prestado.</p>
                    </div>
                </div>

                {/* Caja Grande: Marketing y Cupones */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100 p-5 bento-card overflow-hidden" style={{ borderRadius: '40px', border: '1px solid #e2e8f0' }}>
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div className="avtar avtar-lg bg-light-danger text-danger mb-4 rounded-3">
                                    <i className="ti ti-ticket fs-2"></i>
                                </div>
                                <h4 className="fw-900">Marketing Automatizado</h4>
                                <p className="text-muted">Cupones para <strong>Cumpleaños, Clientes VIP y Campañas FLASH</strong> segmentadas por comportamiento real de compra.</p>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex flex-wrap gap-2 justify-content-end">
                                    {['VIP_PROMO', 'BDAY_GIFT', 'RECURRENCY_UP'].map(t => (
                                        <div key={t} className="p-3 bg-white shadow-sm border rounded-4 font-monospace small fw-bold">
                                            <i className="ti ti-tag me-2 text-primary"></i>{t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SECCIÓN FINANZAS: CONTROL DE GRADO MILITAR (Opción 2 mejorada) --- */}
            <section className="py-5 my-5 bg-light" style={{ borderRadius: '60px' }}>
                <div className="container p-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <h2 className="display-4 fw-900 mb-4">Control Financiero <br /><span className="text-primary">Sistematizado.</span></h2>
                            <p className="text-muted mb-5 fs-5">
                                Dashboard gerencial en tiempo real, facturación <strong>POS Avanzada</strong> con resoluciones legales y gestión de suscripciones con pagos online integrados.
                            </p>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <i className="ti ti-circle-check-filled text-primary fs-3"></i>
                                        <div>
                                            <h6 className="fw-900 mb-0">Múltiples Sedes</h6>
                                            <p className="small text-muted">Control total de sucursales.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="d-flex align-items-start gap-3">
                                        <i className="ti ti-circle-check-filled text-primary fs-3"></i>
                                        <div>
                                            <h6 className="fw-900 mb-0">Gestión de Cajas</h6>
                                            <p className="small text-muted">Apertura y cierre de turnos.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            <div className="card border-0 shadow-2xl p-4 overflow-hidden" style={{ borderRadius: '40px' }}>
                                <div className="card-body">
                                    <h5 className="fw-900 mb-4">Dashboard de Rendimiento</h5>
                                    <div className="bg-dark rounded-4 p-4 text-white text-start mb-3">
                                        <small className="opacity-50">Ventas del Mes</small>
                                        <h2 className="fw-900 mb-0">$12,450,000</h2>
                                    </div>
                                    <div className="progress mb-2" style={{height: '10px', borderRadius: '10px'}}>
                                        <div className="progress-bar bg-primary" style={{width: '75%'}}></div>
                                    </div>
                                    <small className="fw-bold text-muted">+24% incremento vs mes anterior</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA FINAL: REGISTRO CORE (#0) --- */}
            <section className="py-5 text-center mb-5">
                <div className="p-5 bg-dark rounded-5 shadow-2xl position-relative overflow-hidden">
                    <div className="position-relative z-1 py-4">
                        <h2 className="display-4 fw-900 mb-4 text-white">¿Listo para sistematizar tu éxito?</h2>
                        <p className="lead text-white-50 mb-5">Únete a los comercios que ya operan con inteligencia predictiva.</p>
                        <Link href={route('register')} className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-900 shadow-lg scale-hover transition-all">
                            REGISTRAR MI COMERCIO AHORA
                        </Link>
                    </div>
                </div>
            </section>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-900 { font-weight: 900; }
                .tracking-tighter { letter-spacing: -3px; }
                .shadow-2xl { box-shadow: 0 25px 70px -10px rgba(0, 0, 0, 0.2); }
                .transition-all { transition: all 0.3s ease; }
                .scale-hover:hover { transform: scale(1.05); }
                .bento-card:hover { transform: translateY(-10px); border-color: ${brandBlue} !important; }
                .avtar-lg { width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; }
                .min-vh-75 { min-height: 75vh; }
            `}} />
        </LandingMainLayout>
    );
}