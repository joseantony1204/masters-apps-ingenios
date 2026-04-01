import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Ftresoluciones } from '@/types';
  
interface Props {
    ftresoluciones: Ftresoluciones;
}

export default function Show({ ftresoluciones }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="ftresoluciones" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftresoluciones.index')}> Ftresoluciones</a></li>
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
                                Detalle de registro de ftresoluciones
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftresoluciones.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Numero:</strong>
                                    {ftresoluciones.numero}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha:</strong>
                                    {ftresoluciones.fecha}
                                </div>
                                <div className="col-md-12">
                                    <strong>Prefijo:</strong>
                                    {ftresoluciones.prefijo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Desde:</strong>
                                    {ftresoluciones.desde}
                                </div>
                                <div className="col-md-12">
                                    <strong>Hasta:</strong>
                                    {ftresoluciones.hasta}
                                </div>
                                <div className="col-md-12">
                                    <strong>Actual:</strong>
                                    {ftresoluciones.actual}
                                </div>
                                <div className="col-md-12">
                                    <strong>Advertirescacez:</strong>
                                    {ftresoluciones.advertirescacez}
                                </div>
                                <div className="col-md-12">
                                    <strong>Descripcion:</strong>
                                    {ftresoluciones.descripcion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fechafinal:</strong>
                                    {ftresoluciones.fechafinal}
                                </div>
                                <div className="col-md-12">
                                    <strong>Comercio Id:</strong>
                                    {ftresoluciones.comercio_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado:</strong>
                                    {ftresoluciones.estado}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {ftresoluciones.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {ftresoluciones.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {ftresoluciones.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}