import { Cfpersonascomercios } from '@/types';

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
                    <label htmlFor="activo">Activo</label>
                    <input 
                        type="text" 
                        id="activo" 
                        name="activo" 
                        className={`form-control ${errors.activo ? 'is-invalid' : ''}`}
                        value={data.activo}
                        onChange={e => setData('activo', e.target.value)}
                        placeholder="Activo" 
                    />
                    {errors.activo && <div className="invalid-feedback" role="alert"><strong>{errors.activo}</strong></div>}
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
                    <label htmlFor="comercio_id">Comercio Id</label>
                    <input 
                        type="text" 
                        id="comercio_id" 
                        name="comercio_id" 
                        className={`form-control ${errors.comercio_id ? 'is-invalid' : ''}`}
                        value={data.comercio_id}
                        onChange={e => setData('comercio_id', e.target.value)}
                        placeholder="Comercio Id" 
                    />
                    {errors.comercio_id && <div className="invalid-feedback" role="alert"><strong>{errors.comercio_id}</strong></div>}
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
