import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Cfpromociones  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    cfpromociones: Cfpromociones[];
}

export default function Table({ cfpromociones }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfpromociones.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfpromociones.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfpromociones.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        
									<th >Nombre</th>
									<th >Descripcion</th>
									<th >Tipo Descuento</th>
									<th >Valor</th>
									<th >Compra Minima</th>
									<th >Fecha Inicio</th>
									<th >Fecha Fin</th>
									<th >Estado</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {cfpromociones.map((cfpromociones, index) => (
                    <tr key={cfpromociones.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(cfpromociones.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfpromociones.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfpromociones.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
										<td >{ cfpromociones.nombre }</td>
										<td >{ cfpromociones.descripcion }</td>
										<td >{ cfpromociones.tipo_descuento }</td>
										<td >{ cfpromociones.valor }</td>
										<td >{ cfpromociones.compra_minima }</td>
										<td >{ cfpromociones.fecha_inicio }</td>
										<td >{ cfpromociones.fecha_fin }</td>
										<td >{ cfpromociones.estado }</td>
										<td >{ cfpromociones.created_by }</td>
										<td >{ cfpromociones.updated_by }</td>
										<td >{ cfpromociones.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }