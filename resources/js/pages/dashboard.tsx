import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function Dashboard({ auth }: any) {
    return (
        <AppMainLayout>
            <Head title="Vantify - Dashboard Unificado" />

            {/* --- 1. HEADER: BIENVENIDA Y ACCIONES RÁPIDAS --- */}
            <div className="row align-items-center mb-4">
                <div className="col-md-7">
                    <h3 className="fw-bold mb-1">Panel General de {auth.user.name} 🚀</h3>
                    <p className="text-muted small">Resumen de rendimiento, finanzas y agenda en tiempo real.</p>
                </div>
                <div className="col-md-5 text-md-end">
                    <div className="d-flex justify-content-md-end gap-2">
                        <select className="form-select form-select-sm d-inline-block w-auto border-0 shadow-sm me-2">
                            <option>Hoy: 03 Abr 2024</option>
                            <option>Esta Semana</option>
                            <option>Este Mes</option>
                        </select>
                        <button className="btn btn-light shadow-sm border-0"><i className="ti ti-calendar-plus me-1"></i> Agendar</button>
                        <button className="btn btn-primary shadow-sm"><i className="ti ti-plus me-1"></i> Nueva Venta</button>
                    </div>
                </div>
            </div>

            {/* --- 2. FILA DE KPIs DE IMPACTO --- */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Ingresos Totales', val: '$ 4.5M', growth: '+12%', icon: 'ti-currency-dollar', color: 'primary' },
                    { label: 'Citas Hoy', val: '18', growth: '+5%', icon: 'ti-calendar-event', color: 'success' },
                    { label: 'Clientes Nuevos', val: '42', growth: '+18%', icon: 'ti-user-plus', color: 'info' },
                    { label: 'Pendientes Pago', val: '5', growth: '-2%', icon: 'ti-alert-circle', color: 'warning' },
                ].map((kpi, i) => (
                    <div className="col-6 col-md-3" key={i}>
                        <div className="card border-0 shadow-sm">
                            <div className="card-body p-3">
                                <div className="d-flex align-items-center mb-2">
                                    <div className={`avtar avtar-s bg-light-${kpi.color} text-${kpi.color} rounded-circle me-2`}>
                                        <i className={`ti ${kpi.icon}`}></i>
                                    </div>
                                    <span className="text-muted small fw-bold">{kpi.label}</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-between">
                                    <h4 className="fw-bold mb-0">{kpi.val}</h4>
                                    <span className={`text-${kpi.growth.startsWith('+') ? 'success' : 'danger'} x-small fw-bold`}>
                                        {kpi.growth}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- 3. SECCIÓN ESTRATÉGICA Y ANALYTICS --- */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0 fw-bold">Rendimiento de Ingresos</h5>
                                <p className="text-muted small mb-0">Comparativa: <span className="text-success fw-bold">+23.5%</span> vs mes anterior</p>
                            </div>
                            <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-secondary">Día</button>
                                <button className="btn btn-outline-secondary">Semana</button>
                                <button className="btn btn-outline-secondary active">Mes</button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-end justify-content-between h-75 px-2" style={{ minHeight: '180px' }}>
                                {[35, 45, 30, 60, 85, 40, 90, 70, 55, 100, 80, 65].map((h, i) => (
                                    <div key={i} className="position-relative flex-grow-1 mx-1">
                                        <div className="bg-primary rounded-pill w-100" style={{ height: `${h}%`, opacity: i === 9 ? '1' : '0.2' }}></div>
                                        {i === 9 && <span className="position-absolute top-0 start-50 translate-middle-x badge bg-primary mt-n4">$1.2M</span>}
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-between mt-3 text-muted x-small fw-bold border-top pt-3">
                                <span>ENE</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100 bg-dark text-white">
                        <div className="card-body d-flex flex-column justify-content-between p-4">
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="text-white-50 small mb-0">TOTAL CLIENTES</h6>
                                    <i className="ti ti-users fs-4 text-primary"></i>
                                </div>
                                <h2 className="fw-bold mb-1">14,285</h2>
                                <span className="badge bg-light-success text-success">+ 45 nuevos hoy</span>
                            </div>
                            <div className="mt-4 pt-4 border-top border-white border-opacity-10">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="small opacity-50">Tasa de Retención</span>
                                    <span className="small">88%</span>
                                </div>
                                <div className="progress bg-white bg-opacity-10" style={{ height: '4px' }}>
                                    <div className="progress-bar bg-primary" style={{ width: '88%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 4. OPERACIONES DIARIAS Y FIDELIZACIÓN --- */}
            <div className="row g-4 mb-4">
                {/* Agenda Próxima */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0">Agenda Próxima</h6>
                            <span className="badge bg-light-primary text-primary px-3">Hoy</span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light small">
                                    <tr>
                                        <th className="ps-4">CLIENTE</th>
                                        <th>SERVICIO</th>
                                        <th>HORA</th>
                                        <th>ESTADO</th>
                                        <th className="text-end pe-4">VALOR</th>
                                    </tr>
                                </thead>
                                <tbody className="small">
                                    {[
                                        { name: 'Ricardo Soto', service: 'Corte Premium', time: '02:00 PM', status: 'Confirmado', color: 'success', val: '$35.000' },
                                        { name: 'Elena Peña', service: 'Limpieza Facial', time: '03:30 PM', status: 'En Espera', color: 'warning', val: '$120.000' },
                                        { name: 'Marcos Ruiz', service: 'Barba / Spa', time: '05:00 PM', status: 'Pendiente', color: 'danger', val: '$55.000' }
                                    ].map((row, i) => (
                                        <tr key={i}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avtar avtar-xs bg-dark text-white rounded-circle me-2">{row.name.charAt(0)}</div>
                                                    <span className="fw-bold">{row.name}</span>
                                                </div>
                                            </td>
                                            <td>{row.service}</td>
                                            <td>{row.time}</td>
                                            <td><span className={`badge bg-light-${row.color} text-${row.color} rounded-pill`}>{row.status}</span></td>
                                            <td className="text-end pe-4 fw-bold">{row.val}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Fidelización y Servicios */}
                <div className="col-lg-4">
                    {/* Cumpleaños */}
                    <div className="card border-0 shadow-sm mb-4 border-start border-4 border-warning">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="avtar avtar-m bg-light-warning text-warning rounded-circle me-3">
                                    <i className="ti ti-cake fs-4"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">Cumpleaños Hoy</h6>
                                    <p className="text-muted x-small mb-0">Fideliza a tus clientes</p>
                                </div>
                            </div>
                            <div className="d-flex -space-x-2 mb-3">
                                <div className="avtar avtar-xs bg-primary text-white border border-2 border-white rounded-circle">M</div>
                                <div className="avtar avtar-xs bg-info text-white border border-2 border-white rounded-circle">J</div>
                                <div className="avtar avtar-xs bg-success text-white border border-2 border-white rounded-circle">L</div>
                                <div className="avtar avtar-xs bg-light text-muted border border-2 border-white rounded-circle">+2</div>
                            </div>
                            <button className="btn btn-warning btn-sm w-100 text-white fw-bold shadow-sm">Enviar Promo Masiva</button>
                        </div>
                    </div>

                    {/* Top Servicios */}
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-transparent border-0 pt-3">
                            <h6 className="mb-0 fw-bold">Servicios más solicitados</h6>
                        </div>
                        <div className="card-body p-3">
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1 small fw-bold">
                                    <span>Barbería</span>
                                    <span>40%</span>
                                </div>
                                <div className="progress rounded-pill" style={{height: '6px'}}>
                                    <div className="progress-bar bg-primary" style={{width: '40%'}}></div>
                                </div>
                            </div>
                            <div className="mb-0">
                                <div className="d-flex justify-content-between mb-1 small fw-bold">
                                    <span>Tratamientos</span>
                                    <span>25%</span>
                                </div>
                                <div className="progress rounded-pill" style={{height: '6px'}}>
                                    <div className="progress-bar bg-success" style={{width: '25%'}}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 5. HISTORIAL DE TRANSACCIONES --- */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between">
                            <h6 className="fw-bold mb-0">Historial de Transacciones</h6>
                            <a href="#" className="small text-decoration-none">Ver todo</a>
                        </div>
                        <div className="card-body px-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light text-muted">
                                        <tr className="small">
                                            <th className="ps-4">CLIENTE / REFERENCIA</th>
                                            <th>FECHA</th>
                                            <th>MONTO</th>
                                            <th>ESTADO</th>
                                            <th className="text-end pe-4">ACCIÓN</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        <tr>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avtar avtar-xs bg-light-info text-info rounded-circle me-2">AS</div>
                                                    <div>
                                                        <div className="fw-bold">Airi Satou</div>
                                                        <div className="x-small text-muted">Corte + Barba</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>03 Abr, 09:00 PM</td>
                                            <td className="fw-bold">$ 45.000</td>
                                            <td><span className="badge bg-light-success text-success">Completado</span></td>
                                            <td className="text-end pe-4"><i className="ti ti-file-download fs-5 cursor-pointer"></i></td>
                                        </tr>
                                        <tr>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="avtar avtar-xs bg-light-warning text-warning rounded-circle me-2">BC</div>
                                                    <div>
                                                        <div className="fw-bold">Bradley Cox</div>
                                                        <div className="x-small text-muted">Pago Proveedor</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>03 Abr, 02:14 PM</td>
                                            <td className="fw-bold text-danger">- $ 120.000</td>
                                            <td><span className="badge bg-light-primary text-primary">En Proceso</span></td>
                                            <td className="text-end pe-4"><i className="ti ti-dots fs-5 cursor-pointer"></i></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppMainLayout>
    );
}