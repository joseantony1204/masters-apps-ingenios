import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Ftfacturas } from '@/types';
  
interface Props {
    ftfacturas: Ftfacturas;
}

export default function Show({ ftfacturas }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="ftfacturas" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('ftfacturas.index')}> Ftfacturas</a></li>
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
                                Detalle de registro de ftfacturas
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('ftfacturas.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Codigoseguridad:</strong>
                                    {ftfacturas.codigoseguridad}
                                </div>
                                <div className="col-md-12">
                                    <strong>Numero:</strong>
                                    {ftfacturas.numero}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha:</strong>
                                    {ftfacturas.fecha}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fechanavencimiento:</strong>
                                    {ftfacturas.fechanavencimiento}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observaciones:</strong>
                                    {ftfacturas.observaciones}
                                </div>
                                <div className="col-md-12">
                                    <strong>Tabla Id:</strong>
                                    {ftfacturas.tabla_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Referencia Id:</strong>
                                    {ftfacturas.referencia_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Origen Id:</strong>
                                    {ftfacturas.origen_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Destino Id:</strong>
                                    {ftfacturas.destino_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Tipo Id:</strong>
                                    {ftfacturas.tipo_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Turno Id:</strong>
                                    {ftfacturas.turno_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {ftfacturas.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Comercio Id:</strong>
                                    {ftfacturas.comercio_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {ftfacturas.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {ftfacturas.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {ftfacturas.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}