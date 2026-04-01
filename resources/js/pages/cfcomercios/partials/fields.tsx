import { Cfcomercios } from '@/types';

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
                    <label htmlFor="esprincipal">Esprincipal</label>
                    <input 
                        type="text" 
                        id="esprincipal" 
                        name="esprincipal" 
                        className={`form-control ${errors.esprincipal ? 'is-invalid' : ''}`}
                        value={data.esprincipal}
                        onChange={e => setData('esprincipal', e.target.value)}
                        placeholder="Esprincipal" 
                    />
                    {errors.esprincipal && <div className="invalid-feedback" role="alert"><strong>{errors.esprincipal}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="pais_id">Pais Id</label>
                    <input 
                        type="text" 
                        id="pais_id" 
                        name="pais_id" 
                        className={`form-control ${errors.pais_id ? 'is-invalid' : ''}`}
                        value={data.pais_id}
                        onChange={e => setData('pais_id', e.target.value)}
                        placeholder="Pais Id" 
                    />
                    {errors.pais_id && <div className="invalid-feedback" role="alert"><strong>{errors.pais_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="departamento_id">Departamento Id</label>
                    <input 
                        type="text" 
                        id="departamento_id" 
                        name="departamento_id" 
                        className={`form-control ${errors.departamento_id ? 'is-invalid' : ''}`}
                        value={data.departamento_id}
                        onChange={e => setData('departamento_id', e.target.value)}
                        placeholder="Departamento Id" 
                    />
                    {errors.departamento_id && <div className="invalid-feedback" role="alert"><strong>{errors.departamento_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="municipio_id">Municipio Id</label>
                    <input 
                        type="text" 
                        id="municipio_id" 
                        name="municipio_id" 
                        className={`form-control ${errors.municipio_id ? 'is-invalid' : ''}`}
                        value={data.municipio_id}
                        onChange={e => setData('municipio_id', e.target.value)}
                        placeholder="Municipio Id" 
                    />
                    {errors.municipio_id && <div className="invalid-feedback" role="alert"><strong>{errors.municipio_id}</strong></div>}
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
