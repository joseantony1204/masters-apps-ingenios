import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Cfsedes } from '@/types';
  
interface Props {
    cfsedes: Cfsedes[];
}


export default function Index({ cfsedes }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfsedes" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfsedes.index')}> Cfsedes</a></li>
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
                                Gestión de cfsedes
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfsedes.create') }><i className="fa fa-fw fa-plus"></i> Agregar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <Table cfsedes={cfsedes}/>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}