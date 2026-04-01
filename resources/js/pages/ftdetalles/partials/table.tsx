import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Ftdetalles  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    ftdetalles: Ftdetalles[];
}

export default function Table({ ftdetalles }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftdetalles.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('ftdetalles.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('ftdetalles.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Cantidad</th>
									<th >Numero</th>
									<th >Precioinicial</th>
									<th >Preciofinal</th>
									<th >Descuento</th>
									<th >Totalapagar</th>
									<th >Fecha</th>
									<th >Observaciones</th>
									<th >Producto Id</th>
									<th >Factura Id</th>
									<th >Estado Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {ftdetalles.map((ftdetalles, index) => (
                    <tr key={ftdetalles.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(ftdetalles.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(ftdetalles.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(ftdetalles.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ ftdetalles.cantidad }</td>
										<td >{ ftdetalles.numero }</td>
										<td >{ ftdetalles.precioinicial }</td>
										<td >{ ftdetalles.preciofinal }</td>
										<td >{ ftdetalles.descuento }</td>
										<td >{ ftdetalles.totalapagar }</td>
										<td >{ ftdetalles.fecha }</td>
										<td >{ ftdetalles.observaciones }</td>
										<td >{ ftdetalles.producto_id }</td>
										<td >{ ftdetalles.factura_id }</td>
										<td >{ ftdetalles.estado_id }</td>
										<td >{ ftdetalles.created_by }</td>
										<td >{ ftdetalles.updated_by }</td>
										<td >{ ftdetalles.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }