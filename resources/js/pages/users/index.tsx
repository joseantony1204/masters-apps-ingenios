import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Users } from '@/types';
  
interface Props {
    users: Users[];
}


export default function Index({ users }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="users" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('users.index')}> Usuarios</a></li>
                            <li className="breadcrumb-item" aria-current="page">Listado</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title"><h2 className="mb-0">Listado</h2></div>
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
                                Gestión de usuarios
                            </span>
                            <div className="float-right">
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <Table users={users}/>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}