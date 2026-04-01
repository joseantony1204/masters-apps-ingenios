import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Cfcomercios } from '@/types';
  
interface Props {
    cfcomercios: Cfcomercios;
}

export default function Show({ cfcomercios }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfcomercios" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfcomercios.index')}> Cfcomercios</a></li>
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
                                Detalle de registro de cfcomercios
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfcomercios.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Nombre:</strong>
                                    {cfcomercios.nombre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Direccion:</strong>
                                    {cfcomercios.direccion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Telefono:</strong>
                                    {cfcomercios.telefono}
                                </div>
                                <div className="col-md-12">
                                    <strong>Email:</strong>
                                    {cfcomercios.email}
                                </div>
                                <div className="col-md-12">
                                    <strong>Esprincipal:</strong>
                                    {cfcomercios.esprincipal}
                                </div>
                                <div className="col-md-12">
                                    <strong>Pais Id:</strong>
                                    {cfcomercios.pais_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Departamento Id:</strong>
                                    {cfcomercios.departamento_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Municipio Id:</strong>
                                    {cfcomercios.municipio_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {cfcomercios.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Descripcion:</strong>
                                    {cfcomercios.descripcion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {cfcomercios.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {cfcomercios.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {cfcomercios.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}