import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Personas } from '@/types';
  
interface Props {
    personas: Personas;
}

export default function Show({ personas }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="personas" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('personas.index')}> Personas</a></li>
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
                                Detalle de registro de personas
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('personas.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Identificacion:</strong>
                                    {personas.identificacion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Digitoverificacion:</strong>
                                    {personas.digitoverificacion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Lugarexpedicion:</strong>
                                    {personas.lugarexpedicion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fechaexpedicion:</strong>
                                    {personas.fechaexpedicion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Telefono:</strong>
                                    {personas.telefono}
                                </div>
                                <div className="col-md-12">
                                    <strong>Telefonomovil:</strong>
                                    {personas.telefonomovil}
                                </div>
                                <div className="col-md-12">
                                    <strong>Sendsms:</strong>
                                    {personas.sendsms}
                                </div>
                                <div className="col-md-12">
                                    <strong>Email:</strong>
                                    {personas.email}
                                </div>
                                <div className="col-md-12">
                                    <strong>Sendemail:</strong>
                                    {personas.sendemail}
                                </div>
                                <div className="col-md-12">
                                    <strong>Foto:</strong>
                                    {personas.foto}
                                </div>
                                <div className="col-md-12">
                                    <strong>Firma:</strong>
                                    {personas.firma}
                                </div>
                                <div className="col-md-12">
                                    <strong>Direccion:</strong>
                                    {personas.direccion}
                                </div>
                                <div className="col-md-12">
                                    <strong>Pais Id:</strong>
                                    {personas.pais_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Departamento Id:</strong>
                                    {personas.departamento_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Ciudad Id:</strong>
                                    {personas.ciudad_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Barrio:</strong>
                                    {personas.barrio}
                                </div>
                                <div className="col-md-12">
                                    <strong>Tipoidentificacion Id:</strong>
                                    {personas.tipoidentificacion_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Tiporegimen Id:</strong>
                                    {personas.tiporegimen_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Observaciones:</strong>
                                    {personas.observaciones}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {personas.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {personas.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {personas.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}