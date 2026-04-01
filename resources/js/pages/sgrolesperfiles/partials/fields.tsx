import { Sgrolesperfiles } from '@/types';

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
                    <label htmlFor="perfil_id">Perfil Id</label>
                    <input 
                        type="text" 
                        id="perfil_id" 
                        name="perfil_id" 
                        className={`form-control ${errors.perfil_id ? 'is-invalid' : ''}`}
                        value={data.perfil_id}
                        onChange={e => setData('perfil_id', e.target.value)}
                        placeholder="Perfil Id" 
                    />
                    {errors.perfil_id && <div className="invalid-feedback" role="alert"><strong>{errors.perfil_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="rol_id">Rol Id</label>
                    <input 
                        type="text" 
                        id="rol_id" 
                        name="rol_id" 
                        className={`form-control ${errors.rol_id ? 'is-invalid' : ''}`}
                        value={data.rol_id}
                        onChange={e => setData('rol_id', e.target.value)}
                        placeholder="Rol Id" 
                    />
                    {errors.rol_id && <div className="invalid-feedback" role="alert"><strong>{errors.rol_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="estado">Estado</label>
                    <input 
                        type="text" 
                        id="estado" 
                        name="estado" 
                        className={`form-control ${errors.estado ? 'is-invalid' : ''}`}
                        value={data.estado}
                        onChange={e => setData('estado', e.target.value)}
                        placeholder="Estado" 
                    />
                    {errors.estado && <div className="invalid-feedback" role="alert"><strong>{errors.estado}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="observacion">Observacion</label>
                    <input 
                        type="text" 
                        id="observacion" 
                        name="observacion" 
                        className={`form-control ${errors.observacion ? 'is-invalid' : ''}`}
                        value={data.observacion}
                        onChange={e => setData('observacion', e.target.value)}
                        placeholder="Observacion" 
                    />
                    {errors.observacion && <div className="invalid-feedback" role="alert"><strong>{errors.observacion}</strong></div>}
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
