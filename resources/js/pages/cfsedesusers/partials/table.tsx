import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Cfsedesusers  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    cfsedesusers: Cfsedesusers[];
}

export default function Table({ cfsedesusers }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfsedesusers.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfsedesusers.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfsedesusers.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Orden</th>
									<th >Predeterminada</th>
									<th >Usuario Id</th>
									<th >Sede Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {cfsedesusers.map((cfsedesusers, index) => (
                    <tr key={cfsedesusers.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(cfsedesusers.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfsedesusers.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfsedesusers.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ cfsedesusers.orden }</td>
										<td >{ cfsedesusers.predeterminada }</td>
										<td >{ cfsedesusers.usuario_id }</td>
										<td >{ cfsedesusers.sede_id }</td>
										<td >{ cfsedesusers.created_by }</td>
										<td >{ cfsedesusers.updated_by }</td>
										<td >{ cfsedesusers.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }