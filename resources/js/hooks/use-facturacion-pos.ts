import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';

export const useFacturacionPos = (turnoId: number) => {
    const [tipoMovimiento, setTipoMovimiento] = useState<{id: number, nombre: string}>({ id: 942, nombre: 'Gasto' });
    const [mostrarModal, setMostrarModal] = useState(false);
    
    // 1. Estado para almacenar los empleados
    const [empleados, setEmpleados] = useState<any[]>([]);
    const [loadingEmpleados, setLoadingEmpleados] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        monto: '',
        descripcion: '',
        model_type: 1070, //cfmaestra 
        model_type_id: '',
        tipo_id: 942,
        turno_id: turnoId,
        estado_id: 938,
    });

    // 2. Convertimos abrirModal en async para manejar la carga de datos
    const abrirModal = async (tipoId: number) => {
        const nombre = tipoId === 942 ? 'Gasto / Compra' : tipoId === 944 ? 'Adelanto (Vale)' : tipoId === 1063 ? 'Pago Nómina' : 'General';
        
        reset(); // Limpia datos previos
        setTipoMovimiento({ id: tipoId, nombre });

        // 3. Cargar empleados solo si el tipo es Adelanto o Nómina
        if (tipoId === 944) {
            setLoadingEmpleados(true);
            try {
                // Asegúrate que esta ruta devuelva el array de empleados
                const response = await axios.get(route('cfempleados.lista')); 
                setEmpleados(response.data);
            } catch (error) {
                console.error("Error cargando empleados:", error);
                // Aquí podrías usar un toast o alerta
            } finally {
                setLoadingEmpleados(false);
            }
        }

        // 4. Actualizar el form con los valores del tipo seleccionado
        setData((prevData) => ({
            ...prevData,
            tipo_id: tipoId,
            model_type: tipoId === 944 ? 1064 : 1070,
            turno_id: turnoId // Nos aseguramos de re-pasar el turnoId
        }));

        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setEmpleados([]); // Limpiamos la lista al cerrar
        reset();
    };

    const enviarMovimiento = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('ftfacturas.store-movimiento'), {
            onSuccess: () => {
                cerrarModal();
            },
        });
    };

    return {
        abrirModal,
        cerrarModal,
        mostrarModal,
        tipoMovimiento,
        empleados,        // Retornamos la lista
        loadingEmpleados, // Útil para mostrar un spinner en el select
        data,
        setData,
        enviarMovimiento,
        processing,
        errors
    };
};