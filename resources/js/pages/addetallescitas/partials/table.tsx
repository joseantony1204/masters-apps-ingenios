import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';

import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    addetallescitas: any[];
}

export default function Table({ addetallescitas }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('addetallescitas.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('addetallescitas.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('addetallescitas.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Descuento</th>
									<th >Preciofinal</th>
									<th >Fechacreado</th>
									<th >Empleadoservicio Id</th>
									<th >Cita Id</th>
									<th >Estado Id</th>
									<th >Observaciones</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {addetallescitas.map((addetallescitas, index) => (
                    <tr key={addetallescitas.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(addetallescitas.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(addetallescitas.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(addetallescitas.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ addetallescitas.descuento }</td>
										<td >{ addetallescitas.preciofinal }</td>
										<td >{ addetallescitas.fechacreado }</td>
										<td >{ addetallescitas.empleadoservicio_id }</td>
										<td >{ addetallescitas.cita_id }</td>
										<td >{ addetallescitas.estado_id }</td>
										<td >{ addetallescitas.observaciones }</td>
										<td >{ addetallescitas.created_by }</td>
										<td >{ addetallescitas.updated_by }</td>
										<td >{ addetallescitas.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }