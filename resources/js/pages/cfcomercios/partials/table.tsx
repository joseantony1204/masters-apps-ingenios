import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Cfcomercios  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    cfcomercios: Cfcomercios[];
}

export default function Table({ cfcomercios }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfcomercios.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfcomercios.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfcomercios.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Nombre</th>
									<th >Direccion</th>
									<th >Telefono</th>
									<th >Email</th>
									<th >Esprincipal</th>
									<th >Pais Id</th>
									<th >Departamento Id</th>
									<th >Municipio Id</th>
									<th >Estado Id</th>
									<th >Descripcion</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {cfcomercios.map((cfcomercios, index) => (
                    <tr key={cfcomercios.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(cfcomercios.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfcomercios.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfcomercios.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ cfcomercios.nombre }</td>
										<td >{ cfcomercios.direccion }</td>
										<td >{ cfcomercios.telefono }</td>
										<td >{ cfcomercios.email }</td>
										<td >{ cfcomercios.esprincipal }</td>
										<td >{ cfcomercios.pais_id }</td>
										<td >{ cfcomercios.departamento_id }</td>
										<td >{ cfcomercios.municipio_id }</td>
										<td >{ cfcomercios.estado_id }</td>
										<td >{ cfcomercios.descripcion }</td>
										<td >{ cfcomercios.created_by }</td>
										<td >{ cfcomercios.updated_by }</td>
										<td >{ cfcomercios.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }