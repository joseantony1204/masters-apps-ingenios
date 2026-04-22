import AppMainLayout from '@/layouts/app-main-layout';
import { Head, Link, useForm} from '@inertiajs/react';
import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Asegúrate de instalarlo: npm install qrcode.react
import { useState, useRef, useEffect } from 'react';
import { router } from '@inertiajs/react';
import CitasModalPos from '@/components/global/citas-modal-pos';
import CitasModalCancelar from '@/components/global/citas-modal-cancelar';
import CitasOffcanvasReserva from '@/components/global/citas-offcanvas-reserva';
import * as bootstrap from 'bootstrap';
import axios from 'axios';
import { toast } from 'react-hot-toast';

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
    comercio: any;
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
declare global {
    interface Window {
        Echo: any;
    }
}

import { useReservaCita } from '@/hooks/use-reserva-cita';

export default function Dashboard({ auth, comercio, citas, facturas, cumpleanosHoy, estadosList, metodospagosList, totalClientes, clientesHoy, tasaRetencion, turnoActivo, turnosList, sedePredeterminada}: Props) {
    
    const [citaDetalle, setCitaDetalle] = useState<any>(null);
    const [citaCancelar, setCitaCancelar] = useState<any>(null);
    const reservaCita = useReservaCita();
    const [horaActual, setHoraActual] = useState(new Date());
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [mensajePromo, setMensajePromo] = useState("¡Hola! 🎉 Por ser tu cumpleaños, hoy tienes un 20% de descuento en tu próximo corte. ¡Te esperamos!");
    
    // Al principio de index.tsx (fuera del componente)

    // 1. Crea este estado al inicio de tu componente Dashboard
    const [citaResaltadaId, setCitaResaltadaId] = useState<number | null>(null);
    const [bloqueoReverb, setBloqueoReverb] = useState(false);
    useEffect(() => {
        // Solo actuamos si Echo está disponible
        if (typeof window !== 'undefined' && window.Echo) {
            
            console.log("📡 Conectando al canal de actualizaciones...");
            const channel = window.Echo.channel('dashboard-updates');

            channel.listen('.actualizar.dashboard', (e: any) => {
                console.log("✅ Evento recibido:", e);
            
                // Si el bloqueo está activo, ignoramos la señal de Reverb 
                // porque nosotros ya tenemos los datos frescos del 'post'
                if (bloqueoReverb) {
                    console.log("🚫 Bloqueo activo: Evitando colisión de peticiones.");
                    return; 
                }
            
                // Si el ID viene en el evento, lo resaltamos
                if (e.cita && e.cita.id) {
                    setCitaResaltadaId(e.cita.id);
                    setTimeout(() => setCitaResaltadaId(null), 15000);
                }
            
                // Lanzamos el toast elegante
                toast.custom((t) => (
                    <div className={`${t.visible ? 'animate__animated animate__fadeInRight' : 'animate__animated animate__fadeOutRight'} bg-white border rounded-3 p-3 shadow-lg d-flex align-items-center`} style={{ minWidth: '300px', borderLeft: '5px solid #10b981' }}>
                        <div className="bg-success-subtle rounded-circle p-2 me-3">
                            <i className="ti ti-check text-success fs-4"></i>
                        </div>
                        <div className="flex-grow-1">
                            <p className="mb-0 fw-bold text-dark">¡Agenda actualizada!</p>
                            <p className="mb-0 small text-muted">Se han sincronizado los últimos cambios.</p>
                        </div>
                    </div>
                ), { id: 'sync-cita' });
            
                router.visit(window.location.pathname, {
                    only: ['citas', 'facturas'],
                    preserveScroll: true,
                    preserveState: true,
                    replace: true
                });
            });
    
            // --- ESTO ES LO QUE EVITA QUE SALGA MUCHAS VECES ---
            return () => {
                console.log("🛑 Limpiando canal para evitar duplicados...");
                window.Echo.leave('dashboard-updates');
            };
        }
    }, [bloqueoReverb]); // Añade bloqueoReverb aquí // Importante: el array vacío asegura que esto solo corra una vez al montar

    

    {/*}
    const calcularDias = (fecha: any) => { 
        console.log(fecha)
    };

    const SubscriptionBanner = ({ suscripcion }) => {
        const diasRestantes =  calcularDias(suscripcion.fecha_vencimiento);
    
        if (diasRestantes > 5) return null;
    
        return (
            <div className={`alert ${diasRestantes <= 0 ? 'alert-danger' : 'alert-warning'} d-flex justify-content-between`}>
                <span>
                    <i className="ti ti-alert-triangle me-2"></i>
                    {diasRestantes <= 0 
                        ? "Tu suscripción ha vencido. Tienes 10 días para pagar antes de la suspensión." 
                        : `Tu suscripción vence en ${diasRestantes} días.`}
                </span>
                <button className="btn btn-sm btn-dark">Pagar Ahora</button>
            </div>
        );
    };*/}
    
    const [dropdownAbierto, setDropdownAbierto] = useState<number | null>(null);
    // Función para cerrar el menú al hacer click afuera
    useEffect(() => {
        const cerrarMenu = () => setDropdownAbierto(null);
        window.addEventListener('click', cerrarMenu);
        return () => window.removeEventListener('click', cerrarMenu);
    }, []);

    // Función para asignar colores aleatorios a los avatares
    const colors = ['primary', 'info', 'success', 'danger', 'warning'];
    const user = auth.user.personas.comercios;
    const token = user.token;
    //console.log("mostrando: ",auth.user);
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

    // 3. Cálculos de Citas
    const universoCitas = citas || [];

    const totalCitasHoy = universoCitas.filter((c: any) => c.fecha === hoyString).length;
    const totalCitasAyer = universoCitas.filter((c: any) => c.fecha === ayerString).length;

    const totalCitasMes = universoCitas.filter((c: any) => c.fecha?.startsWith(mesActualReferencia)).length;
    const totalCitasMesAnterior = universoCitas.filter((c: any) => c.fecha?.startsWith(mesPasadoReferencia)).length;

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

    // 6. Tu arreglo de Stats actualizado
    const stats = [
        { 
            label: 'TOTAL CITAS MES', 
            val: totalCitasMes, 
            growth: calcularGrowth(totalCitasMes, totalCitasMesAnterior), 
            icon: 'ti-calendar-event', 
            color: '#0d6efd',
            description: 'Comparado con el mes anterior' 
        },
        { 
            label: 'CITAS HOY', 
            val: totalCitasHoy, 
            growth: calcularGrowth(totalCitasHoy, totalCitasAyer), 
            icon: 'ti-star', 
            color: '#198754',
            description: 'Comparado con el dia de ayer' 
        },
        { 
            label: 'INGRESOS HOY', 
            val: `$${ingresosHoy.toLocaleString()}`, 
            growth: calcularGrowth(ingresosHoy, ingresosAyer), 
            icon: 'ti-currency-dollar', 
            color: '#0dcaff',
            description: 'Comparado con el dia de ayer' 
        },
    ];

    useEffect(() => {
        // Actualizamos el reloj cada segundo
        const timer = setInterval(() => setHoraActual(new Date()), 1000);
        return () => clearInterval(timer); // Limpieza al desmontar
    }, []);

    const qrRef = useRef<HTMLDivElement>(null);
    // URL dinámica basada en el username o ID del comercio
    const shopUrl = `https://vantifypro.co/landing?token=${token}`;
    const handleCrearFactura = () => router.visit(route('ftfacturas.create'));

    const downloadQR = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (!svg) return;
    
        const nombreComercio = comercio?.nombre || "Mi Comercio";
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
    
        img.onload = () => {
            // Dimensiones optimizadas para posters/redes sociales
            const width = 1200;
            const height = 1600;
            canvas.width = width;
            canvas.height = height;
    
            if (ctx) {
                // 1. Fondo Blanco Total
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, width, height);
    
                // 2. Cabecera Estilizada (Azul Vantify)
                ctx.fillStyle = "#0095ff";
                ctx.fillRect(0, 0, width, 280);
    
                // 3. Nombre del Comercio (Ajuste automático de tamaño si es largo)
                ctx.fillStyle = "white";
                const fontSizeNombre = nombreComercio.length > 15 ? "70px" : "90px";
                ctx.font = `bold ${fontSizeNombre} Montserrat, sans-serif`;
                ctx.textAlign = "center";
                ctx.fillText(nombreComercio.toUpperCase(), width / 2, 170);
    
                // 4. Dibujar el código QR (Más grande para mejor escaneo)
                const qrSize = 950;
                const qrX = (width - qrSize) / 2;
                const qrY = 380;
                ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
    
                // 5. Texto de Instrucción (CTA)
                ctx.fillStyle = "#1e293b";
                ctx.font = "bold 65px Montserrat, sans-serif";
                ctx.fillText("¡ESCANÉAME PARA AGENDAR!", width / 2, 1420);
    
                // 6. URL OPTIMIZADA (Aquí está el truco para que no se corte)
                ctx.fillStyle = "#64748b"; // Color gris suave profesional
                ctx.font = "40px Montserrat, sans-serif";
                
                // Mostramos una versión simplificada visualmente
                const urlSimplificada = `vantifypro.co/landing?token=${token.substring(0, 8)}...`;
                ctx.fillText(urlSimplificada, width / 2, 1510);
                
                // 7. Línea Decorativa Inferior
                ctx.fillStyle = "#0095ff";
                ctx.fillRect((width - 200) / 2, 1550, 200, 8);
            }
    
            const pngFile = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.download = `QR-${nombreComercio.replace(/\s+/g, '-')}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
    
        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    };

    // Función para compartir (Web Share API)
    const shareQR = async () => {
        try {
            const svgElement = qrRef.current?.querySelector('svg');
            if (!svgElement) return;
    
            const nombreComercio = comercio?.nombre || "Mi Comercio";
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            
            // Dimensiones consistentes con la descarga
            canvas.width = 1200;
            canvas.height = 1600;
    
            img.onload = async () => {
                if (!ctx) return;
    
                // --- MISMO DISEÑO QUE DOWNLOAD ---
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#0095ff";
                ctx.fillRect(0, 0, canvas.width, 280);
                ctx.fillStyle = "white";
                const fontSize = nombreComercio.length > 15 ? "70px" : "90px";
                ctx.font = `bold ${fontSize} Montserrat, sans-serif`;
                ctx.textAlign = "center";
                ctx.fillText(nombreComercio.toUpperCase(), canvas.width / 2, 170);
                ctx.drawImage(img, 125, 380, 950, 950);
                ctx.fillStyle = "#1e293b";
                ctx.font = "bold 65px Montserrat, sans-serif";
                ctx.fillText("¡ESCANÉAME PARA AGENDAR!", canvas.width / 2, 1420);
                ctx.fillStyle = "#64748b";
                ctx.font = "40px Montserrat, sans-serif";
                const urlSimplificada = `vantifypro.co/landing?token=${token.substring(0, 12)}...`;
                ctx.fillText(urlSimplificada, canvas.width / 2, 1510);
                // ---------------------------------
    
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    const file = new File([blob], `QR-${nombreComercio}.png`, { type: "image/png" });
    
                    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({
                                files: [file],
                                title: `QR de ${nombreComercio}`,
                                text: `Escanea nuestro código para agendar tu cita en ${nombreComercio}.`,
                            });
                        } catch (e) { fallbackCopy(); }
                    } else {
                        fallbackDownloadAndCopy(blob);
                    }
                }, "image/png");
            };
    
            img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
        } catch (error) {
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
    
        if (!formReserva.data.cliente_nombre) {
            alert("Por favor, selecciona un cliente o crea uno.");
            return;
        }
    
        // ACTIVAMOS EL BLOQUEO
        setBloqueoReverb(true);
    
        formReserva.post(route('adcitas.store'), {
            onSuccess: () => {
                const modalElement = document.getElementById('modalReserva');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) modalInstance.hide();
                    
                    setTimeout(() => {
                        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                        document.body.classList.remove('modal-open');
                    }, 100);
                }
                formReserva.reset();
                
                // QUITAMOS EL BLOQUEO después de un segundo para dar tiempo a Reverb
                setTimeout(() => setBloqueoReverb(false), 1000);
            },
            onError: () => {
                setBloqueoReverb(false); // Si hay error, liberamos el bloqueo
            },
            onFinish: () => {
                 // Por si acaso, asegurar que se desbloquee
                 setTimeout(() => setBloqueoReverb(false), 2000);
            }
        });
    };
    
    const submitReservass = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica antes de enviar
        if (!formReserva.data.cliente_nombre) {
            alert("Por favor, selecciona un cliente o crea uno.");
            return;
        }
    
        formReserva.post(route('adcitas.store'), {
            onSuccess: () => {
                // CERRAR MODAL PRIMERO
                const modalElement = document.getElementById('modalReserva');
                if (modalElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) modalInstance.hide();
                    
                    // Limpieza forzada de Bootstrap
                    setTimeout(() => {
                        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                        document.body.classList.remove('modal-open');
                        document.body.style.overflow = '';
                    }, 100);
                }
                // 3. Resetear el formulario
                formReserva.reset();
                
            },
            forceFormData: true,
            onError: (errors) => {
                console.error("Errores al validar la cita:", errors);
            }
        });
    };

    const submitReservas = () => {
        // Validación básica antes de enviar
        if (!formReserva.data.cliente_nombre) {
            alert("Por favor, selecciona un cliente o crea uno.");
            return;
        }
        formReserva.post(route('adcitas.store'), {
            onSuccess: () => {
                // 1. Obtener el elemento del modal por su ID
                const modalElement = document.getElementById('modalReserva');
                
                if (modalElement) {
                    // 2. Intentar cerrarlo mediante la instancia de Bootstrap
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
    
                    // 3. ¡EL TRUCO FINAL! Forzar la limpieza del fondo oscuro (backdrop)
                    // A veces Bootstrap no lo quita si el DOM cambia muy rápido
                    setTimeout(() => {
                        const backdrop = document.querySelector('.modal-backdrop');
                        if (backdrop) {
                            backdrop.remove(); // Elimina el div gris
                        }
                        document.body.classList.remove('modal-open'); // Permite hacer scroll de nuevo
                        document.body.style.overflow = '';
                        document.body.style.paddingRight = '';
                    }, 100);
                }
    
                // 4. Resetear el formulario para la próxima cita
                formReserva.reset();
                
                // Opcional: Mostrar un mensaje extra
                //toast.success('Cita confirmada correctamente');
            },
            onError: (errors) => {
                console.error("Error al guardar:", errors);
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
    const [busquedaCita, setBusquedaCita] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const citasPorPagina = 3; // Puedes cambiar este número según prefieras

    // 1. Primero filtramos por fecha, búsqueda y estado "No Pagado"
    const citasFiltradas = citas.filter((cita: any) => {
        const matchFecha = cita.fecha === hoyString;
        const nombreCompleto = `${cita.nombres} ${cita.apellidos}`.toLowerCase();
        const matchBusqueda = nombreCompleto.includes(busquedaCita.toLowerCase()) || cita.identificacion.includes(busquedaCita);
        
        // Filtro de estado: Solo mostramos lo que NO esté pagado
        const noEstaPagada = cita.estado_codigo?.toUpperCase() !== 'AS';

        return matchFecha && matchBusqueda && noEstaPagada;
    });

    // 2. Ordenamos la lista filtrada
    const citasOrdenadas = [...citasFiltradas].sort((a, b) => {
        // 1. Si una es la "nuevaCitaId", va de primero
        if (a.id === citaResaltadaId) return -1;
        if (b.id === citaResaltadaId) return 1;
        a.horainicio.localeCompare(b.horainicio)
        // 2. Por defecto, podrías ordenar por ID descendente (la última creada)
        return b.id - a.id; 
    });
    //const citasOrdenadas = [...citasFiltradas].sort((a: any, b: any) => a.horainicio.localeCompare(b.horainicio));

    // 3. Aplicamos la paginación sobre los resultados ya filtrados y ordenados
    const totalPaginas = Math.ceil(citasOrdenadas.length / citasPorPagina);
    const indiceUltimo = paginaActual * citasPorPagina;
    const indicePrimer = indiceUltimo - citasPorPagina;

    // Esta es la lista final que recorrerás en el .map()
    const citasVisibles = citasOrdenadas.slice(indicePrimer, indiceUltimo);
    
    const handleFacturar = (id: number) => {
        router.visit(route('ftfacturas.create',{ cita: id }));
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

    // Cálculo de progreso para la barra (máximo 100)
    const metaQ2 = 90;
    const porcentajeProgreso = (tasaRetencion / metaQ2) * 100;

    // Estados para paginación
    const [paginaActualFt, setPaginaActualFt] = useState(1);
    const itemsPorPaginaFt = 3; // Puedes cambiar este número

    // Cálculos de índices
    const indiceUltimoItemFt = paginaActualFt * itemsPorPaginaFt;
    const indicePrimerItemFt = indiceUltimoItemFt - itemsPorPaginaFt;
    const facturasPaginadas = facturas.slice(indicePrimerItemFt, indiceUltimoItemFt);
    const totalPaginasFt = Math.ceil(facturas.length / itemsPorPaginaFt);

    // Cambiar de página
    const cambiarPagina = (numeroPagina: number) => setPaginaActualFt(numeroPagina);
    // 1. Definir la función de manejo
    const handleGenerarCupones = () => {
        // Usamos Swal (SweetAlert2) para darle un toque premium si lo tienes instalado, 
        // sino puedes usar un confirm normal de JS.
        if (confirm('¿Deseas generar cupones de regalo para todos los cumpleañeros de hoy?')) {
            router.post(route('cfcupones.generar-cupones-masivos'), {fecha: hoyString, categoria:'cumple'}, {
                preserveScroll: true,
                onSuccess: () => {
                    // Opcional: Alguna notificación de éxito
                    console.log("Cupones creados");
                },
            });
        }
    };



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
                                    {/*<p className="text-muted mb-3 small">
                                        Tu comercio ha crecido un <span className="text-success fw-bold">15% más</span> esta semana.
                                    </p>*/}

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

            <div className="row g-4 mb-4 d-flex align-items-stretch">
                {/* IZQUIERDA: Contenedor de los 3 KPIs */}
                <div className="col-lg-8">
                    <div className="row g-3 h-100">
                        {stats.map((item, i) => (
                            <div className="col-12 col-md-4" key={i}>
                                <div 
                                    className="shadow-sm h-100 bg-white border-0 d-flex flex-column" 
                                    style={{ 
                                        borderRadius: '16px', 
                                        transition: 'transform 0.2s',
                                        cursor: 'default'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{ height: '4px', width: '100px', backgroundColor: item.color, borderRadius: '10px', margin: '20px 0 0 24px' }}></div>
                                    
                                    <div className="p-4 pt-3 d-flex flex-column justify-content-between flex-grow-1">
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center justify-content-center rounded-3" 
                                                style={{ width: '52px', height: '52px', backgroundColor: `${item.color}15`, color: item.color }}>
                                                <i className={`ti ${item.icon}`} style={{ fontSize: '24px' }}></i>
                                            </div>
                                            <div className={`badge rounded-pill ${item.growth.startsWith('+') ? 'bg-light-success text-success' : 'bg-light-danger text-danger'}`}
                                                style={{ fontSize: '11px', fontWeight: '700' }}>
                                                {item.growth}
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column mt-auto">
                                            <span className="text-muted fw-semibold text-uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                                                {item.label}
                                            </span>
                                            <h2 className="fw-bold mb-0" style={{ fontSize: '26px', color: '#1e293b', letterSpacing: '-0.5px' }}>
                                                {item.val}
                                            </h2>
                                            <p className={`badge rounded-pill ${item.growth.startsWith('+') ? 'bg-light-success text-success' : 'bg-light-danger text-danger'}`} style={{ fontSize: '11px' }}>
                                            <i className={`ti ${item.growth.startsWith('+') ? 'ti-trending-up' : 'ti-trending-down'} me-1`}></i>
                                                <span className="fw-bold">{item.description}</span> 
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DERECHA: Tarjeta Bancaria de Ingresos */}
                <div className="col-lg-4">
                    <div className="shadow-lg h-100 position-relative overflow-hidden d-flex flex-column" 
                        style={{ 
                            borderRadius: '16px', 
                            background: 'linear-gradient(135deg, #051937 0%, #004d7a 100%)',
                            border: 'none'
                        }}>
                        
                        {/* Círculos decorativos */}
                        <div className="position-absolute" style={{ right: '10%', top: '10%', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', zIndex: 0 }}></div>
                        <div className="position-absolute" style={{ right: '4%', top: '20%', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,193,7,0.1)', zIndex: 0 }}></div>
                            
                        <div className="p-4 d-flex flex-column justify-content-between flex-grow-1 position-relative" style={{ zIndex: 1 }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div className="d-flex flex-column">
                                    <span className="text-warning fw-bold text-uppercase" style={{ fontSize: '9px', letterSpacing: '1.5px' }}>
                                        Tarjeta de ingresos en vivo
                                    </span>
                                    <small className="text-white-50" style={{ fontSize: '10px' }}>TOTAL INGRESOS MES</small>
                                </div>
                                <div className="text-white-50 opacity-50">
                                    <i className="ti ti-wifi-2 rotate-90" style={{ fontSize: '18px' }}></i>
                                </div>
                            </div>
                            
                            <div className="my-3">
                                <h2 className="fw-bold text-white mb-0" style={{ fontSize: '28px', fontFamily: "'Courier New', Courier, monospace" }}>
                                    ${(Number(ingresosMes) || 0).toLocaleString('es-CO')}
                                </h2>
                                <div className="d-flex align-items-center mt-1">
                                    <span className="text-white-50 me-1" style={{ fontSize: '9px' }}>VÁLIDO HASTA:</span>
                                    <span className="text-white" style={{ fontSize: '11px' }}>{new Date().toLocaleDateString('es-CO', { month: '2-digit', year: '2-digit' })}</span>
                                </div>
                            </div>

                            <div className="d-flex justify-content-between align-items-end mt-auto">
                                <div className="d-flex flex-column text-start">
                                    <span className="text-white-50" style={{ fontSize: '8px' }}>TARJETERO</span>
                                    <span className="text-white fw-medium" style={{ fontSize: '12px', textTransform: 'uppercase' }}>
                                        {comercio.nombre?.substring(0, 15) || 'MI COMERCIO'}
                                    </span>
                                </div>
                                
                                <div className={`badge rounded-pill py-2 px-3 ${calcularGrowth(ingresosMes, ingresosMesAnterior).startsWith('+') ? 'bg-light-success text-success' : 'bg-light-danger text-danger'}`} 
                                    style={{ fontSize: '10px', backdropFilter: 'blur(4px)' }}>
                                    <i className={`ti ${calcularGrowth(ingresosMes, ingresosMesAnterior).startsWith('+') ? 'ti-trending-up' : 'ti-trending-down'} me-1`}></i>
                                    {calcularGrowth(ingresosMes, ingresosMesAnterior)}
                                    <span className="ms-1 opacity-75">vs mes anterior</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 3. AGENDA PROXIMA Y CUMPLEAÑOS Y ANALYTICS --- */}
            {/* Agenda Próxima */}
            <div className="row g-4 mb-4">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        {/* HEADER CON BUSCADOR */}
                        <div className="card-header bg-transparent border-0 pt-1 px-4">
                            <div className="d-flex justify-content-between align-items-center flex-wrap g-3">
                                <h6 className="fw-bold mb-0">Agenda Próxima</h6>
                                <span className="badge bg-light-primary text-primary px-3">Hoy</span>
                            </div>
                        </div>
                        <div className="card-header bg-transparent border-0 pt-1 px-4">
                            <div className="d-flex align-items-left bg-light rounded-pill px-3 py-1" style={{ width: '250px' }}>
                                <i className="ti ti-search text-muted me-2"></i>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm border-0 bg-transparent p-0" 
                                    placeholder="Buscar cliente..."
                                    value={busquedaCita}
                                    onChange={(e) => setBusquedaCita(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light small text-uppercase">
                                    <tr>
                                        <th className="ps-4" style={{ fontSize: '10px' }}>CLIENTE</th>
                                        <th className="text-center pe-4" style={{ fontSize: '10px' }}>SERVICIO / ESPECIALISTA</th>
                                        <th className="text-center pe-4" style={{ fontSize: '10px' }}>DETALLE / TOTAL</th>
                                        <th className="text-center pe-4" style={{ fontSize: '10px' }}>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className="small">
                                    {citasVisibles.map((cita: any) => {
                                            // Aquí ya no necesitas el .filter() ni el .sort()
                                            // Solo la lógica de cálculos de totales y el renderizado del <tr>
                                            const totalServicios = cita.detalle_con_empleadoservicio?.reduce(
                                                (acc: number, item: any) => acc + Number(item.preciofinal || 0), 0
                                            ) || 0;
                                           
                                            const totalProductos = cita.detalle_con_producto?.reduce(
                                                (acc: number, item: any) => acc + Number(item.preciofinal || 0), 0
                                            ) || 0;
                                            const totalGeneral = totalServicios + totalProductos;

                                            const esInactiva = ['RE', 'CA'].includes(cita.estado_codigo?.toUpperCase());
                                            const esPagada = ['AS'].includes(cita.estado_codigo?.toUpperCase());
                                            const esReciente = cita.id === citaResaltadaId;
                                            return (
                                                <tr 
                                                    key={cita.id} 
                                                    className={`
                                                        ${esInactiva ? 'opacity-75 bg-light' : ''} 
                                                        ${esReciente ? 'animate__animated animate__fadeIn' : ''} 
                                                    `}
                                                    style={{
                                                        transition: 'all 0.8s ease', // Transición suave para cuando desaparezca el efecto
                                                        // Color de fondo muy suave (Azul tipo seda o Verde menta suave)
                                                        backgroundColor: esReciente ? '#f0f7ff' : (esInactiva ? '#f8f9fa' : 'transparent'),
                                                        // Un borde lateral más discreto
                                                        borderLeft: esReciente ? '3px solid #7dd3fc' : '3px solid transparent'
                                                    }}
                                                >
                                                    <td className="ps-4">
                                                        {esReciente && (
                                                            <span 
                                                                className="badge rounded-pill mb-1 animate__animated animate__pulse animate__infinite" 
                                                                style={{ 
                                                                    fontSize: '8px', 
                                                                    backgroundColor: '#e0f2fe', // Fondo celeste pastel
                                                                    color: '#0369a1',           // Texto azul profundo
                                                                    border: '1px solid #bae6fd'
                                                                }}
                                                            >
                                                                ¡NUEVA CITA!
                                                            </span>
                                                        )}
                                                        <div className="d-flex align-items-center">
                                                            <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-2 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                                        {cita.round || 'E'}
                                                                    </div>
                                                            <div>
                                                                <span className="fw-bold text-primary">#{cita.codigo}</span>
                                                                <div className="fw-bold text-dark">
                                                                    <Link href={route('adclientes.show', cita.cliente_id)} className="text-dark">
                                                                        <h6 className="mb-1">{cita.nombres} {cita.apellidos}</h6>
                                                                    </Link>
                                                                </div>
                                                                <div className="text-muted" style={{fontSize: '10px'}}>{cita.identificacion}</div>
                                                                <span 
                                                                    className={`badge bg-light-${cita.estado_observacion} text-${cita.estado_observacion}`} 
                                                                    style={{  minWidth: '90px',  padding: '5px 10px', borderRadius: '4px', fontWeight: '600',textTransform: 'capitalize'}}>
                                                                    {cita.estado_nombre}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-left pe-4">
                                                        {cita.detalle_con_empleadoservicio?.map((detalle: any) => (
                                                            
                                                            <div key={detalle.id} className="d-flex align-items-center">
                                                                <div className="bg-light-primary rounded p-2 me-2">
                                                                    <i className="ti ti-clipboard-list text-primary"></i>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-semibold">{detalle.empleadoservicio.servicio.nombre || 'Servicio N/A'}</div>
                                                                    <span className="badge bg-light text-dark border fw-normal">
                                                                        <i className="ti ti-clock me-1 text-primary"></i>
                                                                        {cita.horainicio.substring(0, 5)} - {cita.horafinal.substring(0, 5)}
                                                                    </span>
                                                                    
                                                                </div>
                                                                <br></br>
                                                                <div key={detalle.id} className="d-flex align-items-left mb-1\">
                                                                    {/* Avatar pequeño opcional */}
                                                                    <div className="avatar avatar-sm bg-light-primary text-primary rounded-circle me-2 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                                                                        {detalle.empleadoservicio.empleado.persona.personasnaturales.nombres?.charAt(0) || 'E'}
                                                                    </div>
                                                                    
                                                                    {/* Nombre del Empleado */}
                                                                    <div className="d-flex flex-column">
                                                                        <span className="fw-semibold text-dark">
                                                                        {detalle.empleadoservicio?.empleado?.persona 
                                                                                ? `${detalle.empleadoservicio.empleado.persona.personasnaturales.nombres} ${detalle.empleadoservicio.empleado.persona.personasnaturales.apellidos}`
                                                                                : 'Empleado no encontrado'}
                                                                        </span>
                                                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                                            {detalle.empleadoservicio.empleado.persona.identificacion || 'ID N/A'}
                                                                        </small>
                                                                    </div>
                                                                    
                                                                </div>
                                                            </div>
                                                            
                                                        ))}
                                                    </td>
                                                    <td className="text-center" title={`Servicios: $${totalServicios} | Productos: $${totalProductos}`}>
                                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            {`Servicios: $${totalServicios}`}
                                                        </small>
                                                        <br/>
                                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            {`Adicionales: $${totalProductos}`}
                                                        </small>
                                                        <br/>
                                                        <span className="fw-bold text-success">Total: ${totalGeneral.toLocaleString()}</span>
                                                    </td>
                                                    
                                                    {/* BOTONES DE ACCIÓN */}
                                                    <td className="text-end pe-4">
                                                        <div className="btn-group shadow-sm" style={{ borderRadius: '6px' }}>
                                                            
                                                        {/* BOTÓN ESTADO: Si está pagada, podrías poner un icono de check */}
                                                        <button 
                                                                type="button"
                                                                onClick={() => setCitaDetalle(cita)}
                                                                className={`btn btn-outline-${cita.estado_observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                                style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, fontSize: '0.75rem', fontWeight: 600 }}
                                                                disabled={esInactiva || esPagada}
                                                            >
                                                                <i className="ti ti-list-search fs-5"></i>
                                                            </button>
                                                            
                                                            <button 
                                                                type="button" 
                                                                className={`btn btn-outline-${cita.estado_observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                                style={{ borderRadius: 0, borderLeft: 'none' }}
                                                                onClick={() => handleFacturar(cita.id)}
                                                                disabled={esInactiva || esPagada} 
                                                            >
                                                                <i className="ti ti-coin fs-5"></i>
                                                            </button>

                                                            {/* SI YA ESTÁ PAGADA: Mostrar Ir a Factura */}
                                                            {esPagada ? (
                                                                <button 
                                                                    className="dropdown-item d-flex align-items-center py-2 px-3 text-info"
                                                                    onClick={() => window.open(route('facturas.show', cita.factura_id), '_blank')}
                                                                >
                                                                    <i className="ti ti-file-invoice fs-5"></i>
                                                                </button>
                                                            ) : (
                                                                /* SI NO ESTÁ PAGADA NI CANCELADA: Mostrar Facturar y Cancelar */
                                                                !esInactiva && (  
                                                                    <button 
                                                                        className={`btn btn-outline-${cita.estado_observacion} btn-sm px-3 d-flex align-items-center gap-2`}
                                                                        onClick={() => {setCitaCancelar(cita)}}
                                                                    >
                                                                        <i className="ti ti-ban fs-5"></i>
                                                                    </button>
                                                                )
                                                            )}
                                                        </div>
                                                    </td>
                                                    
                                                </tr>
                                            );
                                        })}
                                       
                                        {/* Opcional: Mostrar mensaje si no hay resultados */}
                                        {citasVisibles.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-muted">
                                                    No hay citas pendientes para mostrar.
                                                </td>
                                            </tr>
                                        )}
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer bg-transparent border-0 pb-4 px-4">
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                    Mostrando {citasVisibles.length} de {citasFiltradas.length} citas
                                </small>
                                
                                {totalPaginas > 1 && (
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0 gap-1">
                                            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link rounded border-0 shadow-none bg-light" 
                                                        onClick={() => setPaginaActual(paginaActual - 1)}>
                                                    <i className="ti ti-chevron-left"></i>
                                                </button>
                                            </li>
                                            
                                            {[...Array(totalPaginas)].map((_, i) => (
                                                <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                                                    <button 
                                                        className={`page-link rounded border-0 shadow-none ${paginaActual === i + 1 ? 'bg-primary' : 'bg-light text-dark'}`}
                                                        onClick={() => setPaginaActual(i + 1)}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}

                                            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                                <button className="page-link rounded border-0 shadow-none bg-light" 
                                                        onClick={() => setPaginaActual(paginaActual + 1)}>
                                                    <i className="ti ti-chevron-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cumpleaños */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '15px' }}>
                        <div style={{ height: '4px', background: '#FFC107' }}></div>
                        
                        <div className="card-body p-4 d-flex flex-column" style={{ maxHeight: '600px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
                                <div>
                                    <h6 className="fw-bold mb-0">Cumpleaños Hoy</h6>
                                    <small className="text-muted">
                                        {cumpleanosHoy.length} {cumpleanosHoy.length === 1 ? 'cliente cumple' : 'clientes cumplen'} años
                                    </small>
                                </div>
                                <div className="avtar avtar-m bg-warning text-white shadow-sm rounded-circle">
                                    <i className="ti ti-cake fs-3"></i>
                                </div>
                            </div>

                            {/* LISTA DINÁMICA */}
                            <div className="flex-grow-1 pe-2" style={{ 
                                overflowY: 'auto', 
                                maxHeight: '350px', 
                                scrollbarWidth: 'thin'
                            }}>
                                {cumpleanosHoy.length > 0 ? (
                                    cumpleanosHoy.map((cliente: any, idx: number) => {
                                        const isUsado = cliente.cupon_estado === 0; // Supongamos 1 = CANJEADO / USADO
                                        const tieneCupon = !!cliente.cupon;
                                        return(
                                        
                                        <div key={cliente.id} className="p-3 mb-2 rounded-3 bg-light transition-all" 
                                            style={{ 
                                                border: isUsado ? '1.5px solid #ef4444' : (tieneCupon ? '1.5px solid #FFC107' : '1px solid rgba(0,0,0,0.05)'),
                                                opacity: isUsado ? 0.8 : 1 
                                            }}>        
                                            
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <div className="position-relative">
                                                        {cliente.foto ? (
                                                            <img src={cliente.foto} className="rounded-circle me-3" style={{width: '45px', height: '45px', objectFit: 'cover'}} />
                                                        ) : (
                                                            <div className={`avtar avtar-m bg-${colors[idx % colors.length]} text-white rounded-circle fw-bold me-3 shadow-sm`}>
                                                                {cliente.iniciales}
                                                            </div>
                                                        )}
                                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark border border-white" 
                                                            style={{ fontSize: '10px', marginLeft: '-15px' }}>
                                                            {cliente.edad_que_cumple}
                                                        </span>
                                                    </div>

                                                    <div className="ms-2">
                                                        <h6 className={`mb-0 fw-bold ${isUsado ? 'text-muted text-decoration-line-through' : 'text-dark'}`} style={{ fontSize: '13px' }}>
                                                            {cliente.nombrecompleto}
                                                        </h6>
                                                        <div className={`mb-0 fw-bold ${isUsado ? 'text-muted text-decoration-line-through' : 'text-dark'}`} style={{ fontSize: '13px' }}>
                                                            <span className="text-muted x-small me-2">
                                                                <i className="ti ti-brand-whatsapp text-success me-1"></i>
                                                                {cliente.telefonomovil}
                                                            </span>
                                                            {/* Texto secundario de edad */}
                                                            <span className="badge bg-success-light text-success fw-bold" style={{ fontSize: '9px' }}>
                                                                {cliente.edad_que_cumple} AÑOS 🎂
                                                            </span>
                                                        </div>
                                                        <div className="d-flex align-items-center mt-1 gap-1">
                                                            {isUsado ? (
                                                                <span className="badge bg-light-danger text-danger fw-bold" style={{ fontSize: '10px' }}>
                                                                    <i className="ti ti-circle-x me-1"></i> CUPÓN USADO
                                                                </span>
                                                            ) : tieneCupon ? (
                                                                <div className="d-flex align-items-center">
                                                                    <span className="badge bg-white text-success border border-success fw-bold" style={{ fontSize: '10px' }}>
                                                                        {cliente.cupon}
                                                                    </span>
                                                                    <button 
                                                                        className="btn btn-sm btn-link-primary p-0 ms-1"
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(cliente.cupon);
                                                                            toast.success(`Copiado: ${cliente.cupon}`);
                                                                        }}
                                                                    >
                                                                        <i className="ti ti-copy"></i>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-muted italic" style={{ fontSize: '10px' }}>Sin cupón generado</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Botón WhatsApp: Oculto o deshabilitado si ya se usó el cupón */}
                                                {!isUsado && (
                                                    <a href={`https://wa.me/${cliente.telefonomovil?.replace(/\D/g, '')}?text=${
                                                            tieneCupon 
                                                            ? `¡Feliz cumpleaños ${cliente.nombrecompleto}! 🎂 Tu cupón es: *${cliente.cupon}*`
                                                            : `¡Feliz cumpleaños ${cliente.nombrecompleto}! 🎉`
                                                        }`} 
                                                        target="_blank" 
                                                        className={`btn btn-icon btn-sm rounded-circle shadow-sm ${tieneCupon ? 'btn-success' : 'btn-light-success'}`}>
                                                        <i className="ti ti-brand-whatsapp fs-5"></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="ti ti-calendar-off fs-1 text-muted opacity-50"></i>
                                        <p className="text-muted small mt-2">No hay cumpleaños hoy</p>
                                    </div>
                                )}
                            </div>

                            {/* SECCIÓN DE ACCIONES FINAL */}
                            <div className="pt-3 border-top mt-3 flex-shrink-0">
                                {/* Botón 1: Generar masivamente si alguno no tiene cupón */}
                                {cumpleanosHoy.some((c: any) => !c.cupon) && cumpleanosHoy.length > 0 && (
                                    <button 
                                        className="btn btn-outline-warning w-100 fw-bold py-2 rounded-pill mb-2 shadow-sm"
                                        onClick={() => handleGenerarCupones()} // Debes crear esta función en tu controlador
                                    >
                                        <i className="ti ti-ticket me-2"></i> Generar cupones faltantes
                                    </button>
                                )}

                                {/* Botón 2: Enviar Promo (Solo se habilita si todos tienen cupón) */}
                                <button 
                                    className="btn btn-warning w-100 fw-bold py-2 text-white shadow-sm rounded-pill"
                                    disabled={cumpleanosHoy.length === 0 || cumpleanosHoy.some((c: any) => !c.cupon)}
                                    onClick={() => setShowPromoModal(true)}
                                >
                                    <i className="ti ti-mail-forward me-2"></i> 
                                    {cumpleanosHoy.some((c: any) => !c.cupon) && cumpleanosHoy.length > 0 
                                        ? 'Primero genera los cupones' 
                                        : 'Enviar Promo a Todos'}
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 5. HISTORIAL DE TRANSACCIONES --- */}
            <div className="row g-4"> {/* Añadimos g-4 para un gap consistente */}
                {/* COLUMNA IZQUIERDA: Historial de Transacciones Detallado */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-bold mb-0">Historial de Transacciones</h6>
                                <p className="text-muted x-small mb-0">
                                    Mostrando {indicePrimerItemFt + 1} - {Math.min(indiceUltimoItemFt, facturas.length)} de {facturas.length} registros
                                </p>
                            </div>
                            <button className="btn btn-sm btn-light-primary">Ver todo</button>
                        </div>
                        <div className="card-body px-0 pb-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="bg-light text-muted">
                                        <tr className="small text-uppercase">
                                            <th className="ps-4 border-0">Cliente / Origen</th>
                                            <th className="border-0">Fecha</th>
                                            <th className="border-0">Descuentos / Cupones</th>
                                            <th className="border-0">Monto Final</th>
                                            <th className="border-0">Estado</th>
                                            <th className="text-end pe-4 border-0">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="small">
                                        {facturasPaginadas.map((item: any) => {
                                            // Cálculo del porcentaje de descuento si no viene directo del objeto
                                            const subtotal = Number(item.subtotal || item.grand_total);
                                            const descuento = Number(item.descuento || 0);
                                            const porcentajeDesc = item.porcentajedescuento || (descuento > 0 ? Math.round((descuento / subtotal) * 100) : 0);

                                            return (
                                                <tr key={item.id}>
                                                    <td className="ps-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="avtar avtar-xs bg-light-primary text-primary rounded-circle me-2 fw-bold" style={{width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                {item.round || item.nombres?.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="fw-bold text-dark">
                                                                    {item.nombres} {item.apellidos}
                                                                </div>
                                                                <div className="x-small text-muted">
                                                                    {item.identificacion}
                                                                </div>
                                                                <div className="">
                                                                    <span className="badge bg-light-secondary text-dark border-0 me-1">#{item.numero}</span>
                                                                    {item.model_type === 921 ? '📅 Cita' : '🛒 Venta'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted">
                                                        {new Date(item.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}<br/>
                                                        <span className="x-small">{new Date(item.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                                    </td>
                                                    
                                                    {/* COLUMNA DE DESCUENTOS Y CUPONES */}
                                                    <td>
                                                        {descuento > 0 ? (
                                                            <div>
                                                                <div className="d-flex align-items-center gap-1 text-danger fw-bold">
                                                                    <i className="ti ti-arrow-down-right"></i>
                                                                    {porcentajeDesc}% OFF
                                                                </div>
                                                                {item.cupon_id && (
                                                                    <div className="x-small text-primary fw-semibold mt-1">
                                                                        <i className="ti ti-ticket me-1"></i>
                                                                        {item.cupon?.codigo || 'Cupón Aplicado'}
                                                                    </div>
                                                                )}
                                                                {!item.cupon_id && (
                                                                    <div className="x-small text-muted mt-1 italic">Dcto. Manual</div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted opacity-50">—</span>
                                                        )}
                                                    </td>

                                                    {/* COLUMNA DE MONTO CON SUBOTOTAL */}
                                                    <td>
                                                        {descuento > 0 && (
                                                            <div className="text-muted x-small text-decoration-line-through">
                                                                $ {subtotal.toLocaleString('es-CO')}
                                                            </div>
                                                        )}
                                                        <div className="fw-bold text-dark fs-6">
                                                            $ {Number(item.grand_total || item.total).toLocaleString('es-CO')}
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <span className={`badge bg-light-${item.estado?.observacion || 'success'} text-${item.estado?.observacion || 'success'} border border-${item.estado?.observacion || 'success'} border-opacity-10`}>
                                                            {item.estado?.nombre}
                                                        </span>
                                                    </td>
                                                    <td className="text-end pe-4">
                                                        <div className="d-flex justify-content-end gap-1">
                                                            <button 
                                                                className="btn btn-sm btn-icon btn-link-secondary border-0" 
                                                                title="Ver detalle"
                                                                onClick={() => {
                                                                    router.visit(route('ftfacturas.show', item.id))
                                                                }}
                                                            >
                                                                <i className="ti ti-eye fs-5"></i>
                                                            </button>

                                                            <button 
                                                                className="btn btn-sm btn-icon btn-link-secondary border-0" 
                                                                title="Imprimir Recibo"
                                                                onClick={() => {
                                                                    window.print()
                                                                }}
                                                            >
                                                                <i className="ti ti-printer fs-5"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        {/* PIE DE TABLA: CONTROLES DE PAGINACIÓN */}
                        <div className="card-footer bg-transparent border-0 px-4 py-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="small text-muted">
                                    Página <strong>{paginaActualFt}</strong> de <strong>{totalPaginasFt}</strong>
                                </div>
                                <nav>
                                    <ul className="pagination pagination-sm mb-0 gap-1">
                                        <li className={`page-item ${paginaActualFt === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link rounded border-0 shadow-none" onClick={() => cambiarPagina(paginaActualFt - 1)}>
                                                <i className="ti ti-chevron-left"></i>
                                            </button>
                                        </li>
                                        
                                        {/* Generar números de página */}
                                        {[...Array(totalPaginasFt)].map((_, i) => (
                                            <li key={i} className={`page-item ${paginaActualFt === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link rounded border-0 shadow-none px-3" onClick={() => cambiarPagina(i + 1)}>
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}

                                        <li className={`page-item ${paginaActualFt === totalPaginasFt ? 'disabled' : ''}`}>
                                            <button className="page-link rounded border-0 shadow-none" onClick={() => cambiarPagina(paginaActualFt + 1)}>
                                                <i className="ti ti-chevron-right"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Más delgada y estilizada (4 o 5) */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-lg h-100 text-white" 
                        style={{ 
                            background: 'linear-gradient(135deg, #051937 0%, #004d7a 100%)',
                            borderRadius: '24px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            overflow: 'hidden'
                        }}>
                        <div className="card-body d-flex flex-column justify-content-between p-4">
                            
                            {/* PARTE SUPERIOR: Header con Acento Cian */}
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div className="avtar avtar-m rounded-circle d-flex align-items-center justify-content-center" 
                                        style={{ 
                                            background: 'rgba(36, 210, 219, 0.15)', 
                                            color: '#24D2DB',
                                            width: '50px',
                                            height: '50px',
                                            border: '1px solid rgba(36, 210, 219, 0.3)',
                                            boxShadow: '0 0 15px rgba(36, 210, 219, 0.2)'
                                        }}>
                                        <i className="ti ti-users fs-3"></i>
                                    </div>
                                    {/* Badge con efecto Neón */}
                                    <span className="badge rounded-pill px-3 py-2 fw-bold" 
                                        style={{ 
                                            backgroundColor: 'rgba(36, 210, 219, 0.1)', 
                                            color: '#24D2DB',
                                            fontSize: '11px',
                                            border: '1px solid rgba(36, 210, 219, 0.2)'
                                        }}>
                                        <i className="ti ti-arrow-up-right me-1"></i> +{clientesHoy} hoy
                                    </span>
                                </div>

                                <h6 className="text-white-50 small mb-1 text-uppercase fw-extrabold" style={{ letterSpacing: '1.5px' }}>
                                    Comunidad Total
                                </h6>
                                
                                {/* El número principal en blanco puro para máximo contraste */}
                                <h2 className="fw-extrabold mb-2 text-white" style={{ fontSize: '42px', letterSpacing: '-1.5px' }}>
                                    {totalClientes.toLocaleString()}
                                </h2>
                                
                                <div className="d-flex align-items-center mt-2">
                                    <div className="d-flex me-2">
                                        {[1, 2, 3].map((_, i) => (
                                            <div key={i} className="rounded-circle border border-2 border-dark" 
                                                style={{ 
                                                    width: '22px', height: '22px', 
                                                    background: '#24D2DB', 
                                                    marginLeft: i === 0 ? 0 : '-10px',
                                                    boxShadow: '0 0 10px rgba(36, 210, 219, 0.3)'
                                                }}></div>
                                        ))}
                                    </div>
                                    <p className="text-white-50 small mb-0 fw-medium">
                                        <span style={{ color: '#24D2DB', fontWeight: 'bold' }}>Crecimiento constante</span>
                                    </p>
                                </div>
                            </div>

                            {/* PARTE INFERIOR: Métricas de Retención con Glow */}
                            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="d-flex justify-content-between align-items-end mb-3">
                                    <div>
                                        <span className="d-block text-white-50 text-uppercase fw-bold mb-1" style={{ fontSize: '10px', letterSpacing: '1px' }}>
                                            Tasa de Fidelización
                                        </span>
                                        <div className="d-flex align-items-baseline">
                                            <span className="fs-3 fw-extrabold text-white">{tasaRetencion}%</span>
                                            <span className="ms-2 small text-white-50">/ {metaQ2}%</span>
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="p-2 rounded-circle bg-white bg-opacity-10">
                                            <i className="ti ti-chart-pie text-cyan" style={{ color: '#24D2DB' }}></i>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Barra de Progreso Cian Eléctrico */}
                                <div className="progress shadow-none" style={{ height: '8px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                    <div 
                                        className="progress-bar" 
                                        style={{ 
                                            width: `${tasaRetencion}%`,
                                            background: 'linear-gradient(90deg, #24D2DB 0%, #00acc1 100%)',
                                            borderRadius: '20px',
                                            boxShadow: '0 0 15px rgba(36, 210, 219, 0.5)', // El brillo de la barra
                                            transition: 'width 1.5s cubic-bezier(0.65, 0, 0.35, 1)'
                                        }}
                                    ></div>
                                </div>
                                
                                {/* Mensaje de Meta estilo Glass */}
                                <div className="mt-4 p-3 rounded-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="d-flex align-items-center">
                                        <i className="ti ti-sparkles me-2" style={{ color: '#24D2DB' }}></i>
                                        <p className="x-small mb-0 fw-bold text-white-50">
                                            {tasaRetencion >= metaQ2 
                                                ? "¡Meta trimestral superada!" 
                                                : "A " + (metaQ2 - tasaRetencion).toFixed(1) + "% de la meta del Q2"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            
            {/* --- MODAL PARA EL QR --- */}
            <div className="modal fade" id="qrModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '25px' }}>
                        <div className="modal-header border-0 pb-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        <div className="modal-body text-center pt-0 pb-4">
                            <h4 className="fw-800 text-dark mb-4">Tu Código QR</h4>

                            {/* VISTA PREVIA ESTILO TARJETA FÍSICA */}
                            <div className="d-flex justify-content-center mb-4">
                                <div 
                                    className="qr-card-preview shadow-sm overflow-hidden"
                                    style={{ 
                                        width: '280px', 
                                        borderRadius: '24px', 
                                        backgroundColor: '#fff',
                                        border: '1px solid #f1f5f9',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Cabecera Azul */}
                                    <div className="bg-primary p-3 text-center">
                                        <div className="text-white fw-800 text-uppercase" style={{ fontSize: '13px', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {comercio?.nombre}
                                        </div>
                                    </div>

                                    {/* Contenedor del QR Real (Este es el que usa qrRef) */}
                                    <div ref={qrRef} className="p-4 d-flex justify-content-center bg-white">
                                        <QRCodeSVG
                                            value={shopUrl}
                                            size={180}
                                            level="H"
                                        />
                                    </div>

                                    {/* Footer de la tarjeta */}
                                    <div className="text-center pb-4 px-3">
                                        <div className="fw-800 text-dark mb-1" style={{ fontSize: '11px' }}>¡ESCANÉAME PARA AGENDAR!</div>
                                        <div className="text-muted fw-bold" style={{ fontSize: '9px', opacity: 0.7 }}>
                                            vantifypro.co/...{token.substring(0, 8)}
                                        </div>
                                    </div>
                                    
                                    {/* Detalle decorativo lateral */}
                                    <div style={{ position: 'absolute', bottom: '0', right: '0', width: '30px', height: '30px', background: 'rgba(0,149,255,0.05)', borderRadius: '100% 0 0 0' }}></div>
                                </div>
                            </div>

                            <p className="text-muted small px-4 mb-4">
                                Descarga esta tarjeta para imprimirla o compártela directamente en tus redes sociales.
                            </p>
                            
                            {/* BOTONES DE ACCIÓN */}
                            <div className="d-grid gap-2 px-4">
                                <button onClick={shareQR} className="btn btn-primary py-3 rounded-pill fw-bold shadow-blue border-0 d-flex align-items-center justify-content-center">
                                    <i className="ti ti-share me-2 fs-5"></i> Compartir con Clientes
                                </button>
                                <button onClick={downloadQR} className="btn btn-outline-light text-dark py-3 rounded-pill fw-bold border-2 d-flex align-items-center justify-content-center">
                                    <i className="ti ti-download me-2 fs-5"></i> Descargar Imagen
                                </button>
                            </div>
                        </div>

                        <div className="modal-footer border-0 bg-light justify-content-center" style={{ borderBottomLeftRadius: '25px', borderBottomRightRadius: '25px' }}>
                            <small className="text-muted fw-bold">Powered by <span className="text-primary">Vantify Pro</span></small>
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .fw-800 { font-weight: 800 !important; }
                .qr-card-preview {
                    transition: transform 0.3s ease;
                }
                .shadow-blue {
                    box-shadow: 0 8px 15px -3px rgba(0, 149, 255, 0.4) !important;
                }
                .btn-outline-light {
                    background: #fff;
                    border-color: #f1f5f9;
                }
                .btn-outline-light:hover {
                    background: #f8fafc;
                    border-color: #e2e8f0;
                }
            `}} />

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
                                                className={`form-control ${formReserva.errors.cliente_identificacion ? 'is-invalid' : ''}`}
                                                placeholder="Identificación del nuevo cliente"
                                                value={formReserva.data.cliente_identificacion || ''}
                                                onChange={e => formReserva.setData('cliente_identificacion', e.target.value)}
                                                required
                                            />
                                            {formReserva.errors.cliente_identificacion && <div className="invalid-feedback" role="alert"><strong>{formReserva.errors.cliente_identificacion}</strong></div>}
                                        </div>
                                    )}

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold small text-muted text-uppercase">Teléfono</label>
                                        <input 
                                            type="tel" 
                                            className={`form-control ${formReserva.errors.cliente_telefono ? 'is-invalid' : ''}`}
                                            value={formReserva.data.cliente_telefono}
                                            onChange={e => formReserva.setData('cliente_telefono', e.target.value)}
                                            placeholder="Ej: 3001234567"
                                            required={!formReserva.data.cliente_id} // Requerido si es nuevo
                                        />
                                         {formReserva.errors.cliente_telefono && <div className="invalid-feedback" role="alert"><strong>{formReserva.errors.cliente_telefono}</strong></div>}
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