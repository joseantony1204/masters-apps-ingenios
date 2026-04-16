import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    perfiles: any[];
}

export default function Table({ perfiles }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfmaestras.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfmaestras.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfmaestras.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th>
                        <th >Codigo</th>
                        <th >Nombre</th>
                    </tr>
                </thead>
                <tbody>
                {perfiles.map((cfmaestras, index) => (
                    <tr key={cfmaestras.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(cfmaestras.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-settings f-20"></i>
                                </button>
                            </li>
                            
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(cfmaestras.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(cfmaestras.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        <td >{ cfmaestras.codigo }</td>
                        <td >{ cfmaestras.nombre }</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }