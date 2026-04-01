import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Productos  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
interface Props {
    productos: Productos[];
}

export default function Table({ productos }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('productos.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('productos.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('productos.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-center" style={{ width: '2%' }}>Item</th>
                        <th >Codigo</th>
                        <th className="text-left" style={{ width: '10%' }}>Nombre</th>
                        <th >Precio</th>
                        <th >Cantidad</th>
                        <th >Min. Stock</th>
                        <th >Estado</th>
                    </tr>
                </thead>
                <tbody>
                {productos.map((productos, index) => (
                    <tr key={productos.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(productos.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(productos.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(productos.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        <td >{ productos.codigo }</td>
                        <td className="text-left">
                            <div className="row">
                                <div className="col-auto pe-0">
                                    <img src={avatar1} alt="user-image" className="wid-40 rounded-circle"></img>
                                </div>
                                <div className="col">
                                    <h6 className="mb-1">{ productos.nombre }</h6>
                                    <p className="text-muted f-12 mb-0">{ productos.descripcion }</p>
                                </div>
                            </div>
                        </td>
                        <td >{ productos.preciosalida }</td>
                        <td >{ productos.minimostock }</td>
                        <td >{ productos.minimostock }</td>
                        <td >{ productos.estado_id }</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }