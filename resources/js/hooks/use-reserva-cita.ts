import { useState } from 'react';
import axios from 'axios';
import {usePage } from '@inertiajs/react';

export const useReservaCita = () => {
    const { auth } = usePage().props as any;
    const token = auth.user.personas.comercios.token;
    const [show, setShow] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [servicios, setServicios] = useState<any[]>([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
    const [especialistaSeleccionado, setEspecialistaSeleccionado] = useState<any>(null);
    const [turnosDisponibles, setTurnosDisponibles] = useState<any>(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
    const [jornadaActiva, setJornadaActiva] = useState<'Mañana' | 'Tarde' | 'Noche'>('Mañana');
    const [seleccion, setSeleccion] = useState<any>(null);

    const abrirModal = async () => {
        setCargando(true);
        try {
            // Asegúrate de que esta ruta exista en tu Ziggy/Laravel
            const response = await axios.get(route('api.servicios.buscar'));
            setServicios(response.data);
            setShow(true);
        } catch (error) {
            console.error("Error al cargar servicios:", error);
        } finally {
            setCargando(false);
        }
    };

    const cerrarModal = () => {
        setShow(false);
        setServicioSeleccionado(null);
        setEspecialistaSeleccionado(null);
        setTurnosDisponibles(null);
    };

    const seleccionarEspecialista = async (esp: any) => {
        setEspecialistaSeleccionado(esp);
        setCargando(true);
        try {
            const url = route('api.disponibilidad.turnos', { 
                token: token,
                empleado: esp.empleado_id,
                servicio: servicioSeleccionado.id
            });
            const resp = await axios.get(url);
            setTurnosDisponibles(resp.data);
            
            // Seleccionar automáticamente la primera fecha del objeto
            const fechas = Object.keys(resp.data);
            if (fechas.length > 0) setFechaSeleccionada(fechas[0]);
            
        } catch (error) {
            console.error("Error al cargar turnos:", error);
        } finally {
            setCargando(false);
        }
    };

    const manejarSeleccionFinal = (fecha: string, hora: string, servicio: any) => {
        // 1. Guardamos la selección localmente por si se necesita referenciar
        setSeleccion({ fecha, hora, servicio });
    
        // 2. Cerramos este Offcanvas
        cerrarModal();
    
        // 3. Retornamos los datos para que el Dashboard decida qué hacer 
        // (como llenar un formulario de Inertia o abrir otro modal)
        return {
            fecha,
            hora,
            servicioasignado_id: servicio.servicioasignado_id,
            horainicio: servicio.horainicio,
            horafinal: servicio.horafinal,
            precio: servicio.precio,
            especialista_id: especialistaSeleccionado?.empleado_id
        };
    };

    return {
        show, abrirModal, cerrarModal,
        servicios, cargando,
        servicioSeleccionado, setServicioSeleccionado,
        especialistaSeleccionado, setEspecialistaSeleccionado, 
        seleccionarEspecialista,
        turnosDisponibles, setTurnosDisponibles,
        fechaSeleccionada, setFechaSeleccionada,
        jornadaActiva, setJornadaActiva,
        manejarSeleccionFinal,
    };
};