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
    // Estado 11 = PAGADA (Ejemplo)
    const pagadas = ftfacturas.filter(f => f.estado_id === 11);
    const montoPagado = pagadas.reduce((acc, curr) => acc + Number(curr.grand_total || 0), 0);
    
    const vencidas = ftfacturas.filter(f => f.estado_id === 937); // Ajustar según tu lógica de "Vencida"
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
                            <li className="breadcrumb-item"><a href={route('ftfacturas.index')}> Ftfacturas</a></li>
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
            <div className="col-xxl-8">
                <div className="row g-3">
                    {/* Tarjeta: Total */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-none border mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h6 className="mb-0">Ventas Totales</h6>
                                    <div className="avtar avtar-s bg-light-primary text-primary">
                                        <i className="ti ti-files fs-5"></i>
                                    </div>
                                </div>
                                <h4 className="mb-1">{formatCurrency(montoTotal)}</h4>
                                <p className="text-muted mb-0 small"><span className="fw-bold text-primary">{totalFacturas}</span> facturas generadas</p>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta: Pagadas */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-none border mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h6 className="mb-0">Pagadas</h6>
                                    <div className="avtar avtar-s bg-light-success text-success">
                                        <i className="ti ti-check fs-5"></i>
                                    </div>
                                </div>
                                <h4 className="mb-1">{formatCurrency(montoPagado)}</h4>
                                <p className="text-muted mb-0 small"><span className="fw-bold text-success">{pagadas.length}</span> cobradas exitosamente</p>
                            </div>
                        </div>
                    </div>

                    {/* Tarjeta: Pendientes/Vencidas */}
                    <div className="col-md-12 col-lg-4">
                        <div className="card shadow-none border mb-0">
                            <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h6 className="mb-0">Pendientes</h6>
                                    <div className="avtar avtar-s bg-light-danger text-danger">
                                        <i className="ti ti-clock fs-5"></i>
                                    </div>
                                </div>
                                <h4 className="mb-1">{formatCurrency(montoVencido)}</h4>
                                <p className="text-muted mb-0 small"><span className="fw-bold text-danger">{vencidas.length}</span> por recaudar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjeta lateral: Resumen de Cartera */}
            <div className="col-xxl-4">
                <div className="card bg-primary text-white mb-0 h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-3">
                                <div className="avtar avtar-s bg-white bg-opacity-10">
                                    <i className="ti ti-wallet text-white fs-5"></i>
                                </div>
                                <p className="mb-0">Total recaudable</p>
                            </div>
                            <h3 className="text-white mb-3">{formatCurrency(montoTotal)}</h3>
                            
                            <div className="d-flex justify-content-between small mb-1">
                                <span>Progreso de cobro</span>
                                <span>{montoTotal > 0 ? Math.round((montoPagado / montoTotal) * 100) : 0}%</span>
                            </div>
                            <div className="progress bg-white bg-opacity-20" style={{ height: '8px' }}>
                                <div 
                                    className="progress-bar bg-warning" 
                                    style={{ width: `${montoTotal > 0 ? (montoPagado / montoTotal) * 100 : 0}%` }}
                                ></div>
                            </div>
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