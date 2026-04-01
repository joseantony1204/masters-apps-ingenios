import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Ftimpuestos  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    ftimpuestos: Ftimpuestos[];
}

export default function Table({ ftimpuestos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftimpuestos.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('ftimpuestos.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('ftimpuestos.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Base</th>
									<th >Valor</th>
									<th >Detalle Id</th>
									<th >Impuesto Id</th>
									<th >Factura Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {ftimpuestos.map((ftimpuestos, index) => (
                    <tr key={ftimpuestos.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(ftimpuestos.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(ftimpuestos.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(ftimpuestos.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ ftimpuestos.base }</td>
										<td >{ ftimpuestos.valor }</td>
										<td >{ ftimpuestos.detalle_id }</td>
										<td >{ ftimpuestos.impuesto_id }</td>
										<td >{ ftimpuestos.factura_id }</td>
										<td >{ ftimpuestos.created_by }</td>
										<td >{ ftimpuestos.updated_by }</td>
										<td >{ ftimpuestos.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }