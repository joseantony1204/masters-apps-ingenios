import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Ftterminales } from '@/types';
  
interface Props {
    ftterminales: Ftterminales;
}

export default function Show({ ftterminales }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="ftterminales" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftterminales.index')}> Ftterminales</a></li>
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
                                Detalle de registro de ftterminales
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftterminales.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Nombre:</strong>
                                    {ftterminales.nombre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Logo:</strong>
                                    {ftterminales.logo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Resolucion Id:</strong>
                                    {ftterminales.resolucion_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {ftterminales.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {ftterminales.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {ftterminales.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {ftterminales.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}