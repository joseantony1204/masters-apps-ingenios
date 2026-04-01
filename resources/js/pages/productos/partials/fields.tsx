import { Productos } from '@/types';

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

export default function Fields({ data, setData, errors, categoriasList = {}, unidadesList = {}, estadosList = {}, tiposList = {}, marcasList = {}, ubicacionesList = {}, impuestosList = {}, sedesList = {} }: Props) {
  return (
    <>
        <div className="row">
            <div className="col-md-8">
                <div className="card">
                    <div className="card-body">
                        <div className="alert alert-primary">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0"><i className="ti ti-info-circle h2 f-w-400 mb-0"></i></div>
                                <div className="flex-grow-1 ms-3">Crea tus productos inventariables y/o servicios que ofreces para registrar en tus ventas.</div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="tipo_id">Tipo de item</label>
                                    <select
                                    className={`form-control${errors.tipo_id ? ' is-invalid' : ''}`}
                                    value={data.tipo_id}
                                    onChange={e => setData('tipo_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(tiposList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.tipo_id && <div className="invalid-feedback">{errors.tipo_id}</div>}
                                </div>
                            </div>    
                            
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="codigo">Codigo</label>
                                    <input 
                                        type="text" 
                                        id="codigo" 
                                        name="codigo" 
                                        className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                                        value={data.codigo}
                                        onChange={e => setData('codigo', e.target.value)}
                                        placeholder="Codigo" 
                                    />
                                    {errors.codigo && <div className="invalid-feedback" role="alert"><strong>{errors.codigo}</strong></div>}
                                </div>
                            </div> 

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="codigobarra">Codigo barra</label>
                                    <input 
                                        type="text" 
                                        id="codigobarra" 
                                        name="codigobarra" 
                                        className={`form-control ${errors.codigobarra ? 'is-invalid' : ''}`}
                                        value={data.codigobarra}
                                        onChange={e => setData('codigobarra', e.target.value)}
                                        placeholder="Codigo barra" 
                                    />
                                    {errors.codigobarra && <div className="invalid-feedback" role="alert"><strong>{errors.codigobarra}</strong></div>}
                                </div>
                            </div> 

                            <div className="col-md-2">
                                <div className="form-group">
                                    <label htmlFor="minimostock">Minimos tock</label>
                                    <input 
                                        type="text" 
                                        id="minimostock" 
                                        name="minimostock" 
                                        className={`form-control ${errors.minimostock ? 'is-invalid' : ''}`}
                                        value={data.minimostock}
                                        onChange={e => setData('minimostock', e.target.value)}
                                        placeholder="Min. stock" 
                                    />
                                    {errors.minimostock && <div className="invalid-feedback" role="alert"><strong>{errors.minimostock}</strong></div>}
                                </div>
                            </div> 

                            <div className="col-md-10">
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input 
                                        type="text" 
                                        id="nombre" 
                                        name="nombre" 
                                        className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                                        value={data.nombre}
                                        onChange={e => setData('nombre', e.target.value)}
                                        placeholder="Nombre" 
                                    />
                                    {errors.nombre && <div className="invalid-feedback" role="alert"><strong>{errors.nombre}</strong></div>}
                                </div>
                            </div>   

                            <div className="col-md-2">
                                <div className="form-group">
                                    <label htmlFor="duracion">Duración</label>
                                    <input 
                                        type="text" 
                                        id="duracion" 
                                        name="duracion" 
                                        className={`form-control ${errors.duracion ? 'is-invalid' : ''}`}
                                        value={data.duracion}
                                        onChange={e => setData('duracion', e.target.value)}
                                        placeholder="Duración" 
                                    />
                                    {errors.duracion && <div className="invalid-feedback" role="alert"><strong>{errors.duracion}</strong></div>}
                                </div>
                            </div>      

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripcion</label>
                                    <textarea 
                                        id="descripcion" 
                                        rows={3}
                                        name="descripcion" 
                                        className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                                        value={data.descripcion}
                                        onChange={e => setData('descripcion', e.target.value)}
                                        placeholder="Descripcion" 
                                    />
                                    {errors.descripcion && <div className="invalid-feedback" role="alert"><strong>{errors.descripcion}</strong></div>}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="unidad_id">Unidad</label>
                                    
                                    

                                    <select
                                    className={`form-control${errors.unidad_id ? ' is-invalid' : ''}`}
                                    value={data.unidad_id}
                                    onChange={e => setData('unidad_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(unidadesList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.unidad_id && <div className="invalid-feedback">{errors.unidad_id}</div>}
                                </div>
                            </div> 

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="categoria_id">Categoria</label>
                                    <select
                                    className={`form-control${errors.categoria_id ? ' is-invalid' : ''}`}
                                    value={data.categoria_id}
                                    onChange={e => setData('categoria_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(categoriasList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.categoria_id && <div className="invalid-feedback">{errors.categoria_id}</div>}
                                </div>
                            </div> 

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="marca_id">Marca</label>
                                    <select
                                    className={`form-control${errors.marca_id ? ' is-invalid' : ''}`}
                                    value={data.marca_id}
                                    onChange={e => setData('marca_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(marcasList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.marca_id && <div className="invalid-feedback">{errors.marca_id}</div>}
                                </div>
                            </div> 

                               

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="ubicacion_id">Ubicacion</label>
                                    <select
                                    className={`form-control${errors.ubicacion_id ? ' is-invalid' : ''}`}
                                    value={data.ubicacion_id}
                                    onChange={e => setData('ubicacion_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(ubicacionesList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.ubicacion_id && <div className="invalid-feedback">{errors.ubicacion_id}</div>}
                                </div>
                            </div>           
                       
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="sede_id">Sede</label>
                                    <select
                                    className={`form-control${errors.sede_id ? ' is-invalid' : ''}`}
                                    value={data.sede_id}
                                    onChange={e => setData('sede_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(sedesList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.sede_id && <div className="invalid-feedback">{errors.sede_id}</div>}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="estado_id">Estado</label>
                                    <select
                                    className={`form-control${errors.estado_id ? ' is-invalid' : ''}`}
                                    value={data.estado_id}
                                    onChange={e => setData('estado_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(estadosList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.estado_id && <div className="invalid-feedback">{errors.estado_id}</div>}
                                </div>
                            </div>

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="observacion">Observacion</label>
                                    <textarea 
                                        id="observacion" 
                                        rows={3}
                                        name="observacion" 
                                        className={`form-control ${errors.observacion ? 'is-invalid' : ''}`}
                                        value={data.observacion}
                                        onChange={e => setData('observacion', e.target.value)}
                                        placeholder="Observacion" 
                                    />
                                    {errors.observacion && <div className="invalid-feedback" role="alert"><strong>{errors.observacion}</strong></div>}
                                </div>
                            </div>

                        </div>
                    </div>            
                </div>            
            </div>  

            <div className="col-md-4">
                <div className="card">
                    <div className="card-body"> 
                        <div className="alert alert-primary">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0"><i className="ti ti-info-circle h2 f-w-400 mb-0"></i></div>
                                <div className="flex-grow-1 ms-3">Indique el valor de venta y el costo de compra del producto.</div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="precioingreso">Precio base</label>
                                    <input 
                                        type="text" 
                                        id="precioingreso" 
                                        name="precioingreso" 
                                        className={`form-control ${errors.precioingreso ? 'is-invalid' : ''}`}
                                        value={data.precioingreso}
                                        onChange={e => setData('precioingreso', e.target.value)}
                                        placeholder="Precioingreso" 
                                    />
                                    {errors.precioingreso && <div className="invalid-feedback" role="alert"><strong>{errors.precioingreso}</strong></div>}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="impuesto_id">Impuesto</label>
                                    <select
                                    className={`form-control${errors.impuesto_id ? ' is-invalid' : ''}`}
                                    value={data.impuesto_id}
                                    onChange={e => setData('impuesto_id', e.target.value)}
                                    >
                                    <option value="">-- Elige --</option>
                                    {Object.entries(impuestosList).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                    </select>
                                    {errors.impuesto_id && <div className="invalid-feedback">{errors.impuesto_id}</div>}
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="preciosalida">Precio total</label>
                                    <input 
                                        type="text" 
                                        id="preciosalida" 
                                        name="preciosalida" 
                                        className={`form-control ${errors.preciosalida ? 'is-invalid' : ''}`}
                                        value={data.preciosalida}
                                        onChange={e => setData('preciosalida', e.target.value)}
                                        placeholder="Preciosalida" 
                                    />
                                    {errors.preciosalida && <div className="invalid-feedback" role="alert"><strong>{errors.preciosalida}</strong></div>}
                                </div>
                            </div> 

                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="preciosalida">Imagen del producto</label>
                                    <form action="../assets/json/file-upload.php" className="dropzone dz-clickable">
                                    <div className="dz-default dz-message">
                                        <button className="dz-button" type="button">Suelte los archivos aquí para cargarlos</button>
                                    </div>
                                </form>
                                </div>
                            </div>

                        </div> 
                             
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}