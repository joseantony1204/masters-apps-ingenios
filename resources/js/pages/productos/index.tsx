import AppMainLayout from '@/layouts/app-main-layout';
import Table from './partials/table';
import { Productos } from '@/types';
import { Head, Link, useForm, usePage} from '@inertiajs/react';

interface Props {
    productos: Productos[];
}


export default function Index({ productos }: Props) {
    const { auth } = usePage().props as any;
    console.log('Auth user:', auth.user); // Verificar que auth.user esté disponible
    return (  
    <AppMainLayout>
        <Head title="productos" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('productos.index')}> Productos</a></li>
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
                <div className="card table-card" >
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span id="card_title">
                                Gestión de productos
                            </span>
					
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('productos.create') }><i className="fa fa-fw fa-plus"></i> Agregar</a>
				            </div>
                            {/*
                            <div className="float-right">
                                Comprobamos si el permiso existe dentro de las props globales de auth 
                                {auth.user.check('productos.create') && (
                                    <Link 
                                        className="btn btn-sm btn-light-primary" 
                                        href={route('productos.create')}
                                    >
                                        <i className="fa fa-fw fa-plus me-1"></i> Agregar
                                    </Link>
                                )}
                                </div>*/}

                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <Table productos={productos}/>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}