import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Ftdetalles } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    ftdetalles: Ftdetalles;
}

export default function Edit({ ftdetalles}: Props) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        id: ftdetalles.id || '',
        
        cantidad: ftdetalles.cantidad || '',
                             
        numero: ftdetalles.numero || '',
                             
        precioinicial: ftdetalles.precioinicial || '',
                             
        preciofinal: ftdetalles.preciofinal || '',
                             
        descuento: ftdetalles.descuento || '',
                             
        totalapagar: ftdetalles.totalapagar || '',
                             
        fecha: ftdetalles.fecha || '',
                             
        observaciones: ftdetalles.observaciones || '',
                             
        producto_id: ftdetalles.producto_id || '',
                             
        factura_id: ftdetalles.factura_id || '',
                             
        estado_id: ftdetalles.estado_id || '',
                             
        created_by: ftdetalles.created_by || '',
                             
        updated_by: ftdetalles.updated_by || '',
                             
        deleted_by: ftdetalles.deleted_by || '',
                             

      });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('ftdetalles.update', data.id));
    };

    const handleDelete = () => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftdetalles.destroy', data.id));
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
                            <li className="breadcrumb-item"><a href={route('ftdetalles.index')}>Ftdetalles</a></li>
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
                                        <a href={route('ftdetalles.index')} className="btn btn-outline-secondary">Cancelar</a> 
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