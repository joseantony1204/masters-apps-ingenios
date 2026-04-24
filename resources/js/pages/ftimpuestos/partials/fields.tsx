

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
                    <label htmlFor="base">Base</label>
                    <input 
                        type="text" 
                        id="base" 
                        name="base" 
                        className={`form-control ${errors.base ? 'is-invalid' : ''}`}
                        value={data.base}
                        onChange={e => setData('base', e.target.value)}
                        placeholder="Base" 
                    />
                    {errors.base && <div className="invalid-feedback" role="alert"><strong>{errors.base}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="valor">Valor</label>
                    <input 
                        type="text" 
                        id="valor" 
                        name="valor" 
                        className={`form-control ${errors.valor ? 'is-invalid' : ''}`}
                        value={data.valor}
                        onChange={e => setData('valor', e.target.value)}
                        placeholder="Valor" 
                    />
                    {errors.valor && <div className="invalid-feedback" role="alert"><strong>{errors.valor}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="detalle_id">Detalle Id</label>
                    <input 
                        type="text" 
                        id="detalle_id" 
                        name="detalle_id" 
                        className={`form-control ${errors.detalle_id ? 'is-invalid' : ''}`}
                        value={data.detalle_id}
                        onChange={e => setData('detalle_id', e.target.value)}
                        placeholder="Detalle Id" 
                    />
                    {errors.detalle_id && <div className="invalid-feedback" role="alert"><strong>{errors.detalle_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="impuesto_id">Impuesto Id</label>
                    <input 
                        type="text" 
                        id="impuesto_id" 
                        name="impuesto_id" 
                        className={`form-control ${errors.impuesto_id ? 'is-invalid' : ''}`}
                        value={data.impuesto_id}
                        onChange={e => setData('impuesto_id', e.target.value)}
                        placeholder="Impuesto Id" 
                    />
                    {errors.impuesto_id && <div className="invalid-feedback" role="alert"><strong>{errors.impuesto_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="factura_id">Factura Id</label>
                    <input 
                        type="text" 
                        id="factura_id" 
                        name="factura_id" 
                        className={`form-control ${errors.factura_id ? 'is-invalid' : ''}`}
                        value={data.factura_id}
                        onChange={e => setData('factura_id', e.target.value)}
                        placeholder="Factura Id" 
                    />
                    {errors.factura_id && <div className="invalid-feedback" role="alert"><strong>{errors.factura_id}</strong></div>}
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
