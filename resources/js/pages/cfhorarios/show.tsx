import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Cfhorarios } from '@/types';
  
interface Props {
    cfhorarios: Cfhorarios;
}

export default function Show({ cfhorarios }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfhorarios" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfhorarios.index')}> Cfhorarios</a></li>
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
                                Detalle de registro de cfhorarios
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfhorarios.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Horainicio:</strong>
                                    {cfhorarios.horainicio}
                                </div>
                                <div className="col-md-12">
                                    <strong>Horafinal:</strong>
                                    {cfhorarios.horafinal}
                                </div>
                                <div className="col-md-12">
                                    <strong>Empleado Id:</strong>
                                    {cfhorarios.empleado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Dia Id:</strong>
                                    {cfhorarios.dia_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {cfhorarios.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {cfhorarios.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {cfhorarios.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}