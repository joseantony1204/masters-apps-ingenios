import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { Personas  } from '@/types';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface Props {
    personas: Personas[];
}

export default function Table({ personas }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    useEffect(() => {
        if (tableRef.current) {
          initDataTable(tableRef.current);
        }
    }, []);
    const { delete: destroy } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('¿Seguro que quiere eliminar este elemento?')) {
            destroy(route('personas.destroy', id));
        }
    };
    
    const handleEdit = (id: number) => {
        router.visit(route('personas.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('personas.show', id));
    };
    

    return (
        <>
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th>Editar</th>
                        <th>Item</th>
                        
									<th >Identificacion</th>
									<th >Digitoverificacion</th>
									<th >Lugarexpedicion</th>
									<th >Fechaexpedicion</th>
									<th >Telefono</th>
									<th >Telefonomovil</th>
									<th >Sendsms</th>
									<th >Email</th>
									<th >Sendemail</th>
									<th >Foto</th>
									<th >Firma</th>
									<th >Direccion</th>
									<th >Pais Id</th>
									<th >Departamento Id</th>
									<th >Ciudad Id</th>
									<th >Barrio</th>
									<th >Tipoidentificacion Id</th>
									<th >Tiporegimen Id</th>
									<th >Observaciones</th>
									<th >Created By</th>
									<th >Updated By</th>
									<th >Deleted By</th>

                    </tr>
                </thead>
                <tbody>
                {personas.map((personas, index) => (
                    <tr key={personas.id}>
                        <td>
                        <ul className="list-inline mb-0">
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(personas.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            */}
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleEdit(personas.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default">
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </li>
                            {/*
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleDelete(personas.id)}
                                    className="avtar avtar-s btn-link-danger btn-pc-default">
                                    <i className="ti ti-trash f-20"></i>
                                </button>
                            </li>
                            */}
                        </ul>
                        </td>
                        <td>{index + 1}</td>
                        
										<td >{ personas.identificacion }</td>
										<td >{ personas.digitoverificacion }</td>
										<td >{ personas.lugarexpedicion }</td>
										<td >{ personas.fechaexpedicion }</td>
										<td >{ personas.telefono }</td>
										<td >{ personas.telefonomovil }</td>
										<td >{ personas.sendsms }</td>
										<td >{ personas.email }</td>
										<td >{ personas.sendemail }</td>
										<td >{ personas.foto }</td>
										<td >{ personas.firma }</td>
										<td >{ personas.direccion }</td>
										<td >{ personas.pais_id }</td>
										<td >{ personas.departamento_id }</td>
										<td >{ personas.ciudad_id }</td>
										<td >{ personas.barrio }</td>
										<td >{ personas.tipoidentificacion_id }</td>
										<td >{ personas.tiporegimen_id }</td>
										<td >{ personas.observaciones }</td>
										<td >{ personas.created_by }</td>
										<td >{ personas.updated_by }</td>
										<td >{ personas.deleted_by }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }