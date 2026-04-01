import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
import avatar9 from '/public/assets/images/user/avatar-9.jpg';
import { Link } from '@inertiajs/react';

interface Props {
    empleados: any[];
}

export default function Table({ empleados }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('cfempleados.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('cfempleados.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('cfempleados.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Editar</th>
                        <th className="text-left" style={{ width: '2%' }}>Item</th> 
                        <th className="text-left" style={{ width: '10%' }}>Nombre</th>
                        <th >Telefono movil</th>
                        <th >F. ingreso</th>
                        <th >Estado</th>
                    </tr>
                </thead>
                <tbody>
                {empleados.map((item, index) => (
                    <tr key={item.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(item.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td className="text-center">{index + 1}</td>
                        
                        <td className="text-left">
                            <div className="row">
                                <div className="col-auto pe-0">
                                    <img 
                                        src={item.sexo_id === 46 ? avatar1 : item.sexo_id === 47 ? avatar9 : '' } 
                                        alt="user-image" 
                                        className="wid-40 rounded-circle" 
                                    />
                                </div>
                                <div className="col">
                                    <Link href={route('cfempleados.show', item.id)} className="text-dark">
                                        <h6 className="mb-1">{item.nombres } {item.apellidos }</h6>
                                    </Link>
                                    <p className="text-muted f-12 mb-0">Identificación: { item.identificacion }</p>
                                    <p className="text-muted f-12 mb-0">Email: { item.email }</p>
                                    <p className="text-muted f-12 mb-0"> Edad: { item.edad }</p>
                                </div>
                            </div>
                        </td>
                        <td >{ item.telefonomovil }</td>
                        <td >{ item.fechaingreso }</td>
                        <td className="text-center">
                            <span 
                                className={`badge bg-light-${item.color_estado} text-${item.color_estado}`} 
                                style={{  minWidth: '90px',  padding: '5px 10px', borderRadius: '4px', fontWeight: '600',textTransform: 'capitalize'}}>
                                {item.estado}
                            </span>
                        </td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }