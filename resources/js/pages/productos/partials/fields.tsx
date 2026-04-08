import React from 'react';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    categoriasList: Record<string, string>;
    unidadesList: Record<string, string>;
    estadosList: Record<string, string>;
    tiposList: Record<string, string>;
    marcasList: Record<string, string>;
    ubicacionesList: Record<string, string>;
    impuestosList: Record<string, string>;
    sedesList: Record<string, string>;
}

export default function Fields({ 
    data, setData, errors, 
    categoriasList = {}, unidadesList = {}, estadosList = {}, 
    tiposList = {}, marcasList = {}, ubicacionesList = {}, 
    impuestosList = {}, sedesList = {} 
}: Props) {

    // Helper para renderizar errores de forma limpia
    const ErrorMessage = ({ field }: { field: string }) => (
        errors[field] ? <div className="invalid-feedback d-block"><i className="ti ti-alert-circle me-1"></i>{errors[field]}</div> : null
    );

    return (
        <div className="row g-4">
            {/* COLUMNA IZQUIERDA: INFORMACIÓN GENERAL */}
            <div className="col-lg-8">
            <div className="card border-0 shadow-sm border-top border-primary border-4 mb-4">
                    <div className="card-header bg-transparent border-bottom py-3">
                        <h5 className="mb-0"><i className="ti ti-box me-2 text-primary"></i>Información del Producto / Servicio</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            {/* Selector de Tipo (Crucial) */}
                            <div className="col-md-12">
                                <label className="form-label fw-bold small">Tipo de Item <span className="text-danger">*</span></label>
                                <div className="input-group input-group-merge">
                                    <span className="input-group-text bg-light border-end-0"><i className="ti ti-category"></i></span>
                                    <select
                                        className={`form-select bg-light border-start-0 ${errors.tipo_id ? 'is-invalid' : ''}`}
                                        value={data.tipo_id}
                                        onChange={e => setData('tipo_id', e.target.value)}
                                    >
                                        <option value="">-- Seleccionar Tipo --</option>
                                        {Object.entries(tiposList).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <ErrorMessage field="tipo_id" />
                            </div>

                            {/* Nombre y Duración */}
                            <div className="col-md-9">
                                <label className="form-label fw-bold small">Nombre del Item <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                    value={data.nombre}
                                    onChange={e => setData('nombre', e.target.value)}
                                    placeholder="Ej: Corte de Cabello o Cerveza Club Colombia" 
                                />
                                <ErrorMessage field="nombre" />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold small">Duración (min)</label>
                                <div className="input-group">
                                    <input 
                                        type="number" 
                                        className={`form-control ${errors.duracion ? 'is-invalid' : ''}`}
                                        value={data.duracion}
                                        onChange={e => setData('duracion', e.target.value)}
                                        placeholder="0" 
                                    />
                                    <span className="input-group-text"><i className="ti ti-clock"></i></span>
                                </div>
                                <ErrorMessage field="duracion" />
                            </div>

                            {/* Códigos y Stock */}
                            <div className="col-md-4">
                                <label className="form-label fw-bold small">Código Interno</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                                    value={data.codigo}
                                    onChange={e => setData('codigo', e.target.value)}
                                    placeholder="SKU-001" 
                                />
                                <ErrorMessage field="codigo" />
                            </div>

                            <div className="col-md-5">
                                <label className="form-label fw-bold small">Código de Barras</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="ti ti-barcode"></i></span>
                                    <input 
                                        type="text" 
                                        className={`form-control ${errors.codigobarra ? 'is-invalid' : ''}`}
                                        value={data.codigobarra}
                                        onChange={e => setData('codigobarra', e.target.value)}
                                        placeholder="770..." 
                                    />
                                </div>
                                <ErrorMessage field="codigobarra" />
                            </div>

                            <div className="col-md-3">
                                <label className="form-label fw-bold small text-primary">Stock Mínimo</label>
                                <input 
                                    type="number" 
                                    className={`form-control border-primary ${errors.minimostock ? 'is-invalid' : ''}`}
                                    value={data.minimostock}
                                    onChange={e => setData('minimostock', e.target.value)}
                                    placeholder="5" 
                                />
                                <ErrorMessage field="minimostock" />
                            </div>

                            <div className="col-md-12">
                                <label className="form-label fw-bold small">Descripción Corta</label>
                                <textarea 
                                    rows={2}
                                    className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    placeholder="Breve detalle para la factura..." 
                                />
                                <ErrorMessage field="descripcion" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: CATEGORIZACIÓN Y LOGÍSTICA */}
                <div className="card border-0 border-top border-primary shadow-sm border-4 mb-4">
                    <div className="card-header bg-transparent border-bottom py-3">
                        <h5 className="mb-0"><i className="ti ti-settings me-2 text-primary"></i>Categorización y Ubicación</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">Categoría<span className="text-danger">*</span></label>
                                <select 
                                    className={`form-select border-0 bg-light ${errors.categoria_id ? 'is-invalid' : ''}`} 
                                    value={data.categoria_id} 
                                    onChange={e => setData('categoria_id', e.target.value)}
                                    required
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(categoriasList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                                {errors.categoria_id && <div className="invalid-feedback">{errors.categoria_id}</div>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">Marca</label>
                                <select 
                                    className="form-select border-0 bg-light" 
                                    value={data.marca_id} 
                                    onChange={e => setData('marca_id', e.target.value)}>
                                    <option value="">-- Sin Marca --</option>
                                    {Object.entries(marcasList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">Unidad de Medida<span className="text-danger">*</span></label>
                                <select
                                    className={`form-select border-0 bg-light ${errors.unidad_id ? 'is-invalid' : ''}`}
                                    value={data.unidad_id || ''}
                                    onChange={e => setData('unidad_id', e.target.value)}
                                >
                                    <option value="">-- Elige --</option>
                                    {/* Validamos que unidadesList exista y sea un objeto */}
                                    {unidadesList && Object.entries(unidadesList).map(([grupo, items]) => (
                                        <optgroup key={grupo} label={grupo}>
                                            {/* Forzamos que items sea tratado como array para el map */}
                                            {Array.isArray(items) && items.map((item: any) => (
                                                <option key={item.id} value={item.id}>
                                                    {/* CRUCIAL: Solo imprimir item.nombre, NUNCA {item} */}
                                                    {String(item.nombre)}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                                {errors.unidad_id && <div className="invalid-feedback">{errors.unidad_id}</div>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">Ubicación Física</label>
                                <select className="form-select border-0 bg-light" value={data.ubicacion_id} onChange={e => setData('ubicacion_id', e.target.value)}>
                                    <option value="">-- No Definida --</option>
                                    {Object.entries(ubicacionesList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">Sede<span className="text-danger">*</span></label>
                                <select className={`form-select border-0 bg-light ${errors.sede_id ? 'is-invalid' : ''}`} value={data.sede_id} onChange={e => setData('sede_id', e.target.value)}>
                                    <option value="">-- Elige --</option>
                                    {Object.entries(sedesList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                                {errors.sede_id && <div className="invalid-feedback">{errors.sede_id}</div>}
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold small text-muted">Estado<span className="text-danger">*</span></label>
                                <select className={`form-select border-0 bg-light fw-bold text-primary ${errors.estado_id ? 'is-invalid' : ''}`}  value={data.estado_id} onChange={e => setData('estado_id', e.target.value)}>
                                    <option value="">-- Elige --</option>
                                    {Object.entries(estadosList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                                {errors.estado_id && <div className="invalid-feedback">{errors.estado_id}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: PRECIOS E IMAGEN */}
            <div className="col-lg-4">
                {/* CARD PRECIOS */}
                <div className="card border-0 shadow-sm border-top border-primary border-4 mb-4">
                    <div className="card-header bg-transparent border-bottom py-3">
                        <h5 className="mb-0"><i className="ti ti-coin me-2 text-primary"></i>Precios y Costos</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12">
                                <label className="form-label fw-bold small">Precio Base (Costo)<span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text">$</span>
                                    <input 
                                        type="number" 
                                        className={`form-control fw-bold ${errors.precioingreso ? 'is-invalid' : ''}`}
                                        value={data.precioingreso}
                                        onChange={e => setData('precioingreso', e.target.value)}
                                        placeholder="0.00" 
                                    />
                                </div>
                                <ErrorMessage field="precioingreso" />
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold small text-muted">Impuesto Aplicado<span className="text-danger">*</span></label>
                                <select className={`form-select border-0 bg-light ${errors.impuesto_id ? 'is-invalid' : ''}`}  value={data.impuesto_id} onChange={e => setData('impuesto_id', e.target.value)}>
                                    <option value="">-- Elige --</option>
                                    {Object.entries(impuestosList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                                {errors.impuesto_id && <div className="invalid-feedback">{errors.impuesto_id}</div>}
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold small text-success">Precio de Venta Total<span className="text-danger">*</span></label>
                                <div className="input-group">
                                    <span className="input-group-text bg-success text-white border-0">$</span>
                                    <input 
                                        type="number" 
                                        className={`form-control form-control-lg fw-bolder text-success border-success ${errors.preciosalida ? 'is-invalid' : ''}`}
                                        value={data.preciosalida}
                                        onChange={e => setData('preciosalida', e.target.value)}
                                        placeholder="0.00" 
                                    />
                                </div>
                                <ErrorMessage field="preciosalida" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD IMAGEN */}
                <div className="card border-0 border-top border-primary shadow-sm border-4 mb-4">
                    <div className="card-header bg-transparent border-bottom py-3">
                        <h5 className="mb-0"><i className="ti ti-photo me-2 text-primary"></i>Imagen Visual</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-center p-4 border border-dashed rounded-3 bg-light">
                            <i className="ti ti-cloud-upload display-4 text-muted"></i>
                            <p className="mt-2 small text-muted">Suelte la imagen aquí o haga clic para buscar</p>
                            <input type="file" className="d-none" id="productImage" />
                            <label htmlFor="productImage" className="btn btn-outline-primary btn-sm px-4">Subir Archivo</label>
                        </div>
                    </div>
                </div>

                {/* OBSERVACIONES */}
                <div className="card border-0 border-top border-primary shadow-sm border-4 mb-4">
                    <div className="card-body">
                        <label className="form-label fw-bold small">Notas Internas / Observación</label>
                        <textarea 
                            rows={3}
                            className="form-control border-0 bg-light"
                            value={data.observacion}
                            onChange={e => setData('observacion', e.target.value)}
                            placeholder="Ej: Solo para uso en sede norte..." 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}