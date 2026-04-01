import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Ftturnos  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    ftturnos: Ftturnos[];
}

export default function Table({ ftturnos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftturnos.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('ftturnos.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('ftturnos.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Codigo</th>
									<th >Descripcion</th>
									<th >Observaciones</th>
									<th >Baseinicial</th>
									<th >Fecha</th>
									<th >Fechanaapertura</th>
									<th >Fechanacierre</th>
									<th >Persona Id</th>
									<th >Terminal Id</th>
									<th >Estado Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {ftturnos.map((ftturnos, index) => (
                    <tr key={ftturnos.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(ftturnos.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(ftturnos.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(ftturnos.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ ftturnos.codigo }</td>
										<td >{ ftturnos.descripcion }</td>
										<td >{ ftturnos.observaciones }</td>
										<td >{ ftturnos.baseinicial }</td>
										<td >{ ftturnos.fecha }</td>
										<td >{ ftturnos.fechanaapertura }</td>
										<td >{ ftturnos.fechanacierre }</td>
										<td >{ ftturnos.persona_id }</td>
										<td >{ ftturnos.terminal_id }</td>
										<td >{ ftturnos.estado_id }</td>
										<td >{ ftturnos.created_by }</td>
										<td >{ ftturnos.updated_by }</td>
										<td >{ ftturnos.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }