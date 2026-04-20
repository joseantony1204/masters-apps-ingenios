import { useEffect, useRef, useState } from 'react';
import { initDataTable } from '@/utils/initDataTable';
import { router, usePage, Link } from '@inertiajs/react';
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

    // Efecto para inicializar y destruir DataTables correctamente
    useEffect(() => {
        if (tableRef.current) {
            // Inicializamos la tabla y guardamos la instancia
            dataTableInstance.current = initDataTable(tableRef.current);
        }

        // Limpieza: Esto evita el error "Node.removeChild" al desmontar o actualizar
        return () => {
            if (dataTableInstance.current) {
                dataTableInstance.current.destroy();
                dataTableInstance.current = null;
            }
        };
    }, [clientes]); // Se reinicia si los clientes cambian

    const handleEdit = (id: number) => {
        router.visit(route('adclientes.edit', id));
    };

    const [sending, setSending] = useState(false); // Estado de carga
    const handleSendWhatsapp = async (cliente: any) => {
        if(sending) return; // Evita clics múltiples
        setSending(true);
        try {
            const response = await axios.post(route('api.whatsapp.send'), {
                telefono: cliente.telefonomovil,
                template: "appointment_confirmed",
                params: [cliente.nombres, '20 abril 2026','Corte cabello','HGABHSJMNAJHS']
            });

            // Opcional: Podrías marcar en el estado local que este cliente ya recibió el mensaje
            alert(`✅ ${response.data.message}`);
        } catch (error: any) {
            // Ahora capturamos el error real enviado desde el backend
            const errorMsg = error.response?.data?.message || "Error de conexión";
            alert(`❌ ${errorMsg}`);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="table-responsive">
            <table ref={tableRef} className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center" style={{ width: '1%' }}>Acciones</th>
                        <th className="text-center" style={{ width: '2%' }}>#</th> 
                        <th className="text-left" style={{ width: '30%' }}>Cliente</th>
                        <th>Teléfono Móvil</th>
                        <th>F. Ingreso</th>
                        <th className="text-center">Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((item, index) => (
                        <tr key={item.id}>
                            <td className="text-center">
                                <button
                                    onClick={() => handleEdit(item.id)}
                                    className="avtar avtar-s btn-link-success btn-pc-default border-0 bg-transparent"
                                >
                                    <i className="ti ti-edit f-20"></i>
                                </button>
                            </td>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-left">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={item.sexo_id === 46 ? avatar1 : item.sexo_id === 47 ? avatar9 : avatar10 } 
                                        alt="user" 
                                        className="wid-40 rounded-circle me-3 border shadow-sm" 
                                    />
                                    <div>
                                        <Link href={route('adclientes.show', item.id)} className="text-dark fw-bold mb-0">
                                            {item.nombres} {item.apellidos}
                                        </Link>
                                        <p className="text-muted f-12 mb-0">Identificación: { item.identificacion }</p>
                                        <p className="text-muted f-12 mb-0">Email: { item.email }</p>
                                        <p className="text-muted f-12 mb-0"> Edad: { item.edad }</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <button 
                                    onClick={() => handleSendWhatsapp(item)}
                                    className="btn btn-link p-0 text-success text-decoration-none fw-bold d-flex align-items-center"
                                >
                                    <i className="ti ti-brand-whatsapp me-2 fs-4"></i>
                                    {item.telefonomovil}
                                </button>
                            </td>
                            <td>{item.fechaingreso}</td>
                            <td className="text-center">
                                <span className={`badge bg-light-${item.color_estado} text-${item.color_estado} px-3 py-2`}>
                                    {item.estado}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}