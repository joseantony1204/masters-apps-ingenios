import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Sgrolesperfiles  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    sgrolesperfiles: Sgrolesperfiles[];
}

export default function Table({ sgrolesperfiles }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('sgrolesperfiles.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('sgrolesperfiles.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('sgrolesperfiles.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th>Editar</th>
                        <th>Item</th>
                        
									<th >Perfil Id</th>
									<th >Rol Id</th>
									<th >Estado</th>
									<th >Observacion</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {sgrolesperfiles.map((sgrolesperfiles, index) => (
                    <tr key={sgrolesperfiles.id}>
                        <td>
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(sgrolesperfiles.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(sgrolesperfiles.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(sgrolesperfiles.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td>{index + 1}</td>
                        
										<td >{ sgrolesperfiles.perfil_id }</td>
										<td >{ sgrolesperfiles.rol_id }</td>
										<td >{ sgrolesperfiles.estado }</td>
										<td >{ sgrolesperfiles.observacion }</td>
										<td >{ sgrolesperfiles.created_by }</td>
										<td >{ sgrolesperfiles.updated_by }</td>
										<td >{ sgrolesperfiles.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }