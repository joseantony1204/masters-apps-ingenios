import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Users } from '@/types';
  
interface Props {
    users: Users;
}

export default function Show({ users }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="users" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('users.index')}> Users</a></li>
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
                                Detalle de registro de users
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('users.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Username:</strong>
                                    {users.username}
                                </div>
                                <div className="col-md-12">
                                    <strong>Email:</strong>
                                    {users.email}
                                </div>
                                <div className="col-md-12">
                                    <strong>Telefonomovil:</strong>
                                    {users.telefonomovil}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {users.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Perfil Id:</strong>
                                    {users.perfil_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Persona Id:</strong>
                                    {users.persona_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {users.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {users.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {users.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}