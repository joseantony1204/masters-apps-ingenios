import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';

export default function Index() {
    const brandBlue = '#0095ff';

    const reportes = [
        {
            titulo: 'Rendimiento y Comisiones',
            descripcion: 'Visualización de ventas por especialista, liquidación de comisiones y productividad individual.',
            link: route('reportes.empleados'),
            icon: 'ti ti-chart-bar',
            color: '#0095ff',
            tag: 'Financiero'
        },
        {
            titulo: 'Agenda y Conversión',
            descripcion: 'Análisis de ocupación (Heatmap), tasa de No-Show y fidelización de clientes VIP.',
            link: route('reportes.citas'), // Asegúrate que este nombre de ruta coincida con tu web.php
            icon: 'ti ti-calendar-stats',
            color: '#4f46e5',
            tag: 'Operativo'
        }
    ];

    return (
        <AppMainLayout>
            <Head title="Vantify Intelligence - Reportes" />

            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb mb-3">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('reportes.index')}> Reportes</a></li>
                                <li className="breadcrumb-item" aria-current="page">Listado</li>
                            </ul>
                        </div>
                        {/* Alineación perfecta: Título a la izquierda, Link a la derecha */}
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-900 mb-0" style={{ color: '#1e293b' }}>
                                    Vantify <span style={{ color: brandBlue }}>Intelligence</span>
                                </h2>
                                <p className="text-muted fw-500">Selecciona un módulo de análisis para optimizar tu comercio.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container-fluid py-4" style={{ backgroundColor: '#f8faff', minHeight: '100vh' }}>
                <div className="row g-4">
                    {reportes.map((rep, index) => (
                        <div className="col-md-6 col-lg-5" key={index}>
                            <a href={rep.link} className="text-decoration-none">
                                <div className="card border-0 shadow-sm report-card" style={{ borderRadius: '24px', overflow: 'hidden', transition: 'all 0.3s ease' }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-start justify-content-between mb-4">
                                            <div className="rounded-4 d-flex align-items-center justify-content-center shadow-sm" 
                                                 style={{ width: '60px', height: '60px', backgroundColor: `${rep.color}15`, color: rep.color }}>
                                                <i className={`${rep.icon} fs-1`}></i>
                                            </div>
                                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: `${rep.color}15`, color: rep.color, fontSize: '10px', fontWeight: '800' }}>
                                                {rep.tag.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <h4 className="fw-900 text-dark mb-2">{rep.titulo}</h4>
                                        <p className="text-muted small fw-500 mb-4" style={{ lineHeight: '1.6' }}>
                                            {rep.descripcion}
                                        </p>

                                        <div className="d-flex align-items-center fw-900 small" style={{ color: rep.color }}>
                                            EXPLORAR DATOS <i className="ti ti-arrow-right ms-2"></i>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>

                {/* Sección Informativa Inferior */}
                <div className="mt-5 p-4 rounded-4 bg-white shadow-sm border-0 d-flex align-items-center">
                    <div className="me-3 text-warning">
                        <i className="ti ti-bulb fs-2"></i>
                    </div>
                    <div>
                        <h6 className="fw-bold mb-0">¿Sabías qué?</h6>
                        <p className="text-muted small mb-0">El análisis de "No-Show" puede ayudarte a reducir cancelaciones hasta en un 25% mediante recordatorios preventivos.</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-900 { font-weight: 900; }
                .fw-500 { font-weight: 500; }
                .report-card:hover { 
                    transform: translateY(-10px); 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
                    background-color: #fff;
                }
                .report-card:hover h4 {
                    color: ${brandBlue} !important;
                }
            `}} />
    </AppMainLayout>
    );
}