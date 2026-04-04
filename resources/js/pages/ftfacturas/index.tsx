import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Ftfacturas } from '@/types';
  
interface Props {
    ftfacturas: any[];
}


export default function Index({ ftfacturas }: Props) {
    // --- LÓGICA DE CÁLCULO PARA EL DASHBOARD ---
    const totalFacturas = ftfacturas.length;
    const montoTotal = ftfacturas.reduce((acc, curr) => acc + Number(curr.grand_total || 0), 0);
    
    // Filtrado por estados (asumiendo IDs de tu base de datos)
    // Estado 937 = ADCITAS (Pendientes/Borradores según tu JSON previo)
    // Estado 938 = PAGADA (Ejemplo)
    const pagadas = ftfacturas.filter(f => f.estado_id === 938);
    const montoPagado = pagadas.reduce((acc, curr) => acc + Number(curr.grand_total || 0), 0);
    
    const vencidas = ftfacturas.filter(f => f.estado_id === 937 || f.estado_id === 940); // Ajustar según tu lógica de "Vencida"
    const montoVencido = vencidas.reduce((acc, curr) => acc + Number(curr.grand_total || 0), 0);

    const formatCurrency = (value: number) => 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
    return (  
    <AppMainLayout>
        <Head title="ftfacturas" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftfacturas.index')}> Facturas</a></li>
                            <li className="breadcrumb-item" aria-current="page">Listado</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title"><h2 className="mb-0">Listado de facturas</h2></div>
                    </div>
                </div>
            </div>
        </div>
       
        {/* --- MINI DASHBOARD STATS --- */}
        <div className="row g-3 mb-4">
            <div className="col-xxl-9">
                <div className="row g-3">
                    {/* Tarjeta: Ventas Totales */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm border-start border-primary  h-100 position-relative overflow-hidden">
                            <div className="card-body p-3">
                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                    Ventas Totales
                                </small>
                                <h3 className="fw-bold mb-0 text-dark mt-1">
                                    {formatCurrency(montoTotal)}
                                </h3>
                                <p className="text-muted mb-0 mt-1 small">
                                    <span className="fw-bold text-primary">{totalFacturas}</span> facturas generadas
                                </p>
                                {/* Icono posicionado para que no desplace el texto */}
                                <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                                    <div className="bg-light-primary text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', opacity: '0.8' }}>
                                        <i className="ti ti-files fs-3"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta: Pagadas */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm border-start border-success h-100 position-relative overflow-hidden">
                            <div className="card-body p-3">
                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                    Pagadas
                                </small>
                                <h3 className="fw-bold mb-0 text-dark mt-1">
                                    {formatCurrency(montoPagado)}
                                </h3>
                                <p className="text-muted mb-0 mt-1 small">
                                    <span className="fw-bold text-success">{pagadas.length}</span> cobradas exitosamente
                                </p>
                                <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                                    <div className="bg-light-success text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', opacity: '0.8' }}>
                                        <i className="ti ti-circle-check fs-3"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta: Pendientes */}
                    <div className="col-md-4">
                        <div className="card border-0 shadow-sm border-start border-danger h-100 position-relative overflow-hidden">
                            <div className="card-body p-3">
                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                    Pendientes
                                </small>
                                <h3 className="fw-bold mb-0 text-dark mt-1">
                                    {formatCurrency(montoVencido)}
                                </h3>
                                <p className="text-muted mb-0 mt-1 small">
                                    <span className="fw-bold text-danger">{vencidas.length}</span> por recaudar
                                </p>
                                <div className="position-absolute end-0 top-50 translate-middle-y me-3">
                                    <div className="bg-light-danger text-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px', opacity: '0.8' }}>
                                        <i className="ti ti-clock fs-3"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjeta lateral: Resumen de Cartera (Optimizada) */}
            <div className="col-xxl-3">
                <div className="card bg-primary text-white border-0 shadow-sm h-100 position-relative overflow-hidden">
                    <div className="card-body p-3">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <div className="bg-white bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '44px', height: '44px' }}>
                                <i className="ti ti-wallet text-white fs-5"></i>
                            </div>
                            <small className="text-white text-opacity-75 text-uppercase fw-bold" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                Total recaudable
                            </small>
                        </div>
                        
                        <h3 className="text-white fw-bold mb-3">
                            {formatCurrency(montoTotal)}
                        </h3>
                        
                        <div className="d-flex justify-content-between mb-1" style={{ fontSize: '11px' }}>
                            <span className="text-white text-opacity-75">Progreso de cobro</span>
                            <span className="fw-bold">{montoTotal > 0 ? Math.round((montoPagado / montoTotal) * 100) : 0}%</span>
                        </div>
                        
                        <div className="progress bg-white bg-opacity-20" style={{ height: '6px' }}>
                            <div 
                                className="progress-bar bg-warning" 
                                style={{ width: `${montoTotal > 0 ? (montoPagado / montoTotal) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   
    
        {/* --- TABLA DE DATOS --- */}
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span id="card_title">
                               
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftfacturas.create') }><i className="fa fa-fw fa-plus"></i> Agregar una factura</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body px-0">
                        <Table ftfacturas={ftfacturas}/>
                    </div>
                </div>
            </div>
        </div>

    </AppMainLayout> 
    );

    
}