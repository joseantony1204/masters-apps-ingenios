import { Ftterminales } from '@/types';

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
                    <label htmlFor="logo">Logo</label>
                    <input 
                        type="text" 
                        id="logo" 
                        name="logo" 
                        className={`form-control ${errors.logo ? 'is-invalid' : ''}`}
                        value={data.logo}
                        onChange={e => setData('logo', e.target.value)}
                        placeholder="Logo" 
                    />
                    {errors.logo && <div className="invalid-feedback" role="alert"><strong>{errors.logo}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="resolucion_id">Resolucion Id</label>
                    <input 
                        type="text" 
                        id="resolucion_id" 
                        name="resolucion_id" 
                        className={`form-control ${errors.resolucion_id ? 'is-invalid' : ''}`}
                        value={data.resolucion_id}
                        onChange={e => setData('resolucion_id', e.target.value)}
                        placeholder="Resolucion Id" 
                    />
                    {errors.resolucion_id && <div className="invalid-feedback" role="alert"><strong>{errors.resolucion_id}</strong></div>}
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
