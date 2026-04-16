import { Scpagos } from '@/types';

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
                    <label htmlFor="referencia_pasarela">Referencia Pasarela</label>
                    <input 
                        type="text" 
                        id="referencia_pasarela" 
                        name="referencia_pasarela" 
                        className={`form-control ${errors.referencia_pasarela ? 'is-invalid' : ''}`}
                        value={data.referencia_pasarela}
                        onChange={e => setData('referencia_pasarela', e.target.value)}
                        placeholder="Referencia Pasarela" 
                    />
                    {errors.referencia_pasarela && <div className="invalid-feedback" role="alert"><strong>{errors.referencia_pasarela}</strong></div>}
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
                    <label htmlFor="suscripcion_id">Suscripcion Id</label>
                    <input 
                        type="text" 
                        id="suscripcion_id" 
                        name="suscripcion_id" 
                        className={`form-control ${errors.suscripcion_id ? 'is-invalid' : ''}`}
                        value={data.suscripcion_id}
                        onChange={e => setData('suscripcion_id', e.target.value)}
                        placeholder="Suscripcion Id" 
                    />
                    {errors.suscripcion_id && <div className="invalid-feedback" role="alert"><strong>{errors.suscripcion_id}</strong></div>}
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
