import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Cfimpuestos } from '@/types';
  
interface Props {
    cfimpuestos: Cfimpuestos;
}

export default function Show({ cfimpuestos }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfimpuestos" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfimpuestos.index')}> Cfimpuestos</a></li>
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
                                Detalle de registro de cfimpuestos
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfimpuestos.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Codigo:</strong>
                                    {cfimpuestos.codigo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Nombre:</strong>
                                    {cfimpuestos.nombre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Descripcion:</strong>
                                    {cfimpuestos.descripcion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Valor:</strong>
                                    {cfimpuestos.valor}
                                </div>
                                <div className="col-md-12">
                                    <strong>Activo:</strong>
                                    {cfimpuestos.activo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Tipo Id:</strong>
                                    {cfimpuestos.tipo_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {cfimpuestos.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {cfimpuestos.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {cfimpuestos.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}