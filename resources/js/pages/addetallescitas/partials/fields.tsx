

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
}

export default function Fields({ data, setData, errors }: Props) {
  return (
    <>
        <div className="row">
            
            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="descuento">Descuento</label>
                    <input 
                        type="text" 
                        id="descuento" 
                        name="descuento" 
                        className={`form-control ${errors.descuento ? 'is-invalid' : ''}`}
                        value={data.descuento}
                        onChange={e => setData('descuento', e.target.value)}
                        placeholder="Descuento" 
                    />
                    {errors.descuento && <div className="invalid-feedback" role="alert"><strong>{errors.descuento}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="preciofinal">Preciofinal</label>
                    <input 
                        type="text" 
                        id="preciofinal" 
                        name="preciofinal" 
                        className={`form-control ${errors.preciofinal ? 'is-invalid' : ''}`}
                        value={data.preciofinal}
                        onChange={e => setData('preciofinal', e.target.value)}
                        placeholder="Preciofinal" 
                    />
                    {errors.preciofinal && <div className="invalid-feedback" role="alert"><strong>{errors.preciofinal}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fechacreado">Fechacreado</label>
                    <input 
                        type="text" 
                        id="fechacreado" 
                        name="fechacreado" 
                        className={`form-control ${errors.fechacreado ? 'is-invalid' : ''}`}
                        value={data.fechacreado}
                        onChange={e => setData('fechacreado', e.target.value)}
                        placeholder="Fechacreado" 
                    />
                    {errors.fechacreado && <div className="invalid-feedback" role="alert"><strong>{errors.fechacreado}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="empleadoservicio_id">Empleadoservicio Id</label>
                    <input 
                        type="text" 
                        id="empleadoservicio_id" 
                        name="empleadoservicio_id" 
                        className={`form-control ${errors.empleadoservicio_id ? 'is-invalid' : ''}`}
                        value={data.empleadoservicio_id}
                        onChange={e => setData('empleadoservicio_id', e.target.value)}
                        placeholder="Empleadoservicio Id" 
                    />
                    {errors.empleadoservicio_id && <div className="invalid-feedback" role="alert"><strong>{errors.empleadoservicio_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="cita_id">Cita Id</label>
                    <input 
                        type="text" 
                        id="cita_id" 
                        name="cita_id" 
                        className={`form-control ${errors.cita_id ? 'is-invalid' : ''}`}
                        value={data.cita_id}
                        onChange={e => setData('cita_id', e.target.value)}
                        placeholder="Cita Id" 
                    />
                    {errors.cita_id && <div className="invalid-feedback" role="alert"><strong>{errors.cita_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="estado_id">Estado Id</label>
                    <input 
                        type="text" 
                        id="estado_id" 
                        name="estado_id" 
                        className={`form-control ${errors.estado_id ? 'is-invalid' : ''}`}
                        value={data.estado_id}
                        onChange={e => setData('estado_id', e.target.value)}
                        placeholder="Estado Id" 
                    />
                    {errors.estado_id && <div className="invalid-feedback" role="alert"><strong>{errors.estado_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="observaciones">Observaciones</label>
                    <input 
                        type="text" 
                        id="observaciones" 
                        name="observaciones" 
                        className={`form-control ${errors.observaciones ? 'is-invalid' : ''}`}
                        value={data.observaciones}
                        onChange={e => setData('observaciones', e.target.value)}
                        placeholder="Observaciones" 
                    />
                    {errors.observaciones && <div className="invalid-feedback" role="alert"><strong>{errors.observaciones}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="created_by">Created By</label>
                    <input 
                        type="text" 
                        id="created_by" 
                        name="created_by" 
                        className={`form-control ${errors.created_by ? 'is-invalid' : ''}`}
                        value={data.created_by}
                        onChange={e => setData('created_by', e.target.value)}
                        placeholder="Created By" 
                    />
                    {errors.created_by && <div className="invalid-feedback" role="alert"><strong>{errors.created_by}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="updated_by">Updated By</label>
                    <input 
                        type="text" 
                        id="updated_by" 
                        name="updated_by" 
                        className={`form-control ${errors.updated_by ? 'is-invalid' : ''}`}
                        value={data.updated_by}
                        onChange={e => setData('updated_by', e.target.value)}
                        placeholder="Updated By" 
                    />
                    {errors.updated_by && <div className="invalid-feedback" role="alert"><strong>{errors.updated_by}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="deleted_by">Deleted By</label>
                    <input 
                        type="text" 
                        id="deleted_by" 
                        name="deleted_by" 
                        className={`form-control ${errors.deleted_by ? 'is-invalid' : ''}`}
                        value={data.deleted_by}
                        onChange={e => setData('deleted_by', e.target.value)}
                        placeholder="Deleted By" 
                    />
                    {errors.deleted_by && <div className="invalid-feedback" role="alert"><strong>{errors.deleted_by}</strong></div>}
                </div>
            </div>
        </div> 
    </>
  );
}
