import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Cfsedesusers } from '@/types';
  
interface Props {
    cfsedesusers: Cfsedesusers;
}

export default function Show({ cfsedesusers }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfsedesusers" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfsedesusers.index')}> Cfsedesusers</a></li>
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
                                Detalle de registro de cfsedesusers
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfsedesusers.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Orden:</strong>
                                    {cfsedesusers.orden}
                                </div>
                                <div className="col-md-12">
                                    <strong>Predeterminada:</strong>
                                    {cfsedesusers.predeterminada}
                                </div>
                                <div className="col-md-12">
                                    <strong>Usuario Id:</strong>
                                    {cfsedesusers.usuario_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Sede Id:</strong>
                                    {cfsedesusers.sede_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {cfsedesusers.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {cfsedesusers.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {cfsedesusers.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}