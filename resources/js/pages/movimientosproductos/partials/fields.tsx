

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
                    <label htmlFor="tipo">Tipo</label>
                    <input 
                        type="text" 
                        id="tipo" 
                        name="tipo" 
                        className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
                        value={data.tipo}
                        onChange={e => setData('tipo', e.target.value)}
                        placeholder="Tipo" 
                    />
                    {errors.tipo && <div className="invalid-feedback" role="alert"><strong>{errors.tipo}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="cantidad">Cantidad</label>
                    <input 
                        type="text" 
                        id="cantidad" 
                        name="cantidad" 
                        className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
                        value={data.cantidad}
                        onChange={e => setData('cantidad', e.target.value)}
                        placeholder="Cantidad" 
                    />
                    {errors.cantidad && <div className="invalid-feedback" role="alert"><strong>{errors.cantidad}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="stock_resultante">Stock Resultante</label>
                    <input 
                        type="text" 
                        id="stock_resultante" 
                        name="stock_resultante" 
                        className={`form-control ${errors.stock_resultante ? 'is-invalid' : ''}`}
                        value={data.stock_resultante}
                        onChange={e => setData('stock_resultante', e.target.value)}
                        placeholder="Stock Resultante" 
                    />
                    {errors.stock_resultante && <div className="invalid-feedback" role="alert"><strong>{errors.stock_resultante}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="motivo">Motivo</label>
                    <input 
                        type="text" 
                        id="motivo" 
                        name="motivo" 
                        className={`form-control ${errors.motivo ? 'is-invalid' : ''}`}
                        value={data.motivo}
                        onChange={e => setData('motivo', e.target.value)}
                        placeholder="Motivo" 
                    />
                    {errors.motivo && <div className="invalid-feedback" role="alert"><strong>{errors.motivo}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="producto_id">Producto Id</label>
                    <input 
                        type="text" 
                        id="producto_id" 
                        name="producto_id" 
                        className={`form-control ${errors.producto_id ? 'is-invalid' : ''}`}
                        value={data.producto_id}
                        onChange={e => setData('producto_id', e.target.value)}
                        placeholder="Producto Id" 
                    />
                    {errors.producto_id && <div className="invalid-feedback" role="alert"><strong>{errors.producto_id}</strong></div>}
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
