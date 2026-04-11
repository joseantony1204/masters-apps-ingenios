import { Cfcupones } from '@/types';

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
                    <label htmlFor="promocion_id">Promocion Id</label>
                    <input 
                        type="text" 
                        id="promocion_id" 
                        name="promocion_id" 
                        className={`form-control ${errors.promocion_id ? 'is-invalid' : ''}`}
                        value={data.promocion_id}
                        onChange={e => setData('promocion_id', e.target.value)}
                        placeholder="Promocion Id" 
                    />
                    {errors.promocion_id && <div className="invalid-feedback" role="alert"><strong>{errors.promocion_id}</strong></div>}
                </div>
            </div>            
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
                    <label htmlFor="limite_uso_total">Limite Uso Total</label>
                    <input 
                        type="text" 
                        id="limite_uso_total" 
                        name="limite_uso_total" 
                        className={`form-control ${errors.limite_uso_total ? 'is-invalid' : ''}`}
                        value={data.limite_uso_total}
                        onChange={e => setData('limite_uso_total', e.target.value)}
                        placeholder="Limite Uso Total" 
                    />
                    {errors.limite_uso_total && <div className="invalid-feedback" role="alert"><strong>{errors.limite_uso_total}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="limite_uso_por_persona">Limite Uso Por Persona</label>
                    <input 
                        type="text" 
                        id="limite_uso_por_persona" 
                        name="limite_uso_por_persona" 
                        className={`form-control ${errors.limite_uso_por_persona ? 'is-invalid' : ''}`}
                        value={data.limite_uso_por_persona}
                        onChange={e => setData('limite_uso_por_persona', e.target.value)}
                        placeholder="Limite Uso Por Persona" 
                    />
                    {errors.limite_uso_por_persona && <div className="invalid-feedback" role="alert"><strong>{errors.limite_uso_por_persona}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="usos_actuales">Usos Actuales</label>
                    <input 
                        type="text" 
                        id="usos_actuales" 
                        name="usos_actuales" 
                        className={`form-control ${errors.usos_actuales ? 'is-invalid' : ''}`}
                        value={data.usos_actuales}
                        onChange={e => setData('usos_actuales', e.target.value)}
                        placeholder="Usos Actuales" 
                    />
                    {errors.usos_actuales && <div className="invalid-feedback" role="alert"><strong>{errors.usos_actuales}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="es_automatico">Es Automatico</label>
                    <input 
                        type="text" 
                        id="es_automatico" 
                        name="es_automatico" 
                        className={`form-control ${errors.es_automatico ? 'is-invalid' : ''}`}
                        value={data.es_automatico}
                        onChange={e => setData('es_automatico', e.target.value)}
                        placeholder="Es Automatico" 
                    />
                    {errors.es_automatico && <div className="invalid-feedback" role="alert"><strong>{errors.es_automatico}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="fechavence">Fechavence</label>
                    <input 
                        type="text" 
                        id="fechavence" 
                        name="fechavence" 
                        className={`form-control ${errors.fechavence ? 'is-invalid' : ''}`}
                        value={data.fechavence}
                        onChange={e => setData('fechavence', e.target.value)}
                        placeholder="Fechavence" 
                    />
                    {errors.fechavence && <div className="invalid-feedback" role="alert"><strong>{errors.fechavence}</strong></div>}
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
