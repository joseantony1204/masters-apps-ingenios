

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
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="descripcion">Descripcion</label>
                    <input 
                        type="text" 
                        id="descripcion" 
                        name="descripcion" 
                        className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                        value={data.descripcion}
                        onChange={e => setData('descripcion', e.target.value)}
                        placeholder="Descripcion" 
                    />
                    {errors.descripcion && <div className="invalid-feedback" role="alert"><strong>{errors.descripcion}</strong></div>}
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
                    <label htmlFor="baseinicial">Baseinicial</label>
                    <input 
                        type="text" 
                        id="baseinicial" 
                        name="baseinicial" 
                        className={`form-control ${errors.baseinicial ? 'is-invalid' : ''}`}
                        value={data.baseinicial}
                        onChange={e => setData('baseinicial', e.target.value)}
                        placeholder="Baseinicial" 
                    />
                    {errors.baseinicial && <div className="invalid-feedback" role="alert"><strong>{errors.baseinicial}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fecha">Fecha</label>
                    <input 
                        type="text" 
                        id="fecha" 
                        name="fecha" 
                        className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
                        value={data.fecha}
                        onChange={e => setData('fecha', e.target.value)}
                        placeholder="Fecha" 
                    />
                    {errors.fecha && <div className="invalid-feedback" role="alert"><strong>{errors.fecha}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fechanaapertura">Fechanaapertura</label>
                    <input 
                        type="text" 
                        id="fechanaapertura" 
                        name="fechanaapertura" 
                        className={`form-control ${errors.fechanaapertura ? 'is-invalid' : ''}`}
                        value={data.fechanaapertura}
                        onChange={e => setData('fechanaapertura', e.target.value)}
                        placeholder="Fechanaapertura" 
                    />
                    {errors.fechanaapertura && <div className="invalid-feedback" role="alert"><strong>{errors.fechanaapertura}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fechanacierre">Fechanacierre</label>
                    <input 
                        type="text" 
                        id="fechanacierre" 
                        name="fechanacierre" 
                        className={`form-control ${errors.fechanacierre ? 'is-invalid' : ''}`}
                        value={data.fechanacierre}
                        onChange={e => setData('fechanacierre', e.target.value)}
                        placeholder="Fechanacierre" 
                    />
                    {errors.fechanacierre && <div className="invalid-feedback" role="alert"><strong>{errors.fechanacierre}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="persona_id">Persona Id</label>
                    <input 
                        type="text" 
                        id="persona_id" 
                        name="persona_id" 
                        className={`form-control ${errors.persona_id ? 'is-invalid' : ''}`}
                        value={data.persona_id}
                        onChange={e => setData('persona_id', e.target.value)}
                        placeholder="Persona Id" 
                    />
                    {errors.persona_id && <div className="invalid-feedback" role="alert"><strong>{errors.persona_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="terminal_id">Terminal Id</label>
                    <input 
                        type="text" 
                        id="terminal_id" 
                        name="terminal_id" 
                        className={`form-control ${errors.terminal_id ? 'is-invalid' : ''}`}
                        value={data.terminal_id}
                        onChange={e => setData('terminal_id', e.target.value)}
                        placeholder="Terminal Id" 
                    />
                    {errors.terminal_id && <div className="invalid-feedback" role="alert"><strong>{errors.terminal_id}</strong></div>}
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
