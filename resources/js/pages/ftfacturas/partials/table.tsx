import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Ftfacturas  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    ftfacturas: Ftfacturas[];
}

export default function Table({ ftfacturas }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('ftfacturas.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('ftfacturas.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('ftfacturas.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Codigoseguridad</th>
									<th >Numero</th>
									<th >Fecha</th>
									<th >Fechanavencimiento</th>
									<th >Observaciones</th>
									<th >Tabla Id</th>
									<th >Referencia Id</th>
									<th >Origen Id</th>
									<th >Destino Id</th>
									<th >Tipo Id</th>
									<th >Turno Id</th>
									<th >Estado Id</th>
									<th >Comercio Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {ftfacturas.map((ftfacturas, index) => (
                    <tr key={ftfacturas.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(ftfacturas.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(ftfacturas.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(ftfacturas.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ ftfacturas.codigoseguridad }</td>
										<td >{ ftfacturas.numero }</td>
										<td >{ ftfacturas.fecha }</td>
										<td >{ ftfacturas.fechanavencimiento }</td>
										<td >{ ftfacturas.observaciones }</td>
										<td >{ ftfacturas.tabla_id }</td>
										<td >{ ftfacturas.referencia_id }</td>
										<td >{ ftfacturas.origen_id }</td>
										<td >{ ftfacturas.destino_id }</td>
										<td >{ ftfacturas.tipo_id }</td>
										<td >{ ftfacturas.turno_id }</td>
										<td >{ ftfacturas.estado_id }</td>
										<td >{ ftfacturas.comercio_id }</td>
										<td >{ ftfacturas.created_by }</td>
										<td >{ ftfacturas.updated_by }</td>
										<td >{ ftfacturas.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }