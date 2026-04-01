import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Ftfacturas } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    ftfacturas: Ftfacturas;
}

export default function Edit({ ftfacturas}: Props) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        id: ftfacturas.id || '',
        
        codigoseguridad: ftfacturas.codigoseguridad || '',
                             
        numero: ftfacturas.numero || '',
                             
        fecha: ftfacturas.fecha || '',
                             
        fechanavencimiento: ftfacturas.fechanavencimiento || '',
                             
        observaciones: ftfacturas.observaciones || '',
                             
        tabla_id: ftfacturas.tabla_id || '',
                             
        referencia_id: ftfacturas.referencia_id || '',
                             
        origen_id: ftfacturas.origen_id || '',
                             
        destino_id: ftfacturas.destino_id || '',
                             
        tipo_id: ftfacturas.tipo_id || '',
                             
        turno_id: ftfacturas.turno_id || '',
                             
        estado_id: ftfacturas.estado_id || '',
                             
        comercio_id: ftfacturas.comercio_id || '',
                             
        created_by: ftfacturas.created_by || '',
                             
        updated_by: ftfacturas.updated_by || '',
                             
        deleted_by: ftfacturas.deleted_by || '',
                             

      });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('ftfacturas.update', data.id));
    };

    const handleDelete = () => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftfacturas.destroy', data.id));
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
                            <li className="breadcrumb-item"><a href={route('ftfacturas.index')}>Ftfacturas</a></li>
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
                                        <a href={route('ftfacturas.index')} className="btn btn-outline-secondary">Cancelar</a> 
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