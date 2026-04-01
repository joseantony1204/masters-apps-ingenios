import { Cfimpuestos } from '@/types';

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
                    <label htmlFor="codigo">Codigo</label>
                    <input 
                        type="text" 
                        id="codigo" 
                        name="codigo" 
                        className={`form-control ${errors.codigo ? 'is-invalid' : ''}`}
                        value={data.codigo}
                        onChange={e => setData('codigo', e.target.value)}
                        placeholder="Codigo" 
                    />
                    {errors.codigo && <div className="invalid-feedback" role="alert"><strong>{errors.codigo}</strong></div>}
                </div>
            </div>            
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
                    <label htmlFor="tipo_id">Tipo Id</label>
                    <input 
                        type="text" 
                        id="tipo_id" 
                        name="tipo_id" 
                        className={`form-control ${errors.tipo_id ? 'is-invalid' : ''}`}
                        value={data.tipo_id}
                        onChange={e => setData('tipo_id', e.target.value)}
                        placeholder="Tipo Id" 
                    />
                    {errors.tipo_id && <div className="invalid-feedback" role="alert"><strong>{errors.tipo_id}</strong></div>}
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
