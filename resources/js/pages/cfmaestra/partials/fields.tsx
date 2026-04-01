import { Cfmaestra } from '@/types';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    tiposList?: { [key: string]: string };      
    jerarquiaList?: { [key: string]: string }; 
}

export default function Fields({ data, setData, errors, tiposList = {}, jerarquiaList = {} }: Props) {
  return (
    <>
        <div className="row">
            <div className="col-md-4">
            <div className="form-group">
                <label htmlFor="codigo">Código</label>
                <input
                type="text"
                className={`form-control${errors.codigo ? ' is-invalid' : ''}`}
                value={data.codigo}
                onChange={e => setData('codigo', e.target.value)}
                />
                {errors.codigo && <div className="invalid-feedback">{errors.codigo}</div>}
            </div>
            </div>

            <div className="col-md-8">
            <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                type="text"
                className={`form-control${errors.nombre ? ' is-invalid' : ''}`}
                value={data.nombre}
                onChange={e => setData('nombre', e.target.value)}
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>
            </div>
        </div>

        <div className="row">
            <div className="col-md-4">
                <div className="form-group">
                    <label htmlFor="padre">Padre</label>
                    <select
                    className={`form-control ${errors.padre ? ' is-invalid' : ''}`}
                    value={data.padre}
                    onChange={e => setData('padre', e.target.value)}
                    >
                    <option value="">-- Selecciona --</option>
                    {Object.entries(tiposList).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                    </select>
                    {errors.padre && <div className="invalid-feedback">{errors.padre}</div>}
                </div>
            </div>

            <div className="col-md-4">
                <div className="form-group">
                    <label htmlFor="jerarquia">Jerarquía</label>
                    <select
                    className={`form-control${errors.jerarquia ? ' is-invalid' : ''}`}
                    value={data.jerarquia}
                    onChange={e => setData('jerarquia', e.target.value)}
                    >
                    <option value="">-- Selecciona --</option>
                    {Object.entries(jerarquiaList).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                    </select>
                    {errors.jerarquia && <div className="invalid-feedback">{errors.jerarquia}</div>}
                </div>
            </div>

            <div className="col-md-2">
                <div className="form-group">
                    <label htmlFor="orden">Posición</label>
                    <input
                    type="number"
                    className={`form-control${errors.orden ? ' is-invalid' : ''}`}
                    value={data.orden}
                    onChange={e => setData('orden', Number(e.target.value))}
                    />
                    {errors.orden && <div className="invalid-feedback">{errors.orden}</div>}
                </div>
            </div>

            <div className="col-md-2">
                <div className="form-group">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="visible"
                            checked={data.visible}
                            onChange={(e) => setData('visible', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="visible">
                            Visible en el menú
                        </label>
                    </div>
                    {errors.visible && <div className="invalid-feedback">{errors.visible}</div>}
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="observacion">Observaciones</label>
                    <textarea
                    className={`form-control${errors.observacion ? ' is-invalid' : ''}`}
                    rows={8}
                    value={data.observacion}
                    onChange={e => setData('observacion', e.target.value)}
                    />
                    {errors.observacion && <div className="invalid-feedback">{errors.observacion}</div>}
                </div>
            </div>
        </div>
    </>
  );
}
