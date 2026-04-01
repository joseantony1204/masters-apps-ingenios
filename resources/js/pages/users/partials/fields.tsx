import { Users } from '@/types';

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
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        id="username" 
                        name="username" 
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={data.username}
                        onChange={e => setData('username', e.target.value)}
                        placeholder="Username" 
                    />
                    {errors.username && <div className="invalid-feedback" role="alert"><strong>{errors.username}</strong></div>}
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
                    <label htmlFor="perfil_id">Perfil Id</label>
                    <input 
                        type="text" 
                        id="perfil_id" 
                        name="perfil_id" 
                        className={`form-control ${errors.perfil_id ? 'is-invalid' : ''}`}
                        value={data.perfil_id}
                        onChange={e => setData('perfil_id', e.target.value)}
                        placeholder="Perfil Id" 
                    />
                    {errors.perfil_id && <div className="invalid-feedback" role="alert"><strong>{errors.perfil_id}</strong></div>}
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
