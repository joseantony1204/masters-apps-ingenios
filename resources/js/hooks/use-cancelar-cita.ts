import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';

export const useCancelarCita = (cita: any) => {
    const form = useForm({
        id: '',
        codigo: '',
        estado_id: '',
        motivo_cancelacion: '',
    });

    // IMPORTANTE: Llenar el formulario cuando la cita cambia
    useEffect(() => {
        if (cita) {
            form.setData({
                id: cita.id || '',
                codigo: cita.codigo || '',
                estado_id: '', // Reiniciar para obligar a elegir uno
                motivo_cancelacion: '',
            });
        }
    }, [cita]);

    const handleCancelarSubmit = (e: React.FormEvent, callbackCerrar: () => void) => {
        e.preventDefault();
    
        if (!form.data.id) return;
    
        form.put(route('adcitas.cancelar', form.data.id), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                callbackCerrar();
            },
            onError: (errors) => {
                console.error("Errores:", errors);
            }
        });
    };

    return { form, handleCancelarSubmit };
};