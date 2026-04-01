import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Cfmaestra } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    cfmaestras: Cfmaestra[];
}

export default function Table({ cfmaestras }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfmaestra.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfmaestra.edit', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Id</th>
                        <th>Codigo</th>
                        <th>Nombre</th>
                        <th>Padre</th>
                        <th>Observación</th>
                        <th>Orden</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {cfmaestras.map((cfmaestra, index) => (
                    <tr key={cfmaestra.id}>
                        <td>{index + 1}</td>
                        <td>{cfmaestra.id}</td>
                        <td>{cfmaestra.codigo}</td>
                        <td>{cfmaestra.nombre}</td>
                        <td>{cfmaestra.padre}</td>
                        <td>{cfmaestra.observacion}</td>
                        <td>{cfmaestra.orden}</td>
                        <td>
                       
                        
                        <ul className="list-inline mb-0">
                            
                            <li className="list-inline-item">
                                <a href="#" className="avtar avtar-s btn-link-info btn-pc-default"><i className="ti ti-eye f-20"></i></a>
                            </li>
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfmaestra.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfmaestra.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                        </ul>
                        
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }