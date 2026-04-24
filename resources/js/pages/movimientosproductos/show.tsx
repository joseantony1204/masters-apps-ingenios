import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Movimientosproductos } from '@/types';
  
interface Props {
    movimientosproductos: Movimientosproductos;
}

export default function Show({ movimientosproductos }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="movimientosproductos" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('movimientosproductos.index')}> Movimientosproductos</a></li>
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
                                Detalle de registro de movimientosproductos
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('movimientosproductos.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Tipo:</strong>
                                    {movimientosproductos.tipo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Cantidad:</strong>
                                    {movimientosproductos.cantidad}
                                </div>
                                <div className="col-md-12">
                                    <strong>Stock Resultante:</strong>
                                    {movimientosproductos.stock_resultante}
                                </div>
                                <div className="col-md-12">
                                    <strong>Motivo:</strong>
                                    {movimientosproductos.motivo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Producto Id:</strong>
                                    {movimientosproductos.producto_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {movimientosproductos.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {movimientosproductos.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {movimientosproductos.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}