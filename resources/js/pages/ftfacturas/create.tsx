import AppMainLayout from '@/layouts/app-main-layout';
import { Head, useForm } from '@inertiajs/react';
import Fields from './partials/fields';
import { Ftfacturas } from '@/types';
import React from 'react';

interface Props {
    ftfactura: Ftfacturas;
    cita : any;
    turnoActivo : any;
    sedePredeterminada : any;
    turnosList: any[];
    estadosList: any[];
    comercio: any;
    metodospagosList: any[];
}

export default function Create({ftfactura, cita, turnoActivo, comercio, sedePredeterminada, turnosList, estadosList, metodospagosList }: Props) {
    const today = new Date().toLocaleString('sv-SE', { timeZone: 'America/Bogota', hour12: false  }).replace(' ', 'T').slice(0, 16);
    console.log("Persona", cita?.cliente?.persona_id || ftfactura.model_type_id || '', );
    const { data, setData, post, processing, errors } = useForm({
        // Datos de cabecera
        id: ftfactura.id || null,
        numero: ftfactura.numero || '',
        fecha: ftfactura.fecha || today,
        fechanavencimiento: ftfactura.fechanavencimiento || today,
        observaciones: ftfactura.observaciones || '',
        
        // Lógica Polimórfica (Cliente)
        model_type: ftfactura.model_type || 921 || 0,
        model_type_id: ftfactura.model_type_id || cita?.id || '',
        cliente_nombre_aux: cita?.cliente?.persona?.personasnaturales?.nombrecompleto || '', // Para mostrar el nombre en la UI sin recargar
        persona_id: cita?.cliente?.persona_id || ftfactura.model_type_id || '', // Para obterner el ID real de la persona al enviar el formulario
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
        subtotal: ftfactura?.subtotal || 0,
        descuento: ftfactura?.descuento || 0,
        porcentajedescuento: ftfactura?.porcentajedescuento || 0,
        impuesto: ftfactura?.impuesto || 0,
        total: ftfactura?.total || 0,

        // Otros
        metodo_id: ftfactura?.adpagos?.[0]?.metodo_id || '',
        estado_id: ftfactura?.estado_id || '',
        cupon_id: ftfactura?.cupon_id || '',
        turno_id: turnoActivo?.id || '',
        comercio_id: comercio?.id || '',
    });

    // 1. Cambia el nombre de la función para que reciba el parámetro de acción
    const handleSubmit = (e: React.FormEvent, redirect: boolean = false) => {
        e.preventDefault();
        
        if (!data.model_type_id) {
            alert("Por favor seleccione un cliente");
            return;
        }
        if (data.items.length === 0) {
            alert("Debe agregar al menos un ítem al detalle");
            return;
        }

        // 2. Enviamos el estado deseado como parte de la petición
        // 'redirect' le dirá al controlador si debe redireccionar a index o al dash
        post(route('ftfacturas.store', { redirect: redirect }), {
            onSuccess: () => {
                // Notificación de éxito
            }
        });
    };

    return (
        <AppMainLayout>
            <Head title="Crear factura" />
            
            <div className="page-header">
                <div className="page-block">
                    <div className="row align-items-center">
                        <div className="col-md-12">
                            <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href={route('dashboard')}>Inicio</a></li>
                                <li className="breadcrumb-item"><a href={route('ftfacturas.index')}>Facturas</a></li>
                                <li className="breadcrumb-item" aria-current="page">Crear</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <div className="page-header-title">
                                <h2 className="mb-0">Crear factura</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12">
                    <div className="card shadow-none border">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <Fields 
                                    ftfactura={ftfactura} 
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
                                            <i className="ti ti-info-circle me-1"></i>
                                            Verifique los totales antes de finalizar.
                                        </div>
                                        <div className="col-sm-auto btn-page">
                                            <a href={route('ftfacturas.index')} className="btn btn-outline-secondary">Cancelar</a> 
                                            <button 
                                                type="button" 
                                                className="btn btn-light-primary" 
                                                disabled={processing}
                                                onClick={(e) => handleSubmit(e, true)}
                                            >
                                                {processing ? (
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                ) : (
                                                    <i className="ti ti-circle-check me-1"></i>
                                                )}
                                                Generar factura con estado
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