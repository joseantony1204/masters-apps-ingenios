import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Scsuscripciones } from '@/types';
  
interface Props {
    scsuscripciones: Scsuscripciones;
}

export default function Show({ scsuscripciones }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="scsuscripciones" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('scsuscripciones.index')}> Scsuscripciones</a></li>
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
                                Detalle de registro de scsuscripciones
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('scsuscripciones.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Fecha Inicio:</strong>
                                    {scsuscripciones.fecha_inicio}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha Vencimiento:</strong>
                                    {scsuscripciones.fecha_vencimiento}
                                </div>
                                <div className="col-md-12">
                                    <strong>Ultimo Pago Id:</strong>
                                    {scsuscripciones.ultimo_pago_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {scsuscripciones.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Plan Id:</strong>
                                    {scsuscripciones.plan_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Comercio Id:</strong>
                                    {scsuscripciones.comercio_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {scsuscripciones.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {scsuscripciones.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {scsuscripciones.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}