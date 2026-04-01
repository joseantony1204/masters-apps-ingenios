import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Productos } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    productos: Productos;
    categoriasList: Record<string, string>;
    unidadesList: Record<string, string>;
    estadosList: Record<string, string>;
    tiposList: Record<string, string>;
    marcasList: Record<string, string>;
    ubicacionesList: Record<string, string>;
    impuestosList: Record<string, string>; 
    sedesList: Record<string, string>; 
}

export default function Edit({ productos, categoriasList, unidadesList, estadosList, marcasList, ubicacionesList, impuestosList, tiposList, sedesList}: Props) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        id: productos.id || '',
        codigo: productos.codigo || '',                 
        codigobarra: productos.codigobarra || '',                 
        nombre: productos.nombre || '',                 
        duracion: productos.duracion || '',                 
        descripcion: productos.descripcion || '',                 
        minimostock: productos.minimostock || '',                 
        precioingreso: productos.precioingreso || '',               
        preciosalida: productos.preciosalida || '',               
        acumulapuntos: productos.acumulapuntos || '',                
        observacion: productos.observacion || '',                
        padre: productos.padre || '',                 
        tipo_id: productos.tipo_id || '',               
        unidad_id: productos.unidad_id || '',                
        ubicacion_id: productos.ubicacion_id || '',                 
        impuesto_id: productos.impuesto_id || '',                 
        categoria_id: productos.categoria_id || '',                 
        marca_id: productos.marca_id || '',                
        estado_id: productos.estado_id || '',
        sede_id: productos.sede_id || '',
      });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('productos.update', data.id));
    };

    const handleDelete = () => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('productos.destroy', data.id));
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
                            <li className="breadcrumb-item"><a href={route('productos.index')}>Productos</a></li>
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
                            <Fields data={data} setData={setData} categoriasList={categoriasList} unidadesList={unidadesList} estadosList={estadosList} marcasList={marcasList} ubicacionesList={ubicacionesList} impuestosList={impuestosList} tiposList={tiposList} sedesList={sedesList} errors={errors}/>
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
                                        <a href={route('productos.index')} className="btn btn-outline-secondary">Cancelar</a> 
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