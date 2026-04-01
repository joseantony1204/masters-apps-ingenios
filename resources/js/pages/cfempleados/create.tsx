import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Personas, Personasnaturales, Cfempleados } from '@/types';
import { useForm } from '@inertiajs/react';
const today = new Date().toISOString().split('T')[0];
interface Props {
    personas: Personas;
    personasnaturales: Personasnaturales;
    empleados: Cfempleados;
    tpidentificacionList: Record<string, string>;
    sexosList: Record<string, string>;
    ocupacionesList: Record<string, string>;
    estadosList: Record<string, string>;
}

export default function Create({ personas, personasnaturales, empleados, tpidentificacionList, sexosList, ocupacionesList, estadosList }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        id: empleados.id || '',
        tipoidentificacion_id: personas.tipoidentificacion_id || '',               
        identificacion: personas.identificacion || '',               
        telefonomovil: personas.telefonomovil || '',               
        email: personas.email || '',               
        fechanacimiento: personasnaturales.fechanacimiento || '',               
        nombre: personasnaturales.nombre || '',               
        segundonombre: personasnaturales.segundonombre || '',               
        apellido: personasnaturales.apellido || '',               
        segundoapellido: personasnaturales.segundoapellido || '',  
        sexo_id: personasnaturales.sexo_id || '',  
        ocupacion_id: personasnaturales.ocupacion_id || '',
        fechaingreso: empleados.fechaingreso || today,                           
        estado_id: empleados.estado_id || '',                 
        observaciones: empleados.observaciones || '',                 
        created_by: empleados.created_by || '',                 
        updated_by: empleados.updated_by || '',                
        deleted_by: empleados.deleted_by || '',
    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cfempleados.store'));
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
                            <li className="breadcrumb-item"><a href={route('cfempleados.index')}>Empleados</a></li>
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
                            <Fields data={data} setData={setData}  tpidentificacionList={tpidentificacionList} sexosList={sexosList} ocupacionesList={ocupacionesList} estadosList={estadosList} errors={errors}/>

                            <div className="col-12">
                                <div className="row align-items-end justify-content-between g-3">
                                    <div className="col-sm-auto"></div>
                                    <div className="col-sm-auto btn-page">
                                        <a href={route('cfempleados.index')} className="btn btn-outline-secondary">Cancelar</a> 
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