import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Ftpagos } from '@/types';
  
interface Props {
    ftpagos: Ftpagos;
}

export default function Show({ ftpagos }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="ftpagos" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftpagos.index')}> Ftpagos</a></li>
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
                                Detalle de registro de ftpagos
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftpagos.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Numero:</strong>
                                    {ftpagos.numero}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha:</strong>
                                    {ftpagos.fecha}
                                </div>
                                <div className="col-md-12">
                                    <strong>Concepto:</strong>
                                    {ftpagos.concepto}
                                </div>
                                <div className="col-md-12">
                                    <strong>Total:</strong>
                                    {ftpagos.total}
                                </div>
                                <div className="col-md-12">
                                    <strong>Metodo Id:</strong>
                                    {ftpagos.metodo_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Factura Id:</strong>
                                    {ftpagos.factura_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {ftpagos.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {ftpagos.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {ftpagos.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}