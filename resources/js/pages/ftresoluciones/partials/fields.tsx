import { Ftresoluciones } from '@/types';

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
                    <label htmlFor="prefijo">Prefijo</label>
                    <input 
                        type="text" 
                        id="prefijo" 
                        name="prefijo" 
                        className={`form-control ${errors.prefijo ? 'is-invalid' : ''}`}
                        value={data.prefijo}
                        onChange={e => setData('prefijo', e.target.value)}
                        placeholder="Prefijo" 
                    />
                    {errors.prefijo && <div className="invalid-feedback" role="alert"><strong>{errors.prefijo}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="desde">Desde</label>
                    <input 
                        type="text" 
                        id="desde" 
                        name="desde" 
                        className={`form-control ${errors.desde ? 'is-invalid' : ''}`}
                        value={data.desde}
                        onChange={e => setData('desde', e.target.value)}
                        placeholder="Desde" 
                    />
                    {errors.desde && <div className="invalid-feedback" role="alert"><strong>{errors.desde}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="hasta">Hasta</label>
                    <input 
                        type="text" 
                        id="hasta" 
                        name="hasta" 
                        className={`form-control ${errors.hasta ? 'is-invalid' : ''}`}
                        value={data.hasta}
                        onChange={e => setData('hasta', e.target.value)}
                        placeholder="Hasta" 
                    />
                    {errors.hasta && <div className="invalid-feedback" role="alert"><strong>{errors.hasta}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="actual">Actual</label>
                    <input 
                        type="text" 
                        id="actual" 
                        name="actual" 
                        className={`form-control ${errors.actual ? 'is-invalid' : ''}`}
                        value={data.actual}
                        onChange={e => setData('actual', e.target.value)}
                        placeholder="Actual" 
                    />
                    {errors.actual && <div className="invalid-feedback" role="alert"><strong>{errors.actual}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="advertirescacez">Advertirescacez</label>
                    <input 
                        type="text" 
                        id="advertirescacez" 
                        name="advertirescacez" 
                        className={`form-control ${errors.advertirescacez ? 'is-invalid' : ''}`}
                        value={data.advertirescacez}
                        onChange={e => setData('advertirescacez', e.target.value)}
                        placeholder="Advertirescacez" 
                    />
                    {errors.advertirescacez && <div className="invalid-feedback" role="alert"><strong>{errors.advertirescacez}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="descripcion">Descripcion</label>
                    <input 
                        type="text" 
                        id="descripcion" 
                        name="descripcion" 
                        className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
                        value={data.descripcion}
                        onChange={e => setData('descripcion', e.target.value)}
                        placeholder="Descripcion" 
                    />
                    {errors.descripcion && <div className="invalid-feedback" role="alert"><strong>{errors.descripcion}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fechafinal">Fechafinal</label>
                    <input 
                        type="text" 
                        id="fechafinal" 
                        name="fechafinal" 
                        className={`form-control ${errors.fechafinal ? 'is-invalid' : ''}`}
                        value={data.fechafinal}
                        onChange={e => setData('fechafinal', e.target.value)}
                        placeholder="Fechafinal" 
                    />
                    {errors.fechafinal && <div className="invalid-feedback" role="alert"><strong>{errors.fechafinal}</strong></div>}
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
