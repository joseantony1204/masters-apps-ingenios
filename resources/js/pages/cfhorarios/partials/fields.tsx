import { Cfhorarios } from '@/types';

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
                    <label htmlFor="horainicio">Horainicio</label>
                    <input 
                        type="text" 
                        id="horainicio" 
                        name="horainicio" 
                        className={`form-control ${errors.horainicio ? 'is-invalid' : ''}`}
                        value={data.horainicio}
                        onChange={e => setData('horainicio', e.target.value)}
                        placeholder="Horainicio" 
                    />
                    {errors.horainicio && <div className="invalid-feedback" role="alert"><strong>{errors.horainicio}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="horafinal">Horafinal</label>
                    <input 
                        type="text" 
                        id="horafinal" 
                        name="horafinal" 
                        className={`form-control ${errors.horafinal ? 'is-invalid' : ''}`}
                        value={data.horafinal}
                        onChange={e => setData('horafinal', e.target.value)}
                        placeholder="Horafinal" 
                    />
                    {errors.horafinal && <div className="invalid-feedback" role="alert"><strong>{errors.horafinal}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="empleado_id">Empleado Id</label>
                    <input 
                        type="text" 
                        id="empleado_id" 
                        name="empleado_id" 
                        className={`form-control ${errors.empleado_id ? 'is-invalid' : ''}`}
                        value={data.empleado_id}
                        onChange={e => setData('empleado_id', e.target.value)}
                        placeholder="Empleado Id" 
                    />
                    {errors.empleado_id && <div className="invalid-feedback" role="alert"><strong>{errors.empleado_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="dia_id">Dia Id</label>
                    <input 
                        type="text" 
                        id="dia_id" 
                        name="dia_id" 
                        className={`form-control ${errors.dia_id ? 'is-invalid' : ''}`}
                        value={data.dia_id}
                        onChange={e => setData('dia_id', e.target.value)}
                        placeholder="Dia Id" 
                    />
                    {errors.dia_id && <div className="invalid-feedback" role="alert"><strong>{errors.dia_id}</strong></div>}
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
