import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

export const useReservaCitaRapida = () => {
    const [show, setShow] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [servicios, setServicios] = useState<any[]>([]);
    const [servicioSeleccionado, setServicioSeleccionado] = useState<any>(null);
    const [activeCat, setActiveCat] = useState<number | null>(null);

    // --- LÓGICA DE CATEGORÍAS (Idéntica para mantener consistencia) ---
    const categorias = useMemo(() => {
        const unique = new Map();
        servicios.forEach((s: any) => {
            if (s.categoria && !unique.has(s.categoria.id)) {
                unique.set(s.categoria.id, s.categoria);
            }
        });
        return Array.from(unique.values());
    }, [servicios]);

    useEffect(() => {
        if (categorias.length > 0 && activeCat === null) {
            setActiveCat(categorias[0].id);
        }
    }, [categorias]);

    const abrirModal = async () => {
        setCargando(true);
        try {
            const response = await axios.get(route('api.servicios.buscar'));
            setServicios(response.data);
            setShow(true);
        } catch (error) {
            console.error("Error al cargar servicios en reserva rápida:", error);
        } finally {
            setCargando(false);
        }
    };

    const cerrarModal = () => {
        setShow(false);
        setServicioSeleccionado(null);
    };

    // --- MANEJO DE SELECCIÓN FINAL DIRECTA ---
    const manejarSeleccionDirecta = (especialista: any) => {
        cerrarModal();
    
        // 1. Obtener la fecha y hora actual en la zona horaria de Colombia
        const ahoraBogota = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
    
        // 2. Extraer Fecha actual en formato YYYY-MM-DD
        const año = ahoraBogota.getFullYear();
        const mes = String(ahoraBogota.getMonth() + 1).padStart(2, '0');
        const dia = String(ahoraBogota.getDate()).padStart(2, '0');
        const fechaActual = `${año}-${mes}-${dia}`;
    
        // 3. Extraer Hora de Inicio actual en formato HH:mm
        const horasInicio = String(ahoraBogota.getHours()).padStart(2, '0');
        const minutosInicio = String(ahoraBogota.getMinutes()).padStart(2, '0');
        const horaInicioCalculada = `${horasInicio}:${minutosInicio}`;
    
        // 4. Calcular la Hora Final sumando la duración (en minutos)
        const duracionMinutos = parseInt(especialista.duracionpersonalizado) || 0;
        const horaFinalObj = new Date(ahoraBogota.getTime() + duracionMinutos * 60000);
    
        const horasFinal = String(horaFinalObj.getHours()).padStart(2, '0');
        const minutosFinal = String(horaFinalObj.getMinutes()).padStart(2, '0');
        const horaFinalCalculada = `${horasFinal}:${minutosFinal}`;
    
        // 5. Retornar la estructura idéntica a tu flujo tradicional
        return {
            fecha: fechaActual,
            hora: horaInicioCalculada, // Se asigna la hora de inicio como el puntero de la cita
            servicioasignado_id: especialista.servicioasignado_id,
            horainicio: horaInicioCalculada,
            horafinal: horaFinalCalculada,
            precio: especialista.preciopersonalizado,
            duracion: especialista.duracionpersonalizado,
            especialista_id: especialista.empleado_id,
            servicio_nombre: servicioSeleccionado?.nombre,
            especialista_nombre: especialista.nombre
        };
    };

    return {
        show,
        abrirModal,
        cerrarModal,
        servicios,
        cargando,
        categorias,
        activeCat,
        setActiveCat,
        servicioSeleccionado,
        setServicioSeleccionado,
        manejarSeleccionDirecta
    };
};