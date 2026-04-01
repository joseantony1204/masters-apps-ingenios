import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Ftpagos  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    ftpagos: Ftpagos[];
}

export default function Table({ ftpagos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftpagos.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('ftpagos.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('ftpagos.show', id));
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
									<th >Concepto</th>
									<th >Total</th>
									<th >Metodo Id</th>
									<th >Factura Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {ftpagos.map((ftpagos, index) => (
                    <tr key={ftpagos.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(ftpagos.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(ftpagos.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(ftpagos.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ ftpagos.numero }</td>
										<td >{ ftpagos.fecha }</td>
										<td >{ ftpagos.concepto }</td>
										<td >{ ftpagos.total }</td>
										<td >{ ftpagos.metodo_id }</td>
										<td >{ ftpagos.factura_id }</td>
										<td >{ ftpagos.created_by }</td>
										<td >{ ftpagos.updated_by }</td>
										<td >{ ftpagos.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }