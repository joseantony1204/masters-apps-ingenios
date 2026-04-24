import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    movimientosproductos: any[];
}

export default function Table({ movimientosproductos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('movimientosproductos.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('movimientosproductos.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('movimientosproductos.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Tipo</th>
									<th >Cantidad</th>
									<th >Stock Resultante</th>
									<th >Motivo</th>
									<th >Producto Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {movimientosproductos.map((movimientosproductos, index) => (
                    <tr key={movimientosproductos.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(movimientosproductos.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(movimientosproductos.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(movimientosproductos.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ movimientosproductos.tipo }</td>
										<td >{ movimientosproductos.cantidad }</td>
										<td >{ movimientosproductos.stock_resultante }</td>
										<td >{ movimientosproductos.motivo }</td>
										<td >{ movimientosproductos.producto_id }</td>
										<td >{ movimientosproductos.created_by }</td>
										<td >{ movimientosproductos.updated_by }</td>
										<td >{ movimientosproductos.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }