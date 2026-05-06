import { useEffect, useRef } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
import avatar9 from '/public/assets/images/user/avatar-9.jpg';
import avatar10 from '/public/assets/images/user/default.png';
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
                    </tr>
                </thead>
                <tbody>
                {empleados.map((item, index) => (
                    <tr key={item.id}>
                        <td className="text-center">
                        <ul className="list-inline mb-0">
                            {
                            <li className="list-inline-item">
                                <button
                                    onClick={() => handleView(item.id)}
                                    className="avtar avtar-s btn-link-info btn-pc-default">
                                    <i className="ti ti-eye f-20"></i>
                                </button>
                            </li>
                            }
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
                            <div className="d-flex align-items-center p-2 rounded-4 hover-bg-light transition-all">
                                {/* AVATAR CON EFECTO */}
                                <div className="position-relative d-inline-block">
                                    <div className="wid-55 hei-55 rounded-circle shadow-sm border border-white overflow-hidden bg-light d-flex align-items-center justify-content-center">
                                        <img 
                                            src={
                                                item.foto ? `.//storage/${item.foto}` :
                                                (item.sexo_id === 46 ? avatar1 : item.sexo_id === 47 ? avatar9 : avatar10)
                                            } 
                                            alt="user" 
                                            className="w-100 h-100 object-fit-cover"
                                            onError={(e: any) => e.target.src = avatar10}
                                        />
                                    </div>

                                    {/* Indicador de estado con pulso si está activo */}
                                    <span className={`position-absolute bottom-0 end-0 p-1 bg-${item.color_estado || 'secondary'} border border-white rounded-circle`}>
                                        {item.color_estado === 'success' && (
                                            <span className="visually-hidden">Online</span>
                                        )}
                                    </span>
                                </div>

                                {/* INFORMACIÓN */}
                                <div className="flex-grow-1 min-width-0">
                                    <Link href={route('cfempleados.show', item.id)} className="text-decoration-none">
                                        <h6 className="mb-0 text-dark fw-bolder f-14 text-truncate">
                                            {item.nombres} {item.apellidos}
                                        </h6>
                                        
                                        <div className="d-flex flex-wrap gap-2 mt-1">
                                            <span className="badge bg-light-secondary text-muted border border-light fw-medium px-2 py-1" style={{ fontSize: '10px' }}>
                                                <i className="ti ti-id me-1"></i>{item.identificacion}
                                            </span>
                                            <span className="badge bg-light-primary text-primary border border-primary-subtle fw-medium px-2 py-1" style={{ fontSize: '10px' }}>
                                                <i className="ti ti-calendar-event me-1"></i>{item.edad.split(' ')[0]} años
                                            </span>
                                        </div>

                                        <p className="text-muted mb-0 mt-1 d-flex align-items-center opacity-75" style={{ fontSize: '11px' }}>
                                            <i className="ti ti-mail me-1"></i>
                                            <span className="text-truncate">{item.email}</span>
                                        </p>
                                    </Link>
                                </div>

                                {/* ACCIÓN RÁPIDA (Opcional) */}
                                <div className="ms-2">
                                    <Link href={route('cfempleados.show', item.id)} className="btn btn-icon btn-link-secondary sm-icon">
                                        <i className="ti ti-chevron-right fs-4"></i>
                                    </Link>
                                </div>

                                <style dangerouslySetInnerHTML={{ __html: `
                                    .hover-bg-light:hover { 
                                        background-color: rgba(0,0,0,0.02); 
                                        transform: translateX(5px);
                                    }
                                    .transition-all { transition: all 0.3s ease; }
                                    .wid-50 { width: 50px; height: 50px; }
                                    .fw-bolder { font-weight: 700; }
                                `}} />
                            </div>
                        </td>
                        <td>
                            <div className="d-flex flex-column">
                                <a href={`https://wa.me/${item.telefonomovil}`} target="_blank" className="text-success text-decoration-none fw-bold f-13 d-flex align-items-center mb-1">
                                    <i className="ti ti-brand-whatsapp me-1 fs-5"></i>
                                    {item.telefonomovil}
                                </a>
                            </div>
                        </td>
                        <td >{ item.fechaingreso }</td>

                    </tr>
                    ))}
                </tbody>
            </table>
        </> 
    );
  }