import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Cfhorarios  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    cfhorarios: Cfhorarios[];
}

export default function Table({ cfhorarios }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfhorarios.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfhorarios.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfhorarios.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Horainicio</th>
									<th >Horafinal</th>
									<th >Empleado Id</th>
									<th >Dia Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {cfhorarios.map((cfhorarios, index) => (
                    <tr key={cfhorarios.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(cfhorarios.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfhorarios.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfhorarios.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ cfhorarios.horainicio }</td>
										<td >{ cfhorarios.horafinal }</td>
										<td >{ cfhorarios.empleado_id }</td>
										<td >{ cfhorarios.dia_id }</td>
										<td >{ cfhorarios.created_by }</td>
										<td >{ cfhorarios.updated_by }</td>
										<td >{ cfhorarios.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }