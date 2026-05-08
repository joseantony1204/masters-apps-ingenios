import { useEffect, useRef, useState } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { router, Link } from '@inertiajs/react';
import axios from 'axios';
import avatar1 from '/public/assets/images/user/avatar-1.jpg';
import avatar9 from '/public/assets/images/user/avatar-9.jpg';
import avatar10 from '/public/assets/images/user/default.png';

interface Props {
    clientes: any[];
}

export default function Table({ clientes }: Props) {
    const tableRef = useRef<HTMLTableElement>(null);
    const dataTableInstance = useRef<any>(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (tableRef.current) {
            dataTableInstance.current = initDataTable(tableRef.current);
        }
        return () => {
            if (dataTableInstance.current) {
                dataTableInstance.current.destroy();
                dataTableInstance.current = null;
            }
        };
    }, [clientes]);

    const handleEdit = (id: number) => {
        router.visit(route('adclientes.edit', id));
    };

    const handleView = (id: number) => {
        router.visit(route('adclientes.show', id));
    };

    return (
        <div className="table-responsive" style={{ minHeight: '400px' }}>
            <table ref={tableRef} className="table table-hover align-middle table-borderless">
                <thead className="text-muted" style={{ borderBottom: '1px solid #f1f1f1', backgroundColor: '#fcfcfd' }}>
                    <tr>
                        <th className="text-center">Editar</th>
                        <th className="ps-4 py-3" style={{ width: '10%' }}>Cliente</th>
                        <th className="py-3">Contacto</th>
                        <th className="py-3">F. Ingreso</th>
                        <th className="py-3 text-center">Estado</th>
                    </tr>
                </thead>
                <tbody style={{ borderTop: 'none' }}>
                    {clientes.map((item) => (
                        <tr key={item.id} className="transition-all">
                            <td className="text-center">
                                <ul className="list-inline mb-0">
                                   
                                    <li className="list-inline-item">
                                        <button
                                            onClick={() => handleView(item.id)}
                                            className="avtar avtar-s btn-link-info btn-pc-default">
                                            <i className="ti ti-eye f-20"></i>
                                        </button>
                                    </li>
                                    
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
                                            onClick={() => handleDelete(cfimpuestos.id)}
                                            className="avtar avtar-s btn-link-danger btn-pc-default">
                                            <i className="ti ti-trash f-20"></i>
                                        </button>
                                    </li>
                                    */}
                                </ul>
                            </td>
                            <td className="ps-4">
                                <div className="d-flex align-items-center">
                                    <div className="position-relative">
                                        <img 
                                            src={item.sexo_id === 46 ? avatar1 : item.sexo_id === 47 ? avatar9 : avatar10} 
                                            alt="user" 
                                            className="wid-45 rounded-circle me-3 border-2 border-white shadow-sm" 
                                        />
                                        <span className={`position-absolute bottom-0 end-0 p-1 bg-${item.color_estado} border border-white rounded-circle`} style={{ marginBottom: '2px', marginRight: '12px' }}></span>
                                    </div>
                                    <div>
                                        <Link href={route('adclientes.show', item.id)} className="text-dark fw-bold mb-0 text-decoration-none hover-primary">
                                            {item.nombres} {item.apellidos}
                                        </Link>
                                        <p className="text-muted f-12 mb-0">ID: {item.identificacion}</p>
                                        <p className="text-muted f-11 mb-0">Edad: {item.edad} años</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="d-flex flex-column">
                                    <button className="btn btn-sm btn-light-success d-inline-flex align-items-center mb-1" style={{ width: 'fit-content' }}>
                                        <i className="ti ti-brand-whatsapp me-2 fs-6"></i>
                                        {item.telefonomovil}
                                    </button>
                                    <span className="text-muted f-12"><i className="ti ti-mail me-1"></i>{item.email}</span>
                                </div>
                            </td>
                            <td>
                                <span className="text-dark fw-medium">{item.fechaingreso}</span>
                            </td>
                            <td className="text-center">
                                <span className={`badge rounded-pill bg-light-${item.color_estado} text-${item.color_estado} px-3 py-2 border border-${item.color_estado}-subtle`}>
                                    {item.estado}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <style>{`
                .hover-primary:hover { color: #007bff !important; }
                .wid-45 { width: 45px; height: 45px; object-fit: cover; }
                .transition-all { transition: all 0.2s ease-in-out; }
                .table-hover tbody tr:hover { background-color: #f8faff !important; }
                .btn-icon { width: 35px; height: 35px; display: inline-flex; align-items: center; justify-content: center; }
            `}</style>
        </div>
    );
}