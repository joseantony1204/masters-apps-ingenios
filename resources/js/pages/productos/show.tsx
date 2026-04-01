import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Productos } from '@/types';
  
interface Props {
    productos: Productos;
}

export default function Show({ productos }: Props) {
    
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
                                Detalle de registro de productos
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('productos.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Codigo:</strong>
                                    {productos.codigo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Codigobarra:</strong>
                                    {productos.codigobarra}
                                </div>
                                <div className="col-md-12">
                                    <strong>Nombre:</strong>
                                    {productos.nombre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Descripcion:</strong>
                                    {productos.descripcion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Minimostock:</strong>
                                    {productos.minimostock}
                                </div>
                                <div className="col-md-12">
                                    <strong>Precioingreso:</strong>
                                    {productos.precioingreso}
                                </div>
                                <div className="col-md-12">
                                    <strong>Preciosalida:</strong>
                                    {productos.preciosalida}
                                </div>
                                <div className="col-md-12">
                                    <strong>Acumulapuntos:</strong>
                                    {productos.acumulapuntos}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observacion:</strong>
                                    {productos.observacion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Padre:</strong>
                                    {productos.padre}
                                </div>
                                <div className="col-md-12">
                                    <strong>Tipo Id:</strong>
                                    {productos.tipo_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Unidad Id:</strong>
                                    {productos.unidad_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Ubicacion Id:</strong>
                                    {productos.ubicacion_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Impuesto Id:</strong>
                                    {productos.impuesto_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Categoria Id:</strong>
                                    {productos.categoria_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Marca Id:</strong>
                                    {productos.marca_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Estado Id:</strong>
                                    {productos.estado_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {productos.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {productos.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {productos.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}