import AppLandingLayout from '@/layouts/app/app-landing-layout';
import { useState } from 'react';

export default function Landing() {
    // Datos de categorías
    const categorias = [
      { id: 890, nombre: 'Cortes', icon: 'ti-cut', obs: 'Corte' },
      { id: 891, nombre: 'Barba', icon: 'ti-sparkles', obs: 'Barba' }, // Usé Barba como nombre para que coincida con tu estilo
      { id: 892, nombre: 'Color', icon: 'ti-palette', obs: 'Cuidado' },
      { id: 893, nombre: 'Uñas', icon: 'ti-hand-finger', obs: null },
      { id: 894, nombre: 'Depilación', icon: 'ti-scissors', obs: null },
      { id: 895, nombre: 'Depilación', icon: 'ti-scissors', obs: null },
      { id: 896, nombre: 'Depilación', icon: 'ti-scissors', obs: null },
    ];

    const [activeTab, setActiveTab] = useState(890);

    return (
        <AppLandingLayout>
            <div className="row">
                <div className="col-12 px-0">
                    
                    {/* SECCIÓN: CATEGORÍAS (Horizontal Scroll) */}
                    <section className="categories-section mb-5">
                        <div className="d-flex overflow-auto pb-3 ps-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {categorias.map((cat) => (
                                <div 
                                    key={cat.id} 
                                    onClick={() => setActiveTab(cat.id)}
                                    className="category-item text-center me-4" 
                                    style={{ minWidth: '90px', cursor: 'pointer' }}
                                >
                                    {/* CONTENEDOR CIRCULAR (Estilo exacto de tu imagen) */}
                                    <div className="category-icon-wrapper mb-3" style={{
                                        width: '85px',
                                        height: '85px',
                                        borderRadius: '35px', // Curvatura suave tipo squircle
                                        backgroundColor: '#E6F9F9', // Fondo aguamarina claro
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto',
                                        position: 'relative',
                                        transition: 'all 0.2s ease',
                                        // Doble borde sutil: uno externo gris muy claro
                                        border: activeTab === cat.id ? '2px solid #24D2DB' : '2px solid #EAECEF',
                                        boxShadow: activeTab === cat.id ? '0 8px 20px rgba(36, 210, 219, 0.25)' : 'none'
                                    }}>
                                        <i className={`ti ${cat.icon}`} style={{ 
                                            fontSize: '32px', 
                                            color: '#24D2DB',
                                            fontWeight: 'normal'
                                        }}></i>
                                    </div>

                                    {/* TEXTO (Dos líneas como en la imagen) */}
                                    <div style={{ 
                                        fontSize: '14px', 
                                        lineHeight: '1.2',
                                        fontWeight: '800', // Extra negrita para el estilo de la imagen
                                        color: '#1A202C', // Color oscuro profundo
                                        textAlign: 'center',
                                        padding: '0 5px'
                                    }}>
                                        {cat.nombre.split(' ').map((word, i) => (
                                            <span key={i} className="d-block">{word}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECCIÓN: LISTA DE SERVICIOS */}
                    <section className="services-section px-2">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-bold mb-0">Servicios Disponibles</h5>
                        </div>
                        
                        <div className="services-list d-grid gap-3">
                            {[
                                { title: 'Corte Fade', price: '$35.000', time: '45 min', icon: 'ti-cut', cat: 890 },
                                { title: 'Arreglo de Barba', price: '$25.000', time: '30 min', icon: 'ti-sparkles', cat: 891 },
                                { title: 'Tinte Global', price: '$80.000', time: '1h 30 min', icon: 'ti-palette', cat: 892 },
                            ].filter(s => s.cat === activeTab || activeTab === null).map((service, idx) => (
                                <div key={idx} className="service-card p-3 d-flex align-items-center animate__animated animate__fadeInUp" style={{ 
                                    backgroundColor: '#FFF', 
                                    borderRadius: '20px',
                                    border: '1px solid #F0F0F0',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                }}>
                                    <div className="icon-box me-3 d-flex align-items-center justify-content-center" style={{ 
                                        width: '50px', height: '50px', backgroundColor: '#F8F9FA', borderRadius: '14px' 
                                    }}>
                                        <i className={`ti ${service.icon} fs-4 text-primary`}></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '15px' }}>{service.title}</h6>
                                        <span className="text-muted small" style={{ fontSize: '12px' }}>
                                            <i className="ti ti-clock me-1 text-primary"></i>{service.time}
                                        </span>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{service.price}</div>
                                        <button className="btn btn-sm px-3" style={{ 
                                            backgroundColor: '#E6F9F9', 
                                            color: '#24D2DB', 
                                            borderRadius: '8px',
                                            fontSize: '11px',
                                            fontWeight: '700'
                                        }}>
                                            Reservar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .category-item:active .category-icon-wrapper {
                    transform: scale(0.92);
                    background-color: #D1F2F2 !important;
                }
                
                .overflow-auto::-webkit-scrollbar {
                    display: none;
                }

                /* Para que se vea como en la imagen, el badge del layout debe ser consistente */
                .category-icon-wrapper::after {
                    content: '';
                    position: absolute;
                    top: -4px; left: -4px; right: -4px; bottom: -4px;
                    border-radius: 38px;
                    border: 1.5px solid rgba(0,0,0,0.03);
                    pointer-events: none;
                }
            `}} />
        </AppLandingLayout>
    );
}