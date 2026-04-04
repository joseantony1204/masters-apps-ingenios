import AppMainLayout from '@/layouts/app-main-layout';
import { Head } from '@inertiajs/react';
import Fields from './partials/fields';
import { Ftfacturas } from '@/types';
import { useForm } from '@inertiajs/react';
interface Props {
    ftfactura: any;
    cita : any;
    turnoActivo : any;
    sedePredeterminada : any;
    turnosList: any[];
    estadosList: any[];
    comercio: any;
    metodospagosList: any[];
}

export default function Edit({ ftfactura, cita, sedePredeterminada, turnoActivo, comercio, turnosList, estadosList, metodospagosList }: Props) {
    const { data, setData, put, delete: destroy, processing, errors } = useForm({
        // Datos de cabecera
        id: ftfactura.id || '',
        numero: ftfactura.numero || '',
        fecha: ftfactura.fecha || new Date().toISOString().slice(0, 16),
        fechanavencimiento: ftfactura.fechanavencimiento || new Date().toISOString().slice(0, 16),
        observaciones: ftfactura.observaciones || '',

        // Lógica Polimórfica (Cliente)
        model_type: ftfactura.model_type || 0,
        model_type_id: ftfactura.model_type_id || cita?.cliente?.persona?.id || '',
        cliente_nombre_aux: cita?.cliente?.persona?.personasnaturales?.nombrecompleto || '', // Para mostrar el nombre en la UI sin recargar
        cliente_identificacion_aux: cita?.cliente?.persona?.identificacion || '',
        cliente_direccion_aux: cita?.cliente?.persona?.direccion || '',
        cliente_telefonomovil_aux: cita?.cliente?.persona?.telefonomovil || '',
        cliente_email_aux: cita?.cliente?.persona?.email || '',

        // Datos del Emisor (Sede)
        origen_id: sedePredeterminada?.id || '',
        emisor_nombre: comercio?.nombre || 'Mi Comercio',
        emisor_sede: sedePredeterminada?.nombre || '',
        emisor_direccion: sedePredeterminada?.direccion || 'Sin direccion',
        emisor_telefono: sedePredeterminada?.telefono || 'Sin telefono',
        emisor_email: sedePredeterminada?.email || 'Sin email',
                             
        // Detalle e Impuestos
        items: [] as any[], // Aquí se guardarán los productos/servicios
        subtotal: 0,
        discount_percent: 0,
        discount_amount: 0,
        tax_percent: 0,
        tax_amount: 0,
        total: 0,

        // Otros
        metodo_id: '',
        estado_id: '',
        turno_id: turnoActivo?.id || '',
        comercio_id: comercio?.id || '',
                             

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
                            <li className="breadcrumb-item"><a href={route('ftfacturas.index')}>Factura</a></li>
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
                            <Fields 
                                data={data} 
                                setData={setData} 
                                errors={errors} 
                                comercio={comercio} 
                                cita={cita} 
                                turnoActivo={turnoActivo} 
                                sedePredeterminada={sedePredeterminada} 
                                turnosList={turnosList}
                                metodospagosList={metodospagosList}
                                estadosList={estadosList}
                            />
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