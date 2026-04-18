import AppMainLayout from '@/layouts/app-main-layout';
import { Head, useForm} from '@inertiajs/react';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Asegúrate de instalarlo: npm install qrcode.react
import { useState, useRef, useEffect } from 'react';
import { useClienteModal } from '@/hooks/use-cliente-context';
import { router } from '@inertiajs/react';
import CitasModalPos from '@/components/global/citas-modal-pos';
import CitasModalCancelar from '@/components/global/citas-modal-cancelar';
import CitasOffcanvasReserva from '@/components/global/citas-offcanvas-reserva';
import * as bootstrap from 'bootstrap';
import axios from 'axios';

// 1. Importamos Recharts con Alias para evitar el choque
import { 
    PieChart, 
    Pie, 
    Legend as RechartsLegend, // Alias aplicado
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip as RechartsTooltip, // Alias aplicado
    ResponsiveContainer, 
    Cell, 
    CartesianGrid 
} from 'recharts';

// 2. Importamos Chart.js normalmente
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip, // Este se queda con el nombre original
    Filler,
    Legend, // Este se queda con el nombre original
} from 'chart.js';

// Registro de Chart.js (sin cambios)
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

interface Props {
    auth : any
    citas: any[];
    cumpleanosHoy: any[];
    facturas: any[];
    sedePredeterminada: any;
    estadosList: Record<string, string>;
    metodospagosList: Record<string, string>;
    turnosList: Record<string, string>;
    totalClientes : any; 
    clientesHoy : any;
    tasaRetencion : any;
    turnoActivo : any;
}

interface DataGrafico {
    name: string;
    total: number;
}
import { useReservaCita } from '@/hooks/use-reserva-cita';

export default function Dashboard({ auth, citas, facturas, cumpleanosHoy, estadosList, metodospagosList, totalClientes, clientesHoy, tasaRetencion, turnoActivo, turnosList, sedePredeterminada}: Props) {
    
    const [citaDetalle, setCitaDetalle] = useState<any>(null);
    const [citaCancelar, setCitaCancelar] = useState<any>(null);
    const reservaCita = useReservaCita();
    const [horaActual, setHoraActual] = useState(new Date());
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [mensajePromo, setMensajePromo] = useState("¡Hola! 🎉 Por ser tu cumpleaños, hoy tienes un 20% de descuento en tu próximo corte. ¡Te esperamos!");

    // Función para asignar colores aleatorios a los avatares
    const colors = ['primary', 'info', 'success', 'danger', 'warning'];
    const user = auth.user.personas.comercios;
    const token = user.token;
    //console.log("mostrando: ",user);
    //console.log("mostrando token: ",user.personas.comercios.token);

    // 1. Función para formatear fecha en zona horaria local (Colombia)
    const getFechaLocal = (fecha: Date) => {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Bogota',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(fecha);
    };

    // 2. Referencias de tiempo
    const ahora = new Date();
    const hoyString = getFechaLocal(ahora); // "2026-04-09"
    const mesActualReferencia = hoyString.substring(0, 7); // "2026-04"

    // Ayer
    const ayerDate = new Date();
    ayerDate.setDate(ahora.getDate() - 1);
    const ayerString = getFechaLocal(ayerDate);

    // Mes Pasado
    const mesPasadoDate = new Date();
    mesPasadoDate.setMonth(ahora.getMonth() - 1);
    const mesPasadoReferencia = getFechaLocal(mesPasadoDate).substring(0, 7);

   
    // 4. Cálculos de Ingresos
    const universoFacturas = facturas || [];

    // Función para sumar los pagos de una factura
    const sumarPagosFactura = (factura: any) => {
        return (factura.pagos || []).reduce((acc: number, pago: any) => {
            return acc + Number(pago.total || 0);
        }, 0);
    };

    // --- INGRESOS HOY ---
    const ingresosHoy = universoFacturas
        .filter((f: any) => f.fecha?.startsWith(hoyString))
        .reduce((acc: number, f: any) => acc + sumarPagosFactura(f), 0);

    // --- INGRESOS AYER ---
    const ingresosAyer = universoFacturas
        .filter((f: any) => f.fecha?.startsWith(ayerString))
        .reduce((acc: number, f: any) => acc + sumarPagosFactura(f), 0);

    // --- INGRESOS MES ACTUAL ---
    const ingresosMes = universoFacturas
        .filter((f: any) => f.fecha?.startsWith(mesActualReferencia))
        .reduce((acc: number, f: any) => acc + sumarPagosFactura(f), 0);

    // --- INGRESOS MES ANTERIOR ---
    const ingresosMesAnterior = universoFacturas
        .filter((f: any) => f.fecha?.startsWith(mesPasadoReferencia))
        .reduce((acc: number, f: any) => acc + sumarPagosFactura(f), 0);
    
    // 5. Función Auxiliar para Porcentaje
    const calcularGrowth = (actual: number, anterior: number) => {
        if (anterior === 0) return actual > 0 ? '+100%' : '0%';
        const diff = ((actual - anterior) / anterior) * 100;
        return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
    };


    useEffect(() => {
        // Actualizamos el reloj cada segundo
        const timer = setInterval(() => setHoraActual(new Date()), 1000);
        return () => clearInterval(timer); // Limpieza al desmontar
    }, []);

    const qrRef = useRef<HTMLDivElement>(null);
    // URL dinámica basada en el username o ID del comercio
    const shopUrl = `http://vantifypro.co/landing?token=${token}`;
    const handleCrearFactura = () => router.visit(route('ftfacturas.create'));

    const { openModalCliente } = useClienteModal();
    const registrarYVender = () => {
        // Abrimos la modal y pasamos un callback opcional
        openModalCliente((nuevoCliente) => {
            console.log("Cliente guardado exitosamente:", nuevoCliente);
            // Aquí puedes redirigir a ventas o actualizar un estado local
        });
    };

    // Función para descargar el QR
    const downloadQR = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = 1500; // Alta resolución para impresión
            canvas.height = 1500;
            if (ctx) {
                // Fondo blanco obligatorio para escaneo físico
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 100, 100, 1300, 1300);
            }
            const pngFile = canvas.toDataURL("image/png");
            
            const downloadLink = document.createElement("a");
            downloadLink.download = `QR-Vantify-Pro-${token}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    // Función para compartir (Web Share API)
    const shareQR = async () => {
        try {
            const svgElement = qrRef.current?.querySelector('svg');
            if (!svgElement) return;
    
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            
            const svgSize = svgElement.getBoundingClientRect();
            canvas.width = svgSize.width * 2;
            canvas.height = svgSize.height * 2;
    
            img.onload = async () => {
                if (!ctx) return;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
                // Intentar compartir como archivo
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    const file = new File([blob], "mi-qr-vantify.png", { type: "image/png" });
    
                    // VALIDACIÓN CRÍTICA: ¿Existe navigator.share y navigator.canShare?
                    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: 'Mi Código QR',
                                text: 'Escanea mi código para agendar.',
                            });
                        } catch (shareError) {
                            // Si el usuario cancela o falla el envío de archivo, intentamos solo texto
                            fallbackCopy();
                        }
                    } else {
                        // PLAN B: Descargar la imagen automáticamente y copiar link
                        fallbackDownloadAndCopy(blob);
                    }
                }, "image/png");
            };
    
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    
        } catch (error) {
            console.error('Error general:', error);
            fallbackCopy();
        }
    };
    
    // --- FUNCIONES DE APOYO (PLAN B) ---
    
    const fallbackCopy = () => {
        navigator.clipboard.writeText(shopUrl);
        alert('Tu navegador no soporta compartir archivos. El enlace ha sido copiado al portapapeles.');
    };
    
    const fallbackDownloadAndCopy = (blob: Blob) => {
        // 1. Copiamos el texto
        navigator.clipboard.writeText(shopUrl);
        
        // 2. Descargamos la imagen automáticamente como respaldo
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'mi-codigo-qr-vantify.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('QR descargado y enlace copiado al portapapeles.');
    };

    const [seleccion, setSeleccion] = useState<{fecha: string, hora: string, servicio: any} | null>(null);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const [resultadosClientes, setResultadosClientes] = useState([]);
    const [buscando, setBuscando] = useState(false);
    // Al lado de los otros useForm (formPass, formBloqueo, etc.)
    const formReserva = useForm({
        cliente_id: '',
        fechanacimiento: '',
        sexo_id: '',
        cliente_identificacion: '',
        cliente_nombre: '',
        cliente_telefono: '',
        cliente_email: '',
        servicioasignado_id: '',
        fecha: '',
        hora: '',
        horainicio: '',
        horafinal: '',
        precio: '',
        servicio_id: '',
        observaciones: '',
    });
    const buscarCliente = async (query: string) => {
        if (query.length < 3) {
            setResultadosClientes([]);
            setMostrarSugerencias(false);
            return;
        }
    
        setBuscando(true);
        try {
            const response = await axios.get(route('api.clientes.buscar', { term: query }));
            setResultadosClientes(response.data);
            setMostrarSugerencias(true);
        } catch (error) {
            console.error("Error buscando cliente", error);
        } finally {
            setBuscando(false);
        }
    };
    const seleccionarCliente = (cliente: any) => {
        formReserva.setData({
            ...formReserva.data, // Mantenemos fecha, hora y servicio que ya se setearon
            cliente_id: cliente.id,
            sexo_id: cliente.sexo_id || '',
            fechanacimiento: cliente.fechanacimiento || '',
            cliente_nombre: `${cliente.nombres} ${cliente.apellidos}`,
            cliente_telefono: cliente.telefonomovil || '',
            cliente_email: cliente.email || '',
        });
        
        setMostrarSugerencias(false);
    };
    const submitReserva = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica antes de enviar
        if (!formReserva.data.cliente_nombre) {
            alert("Por favor, selecciona un cliente o crea uno.");
            return;
        }
    
        formReserva.post(route('adcitas.store'), {
            onSuccess: () => {
                // Si se guarda con éxito:
                // 1. Cerramos el modal
                const modalElement = document.getElementById('modalReserva');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance?.hide();
                }
                // 2. Limpiamos el formulario
                formReserva.reset();
                // 3. Opcional: Refrescar el calendario principal
                // router.reload(); 
            },
            onError: (errors) => {
                console.error("Errores al validar la cita:", errors);
            }
        });
    };

    // 1. Inicializamos un array de 24 posiciones (una por cada hora del día) con valor 0
    const ingresosPorHora = new Array(24).fill(0);

    // 2. Filtramos solo las facturas de hoy y sumamos a su respectiva hora
    universoFacturas.forEach((f: any) => {
        if (f.fecha?.startsWith(hoyString)) {
            // Extraemos la hora del string "2026-04-09 03:20:00" -> 3
            const hora = parseInt(f.fecha.split(' ')[1].split(':')[0]);
            
            // Sumamos los pagos de esa factura a la posición correspondiente
            const totalFactura = (f.pagos || []).reduce((acc: number, p: any) => acc + Number(p.total || 0), 0);
            
            ingresosPorHora[hora] += totalFactura;
        }
    });

    // 3. Etiquetas para el eje X (00:00, 01:00, etc.)
    const etiquetasHoras = ingresosPorHora.map((_, index) => `${index.toString().padStart(2, '0')}:00`);

    // 4. Configuración para el Chart.js
    const dataGrafico = {
        labels: etiquetasHoras, // ["00:00", "01:00", ...]
        datasets: [
            {
                label: 'Ingresos ($)',
                data: ingresosPorHora,
                fill: true,
                backgroundColor: 'rgba(13, 110, 253, 0.1)',
                borderColor: '#0d6efd',
                tension: 0.4, // Esto hace que la línea sea curva y moderna
                pointBackgroundColor: '#0d6efd',
            },
        ],
    };

    const opciones = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }, // Ocultamos la leyenda para que se vea más limpio
            tooltip: {
                callbacks: {
                    label: (context: any) => `Ingreso: $${context.raw.toLocaleString()}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { display: false },
                ticks: {
                    callback: (value: any) => `$${value.toLocaleString()}`
                }
            },
            x: {
                grid: { display: false }
            }
        }
    };

    // 1. Primero la función de procesamiento mensual
    const procesarIngresosMensuales = () => {
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const data = [];
        const fechaActual = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(fechaActual.getMonth() - i);
            const mesNombre = meses[d.getMonth()];
            const mesReferencia = d.toLocaleDateString('en-CA').substring(0, 7);
            const totalMes = (facturas || []).filter(f => f.fecha?.startsWith(mesReferencia))
                .reduce((acc, f) => acc + (f.pagos || []).reduce((pAcc:any, p:any) => pAcc + Number(p.total || 0), 0), 0);
            data.push({ name: mesNombre, total: totalMes });
        }
        return data;
    };

    // 2. Estado del filtro
    const [filtro, setFiltro] = useState('Semana'); // Puede ser 'Día', 'Semana' o 'Mes'

    // 3. Función de datos dinámicos (Ya puede acceder a la anterior)
    const obtenerDatosYComparativa = () => {
        // Definimos que 'datos' es un arreglo de objetos tipo DataGrafico
        let datos: DataGrafico[] = [];
        // Definimos la estructura del objeto de comparativa
        let comparativa: { valor: string; label: string } = { valor: '', label: '' };
        if (filtro === 'Día') {
            const bloques = ['00-04', '04-08', '08-12', '12-16', '16-20', '20-00'];
            datos = bloques.map(bloque => {
                const horaInicio = parseInt(bloque.split('-')[0]);
                const horaFin = parseInt(bloque.split('-')[1]);
                const total = (facturas || []).filter(f => {
                    const esHoy = f.fecha?.startsWith(hoyString);
                    const hora = parseInt(f.fecha?.split(' ')[1].split(':')[0]);
                    return esHoy && hora >= horaInicio && (horaFin === 0 ? hora < 24 : hora < horaFin);
                }).reduce((acc, f) => acc + (f.pagos || []).reduce((pAcc:any, p:any) => pAcc + Number(p.total || 0), 0), 0);
                return { name: bloque, total };
            });
            comparativa = { valor: calcularGrowth(ingresosHoy, ingresosAyer), label: 'vs ayer' };
        } 
        else if (filtro === 'Semana') {
            const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            const ultimos7Dias = [];
            
            // 1. Sumar ingresos de los últimos 7 días (Semana Actual)
            let ingresosSemanaActual = 0;
            for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const fechaRef = getFechaLocal(d);
                
                const totalDia = (facturas || []).filter((f: any) => f.fecha?.startsWith(fechaRef))
                    .reduce((acc: number, f: any) => acc + (f.pagos || []).reduce((pAcc: number, p: any) => pAcc + Number(p.total || 0), 0), 0);
                
                ingresosSemanaActual += totalDia;
                // Llenamos el array para el gráfico (en orden de hoy hacia atrás)
                ultimos7Dias.push({ name: diasSemana[d.getDay()], total: totalDia });
            }
        
            // 2. Sumar ingresos de los 7 días anteriores (Semana Pasada)
            let ingresosSemanaAnterior = 0;
            for (let i = 7; i < 14; i++) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const fechaRef = getFechaLocal(d);
                
                const totalDiaPrevio = (facturas || []).filter((f: any) => f.fecha?.startsWith(fechaRef))
                    .reduce((acc: number, f: any) => acc + (f.pagos || []).reduce((pAcc: number, p: any) => pAcc + Number(p.total || 0), 0), 0);
                
                ingresosSemanaAnterior += totalDiaPrevio;
            }
        
            // 3. Resultados
            datos = ultimos7Dias.reverse(); // Invertimos para que hoy sea la última barra
            comparativa = { 
                valor: calcularGrowth(ingresosSemanaActual, ingresosSemanaAnterior), 
                label: 'vs sem. anterior' 
            };
        }
        else {
            datos = procesarIngresosMensuales();
            comparativa = { valor: calcularGrowth(ingresosMes, ingresosMesAnterior), label: 'vs mes anterior' };
        }

        return { datos, comparativa };
    };

    const { datos: dataDinamica, comparativa } = obtenerDatosYComparativa();
    const picoMaximo = Math.max(...dataDinamica.map(d => d.total), 0);
     // Componente Custom para el Tooltip (opcional para que se vea pro)
     const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 shadow-sm border rounded-3 small">
                    <p className="mb-0 fw-bold">{`${payload[0].payload.name}`}</p>
                    <p className="mb-0 text-primary">{`Ingresos: $${payload[0].value.toLocaleString()}`}</p>
                </div>
            );
        }
        return null;
    };

    // 1. Extraer todos los nombres de servicios del JSON
    const serviciosExtraidos = citas.flatMap((cita: any) => 
        cita.detalle_con_empleadoservicio.map((det: any) => det.empleadoservicio.servicio.nombre)
    );

    // 2. Contar frecuencias
    const conteoServicios = serviciosExtraidos.reduce((acc: any, nombre: string) => {
        acc[nombre] = (acc[nombre] || 0) + 1;
        return acc;
    }, {});

    const totalServiciosCerrados = serviciosExtraidos.length;

    // 3. Formatear para Recharts
    const colores = ['#5E35B1', '#03A9F4', '#00C853', '#FFC107', '#FB8C00'];
    const dataServicios = Object.keys(conteoServicios).map((name, index) => ({
        name: name,
        value: Math.round((conteoServicios[name] / totalServiciosCerrados) * 100),
        cantidad: conteoServicios[name],
        color: colores[index % colores.length]
    }));

   
    return (
        <AppMainLayout>
            <Head title="Vantify - Dashboard Unificado" />

            {/* --- BANNER DE BIENVENIDA OPTIMIZADO --- */}
            <div className="row mb-4">
                <div className="col-12">
                    <div 
                        className="card border-0 shadow-sm overflow-hidden" 
                        style={{ 
                            background: 'linear-gradient(90deg, #e6f7ff 0%, #ffffff 100%)', 
                            borderLeft: '5px solid #1890ff',
                            position: 'relative'
                        }}
                    >
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                
                                {/* 1. SECCIÓN DE INFORMACIÓN Y ACCIONES (Izquierda) */}
                                <div className="col-md-12 col-lg-12">
                                    <div className="d-flex align-items-center mb-2">
                                        <span className="badge bg-light-primary text-primary me-2 px-2 py-1 small">Resumen en tiempo real</span>
                                        <span className="text-muted small">
                                            {horaActual.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            <span className="mx-1">•</span>
                                            {horaActual.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                    
                                    <h3 className="fw-bold text-dark mb-1">
                                        ¡Bienvenido a Vantify Pro, {auth.user.nombreComercio || auth.user.name}! 🚀
                                    </h3>
                                    <p className="text-muted mb-3 small">
                                        Tu comercio ha crecido un <span className="text-success fw-bold">15% más</span> esta semana.
                                    </p>

                                    {/* ACCIONES MOVIDAS AQUÍ PARA NO TAPAR EL FONDO */}
                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                        <select className="form-select form-select-sm w-auto border-0 shadow-sm bg-white cursor-pointer fw-bold text-muted">
                                            <option>Hoy</option>
                                            <option>Esta Semana</option>
                                            <option>Este Mes</option>
                                        </select>
                                        
                                        <button 
                                            className="btn btn-light-primary btn-sm shadow-sm px-3 border-0"
                                            onClick={reservaCita.abrirModal} 
                                            disabled={reservaCita.cargando}
                                        >
                                            {reservaCita.cargando ? <span className="spinner-border spinner-border-sm me-1"></span> : <i className="ti ti-plus me-1"></i>}
                                            Agendar cita
                                        </button>
                                        
                                        <button 
                                            className="btn btn-light-primary btn-sm shadow-sm px-3 border-0"
                                            onClick={handleCrearFactura}
                                        >
                                            <i className="ti ti-plus me-1"></i> Nueva venta directa
                                        </button>

                                        {/* NUEVO BOTÓN: OBTENER QR */}
                                        <button 
                                            className="btn btn-light-primary btn-sm shadow-sm px-3 border-0"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#qrModal"
                                        >
                                            <i className="ti ti-qrcode me-1"></i> Mi QR
                                        </button>
                                        
                                    </div>
                                </div>

                            </div>

                            {/* Icono Decorativo de Fondo (Limpio, sin botones encima) */}
                            <div className="position-absolute end-0 top-50 translate-middle-y me-n2 d-none d-lg-block opacity-25">
                                <i className="ti ti-chart-dots text-primary" style={{ fontSize: '9rem', pointerEvents: 'none' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="card border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                    <div className="card-body p-4">
                        {/* Header del card */}
                        <div style={{ height: '300px' }}>
                            <Line data={dataGrafico} options={opciones} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0 fw-bold">Rendimiento de Ingresos</h5>
                                <p className="text-muted small mb-0">
                                    Comparativa: 
                                    <span className={`fw-bold ms-1 ${comparativa.valor.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                                        {comparativa.valor}
                                    </span> {comparativa.label}
                                </p>
                                <div className="badge bg-light-primary text-primary p-2">
                                    <i className="ti ti-trending-up me-1"></i> Pico: ${picoMaximo.toLocaleString()}
                                </div>
                            </div>
                            <div className="btn-group btn-group-sm">
                                {['Día', 'Semana', 'Mes'].map((opcion) => (
                                    <button 
                                        key={opcion}
                                        className={`btn ${filtro === opcion ? 'btn-primary' : 'btn-outline-secondary'}`}
                                        onClick={() => setFiltro(opcion)}
                                    >
                                        {opcion}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="card-body" style={{ width: '100%', height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dataDinamica} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }} 
                                    />
                                    <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#f8f9fa' }} />
                                    <Bar dataKey="total" radius={[6, 6, 6, 6]} barSize={filtro === 'Día' ? 40 : 20}>
                                        {dataDinamica.map((entry, index) => (
                                            <Cell 
                                                key={`cell-${index}`} 
                                                // Resaltamos siempre la última barra (la más reciente)
                                                fill={index === dataDinamica.length - 1 ? '#0d6efd' : '#e6f7ff'} 
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                
                {/* Top Servicios */}
                <div className="col-lg-4">     
                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                        {/* Subtítulo con Badge de Meta */}
                        <div className="d-flex align-items-center mb-3">
                            <span className="badge bg-light-primary text-primary me-2" style={{ fontSize: '10px' }}>
                                META: {totalServiciosCerrados + 5} {/* Ejemplo dinámico */}
                            </span>
                            <span className="text-muted" style={{ fontSize: '10px' }}>
                                {((totalServiciosCerrados / (totalServiciosCerrados + 5)) * 100).toFixed(1)}% completado
                            </span>
                        </div>

                        <div className="row align-items-center mb-3">
                            <div className="col-7">
                                
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={dataServicios}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={65} // Un poco más delgado para más elegancia
                                            outerRadius={85}
                                            paddingAngle={8}
                                            dataKey="value"
                                            cornerRadius={10} // Más redondeado = más moderno
                                        >
                                            {dataServicios.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip /> 
                                        {/* INFO CENTRAL DINÁMICA */}
                                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                                            <tspan x="50%" dy="-10" fontSize="10" fontWeight="700" fill="#adb5bd" textAnchor="middle">TOTAL</tspan>
                                            <tspan x="50%" dy="25" fontSize="28" fontWeight="800" fill="#212529" textAnchor="middle">
                                                {totalServiciosCerrados}
                                            </tspan>
                                        </text>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="col-5 pl-0">
                                {/* Leyenda con Valores Absolutos */}
                                <div className="ps-2">
                                    {dataServicios.map((item, i) => (
                                        <div key={i} className="mb-3">
                                            <div className="d-flex align-items-center justify-content-between mb-1">
                                                <div className="d-flex align-items-center">
                                                    <span className="rounded-circle me-2" style={{width: '8px', height: '8px', backgroundColor: item.color}}></span>
                                                    <span className="small text-muted fw-bold" style={{fontSize: '11px'}}>{item.name}</span>
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <span className="fw-bold me-2" style={{ fontSize: '14px' }}>{item.value}%</span>
                                                <span className="text-muted small" style={{ fontSize: '11px' }}>({item.cantidad})</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* --- MODAL PARA EL QR --- */}
            <div className="modal fade" id="qrModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold text-primary">Impulsa tu comercio</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center py-5">
                            <div ref={qrRef} style={{ display: 'inline-block', background: 'white', padding: '10px' }}>
                                <QRCodeSVG value={shopUrl} size={256} />
                            </div>

                            
                            <h6 className="fw-bold mb-1">¡Comparte tu perfil!</h6>
                            <p className="text-muted small px-4 mb-4">Tus clientes podrán agendar y ver tus servicios escaneando este código.</p>
                            
                            <div className="d-flex justify-content-center gap-3">
                                <button onClick={downloadQR} className="btn btn-primary px-4 rounded-pill">
                                    <i className="ti ti-download me-1"></i> Descargar
                                </button>
                                <button onClick={shareQR} className="btn btn-light px-4 rounded-pill border">
                                    <i className="ti ti-share me-1"></i> Compartir
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer border-0 bg-light justify-content-center">
                            <small className="text-muted">Powered by <strong>Vantify Pro</strong></small>
                        </div>
                    </div>
                </div>
            </div>

            {showPromoModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header border-0 pt-4 px-4">
                                <h5 className="fw-bold mb-0">Enviar Promoción Masiva</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPromoModal(false)}></button>
                            </div>
                            <div className="modal-body px-4">
                                <p className="text-muted small">Se enviará este mensaje a los {cumpleanosHoy.length} clientes que cumplen años hoy.</p>
                                <textarea 
                                    className="form-control border-light-subtle bg-light" 
                                    rows={4} 
                                    value={mensajePromo}
                                    onChange={(e) => setMensajePromo(e.target.value)}
                                    style={{ borderRadius: '10px' }}
                                ></textarea>
                            </div>
                            <div className="modal-footer border-0 pb-4 px-4">
                                <button className="btn btn-light rounded-pill px-4" onClick={() => setShowPromoModal(false)}>Cancelar</button>
                                <button className="btn btn-warning text-white rounded-pill px-4 fw-bold" onClick={() => {
                                    // Lógica para abrir los WhatsApps (o enviar al backend)
                                    cumpleanosHoy.forEach((cliente: any) => {
                                        const num = cliente.telefonomovil.replace(/\D/g, '');
                                        window.open(`https://wa.me/${num}?text=${encodeURIComponent(mensajePromo)}`, '_blank');
                                    });
                                    setShowPromoModal(false);
                                }}>
                                    <i className="ti ti-brand-whatsapp me-2"></i> Enviar a todos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE RESERVA ACTUALIZADO --- */}
            <div className="modal fade" id="modalReserva" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-bottom bg-light p-3">
                            <div>
                                <h5 className="modal-title fw-bold text-dark">
                                    <i className="ti ti-bookmark me-2 text-primary fs-4"></i>
                                    Confirmar cita
                                </h5>
                                <small className="text-muted">Busca un cliente o registra uno nuevo</small>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div className="modal-body p-4">
                            {/* Resumen del Turno (Igual al anterior) */}
                            {seleccion && (
                                <div className="alert bg-primary-subtle border border-primary-subtle rounded-3 mb-4 p-3 shadow-sm">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-white rounded-circle p-2 border border-primary-subtle text-primary shadow-sm">
                                            <i className="ti ti-calendar-event fs-3"></i>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0 fw-bold text-dark">
                                                {new Date(seleccion.fecha + 'T00:00:00').toLocaleDateString('es-ES', { 
                                                    weekday: 'long', day: 'numeric', month: 'long' 
                                                })}
                                            </h6>
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <span className="badge bg-primary text-white fw-bold px-3 py-1 fs-7 rounded-pill">
                                                    <i className="ti ti-clock-check me-1"></i> {seleccion.hora}
                                                </span>
                                                <span className="text-muted small">
                                                    para <strong>{seleccion.servicio.nombre}</strong>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <form id="formConfirmarCita" onSubmit={submitReserva}>
                                {/* Buscador de Cliente con Opción de "Nuevo" */}
                                <div className="mb-3 position-relative">
                                    <label className="form-label fw-semibold small text-muted text-uppercase">Cliente</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><i className="ti ti-user"></i></span>
                                        <input 
                                            type="text" 
                                            className={`form-control ${!formReserva.data.cliente_id && formReserva.data.cliente_nombre ? 'border-warning' : ''}`}
                                            value={formReserva.data.cliente_nombre}
                                            onChange={(e) => {
                                                formReserva.setData({
                                                    ...formReserva.data,
                                                    cliente_nombre: e.target.value,
                                                    cliente_id: '' // Limpiamos el ID si el usuario escribe, para marcarlo como "Nuevo"
                                                });
                                                buscarCliente(e.target.value);
                                            }}
                                            placeholder="Buscar cliente por nombre o cédula..."
                                            autoComplete="off"
                                        />
                                    </div>
                                    
                                    {/* Indicador de Nuevo Cliente */}
                                    {!formReserva.data.cliente_id && formReserva.data.cliente_nombre.length > 2 && !buscando && (
                                        <div className="form-text text-warning fw-bold">
                                            <i className="ti ti-alert-circle me-1"></i> Se creará como cliente nuevo
                                        </div>
                                    )}

                                    {/* Lista de sugerencias */}
                                    {mostrarSugerencias && (
                                        <ul className="list-group position-absolute w-100 shadow-lg z-3 mt-1" style={{ top: '100%' }}>
                                            {/* Resultados de la DB */}
                                            {resultadosClientes.map((c: any) => (
                                                <li 
                                                    key={c.id} 
                                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2"
                                                    onClick={() => seleccionarCliente(c)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <div>
                                                        <div className="fw-bold">{c.nombres} {c.apellidos}</div>
                                                        <small className="text-muted">{c.telefonomovil || 'Sin teléfono'}</small>
                                                    </div>
                                                    <i className="ti ti-chevron-right text-muted"></i>
                                                </li>
                                            ))}
                                            
                                            {/* Opción: Crear Nuevo (si no hay resultados exactos) */}
                                            {formReserva.data.cliente_nombre.length > 2 && (
                                                <li 
                                                    className="list-group-item list-group-item-action list-group-item-primary d-flex align-items-center py-2"
                                                    onClick={() => setMostrarSugerencias(false)}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    <i className="ti ti-user-plus me-2 fs-5"></i>
                                                    <div>
                                                        <div className="fw-bold">Usar "{formReserva.data.cliente_nombre}"</div>
                                                        <small>Registrar como cliente nuevo</small>
                                                    </div>
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>

                                <div className="row g-3">
                                    {/* Identificación (Nueva para cliente nuevo) */}
                                    {!formReserva.data.cliente_id && formReserva.data.cliente_nombre && (
                                        <div className="col-12">
                                            <label className="form-label fw-semibold small text-muted text-uppercase">N° Identificación</label>
                                            <input 
                                                type="text" 
                                                className="form-control bg-light-warning border-warning-subtle" 
                                                placeholder="Identificación del nuevo cliente"
                                                value={formReserva.data.cliente_identificacion || ''}
                                                onChange={e => formReserva.setData('cliente_identificacion', e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small text-muted text-uppercase">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            className="form-control" 
                                            value={formReserva.data.cliente_telefono}
                                            onChange={e => formReserva.setData('cliente_telefono', e.target.value)}
                                            placeholder="Ej: 3001234567"
                                            required={!formReserva.data.cliente_id} // Requerido si es nuevo
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small text-muted text-uppercase">Email</label>
                                        <input 
                                            type="email" 
                                            className="form-control" 
                                            value={formReserva.data.cliente_email}
                                            onChange={e => formReserva.setData('cliente_email', e.target.value)}
                                            placeholder="ejemplo@correo.com"
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label fw-semibold small text-muted text-uppercase">Notas Opcionales</label>
                                        <textarea 
                                            className="form-control" 
                                            rows={2}
                                            value={formReserva.data.observaciones}
                                            onChange={(e) => formReserva.setData('observaciones', e.target.value)}
                                            placeholder="Alguna observación importante..."
                                        ></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="modal-footer border-top bg-light p-3">
                            <button type="button" className="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cancelar</button>
                            <button 
                                type="submit" 
                                form="formConfirmarCita" 
                                className={`btn ${formReserva.data.cliente_id ? 'btn-primary' : 'btn-warning'} shadow-sm`}
                                disabled={formReserva.processing}
                            >
                                {formReserva.processing ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <>
                                        <i className={`ti ${formReserva.data.cliente_id ? 'ti-device-floppy' : 'ti-user-plus'} me-2`}></i>
                                        {formReserva.data.cliente_id ? 'Confirmar cita' : 'Registrar y Agendar'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- COMPONENTE GLOBAL DE FACTURACIÓN --- */}
            <CitasModalPos 
                cita={citaDetalle}
                metodospagosList={metodospagosList}
                sedePredeterminada={sedePredeterminada}
                turnoActivo={turnoActivo}
                turnosList={turnosList}
                show={!!citaDetalle} 
                onClose={() => setCitaDetalle(null)} 
            />

            {/* --- COMPONENTE GLOBAL DE CANCELACION CITA --- */}
            <CitasModalCancelar
                cita={citaCancelar} 
                show={!!citaCancelar}
                estadosList={estadosList}
                onClose={() => setCitaCancelar(null)} 
            />

            {/* 3. El componente recibe el estado completo del hook */}
            <CitasOffcanvasReserva 
                state={reservaCita}
                onReservar={(datos) => {
                    // 1. Llenamos el formulario de reserva con los datos del turno
                    formReserva.setData({
                        ...formReserva.data,
                        fecha: datos.fecha,
                        hora: datos.hora,
                        servicioasignado_id: datos.servicioasignado_id,
                        horainicio: datos.horainicio,
                        horafinal: datos.horafinal,
                        precio: datos.precio,
                    });

                    // 2. Abrimos el modal de confirmación (puedes usar un ID o un estado)
                    setTimeout(() => {
                        const modalConfirm = document.getElementById('modalReserva');
                        if (modalConfirm) {
                            const modal = new bootstrap.Modal(modalConfirm);
                            modal.show();
                        }
                    }, 300);
                    console.log("Finalizado", datos);
                    reservaCita.cerrarModal();
                }}
            />
            
        

        </AppMainLayout>
    );
}