import { Ftpagos } from '@/types';

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
                    <label htmlFor="numero">Numero</label>
                    <input 
                        type="text" 
                        id="numero" 
                        name="numero" 
                        className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                        value={data.numero}
                        onChange={e => setData('numero', e.target.value)}
                        placeholder="Numero" 
                    />
                    {errors.numero && <div className="invalid-feedback" role="alert"><strong>{errors.numero}</strong></div>}
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
                    <label htmlFor="concepto">Concepto</label>
                    <input 
                        type="text" 
                        id="concepto" 
                        name="concepto" 
                        className={`form-control ${errors.concepto ? 'is-invalid' : ''}`}
                        value={data.concepto}
                        onChange={e => setData('concepto', e.target.value)}
                        placeholder="Concepto" 
                    />
                    {errors.concepto && <div className="invalid-feedback" role="alert"><strong>{errors.concepto}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="total">Total</label>
                    <input 
                        type="text" 
                        id="total" 
                        name="total" 
                        className={`form-control ${errors.total ? 'is-invalid' : ''}`}
                        value={data.total}
                        onChange={e => setData('total', e.target.value)}
                        placeholder="Total" 
                    />
                    {errors.total && <div className="invalid-feedback" role="alert"><strong>{errors.total}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="metodo_id">Metodo Id</label>
                    <input 
                        type="text" 
                        id="metodo_id" 
                        name="metodo_id" 
                        className={`form-control ${errors.metodo_id ? 'is-invalid' : ''}`}
                        value={data.metodo_id}
                        onChange={e => setData('metodo_id', e.target.value)}
                        placeholder="Metodo Id" 
                    />
                    {errors.metodo_id && <div className="invalid-feedback" role="alert"><strong>{errors.metodo_id}</strong></div>}
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
