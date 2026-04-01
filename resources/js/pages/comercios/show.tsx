import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Comercios } from '@/types';
  
interface Props {
    comercios: Comercios;
}

export default function Show({ comercios }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="comercios" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('comercios.index')}> Comercios</a></li>
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
                                Detalle de registro de comercios
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('comercios.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Nombre:</strong>
                                    {comercios.nombre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Objetocomercial:</strong>
                                    {comercios.objetocomercial}
                                </div>
                                <div className="col-md-12">
                                    <strong>Persona Id:</strong>
                                    {comercios.persona_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observaciones:</strong>
                                    {comercios.observaciones}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {comercios.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {comercios.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {comercios.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}