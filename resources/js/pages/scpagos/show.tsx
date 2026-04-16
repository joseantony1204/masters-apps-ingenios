import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Scpagos } from '@/types';
  
interface Props {
    scpagos: Scpagos;
}

export default function Show({ scpagos }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="scpagos" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('scpagos.index')}> Scpagos</a></li>
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
                                Detalle de registro de scpagos
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('scpagos.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Valor:</strong>
                                    {scpagos.valor}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha:</strong>
                                    {scpagos.fecha}
                                </div>
                                <div className="col-md-12">
                                    <strong>Referencia Pasarela:</strong>
                                    {scpagos.referencia_pasarela}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {scpagos.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Metodo Id:</strong>
                                    {scpagos.metodo_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Suscripcion Id:</strong>
                                    {scpagos.suscripcion_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {scpagos.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {scpagos.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {scpagos.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}