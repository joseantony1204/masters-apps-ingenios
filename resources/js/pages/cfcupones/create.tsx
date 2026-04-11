import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Cfcupones } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    cfcupones: Cfcupones;
}

export default function Create({ cfcupones }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id: cfcupones.id || '',
        
        promocion_id: cfcupones.promocion_id || '',
                             
        codigo: cfcupones.codigo || '',
                             
        persona_id: cfcupones.persona_id || '',
                             
        limite_uso_total: cfcupones.limite_uso_total || '',
                             
        limite_uso_por_persona: cfcupones.limite_uso_por_persona || '',
                             
        usos_actuales: cfcupones.usos_actuales || '',
                             
        es_automatico: cfcupones.es_automatico || '',
                             
        fechavence: cfcupones.fechavence || '',
                             
        created_by: cfcupones.created_by || '',
                             
        updated_by: cfcupones.updated_by || '',
                             
        deleted_by: cfcupones.deleted_by || '',
                             

    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cfcupones.store'));
    };

    return (
        
    <AppMainLayout>
        <Head title="Crear registro" />
        <div className="page-header">
            <div className="page-block">
                <div className="row align-items-center">
                <div className="col-md-12">
                        <ul className="breadcrumb">
                            <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                            <li className="breadcrumb-item"><a href={route('cfcupones.index')}>Cfcupones</a></li>
                            <li className="breadcrumb-item" aria-current="page">Crear</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title"><h2 className="mb-0">Crear</h2></div>
                    </div>
                </div>
            </div>
        </div>
    

        <div className="row">
            <div className="col-sm-12">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <Fields data={data} setData={setData} errors={errors}/>

                            <div className="col-12">
                                <div className="row align-items-end justify-content-between g-3">
                                    <div className="col-sm-auto"></div>
                                    <div className="col-sm-auto btn-page">
                                        <a href={route('cfcupones.index')} className="btn btn-outline-secondary">Cancelar</a> 
                                        <button type="submit" className="btn btn-light-primary" disabled={processing}>
                                            <i className="fa fa-fw fa-check-circle"></i> Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </AppMainLayout> 
    );
}