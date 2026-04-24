import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
  
interface Props {
    cfpromociones: any;
}

export default function Show({ cfpromociones }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfpromociones" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfpromociones.index')}> Cfpromociones</a></li>
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
                                Detalle de registro de cfpromociones
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfpromociones.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Nombre:</strong>
                                    {cfpromociones.nombre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Descripcion:</strong>
                                    {cfpromociones.descripcion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Tipo Descuento:</strong>
                                    {cfpromociones.tipo_descuento}
                                </div>
                                <div className="col-md-12">
                                    <strong>Valor:</strong>
                                    {cfpromociones.valor}
                                </div>
                                <div className="col-md-12">
                                    <strong>Compra Minima:</strong>
                                    {cfpromociones.compra_minima}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha Inicio:</strong>
                                    {cfpromociones.fecha_inicio}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fecha Fin:</strong>
                                    {cfpromociones.fecha_fin}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado:</strong>
                                    {cfpromociones.estado}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {cfpromociones.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {cfpromociones.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {cfpromociones.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}