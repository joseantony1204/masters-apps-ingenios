import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
  
interface Props {
    ftimpuestos: any;
}

export default function Show({ ftimpuestos }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="ftimpuestos" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftimpuestos.index')}> Ftimpuestos</a></li>
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
                                Detalle de registro de ftimpuestos
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftimpuestos.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Base:</strong>
                                    {ftimpuestos.base}
                                </div>
                                <div className="col-md-12">
                                    <strong>Valor:</strong>
                                    {ftimpuestos.valor}
                                </div>
                                <div className="col-md-12">
                                    <strong>Detalle Id:</strong>
                                    {ftimpuestos.detalle_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Impuesto Id:</strong>
                                    {ftimpuestos.impuesto_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Factura Id:</strong>
                                    {ftimpuestos.factura_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {ftimpuestos.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {ftimpuestos.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {ftimpuestos.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}