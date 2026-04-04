import React, { useImperativeHandle, forwardRef } from 'react';
import { useForm } from '@inertiajs/react';

interface Props {
    comercio?: any;
}

// Usamos forwardRef para permitir que el padre acceda a funciones internas
const FormComercio = forwardRef(({ comercio }: Props, ref) => {
    
    // 1. Buscamos el objeto de soporte dentro del array de soportes que ahora sí viene cargado
    const logoSoporte = comercio?.soportes[0];
    // Extraemos solo la ruta
    const rutaLogo = logoSoporte ? logoSoporte.ruta : null;

    const { data, setData, post, processing, errors } = useForm({
        id: comercio?.id || '',
        persona_id: comercio?.persona_id || '',
        nombre: comercio?.nombre || '',
        objetocomercial: comercio?.objetocomercial || '',
        nit: comercio?.persona?.identificacion || '',
        email: comercio?.persona?.email || '',
        telefonomovil: comercio?.persona?.telefonomovil || '',
        direccion: comercio?.persona?.direccion || '',
        observaciones: comercio?.observaciones || '',
        logo: null as File | null,
        current_logo_path: rutaLogo || null, 
    });

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();
        post(route('comercios.update'), {
            forceFormData: true, // Importante para enviar archivos (Logo)
            onSuccess: () => {
                // Opcional: Mostrar una notificación de éxito aquí
            }
        });
    };

    // Exponemos la función submit al componente padre
    useImperativeHandle(ref, () => ({
        submitForm: () => submit()
    }));

    return (
        <form id="form-comercio" onSubmit={submit} className="row g-4 animate__animated animate__fadeIn">
            {/* SECCIÓN LOGO */}
            <div className="bg-light-subtle p-4 rounded-3 border border-dashed border-primary-subtle mb-4">
                <div className="d-flex align-items-center gap-4">
                    <div className="position-relative">
                        <div className="avatar avatar-xl bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center border" style={{ width: '100px', height: '100px' }}>
                            {data.logo ? (
                                <img src={URL.createObjectURL(data.logo as any)} className="rounded-circle w-100 h-100 object-fit-cover" alt="Previsualización" />
                            ) : data.current_logo_path ? (
                                <img src={`storage/${data.current_logo_path}`} className="rounded-circle w-100 h-100 object-fit-cover" alt="Logo Actual" />
                            ) : (
                                <i className="ti ti-photo fs-1 text-muted"></i>
                            )}
                        </div>
                        <label className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle p-2 shadow" style={{ cursor: 'pointer' }}>
                            <i className="ti ti-camera fs-6"></i>
                            <input type="file" className="d-none" onChange={e => setData('logo', e.target.files?.[0] || null)} />
                        </label>
                    </div>
                    <div>
                        <h6 className="fw-bold mb-1 text-dark">Logotipo</h6>
                        <p className="text-muted small mb-0">Imagen recomendada PNG o JPG de 500x500px.</p>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* SECCIÓN INFORMACIÓN */}
                <div className="col-12">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="ti ti-building-store text-primary fs-4"></i>
                        <span className="fw-bold text-uppercase small text-muted">Información General</span>
                    </div>
                </div>

                <div className="col-md-8">
                    <label className="form-label small fw-bold">Razón Social</label>
                    <input 
                        type="text" 
                        className={`form-control border-0 bg-light ${errors.nombre ? 'is-invalid' : ''}`}
                        value={data.nombre}
                        onChange={e => setData('nombre', e.target.value)}
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">NIT / RUT</label>
                    <input 
                        type="text" 
                        className={`form-control border-0 bg-light ${errors.nit ? 'is-invalid' : ''}`}
                        value={data.nit}
                        onChange={e => setData('nit', e.target.value)}
                    />
                    {errors.nit && <div className="invalid-feedback">{errors.nit}</div>}
                </div>

                <div className="col-md-12">
                    <label className="form-label fw-semibold small text-muted">Objeto comercial</label>
                    <input 
                        type="text" 
                        className="form-control border-0 bg-light shadow-none py-2"
                        value={data.objetocomercial}
                        onChange={e => setData('objetocomercial', e.target.value)}
                    />
                </div>

                {/* SECCIÓN CONTACTO */}
                <div className="col-12 mt-4">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="ti ti-world text-primary fs-4"></i>
                        <span className="fw-bold text-uppercase small text-muted">Presencia Digital</span>
                    </div>
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Email Corporativo</label>
                    <input 
                        type="email" 
                        className={`form-control border-0 bg-light ${errors.email ? 'is-invalid' : ''}`}
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">Dirección</label>
                    <input 
                        type="text" 
                        className="form-control border-0 bg-light shadow-none py-2"
                        value={data.direccion}
                        onChange={e => setData('direccion', e.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label fw-semibold small text-muted">WhatsApp / Teléfono</label>
                    <input 
                        type="text" 
                        className={`form-control border-0 bg-light ${errors.telefonomovil ? 'is-invalid' : ''}`}
                        value={data.telefonomovil}
                        onChange={e => setData('telefonomovil', e.target.value)}
                    />
                    {errors.telefonomovil && <div className="invalid-feedback">{errors.telefonomovil}</div>}
                </div>
            </div>

            <div className="mt-5 pt-4 border-top d-flex justify-content-end">
                <button type="submit" className="btn btn-primary px-5 py-2 fw-bold shadow-sm rounded-3">
                    <i className="ti ti-device-floppy me-2"></i>
                    Guardar Cambios
                </button>
            </div>
        </form>
    )
});
export default FormComercio;