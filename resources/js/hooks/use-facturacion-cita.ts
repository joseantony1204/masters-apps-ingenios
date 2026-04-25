import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const useFacturacionCita = (cita: any, turnoActivo: any) => {
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    //console.log(cita?.detalle_con_empleadoservicio[0]?.empleadoservicio?.empleado?.id)
    
    const form = useForm({
        nombreCliente: '',
        observaciones: '',
        items: [] as any[],
        cupon_id: '',
        porcentajedescuento: 0,
        descuento: 0
    });

    // --- FORMULARIOS INERTIA ---
    const today = new Date().toLocaleString('sv-SE', { timeZone: 'America/Bogota', hour12: false  }).replace(' ', 'T').slice(0, 16);
    const { 
        data: facturaData, 
        setData: setFacturaData, 
        post: fetchFactura, 
        processing: processingFactura, 
        reset: resetFactura,  
        errors: facturaErrors
    } = useForm({
        fecha: today,
        fechanavencimiento: today,
        observaciones: '', // Aquí irían las "Notas finales de la cita" de tu imagen
    
        model_type: 921, 
        model_type_id: cita?.id || '',
    
        // Detalle dinámico
        items: [] as any[], 
        
        // Totales
        subtotal: 0,
        descuento: 0, // <--- Agregado para tu controlador
        impuesto: 0,  // <--- Agregado para tu controlador
        total: 0,
        porcentajedescuento: 0,
        tax_percent: 0,
    
        // Para factura rápida, podrías preseleccionar el método más común (ej: Efectivo)
        cupon_id: '', // Deja vacío para que el usuario elija
        turno_id: '', // Deja vacío para que el usuario elija
        metodo_id: '', // Deja vacío para que el usuario elija
        estado_id: 938, // Asumiendo que 938 es 'Pagada'
    });

    // ... dentro de tu función Index o Create ...
    const [showTurnoModal, setShowTurnoModal] = useState(false);
    // Hook para el Turno (NUEVO - con nombres únicos)
    const { 
        data: turnoData, 
        setData: setTurnoData, 
        post: postTurno, 
        processing: processingTurno, 
        reset: resetTurno,
        errors: turnoErrors, 
    } = useForm({
        codigo: 'TRN-001',
        baseinicial: '',
        descripcion: '',
        terminal_id: '', 
    });

    // Sincronizar datos cuando la cita cambia o se abre el modal
    useEffect(() => {
        if (cita) {
            setCouponCode('');
            setAppliedCoupon(null);
            setIsValidatingCoupon(false);
            form.setData({
                nombreCliente: `${cita.nombres} ${cita.apellidos}`,
                observaciones: cita.observaciones || '',
                items: [], // Reiniciamos items adicionales al cambiar de cita
                cupon_id: '',
                porcentajedescuento: 0,
                descuento: 0
            });
            setFacturaData(prev => ({
                ...prev,
                porcentajedescuento: 0,
                cupon_id: ''
            }));
        }
    }, [cita]);

    useEffect(() => {
        if (cita) {
            // Mapeamos los servicios de la cita al formato de items de factura
            const serviciosComoItems = cita.detalle_con_empleadoservicio?.map((d: any) => ({
                producto_id: d.empleadoservicio.servicio.id,
                nombre: d.empleadoservicio.servicio.nombre || 'Servicio',
                descripcion: `Servicio de cita #${cita.codigo} - ${d.empleadoservicio?.servicio?.nombre}`,
                cantidad: 1,
                precio: d.preciounitario || 0,
                total: (d.cantidad || 1) * (d.preciounitario || 0),
                is_from_appointment: true

            })) || [];

            const productosComoItems: any[] = [];
            // 2. Procesar Productos adicionales (detalle_con_producto)
            if (cita.detalle_con_producto) {
                cita.detalle_con_producto.forEach((det: any) => {
                    // El producto viene como un array según tu JSON
                    const productoInfo = det.producto?.[0]; 
                    productosComoItems.push({
                        producto_id: productoInfo?.id,
                        nombre: productoInfo?.nombre || 'Producto',
                        descripcion: `Producto adicional #${productoInfo.id} - ${productoInfo?.nombre}`,
                        cantidad: det.cantidad || 1,
                        precio: det.preciounitario || 0,
                        total: (det.cantidad || 1) * (det.preciounitario || 0),
                        is_from_appointment: true
                    });
                }) || [];
            }
    
    
            const todosLosItems = [...serviciosComoItems, ...productosComoItems];
            const sumaTotal = todosLosItems.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0);
            setCouponCode('');
            setAppliedCoupon(null);
            setIsValidatingCoupon(false);
            setFacturaData(prev => ({
                ...prev,
                model_type_id: cita.id,
                items: todosLosItems,
                subtotal: sumaTotal,
                total: sumaTotal,
                observaciones: cita.observaciones || ''
            }));
        }
    }, [cita]);

    const manejarFacturaRapida = (callbackCerrar: () => void) => {
        if (facturaData.items.length === 0) return alert("No hay conceptos para facturar");
    
        fetchFactura(route('ftfacturas.store', { rediret: false }), {
            onSuccess: () => {
                resetFactura();
                setAppliedCoupon(null);
                setCouponCode('');
                callbackCerrar();
            },
        });
    };

    // Dentro de useFacturacionCita en tu hook
    const manejarAbrirTurno = (e?: React.MouseEvent | React.FormEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        postTurno(route('ftturnos.store'), {
            onSuccess: (page: any) => {
                // 1. Cerramos el modal de apertura de turno
                setShowTurnoModal(false);
                
                // 2. Extraemos el turno_id que acaba de llegar (depende de cómo lo envíe tu controlador)
                // Normalmente Laravel + Inertia devuelven los flashes o el objeto actualizado en los props
                const nuevoTurnoId = page.props.turnoActivo?.id;

                if (nuevoTurnoId) {
                    // 3. ACTUALIZACIÓN CLAVE: Seteamos el ID en el formulario de la factura
                    setFacturaData('turno_id', nuevoTurnoId);
                }

                resetTurno();
            },
            onError: (errors) => {
                console.log("Errores recibidos del servidor:", errors);
            },
            preserveScroll: true,
        });
    };


    useEffect(() => {
        // Si recibimos un turnoActivo por props y la factura no tiene uno asignado
        if (turnoActivo?.id && !facturaData.turno_id) {
            setFacturaData('turno_id', turnoActivo.id);
        }
    }, [turnoActivo, cita]); // Se ejecuta al cambiar la cita o el turno

    // Buscador con Debounce
    useEffect(() => {
        const empleado = cita?.detalle_con_empleadoservicio[0]?.empleadoservicio?.empleado?.id;
        if (filtroBusqueda.length > 2) {
            const delayDebounce = setTimeout(async () => {
                try {
                    // Ajusta esta ruta a tu API real de búsqueda
                    //const { data } = await axios.get(`/api/productos/buscar?q=${filtroBusqueda}`);
                    const { data } = await axios.get(
                                                        route('api.productos.buscar'), 
                                                        { params: 
                                                            { 
                                                                q: filtroBusqueda, 
                                                                empleado_id: empleado ? empleado: null
     
                                                            } 
                                                        }
                                                    );
                    setResultadosBusqueda(data);
                } catch (error) {
                    console.error("Error buscando productos", error);
                }
            }, 300);
            return () => clearTimeout(delayDebounce);
        } else {
            setResultadosBusqueda([]);
        }
    }, [filtroBusqueda]);

    const agregarItem = (producto: any) => {
        const precio = Number(producto.precio || producto.preciosalida || 0);
        const nuevoItem = {
            unique_id: Date.now(),
            producto_id: producto.id,
            nombre: producto.nombre,
            descripcion: `Producto adicional #${producto.id} - ${producto?.nombre}`,
            cantidad: 1,
            precio: precio,
            descuento: 0,
            total: precio,
            tipo_id: producto.tipo?.id || producto.tipo_id || 854,
            tipo: producto.tipo?.nombre || producto.tipo || 'PRODUCTO'
        };
        // 1. Actualizamos el form de la Cita (visual/db cita)
        form.setData('items', [...form.data.items, nuevoItem]);
        setFiltroBusqueda('');
        setResultadosBusqueda([]);

        // 2. IMPORTANTE: Actualizamos el facturaData para que el total se vea reflejado
        setFacturaData(prev => {
            const nuevosItemsFactura = [...prev.items, nuevoItem];
            const nuevoTotal = nuevosItemsFactura.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0);
            return {
                ...prev,
                items: nuevosItemsFactura,
                subtotal: nuevoTotal,
                total: nuevoTotal
            };
        });
    };

    const eliminarItem = (uniqueId: number) => {
        form.setData('items', form.data.items.filter((i: any) => i.unique_id !== uniqueId));
    };

    const actualizarCalculosItem = (uniqueId: number, cambios: object) => {
        const nuevosItems = form.data.items.map((item: any) => {
            if (item.unique_id === uniqueId) {
                const actualizado = { ...item, ...cambios };
                actualizado.total = (actualizado.precio * actualizado.cantidad) * (1 - (actualizado.descuento / 100));
                return actualizado;
            }
            return item;
        });
        form.setData('items', nuevosItems);
    };

    const cambiarCantidadItem = (uniqueId: number, operacion: 'sumar' | 'restar') => {
        const item = form.data.items.find(i => i.unique_id === uniqueId);
        if (!item) return;
        const nuevaCant = operacion === 'sumar' ? item.cantidad + 1 : Math.max(1, item.cantidad - 1);
        actualizarCalculosItem(uniqueId, { cantidad: nuevaCant });
    };

    const cambiarDescuentoItem = (uniqueId: number, valor: string) => {
        const desc = Math.min(100, Math.max(0, Number(valor) || 0));
        actualizarCalculosItem(uniqueId, { descuento: desc });
    };

    const abrirModalRapidoProducto = (nombre: any) => {
        const precioSugerido = window.prompt(`Introduce el precio para "${nombre}":`, "0");
        
        if (precioSugerido !== null && precioSugerido !== "") {
            const precio = parseFloat(precioSugerido);
            const nuevoItem = {
                unique_id: Date.now(), 
                producto_id: null,     // El backend detectará que es nuevo
                nombre: nombre.toUpperCase(),
                descripcion: 'Producto nuevo agregado manualmente',
                cantidad: 1,
                precio: precio,
                descuento: 0,
                total: precio,
                es_nuevo: true,        // Flag crucial para el controlador de Laravel
                tipo_id: 854,
                tipo: 'PRODUCTO',
            };
    
            // 1. Actualizar formulario de la Cita
            form.setData('items', [...form.data.items, nuevoItem]);
    
            // 2. ACTUALIZAR formulario de la Factura (Esto es lo que te faltaba sincronizar bien)
            setFacturaData(prev => {
                const nuevosItemsFactura = [...prev.items, nuevoItem];
                const nuevoTotal = nuevosItemsFactura.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0);
                return {
                    ...prev,
                    items: nuevosItemsFactura,
                    subtotal: nuevoTotal,
                    total: nuevoTotal
                };
            });
    
            setFiltroBusqueda('');
            setResultadosBusqueda([]);
        }
    };

    const finalizarYGuardarCita = (e: React.FormEvent, callbackCerrar: () => void) => {
        e.preventDefault();
    
        form.post(route('api.citas.actualizar', cita?.id), {
            preserveScroll: true,
            onSuccess: () => {
                // 1. Cerramos el modal usando la función que viene del Dashboard
                // Esto pondrá citaDetalle en null y eliminará el modal del DOM
                callbackCerrar();
    
                // 2. Limpieza opcional de estados locales del hook
                setFiltroBusqueda('');
                setAppliedCoupon(null);
                setCouponCode('');
                setResultadosBusqueda([]);
                // 3. Notificación opcional (Si usas SweetAlert2)
                // Swal.fire({
                //     icon: 'success',
                //     title: '¡Guardado!',
                //     text: 'La cuenta ha sido actualizada correctamente.',
                //     timer: 2000,
                //     showConfirmButton: false
                // });
            },
            onError: (errors) => {
                console.error("Errores en el formulario:", errors);
            }
        });
    };

    const validarCupon = async () => {
        if (!couponCode) return;
        setIsValidatingCoupon(true);
        try {
            // Llamamos a un endpoint que crearemos (ej: ftcupones.validate)
            const { data } = await axios.post(route('cfcupones.validar'), {
                codigo: couponCode,
                persona_id: cita?.adcliente?.persona_id, // Para validar que sea de este cliente
            });
    
            if (data.valido) {
                setAppliedCoupon(data.cupon);
                // Aplicamos el descuento al formulario de la factura
                setFacturaData(prev => ({
                    ...prev,
                    porcentajedescuento: data.cupon.promociones.valor,
                    // Guardamos el ID del cupón para que el backend lo marque como USADO al facturar
                    cupon_id: data.cupon.id 
                }));
                toast.success(`¡Cupón aplicado!: ${data.cupon.promociones.nombre}`);
            } else {
                toast.error(data.mensaje || "Cupón no válido");
                setAppliedCoupon(null);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.mensaje || "Cupón no válido");
        } finally {
            setIsValidatingCoupon(false);
        }
    };
    
    // Totales calculados al vuelo (disponibles en cada render)
    const subtotalServicios = cita?.detalle_con_empleadoservicio?.reduce((acc: number, d: any) => acc + Number(d.preciofinal), 0) || 0;
    const subtotalProductosPrevios = cita?.detalle_con_producto?.reduce((acc: number, d: any) => acc + Number(d.preciofinal), 0) || 0;
    const subtotalNuevos = form.data.items.reduce((acc: number, item: any) => acc + item.total, 0) || 0;
    
    const totalAntesDeDescuento = subtotalServicios + subtotalProductosPrevios + subtotalNuevos;
    const montoDescuento = totalAntesDeDescuento * (facturaData.porcentajedescuento / 100);
    const totalFinal = totalAntesDeDescuento - montoDescuento;
    
    // 1. Efecto para sincronizar los totales calculados con el estado de la factura
    // Sincronización con FacturaData (Agregando descuento e impuesto para el controlador)
    useEffect(() => {
        setFacturaData(prev => ({
            ...prev,
            subtotal: totalAntesDeDescuento,
            descuento: montoDescuento, // <--- Envía el valor en dinero
            impuesto: 0, // <--- Si luego agregas impuestos, aquí lo calculas
            total: totalFinal // <--- ESTO es lo que recibe Laravel,
            
        }));
    }, [totalAntesDeDescuento, totalFinal]); 

    // 2. Mejora en quitarCupon para limpiar el total
    const quitarCupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setFacturaData(prev => ({
            ...prev,
            porcentajedescuento: 0,
            cupon_id: ''
        }));
    };

    return {
        form,
        agregarItem,
        eliminarItem,
        cambiarCantidadItem,
        cambiarDescuentoItem,
        abrirModalRapidoProducto,
        filtroBusqueda,
        setFiltroBusqueda,
        resultadosBusqueda,
        setResultadosBusqueda,
        finalizarYGuardarCita,
        manejarFacturaRapida,
        manejarAbrirTurno,

        facturaData,    
        setFacturaData, 
        processingFactura,     
        facturaErrors,

        turnoData, 
        setTurnoData, 
        processingTurno, 
        turnoErrors,
        showTurnoModal,
        setShowTurnoModal,

        couponCode,
        setCouponCode,
        validarCupon,
        appliedCoupon,
        quitarCupon,
        isValidatingCoupon,
        totales: {
            subtotalServicios,
            subtotalProductosPrevios,
            subtotalNuevos,
            montoDescuento,
            totalFinal
        }
        
    };
};