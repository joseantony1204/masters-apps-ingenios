import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import { Ftfacturas } from '@/types';

interface Props {
    ftfactura: any; // Cambiado temporalmente a any para manejar las relaciones de items
    comercio: any;
    cita: any;
    persona: any;
}

export default function Show({ ftfactura, comercio, cita, persona }: Props) {
    
    // Función para manejar la impresión
    const handlePrint = () => {
        window.print();
    };

    return (
        <AppMainLayout>
            <Head title={`Factura ${ftfactura.numero || 'Detalle'}`} />
            
            {/* Breadcrumb y Header */}
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('ftfacturas.index')}> Facturas</a></li>
                                <li className="breadcrumb-item" aria-current="page">Detalle</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <h2 className="mb-0">Factura {ftfactura.numero}</h2>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    {/* Barra de Acciones - Oculta en impresión */}
                    <div className="d-print-none card mb-3">
                        <div className="card-body p-3">
                            <ul className="list-inline ms-auto mb-0 d-flex justify-content-end flex-wrap">
                                <li className="list-inline-item align-bottom me-2">
                                    <a href={route('ftfacturas.edit', ftfactura.id)} className="avtar avtar-s btn-link-secondary" title="Editar">
                                        <i className="ti ti-pencil f-22"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item align-bottom me-2">
                                    <a href="#" className="avtar avtar-s btn-link-secondary">
                                        <i className="ph-duotone ph-download-simple f-22"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item align-bottom me-2">
                                    <button onClick={handlePrint} className="avtar avtar-s btn-link-secondary border-0 bg-transparent" title="Imprimir">
                                        <i className="ti ti-printer f-22"></i>
                                    </button>
                                </li>
                                <li className="list-inline-item align-bottom me-2">
                                    <a href={route('ftfacturas.index')} className="avtar avtar-s btn-link-secondary" title="Regresar">
                                        <i className="ti ti-arrow-back f-22"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contenido de la ftfactura */}
                    <div className="card">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="row align-items-center g-3">
                                        <div className="col-sm-6">
                                            <div className="d-flex align-items-center mb-2 navbar-brand">
                                                <img src="/assets/images/logo-dark.svg" className="img-fluid logo-lg" alt="Logo" />
                                                <span className={`badge ${ftfactura.estado_id === 938 ? 'bg-light-success' : 'bg-light-secondary'} rounded-pill ms-2`}>
                                                    {ftfactura.estado?.nombre || 'Facturado'}
                                                </span>
                                            </div>
                                            <p className="mb-0 fw-bold">N° {ftfactura.numero}</p>
                                            <small className="text-muted">Código Seg: {ftfactura.codigoseguridad}</small>
                                        </div>
                                        <div className="col-sm-6 text-sm-end">
                                            <h6>Fecha: <span className="text-muted f-w-400">{ftfactura.fecha}</span></h6>
                                            <h6>Vencimiento: <span className="text-muted f-w-400">{ftfactura.fechanavencimiento}</span></h6>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6">
                                    <div className="border rounded p-3 h-100">
                                        <h6 className="mb-0">Datos del emisor (empresa):</h6>
                                        <h5 className="fw-bold">{comercio?.nombre || 'Mi Comercio'}</h5>
                                        <div className="d-flex flex-column gap-1">
                                            <span className="mb-0"><i className="ti ti-id me-1"></i>{comercio?.persona?.identificacion || 'N/A'}</span>
                                            <span className="mb-0"><i className="ti ti-map-pin me-1"></i>{ftfactura.adturno.terminal.sede.direccion}</span>
                                            <span className="mb-0"><i className="ti ti-phone me-1"></i>{ftfactura.adturno.terminal.sede.telefono}</span>
                                            <span className="mb-0"><i className="ti ti-mail me-1"></i>{ftfactura.adturno.terminal.sede.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="border rounded p-3 h-100">
                                        <h6 className="mb-0">
                                            <i className="ti ti-user me-2"></i>Datos del receptor (cliente):
                                        </h6>
                                        <h5 className="fw-bold">{cita?.cliente?.persona?.personasnaturales?.nombrecompleto ? cita?.cliente?.persona?.personasnaturales?.nombrecompleto : persona?.personasnaturales?.nombrecompleto || 'Cliente'}</h5>
                                        <div className="d-flex flex-column gap-1">
                                            <span className="mb-0"><i className="ti ti-id me-1"></i>{cita?.cliente?.persona?.identificacion ? cita?.cliente?.persona?.identificacion : persona?.identificacion || 'Sin identificación'}</span>
                                            <span className="mb-0"><i className="ti ti-map-pin me-1"></i>{cita?.cliente?.persona?.direccion ? cita?.cliente?.persona?.direccion : persona?.direccion}</span>
                                            <span className="mb-0"><i className="ti ti-phone me-1"></i>{cita?.cliente?.persona?.telefonomovil ? cita?.cliente?.persona?.telefonomovil : persona?.telefonomovil || 'Sin telefono'}</span>
                                            <span className="mb-0"><i className="ti ti-mail me-1"></i>{cita?.cliente?.persona?.email ? cita?.cliente?.persona?.email : persona?.email || 'Sin email'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Descripción</th>
                                                    <th className="text-end">Cant.</th>
                                                    <th className="text-end">Precio Unit.</th>
                                                    <th className="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {(ftfactura.detalles?.length && ftfactura.detalles?.length > 0) && (
                                                  ftfactura.detalles?.map((det: any, index: number) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <div className="fw-bold">{det.producto?.nombre || 'Producto/Servicio'}</div>
                                                            <small className="text-muted">{det.observaciones || ''}</small>
                                                        </td>
                                                        <td className="text-end">{Number(det.cantidad)}</td>
                                                        <td className="text-end">${Number(det.preciofinal).toLocaleString()}</td>
                                                        <td className="text-end">${Number(det.totalapagar).toLocaleString()}</td>
                                                    </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <hr className="mb-2 mt-1 border-secondary border-opacity-50" />
                                </div>

                                <div className="col-12">
                                    <div className="invoice-total ms-auto" style={{ maxWidth: '300px' }}>
                                        <div className="row">
                                            <div className="col-6">
                                                <p className="text-muted mb-1 text-start">Sub Total :</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="mb-1 text-end">${Number(ftfactura.subtotal).toLocaleString()}</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="text-muted mb-1 text-start">Descuento :</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="mb-1 text-end text-success">-${Number(ftfactura.descuento || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="text-muted mb-1 text-start">Impuestos :</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="mb-1 text-end">${Number(ftfactura.impuesto || 0).toLocaleString()}</p>
                                            </div>
                                            <div className="col-12">
                                                <hr className="my-2" />
                                            </div>
                                            <div className="col-6">
                                                <p className="f-w-600 mb-1 text-start">Gran Total :</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="f-w-600 mb-1 text-end text-primary h5">${Number(ftfactura.total).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold">Observaciones:</label>
                                    <p className="mb-0 text-muted">{ftfactura.observaciones || 'Sin observaciones adicionales.'}</p>
                                </div>

                                <div className="col-12 text-end d-print-none mt-4">
                                    <button onClick={handlePrint} className="btn btn-primary">
                                        <i className="ti ti-printer me-2"></i>Imprimir Factura
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppMainLayout>
    );
}