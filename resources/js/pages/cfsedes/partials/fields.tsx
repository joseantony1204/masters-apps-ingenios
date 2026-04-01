import { Cfsedes } from '@/types';

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
                    <label htmlFor="direccion">Direccion</label>
                    <input 
                        type="text" 
                        id="direccion" 
                        name="direccion" 
                        className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                        value={data.direccion}
                        onChange={e => setData('direccion', e.target.value)}
                        placeholder="Direccion" 
                    />
                    {errors.direccion && <div className="invalid-feedback" role="alert"><strong>{errors.direccion}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        placeholder="Email" 
                    />
                    {errors.email && <div className="invalid-feedback" role="alert"><strong>{errors.email}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="telefono">Telefono</label>
                    <input 
                        type="text" 
                        id="telefono" 
                        name="telefono" 
                        className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                        value={data.telefono}
                        onChange={e => setData('telefono', e.target.value)}
                        placeholder="Telefono" 
                    />
                    {errors.telefono && <div className="invalid-feedback" role="alert"><strong>{errors.telefono}</strong></div>}
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
