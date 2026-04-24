import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    cfimpuestos: any[];
}

export default function Table({ cfimpuestos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfimpuestos.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfimpuestos.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfimpuestos.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th>Editar</th>
                        <th>Item</th>
                        
									<th >Codigo</th>
									<th >Nombre</th>
									<th >Descripcion</th>
									<th >Valor</th>
									<th >Activo</th>
									<th >Tipo Id</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {cfimpuestos.map((cfimpuestos, index) => (
                    <tr key={cfimpuestos.id}>
                        <td>
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(cfimpuestos.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfimpuestos.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfimpuestos.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td>{index + 1}</td>
                        
										<td >{ cfimpuestos.codigo }</td>
										<td >{ cfimpuestos.nombre }</td>
										<td >{ cfimpuestos.descripcion }</td>
										<td >{ cfimpuestos.valor }</td>
										<td >{ cfimpuestos.activo }</td>
										<td >{ cfimpuestos.tipo_id }</td>
										<td >{ cfimpuestos.created_by }</td>
										<td >{ cfimpuestos.updated_by }</td>
										<td >{ cfimpuestos.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }