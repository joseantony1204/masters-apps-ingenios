import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Personas } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    personas: Personas;
}

export default function Create({ personas }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id: personas.id || '',
        
        identificacion: personas.identificacion || '',
                             
        digitoverificacion: personas.digitoverificacion || '',
                             
        lugarexpedicion: personas.lugarexpedicion || '',
                             
        fechaexpedicion: personas.fechaexpedicion || '',
                             
        telefono: personas.telefono || '',
                             
        telefonomovil: personas.telefonomovil || '',
                             
        sendsms: personas.sendsms || '',
                             
        email: personas.email || '',
                             
        sendemail: personas.sendemail || '',
                             
        foto: personas.foto || '',
                             
        firma: personas.firma || '',
                             
        direccion: personas.direccion || '',
                             
        pais_id: personas.pais_id || '',
                             
        departamento_id: personas.departamento_id || '',
                             
        ciudad_id: personas.ciudad_id || '',
                             
        barrio: personas.barrio || '',
                             
        tipoidentificacion_id: personas.tipoidentificacion_id || '',
                             
        tiporegimen_id: personas.tiporegimen_id || '',
                             
        observaciones: personas.observaciones || '',
                             
        created_by: personas.created_by || '',
                             
        updated_by: personas.updated_by || '',
                             
        deleted_by: personas.deleted_by || '',
                             

    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('personas.store'));
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
                            <li className="breadcrumb-item"><a href={route('personas.index')}>Personas</a></li>
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
                                        <a href={route('personas.index')} className="btn btn-outline-secondary">Cancelar</a> 
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