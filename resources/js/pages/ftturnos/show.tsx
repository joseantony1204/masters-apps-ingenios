import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Ftturnos } from '@/types';
  
interface Props {
    ftturnos: Ftturnos;
}

export default function Show({ ftturnos }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="ftturnos" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftturnos.index')}> Ftturnos</a></li>
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
                                Detalle de registro de ftturnos
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftturnos.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Codigo:</strong>
                                    {ftturnos.codigo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Descripcion:</strong>
                                    {ftturnos.descripcion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observaciones:</strong>
                                    {ftturnos.observaciones}
                                </div>
                                <div className="col-md-12">
                                    <strong>Baseinicial:</strong>
                                    {ftturnos.baseinicial}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha:</strong>
                                    {ftturnos.fecha}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fechanaapertura:</strong>
                                    {ftturnos.fechanaapertura}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fechanacierre:</strong>
                                    {ftturnos.fechanacierre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Persona Id:</strong>
                                    {ftturnos.persona_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Terminal Id:</strong>
                                    {ftturnos.terminal_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {ftturnos.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {ftturnos.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {ftturnos.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {ftturnos.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}