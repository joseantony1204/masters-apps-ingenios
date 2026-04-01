import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Users  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    users: Users[];
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
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Username</th>
									<th >Email</th>
									<th >Telefonomovil</th>
									<th >Estado Id</th>
									<th >Perfil Id</th>
									<th >Persona Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {users.map((users, index) => (
                    <tr key={users.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(users.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(users.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(users.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ users.username }</td>
										<td >{ users.email }</td>
										<td >{ users.telefonomovil }</td>
										<td >{ users.estado_id }</td>
										<td >{ users.perfil_id }</td>
										<td >{ users.persona_id }</td>
										<td >{ users.created_by }</td>
										<td >{ users.updated_by }</td>
										<td >{ users.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }