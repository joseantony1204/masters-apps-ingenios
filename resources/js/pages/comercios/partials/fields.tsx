import { Comercios } from '@/types';

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
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="objetocomercial">Objetocomercial</label>
                    <input 
                        type="text" 
                        id="objetocomercial" 
                        name="objetocomercial" 
                        className={`form-control ${errors.objetocomercial ? 'is-invalid' : ''}`}
                        value={data.objetocomercial}
                        onChange={e => setData('objetocomercial', e.target.value)}
                        placeholder="Objetocomercial" 
                    />
                    {errors.objetocomercial && <div className="invalid-feedback" role="alert"><strong>{errors.objetocomercial}</strong></div>}
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
