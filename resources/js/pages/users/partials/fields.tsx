import { Users } from '@/types';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    perfilesList: Record<string, string>;
    estadosList: Record<string, string>;
}

export default function Fields({ data, setData, errors, perfilesList, estadosList }: Props) {
  return (
    <>
        <div className="row">
            {/* SECCIÓN: INFORMACIÓN DE CUENTA */}
            <div className="col-12 mt-0">
                <div className="d-flex align-items-center mb-2">
                    <i className="ti ti-user-circle fs-4 text-primary me-2"></i>
                    <h6 className="mb-0 text-uppercase fw-bold text-muted">Información de Cuenta</h6>
                </div>
                <hr className="mt-0 opacity-25" />
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label className="form-label fw-semibold" htmlFor="username">Nombre de Usuario</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light"><i className="ti ti-user fs-5"></i></span>
                        <input 
                            type="text" 
                            id="username" 
                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                            value={data.username}
                            onChange={e => setData('username', e.target.value)}
                            placeholder="ej. jdoe123" 
                        />
                        {errors.username && <div className="invalid-feedback"><strong>{errors.username}</strong></div>}
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="form-group">
                    <label className="form-label fw-semibold" htmlFor="perfil_id">Perfil de Usuario</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light"><i className="ti ti-shield-lock fs-5"></i></span>
                        <select 
                            className={`form-select ${errors.perfil_id ? 'is-invalid' : ''}`}
                            value={data.perfil_id} 
                            onChange={e => setData('perfil_id', e.target.value)}>
                            <option value="">-- Elige --</option>
                            {Object.entries(perfilesList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        {errors.perfil_id && <div className="invalid-feedback"><strong>{errors.perfil_id}</strong></div>}
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="form-group">
                    <label className="form-label fw-semibold" htmlFor="email">Correo Electrónico</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light"><i className="ti ti-mail fs-5"></i></span>
                        <input 
                            type="email" 
                            id="email" 
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="usuario@ejemplo.com" 
                        />
                        {errors.email && <div className="invalid-feedback"><strong>{errors.email}</strong></div>}
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="form-group">
                    <label className="form-label fw-semibold" htmlFor="telefonomovil">Teléfono Móvil</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light"><i className="ti ti-device-mobile fs-5"></i></span>
                        <input 
                            type="text" 
                            id="telefonomovil" 
                            className={`form-control ${errors.telefonomovil ? 'is-invalid' : ''}`}
                            value={data.telefonomovil}
                            onChange={e => setData('telefonomovil', e.target.value)}
                            placeholder="+57 300..." 
                        />
                        {errors.telefonomovil && <div className="invalid-feedback"><strong>{errors.telefonomovil}</strong></div>}
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="form-group">
                    <label className="form-label fw-semibold" htmlFor="estado_id">Estado del Usuario</label>
                    <div className="input-group">
                        <span className="input-group-text bg-light"><i className="ti ti-activity fs-5"></i></span>
                        <select 
                            className={`form-select ${errors.estado_id ? 'is-invalid' : ''}`}
                            value={data.estado_id} 
                            onChange={e => setData('estado_id', e.target.value)}>
                            <option value="">-- Elige --</option>
                            {Object.entries(estadosList).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        {errors.estado_id && <div className="invalid-feedback"><strong>{errors.estado_id}</strong></div>}
                    </div>
                </div>
            </div>
        </div> 
    </>
  );
}