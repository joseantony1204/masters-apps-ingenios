import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { useForm } from '@inertiajs/react';
interface Props {
    ftimpuestos: any;
}

export default function Create({ ftimpuestos }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id: ftimpuestos.id || '',
        
        base: ftimpuestos.base || '',
                             
        valor: ftimpuestos.valor || '',
                             
        detalle_id: ftimpuestos.detalle_id || '',
                             
        impuesto_id: ftimpuestos.impuesto_id || '',
                             
        factura_id: ftimpuestos.factura_id || '',
                             
        created_by: ftimpuestos.created_by || '',
                             
        updated_by: ftimpuestos.updated_by || '',
                             
        deleted_by: ftimpuestos.deleted_by || '',
                             

    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ftimpuestos.store'));
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
                            <li className="breadcrumb-item"><a href={route('ftimpuestos.index')}>Ftimpuestos</a></li>
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
                                        <a href={route('ftimpuestos.index')} className="btn btn-outline-secondary">Cancelar</a> 
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