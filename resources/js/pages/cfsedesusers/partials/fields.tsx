import { Cfsedesusers } from '@/types';

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
                    <label htmlFor="orden">Orden</label>
                    <input 
                        type="text" 
                        id="orden" 
                        name="orden" 
                        className={`form-control ${errors.orden ? 'is-invalid' : ''}`}
                        value={data.orden}
                        onChange={e => setData('orden', e.target.value)}
                        placeholder="Orden" 
                    />
                    {errors.orden && <div className="invalid-feedback" role="alert"><strong>{errors.orden}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="predeterminada">Predeterminada</label>
                    <input 
                        type="text" 
                        id="predeterminada" 
                        name="predeterminada" 
                        className={`form-control ${errors.predeterminada ? 'is-invalid' : ''}`}
                        value={data.predeterminada}
                        onChange={e => setData('predeterminada', e.target.value)}
                        placeholder="Predeterminada" 
                    />
                    {errors.predeterminada && <div className="invalid-feedback" role="alert"><strong>{errors.predeterminada}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="usuario_id">Usuario Id</label>
                    <input 
                        type="text" 
                        id="usuario_id" 
                        name="usuario_id" 
                        className={`form-control ${errors.usuario_id ? 'is-invalid' : ''}`}
                        value={data.usuario_id}
                        onChange={e => setData('usuario_id', e.target.value)}
                        placeholder="Usuario Id" 
                    />
                    {errors.usuario_id && <div className="invalid-feedback" role="alert"><strong>{errors.usuario_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="sede_id">Sede Id</label>
                    <input 
                        type="text" 
                        id="sede_id" 
                        name="sede_id" 
                        className={`form-control ${errors.sede_id ? 'is-invalid' : ''}`}
                        value={data.sede_id}
                        onChange={e => setData('sede_id', e.target.value)}
                        placeholder="Sede Id" 
                    />
                    {errors.sede_id && <div className="invalid-feedback" role="alert"><strong>{errors.sede_id}</strong></div>}
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
