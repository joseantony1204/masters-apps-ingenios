import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Sgrolesperfiles } from '@/types';
  
interface Props {
    sgrolesperfiles: Sgrolesperfiles;
}

export default function Show({ sgrolesperfiles }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="sgrolesperfiles" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('sgrolesperfiles.index')}> Sgrolesperfiles</a></li>
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
                                Detalle de registro de sgrolesperfiles
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('sgrolesperfiles.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Perfil Id:</strong>
                                    {sgrolesperfiles.perfil_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Rol Id:</strong>
                                    {sgrolesperfiles.rol_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado:</strong>
                                    {sgrolesperfiles.estado}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observacion:</strong>
                                    {sgrolesperfiles.observacion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {sgrolesperfiles.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {sgrolesperfiles.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {sgrolesperfiles.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}