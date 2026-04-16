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
                    <label htmlFor="padre">Padre</label>
                    <input 
                        type="text" 
                        id="padre" 
                        name="padre" 
                        className={`form-control ${errors.padre ? 'is-invalid' : ''}`}
                        value={data.padre}
                        onChange={e => setData('padre', e.target.value)}
                        placeholder="Padre" 
                    />
                    {errors.padre && <div className="invalid-feedback" role="alert"><strong>{errors.padre}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="jerarquia">Jerarquia</label>
                    <input 
                        type="text" 
                        id="jerarquia" 
                        name="jerarquia" 
                        className={`form-control ${errors.jerarquia ? 'is-invalid' : ''}`}
                        value={data.jerarquia}
                        onChange={e => setData('jerarquia', e.target.value)}
                        placeholder="Jerarquia" 
                    />
                    {errors.jerarquia && <div className="invalid-feedback" role="alert"><strong>{errors.jerarquia}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="orden">Orden</label>
                    <input 
                        type="text" 
                        id="orden" 
                        name="orden" 
                        className={`form-control ${errors.orden ? 'is-invalid' : ''}`}
                        value={data.orden}
                        onChange={e => setData('orden', e.target.value)}
                        placeholder="Orden" 
                    />
                    {errors.orden && <div className="invalid-feedback" role="alert"><strong>{errors.orden}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="visible">Visible</label>
                    <input 
                        type="text" 
                        id="visible" 
                        name="visible" 
                        className={`form-control ${errors.visible ? 'is-invalid' : ''}`}
                        value={data.visible}
                        onChange={e => setData('visible', e.target.value)}
                        placeholder="Visible" 
                    />
                    {errors.visible && <div className="invalid-feedback" role="alert"><strong>{errors.visible}</strong></div>}
                </div>
            </div>            
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="observacion">Observacion</label>
                    <input 
                        type="text" 
                        id="observacion" 
                        name="observacion" 
                        className={`form-control ${errors.observacion ? 'is-invalid' : ''}`}
                        value={data.observacion}
                        onChange={e => setData('observacion', e.target.value)}
                        placeholder="Observacion" 
                    />
                    {errors.observacion && <div className="invalid-feedback" role="alert"><strong>{errors.observacion}</strong></div>}
                </div>
            </div>      
        </div> 
    </>
  );
}
