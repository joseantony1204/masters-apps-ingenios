import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Comercios } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    comercios: Comercios;
}

export default function Create({ comercios }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id: comercios.id || '',
        nombre: comercios.nombre || '',
                             
        objetocomercial: comercios.objetocomercial || '',
                             
        persona_id: comercios.persona_id || '',
                             
        observaciones: comercios.observaciones || '',
                             
        created_by: comercios.created_by || '',
                             
        updated_by: comercios.updated_by || '',
                             
        deleted_by: comercios.deleted_by || '',
                             

    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('comercios.store'));
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
                            <li className="breadcrumb-item"><a href={route('comercios.index')}>Comercios</a></li>
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
                                        <a href={route('comercios.index')} className="btn btn-outline-secondary">Cancelar</a> 
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