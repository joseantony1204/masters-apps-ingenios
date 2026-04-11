import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Cfcupones  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    cfcupones: Cfcupones[];
}

export default function Table({ cfcupones }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfcupones.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfcupones.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfcupones.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Promocion Id</th>
									<th >Codigo</th>
									<th >Persona Id</th>
									<th >Limite Uso Total</th>
									<th >Limite Uso Por Persona</th>
									<th >Usos Actuales</th>
									<th >Es Automatico</th>
									<th >Fechavence</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {cfcupones.map((cfcupones, index) => (
                    <tr key={cfcupones.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(cfcupones.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfcupones.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfcupones.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ cfcupones.promocion_id }</td>
										<td >{ cfcupones.codigo }</td>
										<td >{ cfcupones.persona_id }</td>
										<td >{ cfcupones.limite_uso_total }</td>
										<td >{ cfcupones.limite_uso_por_persona }</td>
										<td >{ cfcupones.usos_actuales }</td>
										<td >{ cfcupones.es_automatico }</td>
										<td >{ cfcupones.fechavence }</td>
										<td >{ cfcupones.created_by }</td>
										<td >{ cfcupones.updated_by }</td>
										<td >{ cfcupones.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }