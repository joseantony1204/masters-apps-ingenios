import { Cfpromociones } from '@/types';

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
                    <label htmlFor="tipo_descuento">Tipo Descuento</label>
                    <input 
                        type="text" 
                        id="tipo_descuento" 
                        name="tipo_descuento" 
                        className={`form-control ${errors.tipo_descuento ? 'is-invalid' : ''}`}
                        value={data.tipo_descuento}
                        onChange={e => setData('tipo_descuento', e.target.value)}
                        placeholder="Tipo Descuento" 
                    />
                    {errors.tipo_descuento && <div className="invalid-feedback" role="alert"><strong>{errors.tipo_descuento}</strong></div>}
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
                    <label htmlFor="compra_minima">Compra Minima</label>
                    <input 
                        type="text" 
                        id="compra_minima" 
                        name="compra_minima" 
                        className={`form-control ${errors.compra_minima ? 'is-invalid' : ''}`}
                        value={data.compra_minima}
                        onChange={e => setData('compra_minima', e.target.value)}
                        placeholder="Compra Minima" 
                    />
                    {errors.compra_minima && <div className="invalid-feedback" role="alert"><strong>{errors.compra_minima}</strong></div>}
                </div>
            </div>            
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
                    <label htmlFor="fecha_fin">Fecha Fin</label>
                    <input 
                        type="text" 
                        id="fecha_fin" 
                        name="fecha_fin" 
                        className={`form-control ${errors.fecha_fin ? 'is-invalid' : ''}`}
                        value={data.fecha_fin}
                        onChange={e => setData('fecha_fin', e.target.value)}
                        placeholder="Fecha Fin" 
                    />
                    {errors.fecha_fin && <div className="invalid-feedback" role="alert"><strong>{errors.fecha_fin}</strong></div>}
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
