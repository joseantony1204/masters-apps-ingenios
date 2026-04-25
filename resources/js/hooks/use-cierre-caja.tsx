import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export const useCierreCaja = () => {
    const [showCierre, setShowCierre] = useState(false);
    const [resumenCierre, setResumenCierre] = useState<any>(null);
    const [loadingResumen, setLoadingResumen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [turnoParaCerrar, setTurnoParaCerrar] = useState<any>(null);

    const abrirModalCierre = async (turno: any) => {
        setTurnoParaCerrar(turno);
        setLoadingResumen(true);
        try {
            const response = await axios.get(route('ftturnos.resumen', turno.id));
            setResumenCierre(response.data);
            setShowCierre(true);
        } catch (error) {
            alert("No se pudo obtener el resumen de ventas. Noy hay turnos abiertos.");
        } finally {
            setLoadingResumen(false);
        }
    };

    const confirmarCierre = () => {
        if (!turnoParaCerrar) return;
        
        // Cambiamos .post por .patch
        router.patch(route('ftturnos.cerrar', turnoParaCerrar.id), {}, {
            onBefore: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setShowCierre(false);
            },
            onSuccess: () => {
                // Aquí puedes disparar una notificación de éxito
            }
        });
    };

    return {
        showCierre,
        setShowCierre,
        resumenCierre,
        loadingResumen,
        processing,
        abrirModalCierre,
        confirmarCierre
    };
};