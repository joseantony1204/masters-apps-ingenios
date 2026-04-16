import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Scsuscripciones } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    scsuscripciones: Scsuscripciones;
}

export default function Create({ scsuscripciones }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id: scsuscripciones.id || '',
        
        fecha_inicio: scsuscripciones.fecha_inicio || '',
                             
        fecha_vencimiento: scsuscripciones.fecha_vencimiento || '',
                             
        ultimo_pago_id: scsuscripciones.ultimo_pago_id || '',
                             
        estado_id: scsuscripciones.estado_id || '',
                             
        plan_id: scsuscripciones.plan_id || '',
                             
        comercio_id: scsuscripciones.comercio_id || '',
                             
        created_by: scsuscripciones.created_by || '',
                             
        updated_by: scsuscripciones.updated_by || '',
                             
        deleted_by: scsuscripciones.deleted_by || '',
                             

    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('scsuscripciones.store'));
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
                            <li className="breadcrumb-item"><a href={route('scsuscripciones.index')}>Scsuscripciones</a></li>
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
                                        <a href={route('scsuscripciones.index')} className="btn btn-outline-secondary">Cancelar</a> 
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