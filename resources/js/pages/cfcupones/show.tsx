import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Table from './partials/table';
import { Cfcupones } from '@/types';
  
interface Props {
    cfcupones: Cfcupones;
}

export default function Show({ cfcupones }: Props) {
    
    return (  
    <AppMainLayout>
        <Head title="cfcupones" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                    <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfcupones.index')}> Cfcupones</a></li>
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
                                Detalle de registro de cfcupones
                            </span>
                            <div className="float-right">
                                <a className="btn btn-sm btn-light-primary " href={ route('cfcupones.index') }><i className="fa fa-fw fa-backward"></i> Regresar</a>
                            </div>
                        </div>
                    </div>	
                    
                    <div className="card-body">
                        <div className="row">
                            
                                <div className="col-md-12">
                                    <strong>Promocion Id:</strong>
                                    {cfcupones.promocion_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Codigo:</strong>
                                    {cfcupones.codigo}
                                </div>
                                <div className="col-md-12">
                                    <strong>Persona Id:</strong>
                                    {cfcupones.persona_id}
                                </div>
                                <div className="col-md-12">
                                    <strong>Limite Uso Total:</strong>
                                    {cfcupones.limite_uso_total}
                                </div>
                                <div className="col-md-12">
                                    <strong>Limite Uso Por Persona:</strong>
                                    {cfcupones.limite_uso_por_persona}
                                </div>
                                <div className="col-md-12">
                                    <strong>Usos Actuales:</strong>
                                    {cfcupones.usos_actuales}
                                </div>
                                <div className="col-md-12">
                                    <strong>Es Automatico:</strong>
                                    {cfcupones.es_automatico}
                                </div>
                                <div className="col-md-12">
                                    <strong>Fechavence:</strong>
                                    {cfcupones.fechavence}
                                </div>
                                <div className="col-md-12">
                                    <strong>Created By:</strong>
                                    {cfcupones.created_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Updated By:</strong>
                                    {cfcupones.updated_by}
                                </div>
                                <div className="col-md-12">
                                    <strong>Deleted By:</strong>
                                    {cfcupones.deleted_by}
                                </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}