import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export const useLiquidacionEmpleados = (turnoId: number, onSuccessCallback?: () => void) => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
    });

    const ejecutarLiquidacion = async (listaEmpleados: any[], fechas: { inicio: string, fin: string }) => {
        const empleadosAProcesar = Array.isArray(listaEmpleados) ? listaEmpleados : [listaEmpleados];
        
        // 1. Filtramos: solo empleados con monto mayor a 0
        const empleadosConSaldo = empleadosAProcesar.filter(
            emp => Number(emp.total_ganado_empleado) > 0
        );
        
        if (empleadosAProcesar.length === 0) return;

        const result = await Swal.fire({
            title: '<span class="fw-900">¿Confirmar Liquidación?</span>',
            html: `Se registrarán <b>${empleadosConSaldo.length}</b> comprobantes de pago.<br><small class="text-muted">Periodo: ${fechas.inicio} al ${fechas.fin}</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar pagos',
            cancelButtonText: 'Cancelar',
            buttonsStyling: false,
            customClass: {
                confirmButton: 'btn btn-primary shadow-blue-deep px-4 py-2 mx-2 fw-bold',
                cancelButton: 'btn btn-light-secondary px-4 py-2 mx-2 fw-bold',
                popup: 'rounded-3 border-0 shadow-lg'
            }
        });

        if (!result.isConfirmed) return;

        setLoading(true);

        try {
            // 2. Si después de filtrar no queda nadie, avisamos y cancelamos
            if (empleadosConSaldo.length === 0) {
                setLoading(false);
                return Toast.fire({
                    icon: 'info',
                    title: 'No hay empleados con saldo pendiente para liquidar'
                });
            }

            // 3. Se validan que exista un turno abierto para registrar los movimientos
            if (!turnoId) {
                setLoading(false);
                return Toast.fire({
                    icon: 'info',
                    title: 'No hay turnos abiertos. No se puede realizar la liquidación.'
                });
            }

            // 4. Creamos las promesas solo para los que pasaron el filtro
            const promesas = empleadosConSaldo.map(emp => {
                return axios.post(route('ftfacturas.store-movimiento'), {
                    monto: emp.total_ganado_empleado,
                    tipo_id: 1063, 
                    turno_id: turnoId,
                    model_type: 1064, 
                    model_type_id: emp.id,
                    estado_id: 938, 
                    descripcion: `LIQUIDACION DE SERVICIOS DEL ${fechas.inicio} AL ${fechas.fin}. Total servicios: ${emp.total_servicios}`,
                    servicios_ids: emp.servicios ? emp.servicios.map((s: any) => s.id) : [],
                    vales_ids: emp.detalle_vales ? emp.detalle_vales.map((v: any) => v.id) : []
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
            });

            // Esperamos a que todas las peticiones terminen
            await Promise.all(promesas);

            Toast.fire({
                icon: 'success',
                title: 'Todos los pagos han sido registrados'
            });

            setShowModal(false);
            if (onSuccessCallback) onSuccessCallback();

        } catch (error: any) {
            console.error("Error en liquidación masiva:", error);
            Toast.fire({
                icon: 'error',
                title: 'Hubo un error al procesar algunos pagos'
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, showModal, setShowModal, ejecutarLiquidacion };
};