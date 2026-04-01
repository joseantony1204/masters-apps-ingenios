import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Ftresoluciones  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    ftresoluciones: Ftresoluciones[];
}

export default function Table({ ftresoluciones }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftresoluciones.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('ftresoluciones.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('ftresoluciones.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Numero</th>
									<th >Fecha</th>
									<th >Prefijo</th>
									<th >Desde</th>
									<th >Hasta</th>
									<th >Actual</th>
									<th >Advertirescacez</th>
									<th >Descripcion</th>
									<th >Fechafinal</th>
									<th >Comercio Id</th>
									<th >Estado</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {ftresoluciones.map((ftresoluciones, index) => (
                    <tr key={ftresoluciones.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(ftresoluciones.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(ftresoluciones.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(ftresoluciones.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ ftresoluciones.numero }</td>
										<td >{ ftresoluciones.fecha }</td>
										<td >{ ftresoluciones.prefijo }</td>
										<td >{ ftresoluciones.desde }</td>
										<td >{ ftresoluciones.hasta }</td>
										<td >{ ftresoluciones.actual }</td>
										<td >{ ftresoluciones.advertirescacez }</td>
										<td >{ ftresoluciones.descripcion }</td>
										<td >{ ftresoluciones.fechafinal }</td>
										<td >{ ftresoluciones.comercio_id }</td>
										<td >{ ftresoluciones.estado }</td>
										<td >{ ftresoluciones.created_by }</td>
										<td >{ ftresoluciones.updated_by }</td>
										<td >{ ftresoluciones.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }