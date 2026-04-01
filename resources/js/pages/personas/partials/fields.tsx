import { Personas } from '@/types';

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
                    <label htmlFor="identificacion">Identificacion</label>
                    <input 
                        type="text" 
                        id="identificacion" 
                        name="identificacion" 
                        className={`form-control ${errors.identificacion ? 'is-invalid' : ''}`}
                        value={data.identificacion}
                        onChange={e => setData('identificacion', e.target.value)}
                        placeholder="Identificacion" 
                    />
                    {errors.identificacion && <div className="invalid-feedback" role="alert"><strong>{errors.identificacion}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="digitoverificacion">Digitoverificacion</label>
                    <input 
                        type="text" 
                        id="digitoverificacion" 
                        name="digitoverificacion" 
                        className={`form-control ${errors.digitoverificacion ? 'is-invalid' : ''}`}
                        value={data.digitoverificacion}
                        onChange={e => setData('digitoverificacion', e.target.value)}
                        placeholder="Digitoverificacion" 
                    />
                    {errors.digitoverificacion && <div className="invalid-feedback" role="alert"><strong>{errors.digitoverificacion}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="lugarexpedicion">Lugarexpedicion</label>
                    <input 
                        type="text" 
                        id="lugarexpedicion" 
                        name="lugarexpedicion" 
                        className={`form-control ${errors.lugarexpedicion ? 'is-invalid' : ''}`}
                        value={data.lugarexpedicion}
                        onChange={e => setData('lugarexpedicion', e.target.value)}
                        placeholder="Lugarexpedicion" 
                    />
                    {errors.lugarexpedicion && <div className="invalid-feedback" role="alert"><strong>{errors.lugarexpedicion}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fechaexpedicion">Fechaexpedicion</label>
                    <input 
                        type="text" 
                        id="fechaexpedicion" 
                        name="fechaexpedicion" 
                        className={`form-control ${errors.fechaexpedicion ? 'is-invalid' : ''}`}
                        value={data.fechaexpedicion}
                        onChange={e => setData('fechaexpedicion', e.target.value)}
                        placeholder="Fechaexpedicion" 
                    />
                    {errors.fechaexpedicion && <div className="invalid-feedback" role="alert"><strong>{errors.fechaexpedicion}</strong></div>}
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
                    <label htmlFor="telefonomovil">Telefonomovil</label>
                    <input 
                        type="text" 
                        id="telefonomovil" 
                        name="telefonomovil" 
                        className={`form-control ${errors.telefonomovil ? 'is-invalid' : ''}`}
                        value={data.telefonomovil}
                        onChange={e => setData('telefonomovil', e.target.value)}
                        placeholder="Telefonomovil" 
                    />
                    {errors.telefonomovil && <div className="invalid-feedback" role="alert"><strong>{errors.telefonomovil}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="sendsms">Sendsms</label>
                    <input 
                        type="text" 
                        id="sendsms" 
                        name="sendsms" 
                        className={`form-control ${errors.sendsms ? 'is-invalid' : ''}`}
                        value={data.sendsms}
                        onChange={e => setData('sendsms', e.target.value)}
                        placeholder="Sendsms" 
                    />
                    {errors.sendsms && <div className="invalid-feedback" role="alert"><strong>{errors.sendsms}</strong></div>}
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
                    <label htmlFor="sendemail">Sendemail</label>
                    <input 
                        type="text" 
                        id="sendemail" 
                        name="sendemail" 
                        className={`form-control ${errors.sendemail ? 'is-invalid' : ''}`}
                        value={data.sendemail}
                        onChange={e => setData('sendemail', e.target.value)}
                        placeholder="Sendemail" 
                    />
                    {errors.sendemail && <div className="invalid-feedback" role="alert"><strong>{errors.sendemail}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="foto">Foto</label>
                    <input 
                        type="text" 
                        id="foto" 
                        name="foto" 
                        className={`form-control ${errors.foto ? 'is-invalid' : ''}`}
                        value={data.foto}
                        onChange={e => setData('foto', e.target.value)}
                        placeholder="Foto" 
                    />
                    {errors.foto && <div className="invalid-feedback" role="alert"><strong>{errors.foto}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="firma">Firma</label>
                    <input 
                        type="text" 
                        id="firma" 
                        name="firma" 
                        className={`form-control ${errors.firma ? 'is-invalid' : ''}`}
                        value={data.firma}
                        onChange={e => setData('firma', e.target.value)}
                        placeholder="Firma" 
                    />
                    {errors.firma && <div className="invalid-feedback" role="alert"><strong>{errors.firma}</strong></div>}
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
                    <label htmlFor="ciudad_id">Ciudad Id</label>
                    <input 
                        type="text" 
                        id="ciudad_id" 
                        name="ciudad_id" 
                        className={`form-control ${errors.ciudad_id ? 'is-invalid' : ''}`}
                        value={data.ciudad_id}
                        onChange={e => setData('ciudad_id', e.target.value)}
                        placeholder="Ciudad Id" 
                    />
                    {errors.ciudad_id && <div className="invalid-feedback" role="alert"><strong>{errors.ciudad_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="barrio">Barrio</label>
                    <input 
                        type="text" 
                        id="barrio" 
                        name="barrio" 
                        className={`form-control ${errors.barrio ? 'is-invalid' : ''}`}
                        value={data.barrio}
                        onChange={e => setData('barrio', e.target.value)}
                        placeholder="Barrio" 
                    />
                    {errors.barrio && <div className="invalid-feedback" role="alert"><strong>{errors.barrio}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="tipoidentificacion_id">Tipoidentificacion Id</label>
                    <input 
                        type="text" 
                        id="tipoidentificacion_id" 
                        name="tipoidentificacion_id" 
                        className={`form-control ${errors.tipoidentificacion_id ? 'is-invalid' : ''}`}
                        value={data.tipoidentificacion_id}
                        onChange={e => setData('tipoidentificacion_id', e.target.value)}
                        placeholder="Tipoidentificacion Id" 
                    />
                    {errors.tipoidentificacion_id && <div className="invalid-feedback" role="alert"><strong>{errors.tipoidentificacion_id}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="tiporegimen_id">Tiporegimen Id</label>
                    <input 
                        type="text" 
                        id="tiporegimen_id" 
                        name="tiporegimen_id" 
                        className={`form-control ${errors.tiporegimen_id ? 'is-invalid' : ''}`}
                        value={data.tiporegimen_id}
                        onChange={e => setData('tiporegimen_id', e.target.value)}
                        placeholder="Tiporegimen Id" 
                    />
                    {errors.tiporegimen_id && <div className="invalid-feedback" role="alert"><strong>{errors.tiporegimen_id}</strong></div>}
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
