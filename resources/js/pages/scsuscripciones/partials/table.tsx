import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Scsuscripciones  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    scsuscripciones: Scsuscripciones[];
}

export default function Table({ scsuscripciones }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('scsuscripciones.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('scsuscripciones.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('scsuscripciones.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Fecha Inicio</th>
									<th >Fecha Vencimiento</th>
									<th >Ultimo Pago Id</th>
									<th >Estado Id</th>
									<th >Plan Id</th>
									<th >Comercio Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {scsuscripciones.map((scsuscripciones, index) => (
                    <tr key={scsuscripciones.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(scsuscripciones.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(scsuscripciones.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(scsuscripciones.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ scsuscripciones.fecha_inicio }</td>
										<td >{ scsuscripciones.fecha_vencimiento }</td>
										<td >{ scsuscripciones.ultimo_pago_id }</td>
										<td >{ scsuscripciones.estado_id }</td>
										<td >{ scsuscripciones.plan_id }</td>
										<td >{ scsuscripciones.comercio_id }</td>
										<td >{ scsuscripciones.created_by }</td>
										<td >{ scsuscripciones.updated_by }</td>
										<td >{ scsuscripciones.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }