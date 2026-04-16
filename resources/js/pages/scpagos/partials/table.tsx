import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Scpagos  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    scpagos: Scpagos[];
}

export default function Table({ scpagos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('scpagos.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('scpagos.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('scpagos.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Valor</th>
									<th >Fecha</th>
									<th >Referencia Pasarela</th>
									<th >Estado Id</th>
									<th >Metodo Id</th>
									<th >Suscripcion Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {scpagos.map((scpagos, index) => (
                    <tr key={scpagos.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(scpagos.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(scpagos.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(scpagos.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ scpagos.valor }</td>
										<td >{ scpagos.fecha }</td>
										<td >{ scpagos.referencia_pasarela }</td>
										<td >{ scpagos.estado_id }</td>
										<td >{ scpagos.metodo_id }</td>
										<td >{ scpagos.suscripcion_id }</td>
										<td >{ scpagos.created_by }</td>
										<td >{ scpagos.updated_by }</td>
										<td >{ scpagos.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }