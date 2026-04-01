import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Cfcomercios } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    cfcomercios: Cfcomercios;
}

export default function Edit({ cfcomercios}: Props) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        id: cfcomercios.id || '',
        
        nombre: cfcomercios.nombre || '',
                             
        direccion: cfcomercios.direccion || '',
                             
        telefono: cfcomercios.telefono || '',
                             
        email: cfcomercios.email || '',
                             
        esprincipal: cfcomercios.esprincipal || '',
                             
        pais_id: cfcomercios.pais_id || '',
                             
        departamento_id: cfcomercios.departamento_id || '',
                             
        municipio_id: cfcomercios.municipio_id || '',
                             
        estado_id: cfcomercios.estado_id || '',
                             
        descripcion: cfcomercios.descripcion || '',
                             
        created_by: cfcomercios.created_by || '',
                             
        updated_by: cfcomercios.updated_by || '',
                             
        deleted_by: cfcomercios.deleted_by || '',
                             

      });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('cfcomercios.update', data.id));
    };

    const handleDelete = () => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfcomercios.destroy', data.id));
        }
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
                            <li className="breadcrumb-item"><a href={route('cfcomercios.index')}>Cfcomercios</a></li>
                            <li className="breadcrumb-item" aria-current="page">Actualizar</li>
                        </ul>
                    </div>
                    <div className="col-md-12">
                        <div className="page-header-title"><h2 className="mb-0">Actualizar</h2></div>
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
                                    <div className="col-sm-auto">
                                        <button
                                            type="button" 
                                            onClick={() => handleDelete()}
                                            className="btn btn-outline-danger">
                                            <i className="fa fa-fw fa-trash"></i> Eliminar
                                        </button>
                                    </div>
                                    <div className="col-sm-auto btn-page">
                                        <a href={route('cfcomercios.index')} className="btn btn-outline-secondary">Cancelar</a> 
                                        <button type="submit" className="btn btn-light-primary" disabled={processing}>
                                            <i className="fa fa-fw fa-check-circle"></i> Actualizar
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