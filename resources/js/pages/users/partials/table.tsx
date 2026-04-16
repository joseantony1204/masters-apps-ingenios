import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    users: any[];
}

export default function Table({ users }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('users.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('users.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('users.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover align-middle mb-0">
                <thead className="table-light">
                    <tr>
                        <th className="text-center ps-4" style={{ width: '5%' }}>Acciones</th>
                        <th className="text-center" style={{ width: '2%' }}>#</th>
                        <th>Persona / Identificación / Usuario</th>
                        <th>Contacto</th>
                        <th>Perfil / Comercio</th>
                        <th className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            {/* ACCIONES */}
                            <td className="text-center ps-4">
                                <div className="d-flex justify-content-center gap-1">
                                    <button 
                                        onClick={() => handleView(user.id)} 
                                        className="btn btn-sm btn-icon btn-link-secondary border-0"
                                    >
                                        <i className="ti ti-eye fs-4"></i>
                                    </button>
                                </div>
                            </td>

                            {/* ÍNDICE */}
                            <td className="text-center text-muted small">{index + 1}</td>

                            {/* INFO USUARIO */}
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="avtar avtar-s bg-light-primary text-primary me-2">
                                        {user.round || user.persona.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="fw-bold text-dark">{user.persona || 'Sin nombre'}</div>
                                        <span className="badge bg-light-secondary border text-secondary fw-medium">
                                            {user.identificacion}
                                        </span>
                                        <small className="text-muted d-block">{user.username}</small>
                                    </div>
                                </div>
                            </td>

                            {/* CONTACTO */}
                            <td>
                                <div className="small">
                                    <div className="text-dark">
                                        <i className="ti ti-mail me-1 text-muted"></i>
                                        {user.email}
                                    </div>
                                    <div className="text-muted">
                                        <i className="ti ti-phone me-1 text-muted"></i>
                                        {user.telefonomovil}
                                    </div>
                                </div>
                            </td>

                            {/* PERFIL Y COMERCIO */}
                            <td>
                                <div>
                                    <span className="d-block fw-semibold small text-uppercase">
                                        {user.perfil}
                                    </span>
                                    <small className="text-muted">
                                        <i className="ti ti-building-store me-1"></i>
                                        {user.nombreComercio}
                                    </small>
                                </div>
                            </td>

                            {/* ESTADO */}
                            <td className="text-center">
                                <span className={`badge ${user.estado === 'ACTIVO' ? 'bg-light-success text-success' : 'bg-light-danger text-danger'} rounded-pill px-3`}>
                                    {user.estado}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }