import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Ftdetalles } from '@/types';
  
interface Props {
    ftdetalles: Ftdetalles;
}

export default function Show({ ftdetalles }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="ftdetalles" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftdetalles.index')}> Ftdetalles</a></li>
                            <li className="breadcrumb-item" aria-current="page">Detalle</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title"><h2 className="mb-0">Detalle</h2></div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span id="card_title">
                                Detalle de registro de ftdetalles
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftdetalles.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Cantidad:</strong>
                                    {ftdetalles.cantidad}
                                </div>
                                <div className="col-md-12">
                                    <strong>Numero:</strong>
                                    {ftdetalles.numero}
                                </div>
                                <div className="col-md-12">
                                    <strong>Precioinicial:</strong>
                                    {ftdetalles.precioinicial}
                                </div>
                                <div className="col-md-12">
                                    <strong>Preciofinal:</strong>
                                    {ftdetalles.preciofinal}
                                </div>
                                <div className="col-md-12">
                                    <strong>Descuento:</strong>
                                    {ftdetalles.descuento}
                                </div>
                                <div className="col-md-12">
                                    <strong>Totalapagar:</strong>
                                    {ftdetalles.totalapagar}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha:</strong>
                                    {ftdetalles.fecha}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observaciones:</strong>
                                    {ftdetalles.observaciones}
                                </div>
                                <div className="col-md-12">
                                    <strong>Producto Id:</strong>
                                    {ftdetalles.producto_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Factura Id:</strong>
                                    {ftdetalles.factura_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {ftdetalles.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {ftdetalles.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {ftdetalles.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {ftdetalles.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}