import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';

  
interface Props {
    addetallescitas: any;
}

export default function Show({ addetallescitas }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="addetallescitas" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('addetallescitas.index')}> Addetallescitas</a></li>
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
                                Detalle de registro de addetallescitas
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('addetallescitas.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Descuento:</strong>
                                    {addetallescitas.descuento}
                                </div>
                                <div className="col-md-12">
                                    <strong>Preciofinal:</strong>
                                    {addetallescitas.preciofinal}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fechacreado:</strong>
                                    {addetallescitas.fechacreado}
                                </div>
                                <div className="col-md-12">
                                    <strong>Empleadoservicio Id:</strong>
                                    {addetallescitas.empleadoservicio_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Cita Id:</strong>
                                    {addetallescitas.cita_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {addetallescitas.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observaciones:</strong>
                                    {addetallescitas.observaciones}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {addetallescitas.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {addetallescitas.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {addetallescitas.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}