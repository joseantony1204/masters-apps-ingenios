import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';

import { useForm } from '@inertiajs/react';
interface Props {
    addetallescitas: any;
}

export default function Create({ addetallescitas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id: addetallescitas.id || '',
        
        descuento: addetallescitas.descuento || '',
                             
        preciofinal: addetallescitas.preciofinal || '',
                             
        fechacreado: addetallescitas.fechacreado || '',
                             
        empleadoservicio_id: addetallescitas.empleadoservicio_id || '',
                             
        cita_id: addetallescitas.cita_id || '',
                             
        estado_id: addetallescitas.estado_id || '',
                             
        observaciones: addetallescitas.observaciones || '',
                             
        created_by: addetallescitas.created_by || '',
                             
        updated_by: addetallescitas.updated_by || '',
                             
        deleted_by: addetallescitas.deleted_by || '',
                             

    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('addetallescitas.store'));
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
                            <li className="breadcrumb-item"><a href={route('addetallescitas.index')}>Addetallescitas</a></li>
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
                                        <a href={route('addetallescitas.index')} className="btn btn-outline-secondary">Cancelar</a> 
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