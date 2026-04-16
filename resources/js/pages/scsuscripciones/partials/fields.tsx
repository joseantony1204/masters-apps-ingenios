import { Scsuscripciones } from '@/types';

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
                    <label htmlFor="fecha_inicio">Fecha Inicio</label>
                    <input 
                        type="text" 
                        id="fecha_inicio" 
                        name="fecha_inicio" 
                        className={`form-control ${errors.fecha_inicio ? 'is-invalid' : ''}`}
                        value={data.fecha_inicio}
                        onChange={e => setData('fecha_inicio', e.target.value)}
                        placeholder="Fecha Inicio" 
                    />
                    {errors.fecha_inicio && <div className="invalid-feedback" role="alert"><strong>{errors.fecha_inicio}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fecha_vencimiento">Fecha Vencimiento</label>
                    <input 
                        type="text" 
                        id="fecha_vencimiento" 
                        name="fecha_vencimiento" 
                        className={`form-control ${errors.fecha_vencimiento ? 'is-invalid' : ''}`}
                        value={data.fecha_vencimiento}
                        onChange={e => setData('fecha_vencimiento', e.target.value)}
                        placeholder="Fecha Vencimiento" 
                    />
                    {errors.fecha_vencimiento && <div className="invalid-feedback" role="alert"><strong>{errors.fecha_vencimiento}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="ultimo_pago_id">Ultimo Pago Id</label>
                    <input 
                        type="text" 
                        id="ultimo_pago_id" 
                        name="ultimo_pago_id" 
                        className={`form-control ${errors.ultimo_pago_id ? 'is-invalid' : ''}`}
                        value={data.ultimo_pago_id}
                        onChange={e => setData('ultimo_pago_id', e.target.value)}
                        placeholder="Ultimo Pago Id" 
                    />
                    {errors.ultimo_pago_id && <div className="invalid-feedback" role="alert"><strong>{errors.ultimo_pago_id}</strong></div>}
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
                    <label htmlFor="plan_id">Plan Id</label>
                    <input 
                        type="text" 
                        id="plan_id" 
                        name="plan_id" 
                        className={`form-control ${errors.plan_id ? 'is-invalid' : ''}`}
                        value={data.plan_id}
                        onChange={e => setData('plan_id', e.target.value)}
                        placeholder="Plan Id" 
                    />
                    {errors.plan_id && <div className="invalid-feedback" role="alert"><strong>{errors.plan_id}</strong></div>}
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
