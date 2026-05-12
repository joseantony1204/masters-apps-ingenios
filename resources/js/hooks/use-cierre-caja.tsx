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
            alert("No se pudo obtener el resumen de ventas.");
        } finally {
            setLoadingResumen(false);
        }
    };

    // 1. MODIFICACIÓN: Aceptamos el objeto 'datosArqueo'
    const confirmarCierre = (datosArqueo: { efectivo_real: number, diferencia: number }) => {
        if (!turnoParaCerrar) return;
        
        // 2. ENVIAMOS LOS DATOS: El segundo parámetro es el cuerpo del PATCH
        router.patch(route('ftturnos.cerrar', turnoParaCerrar.id), {
            efectivo_real: datosArqueo.efectivo_real,
            diferencia: datosArqueo.diferencia,
            total_sistema: resumenCierre.total_sistema // Opcional: enviar lo que el sistema esperaba
        }, {
            onBefore: () => setProcessing(true),
            onFinish: () => {
                setProcessing(false);
                setShowCierre(false);
            },
            onSuccess: () => {
                // Notificación de éxito opcional
            },
            onError: (errors) => {
                console.error("Error al cerrar caja:", errors);
                alert("Hubo un error al procesar el cierre.");
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