import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Cfpersonascomercios } from '@/types';
  
interface Props {
    cfpersonascomercios: Cfpersonascomercios;
}

export default function Show({ cfpersonascomercios }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfpersonascomercios" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfpersonascomercios.index')}> Cfpersonascomercios</a></li>
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
                                Detalle de registro de cfpersonascomercios
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfpersonascomercios.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Activo:</strong>
                                    {cfpersonascomercios.activo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Persona Id:</strong>
                                    {cfpersonascomercios.persona_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Comercio Id:</strong>
                                    {cfpersonascomercios.comercio_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {cfpersonascomercios.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {cfpersonascomercios.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {cfpersonascomercios.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}