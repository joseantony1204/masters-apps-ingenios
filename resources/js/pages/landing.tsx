import AppLandingLayout from '@/layouts/app/app-landing-layout';
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react'

export default function Landing({ comercio, servicios }: any) {
    const [activeStep, setActiveStep] = useState('servicios');
    const [selectedService, setSelectedService] = useState<any>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [selectedHora, setSelectedHora] = useState<any | null>(null);
    // Estados para la Agenda
    const [turnosData, setTurnosData] = useState<any>({}); 
    const [selectedDate, setSelectedDate] = useState('');
    const [activeJornada, setActiveJornada] = useState('Mañana'); 
    const [loadingTurnos, setLoadingTurnos] = useState(false);

    // 1. Extraer categorías únicas para los servicios
    const categorias = useMemo(() => {
        const unique = new Map();
        servicios.forEach((s: any) => {
            if (s.categoria && !unique.has(s.categoria.id)) {
                unique.set(s.categoria.id, s.categoria);
            }
        });
        return Array.from(unique.values());
    }, [servicios]);

    const [activeCat, setActiveCat] = useState(categorias[0]?.id);

    // Mapeo de Iconos
    const stepIcons: any = {
        'servicios': 'ti-scissors',
        'especialistas': 'ti-users',
        'fecha': 'ti-calendar-event'
    };

    const jornadaIcons: any = {
        'Mañana': 'ti-sun',
        'Tarde': 'ti-sunset',
        'Noche': 'ti-moon'
    };

    // Función para obtener el nombre del día correcto (Evita desfase de zona horaria)
    const getDiaSemana = (fechaStr: string) => {
        const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        const fecha = new Date(fechaStr + "T00:00:00");
        return dias[fecha.getDay()];
    };

    // Navegación desde los tabs
    const irAPaso = (paso: string) => {
        if (paso === 'servicios') {
            setActiveStep('servicios');
            setSelectedEmployee(null);
            setSelectedHora(null);
        } else if (paso === 'especialistas' && selectedService) {
            setActiveStep('especialistas');
            setSelectedHora(null);
        }
    };

    const manejarSeleccionEspecialista = async (especialista: any) => {
      setSelectedEmployee(especialista);
      setLoadingTurnos(true);
      setActiveStep('fecha');
      try {
          const url = route('api.disponibilidad.turnos', { 
            token: comercio.token, 
            empleado: especialista.id, 
            servicio: selectedService.id 
          });
          const resp = await axios.get(url);
          setTurnosData(resp.data);
          const fechas = Object.keys(resp.data);
          if (fechas.length > 0) setSelectedDate(fechas[0]);
      } catch (error) {
          console.error("Error cargando turnos", error);
      } finally {
          setLoadingTurnos(false);
      }
    };

    const turnosFiltrados = useMemo(() => {
        if (!turnosData[selectedDate]) return [];
        return turnosData[selectedDate].filter((bloque: any) => {
            const horaNum = parseInt(bloque.hora.split(':')[0]);
            const isPM = bloque.hora.toLowerCase().includes('pm');
            let hora24 = horaNum;
            if (isPM && horaNum !== 12) hora24 += 12;
            if (!isPM && horaNum === 12) hora24 = 0;

            if (activeJornada === 'Mañana') return hora24 < 12;
            if (activeJornada === 'Tarde') return hora24 >= 12 && hora24 < 18;
            return hora24 >= 18;
        });
    }, [selectedDate, activeJornada, turnosData]);

    const [showModal, setShowModal] = useState(false);
    const [identificacion, setIdentificacion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [cliente, setCliente] = useState<any>(null);
    const [nombreNuevo, setNombreNuevo] = useState('');
    const [apellidoNuevo, setApellidoNuevo] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    //const telLimpio = telefono.replace(/\D/g, '');

    const manejarConfirmacionFinal = async () => {
      // Validaciones básicas antes de disparar
      if (!telefono || telefono.length < 7) {
          alert("Por favor, ingresa un número de teléfono válido.");
          return;
      }
      if (!nombreNuevo) {
          alert("Por favor, ingresa tu nombre.");
          return;
      }
  
      setIsChecking(true);
      try {
          const infoTurno = selectedHora?.servicios_que_caben?.[0];
          // PASO 1: Guardar la Cita
          // Usamos los estados que ya tenemos seleccionados en el flujo
          const payloadCita = {
              token: comercio.token,
              cliente_id: cliente,
              identificacion: identificacion,
              otp: otp,
              fecha: selectedDate,
              // Accedemos a las propiedades que necesitas
              servicioasignado_id: infoTurno?.servicioasignado_id,
              horainicio: infoTurno?.horainicio,
              horafinal: infoTurno?.horafinal,
              precio: infoTurno?.precio
          };
  
          const respCita = await axios.post(route('api.citas.store'), payloadCita);
  
          if (respCita.status === 201 || respCita.status === 200) {
            // 2. Cerramos el modal primero para evitar parpadeos visuales
            setShowModal(false);

            // 3. Extraemos el código correctamente según JSON
            const codigoReserva = respCita.data.data.codigo;

            // 4. Redirigimos. 
            // Nota: Si es una página para el usuario final, usa una ruta de 'web' 
            // no de 'api', para que cargue el componente ConfirmacionCita.
            router.visit(route('public.confirmada', { 
              token: comercio.token, 
              codigo: codigoReserva 
            }));
            // Opcional: Reiniciar el flujo
            setActiveStep('servicios');
            setSelectedHora(null);
          }
  
      } catch (error: any) {
          console.error("Error en el proceso:", error);
          const mensaje = error.response?.data?.message || "No se pudo completar la reserva. Intenta de nuevo.";
          alert(mensaje);
      } finally {
          setIsChecking(false);
      }
    };

    const [isRegistered, setIsRegistered] = useState(false);
    const [step, setStep] = useState(1); // 1: Datos, 2: Verificación OTP
    const [otp, setOtp] = useState('');
    const [codigoEnviado, setCodigoEnviado] = useState(false);

    // Esta función ahora solo se dispara cuando el usuario quita el foco del input (onBlur)
    const manejarBusquedaBlur = async () => {
      if (identificacion.length > 5) {
          setIsChecking(true);
          try {
              const resp= await axios.get(route('api.personas.buscar'), {
                params: { term: identificacion }
              });
  
              // La API devuelve un array
              const resultados = resp.data;
  
              if (Array.isArray(resultados) && resultados.length > 0) {
                  // Buscamos el que coincida exactamente con la identificación ingresada
                  const clienteExacto = resultados.find(
                      (c: any) => String(c.identificacion) === String(identificacion)
                  );
  
                  if (clienteExacto) {
                      setNombreNuevo(clienteExacto.nombre);
                      setApellidoNuevo(clienteExacto.apellido || '');
                      setTelefono(clienteExacto.telefonomovil);
                      setIsRegistered(true);
                  } else {
                      // Si hay resultados pero ninguno coincide exacto (ej. búsqueda parcial)
                      setIsRegistered(false);
                  }
              } else {
                  setIsRegistered(false);
                  // Si no hay nada, limpiamos para nuevo registro
                  setNombreNuevo('');
                  setApellidoNuevo('');
                  setTelefono('');
              }
          } catch (e) {
              console.error("Error buscando cliente", e);
              setIsRegistered(false);
          } finally {
              setIsChecking(false);
          }
      }
    };

    // Función para enviar el SMS/WhatsApp de verificación
    const [errores, setErrores] = useState<any>({});
    const enviarVerificacion = async () => {
      setIsChecking(true);
      try {
        // PASO 1: Verificar o Crear el Cliente
          // Enviamos el teléfono y el nombre al backend
          const respCliente = await axios.post(route('api.clientes.verificarcrear'), {
            identificacion: identificacion,
            telefonomovil: telefono,
            nombre: nombreNuevo,
            apellido: apellidoNuevo,
            token: comercio.token,
        });
          setCliente(respCliente.data.id); // Guardamos el ID del cliente para la reserva  
          setStep(2);
        } catch (error: any) { // Cambiamos 'e' por 'error' para mayor claridad
          console.error("Detalle del error:", error);
          // 1. Verificamos si hay respuesta del servidor (Status 422 - Validación)
          if (error.response && error.response.status === 422) {
              const listaErrores = error.response.data.errors;
              setErrores(listaErrores || {});
          } 
          // 2. Verificamos si el error es de red (Sin respuesta del servidor)
          else if (error.request) {
              alert("No se pudo conectar con el servidor. Revisa tu conexión a internet.");
          } 
          // 3. Cualquier otro error (Error de código o configuración)
          else {
              alert("Ocurrió un error inesperado: " + error.message);
          }
      } finally {
          setIsChecking(false);
      }
  };

    const [indicativo, setIndicativo] = useState('+57');
    const [showPaises, setShowPaises] = useState(false);
    const paises = [
        { nombre: 'Argentina', code: '+54', flag: '🇦🇷' },
        { nombre: 'Bolivia', code: '+591', flag: '🇧🇴' },
        { nombre: 'Brasil', code: '+55', flag: '🇧🇷' },
        { nombre: 'Chile', code: '+56', flag: '🇨🇱' },
        { nombre: 'Colombia', code: '+57', flag: '🇨🇴' },
        { nombre: 'Ecuador', code: '+593', flag: '🇪🇨' },
        { nombre: 'Panamá', code: '+507', flag: '🇵🇦' },
        { nombre: 'Perú', code: '+51', flag: '🇵🇪' },
    ];

    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(0);

    // Efecto para manejar la cuenta regresiva
    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const manejarReenvio = async () => {
      if (!canResend) return;
  
      setCanResend(false);
      setTimer(60); // Bloqueamos por 60 segundos
  
      try {
          const telefonoCompleto = `${indicativo}${telefono}`;
          await axios.post(route('api.otp.enviar'), {
              telefonomovil: telefonoCompleto,
              identificacion: identificacion,
          });
          // Opcional: mostrar una notificación de "Código reenviado"
      } catch (error) {
          setCanResend(true);
          setTimer(0);
          alert("Error al reenviar el código.");
      }
    };

    return (
        <AppLandingLayout comercio={comercio}>
            <div className="pb-5 mb-5 px-3">
                
                {/* TABS SUPERIORES CON OPCIÓN DE VOLVER */}
                <div className="tabs-stepper bg-white p-2 mb-4 d-flex shadow-sm rounded-pill border">
                    {['servicios', 'especialistas', 'fecha'].map((step) => {
                        const isAvailable = (step === 'servicios') || (step === 'especialistas' && selectedService) || (step === 'fecha' && selectedEmployee);
                        return (
                            <div key={step} 
                                 onClick={() => isAvailable && irAPaso(step)}
                                 className={`flex-grow-1 text-center py-2 rounded-pill fw-bold d-flex align-items-center justify-content-center ${activeStep === step ? 'bg-primary text-white shadow-sm' : 'text-muted'}`} 
                                 style={{ fontSize: '11px', transition: '0.3s', cursor: isAvailable ? 'pointer' : 'default', opacity: isAvailable ? 1 : 0.6 }}>
                                <i className={`ti ${stepIcons[step]} me-2 fs-5`}></i>
                                {step === 'fecha' ? 'FECHA' : step.toUpperCase()}
                            </div>
                        );
                    })}
                </div>

                {/* PASO 1: SERVICIOS Y CATEGORÍAS */}
                {activeStep === 'servicios' && (
                    <div className="animate__animated animate__fadeIn">
                        {/* Burbujas de Categorías */}
                        <div className="d-flex overflow-auto gap-3 mb-4 pb-2 no-scrollbar">
                            {categorias.map((cat: any) => (
                                <div key={cat.id} onClick={() => setActiveCat(cat.id)} className="text-center" style={{ minWidth: '75px', cursor: 'pointer' }}>
                                    <div 
                                        className={`mb-2 mx-auto d-flex align-items-center justify-content-center rounded-circle border transition-all ${
                                            activeCat === cat.id ? 'bg-primary-subtle border-primary shadow-sm' : 'bg-white'
                                        }`} 
                                        style={{ width: '55px', height: '55px' }}
                                    >
                                        {/* Aquí inyectamos el icono de la base de datos o uno por defecto */}
                                        <i className={`${cat.observacion || 'ti ti-layout-grid'} fs-4 ${
                                            activeCat === cat.id ? 'text-primary' : 'text-muted'
                                        }`}></i>
                                    </div>
                                    <span 
                                        className={`small fw-bold d-block ${activeCat === cat.id ? 'text-primary' : 'text-muted'}`} 
                                        style={{ fontSize: '11px', lineHeight: '1.2' }}
                                    >
                                        {cat.nombre}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '10px', letterSpacing: '1px' }}>Servicios Disponibles</h6>
                        <div className="d-grid gap-3">
                            {servicios.filter((s: any) => s.categoria_id === activeCat).map((service: any) => (
                                <div key={service.id} onClick={() => { setSelectedService(service); setActiveStep('especialistas'); }}
                                    className="p-3 d-flex align-items-center bg-white shadow-sm border rounded-3 transition-all hover-border-primary cursor-pointer">
                                    <div className="me-3 bg-primary-subtle rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                        <i className="ti ti-scissors text-primary fs-4"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-0 text-dark">{service.nombre}</h6>
                                        <small className="text-muted">Múltiples especialistas</small>
                                    </div>
                                    <i className="ti ti-chevron-right text-muted"></i>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PASO 2: ESPECIALISTAS + RESUMEN SERVICIO */}
                {activeStep === 'especialistas' && (
                    <div className="animate__animated animate__fadeInRight">
                        <h6 className="fw-bold mb-2 text-uppercase text-muted" style={{ fontSize: '10px' }}>Tu Selección</h6>
                        <div className="p-3 mb-4 bg-white border rounded-3 d-flex align-items-center shadow-sm">
                            <div className="me-3 bg-primary-subtle rounded-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                                <i className="ti ti-scissors text-primary fs-5"></i>
                            </div>
                            <div className="flex-grow-1">
                                <h6 className="fw-bold mb-0 text-dark">{selectedService?.nombre}</h6>
                                <small className="text-muted">Servicio seleccionado</small>
                            </div>
                            <button onClick={() => setActiveStep('servicios')} className="btn btn-sm btn-light rounded-pill px-3 fw-bold text-primary" style={{ fontSize: '10px' }}>Cambiar</button>
                        </div>

                        <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '10px' }}>Selecciona un Especialista</h6>
                        <div className="d-grid gap-3">
                            {selectedService?.empleados.map((emp: any) => (
                                <div key={emp.id} onClick={() => manejarSeleccionEspecialista(emp)}
                                    className="p-3 bg-white border rounded-3 shadow-sm d-flex align-items-center hover-border-primary transition-all cursor-pointer">
                                    <div className="avatar me-3 bg-light text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle border" style={{ width: '45px', height: '45px' }}>
                                        {emp.nombre.charAt(0)}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="fw-bold mb-0">{emp.nombre}</h6>
                                        <small className="text-muted"><i className="ti ti-clock me-1"></i>{emp.duracion} min</small>
                                    </div>
                                    <div className="text-end">
                                        <div className="fw-bold text-primary">${Number(emp.precio).toLocaleString()}</div>
                                        <span className="text-primary small fw-bold">Elegir</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PASO 3: FECHA + CARD INTEGRADA DE RESUMEN */}
                {activeStep === 'fecha' && (
                    <div className="animate__animated animate__fadeInRight">
                        <h6 className="fw-bold mb-2 text-uppercase text-muted" style={{ fontSize: '10px' }}>Tu Orden</h6>
                        
                        {/* Card Integrada de Resumen */}
                        <div className="bg-white border rounded-3 p-3 mb-4 shadow-sm">
                            <div className="d-flex align-items-center mb-3">
                                <div className="me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ width: '48px', height: '48px' }}>
                                    {selectedEmployee?.nombre.charAt(0)}
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 fs-5">{selectedEmployee?.nombre}</h6>
                                    <p className="text-muted mb-0 small">{selectedService?.nombre}</p>
                                </div>
                            </div>
                            <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center text-muted small">
                                    <i className="ti ti-clock me-1"></i>
                                    <span>{selectedHora ? selectedHora.hora : '--:--'}</span>
                                    <span className="mx-2">•</span>
                                    <i className="ti ti-hourglass me-1"></i>
                                    <span>{selectedEmployee?.duracion} min</span>
                                </div>
                                <div className="fw-bold text-primary fs-5">
                                    ${Number(selectedEmployee?.precio).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '10px' }}>Elige tu fecha</h6>
                        <div className="d-flex overflow-auto gap-2 mb-4 pb-2 no-scrollbar">
                            {Object.keys(turnosData).map((fecha) => (
                                <div key={fecha} onClick={() => setSelectedDate(fecha)}
                                    className={`text-center p-2 rounded-3 border transition-all ${selectedDate === fecha ? 'bg-primary text-white shadow' : 'bg-white text-muted'}`}
                                    style={{ minWidth: '70px', cursor: 'pointer' }}>
                                    <div className="small text-uppercase fw-bold" style={{ fontSize: '10px' }}>{getDiaSemana(fecha)}</div>
                                    <div className="fw-bold fs-4">{fecha.split('-')[2]}</div>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex gap-2 mb-4 bg-light p-1 rounded-3">
                            {['Mañana', 'Tarde', 'Noche'].map((j) => (
                                <button key={j} onClick={() => setActiveJornada(j)}
                                    className={`btn flex-grow-1 fw-bold rounded-3 d-flex align-items-center justify-content-center gap-2 py-2 border-0 ${activeJornada === j ? 'btn-primary shadow-sm' : 'text-muted'}`}
                                    style={{ fontSize: '13px' }}>
                                    <i className={`ti ${jornadaIcons[j]} fs-5`}></i> {j}
                                </button>
                            ))}
                        </div>

                        <h6 className="fw-bold mb-3 text-uppercase text-muted" style={{ fontSize: '11px' }}>
                          Horas Disponibles
                      </h6>
                      <div className="row g-3">
                          {loadingTurnos ? (
                              <div className="col-12 text-center py-5">
                                  <div className="spinner-border text-primary opacity-50"></div>
                              </div>
                          ) : turnosFiltrados.length > 0 ? (
                              /* Eliminamos las llaves extras que causaban el error de sintaxis */
                              turnosFiltrados.map((bloque: any, idx: number) => (
                                  <div key={idx} className="col-4">
                                      <div 
                                          onClick={() => setSelectedHora(bloque)} 
                                          className={`py-3 rounded-3 border text-center fw-bold transition-all ${
                                              // Validamos contra la propiedad .hora del objeto guardado en el estado
                                              selectedHora?.hora === bloque.hora 
                                              ? 'bg-primary text-white border-primary shadow' 
                                              : 'bg-white text-dark border-light-subtle'
                                          }`}
                                          style={{ cursor: 'pointer', fontSize: '14px' }}>
                                          {bloque.hora}
                                      </div>
                                  </div>
                              ))
                          ) : (
                              <div className="col-12 text-center py-5 bg-light rounded-3 border border-dashed text-muted">
                                  No hay horarios
                              </div>
                          )}
                      </div>
                    </div>
                )}
            </div>

            {/* BOTÓN INFERIOR DE ACCIÓN */}
            {(selectedService && (selectedHora || activeStep === 'especialistas' || activeStep === 'fecha')) && (
                <div className="fixed-bottom bg-white p-3 border-top d-flex justify-content-between align-items-center mx-auto shadow-lg" 
                     style={{ maxWidth: '500px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', zIndex: 2050 }}>
                    <div className="ps-2">
                        <div className="small text-muted fw-bold" style={{ fontSize: '10px' }}>TOTAL</div>
                        <div className="fw-bold fs-4 text-dark">
                            ${selectedEmployee ? Number(selectedEmployee.precio).toLocaleString() : '0'}
                        </div>
                    </div>

                    <button 
                      onClick={() => activeStep === 'fecha' ? setShowModal(true) : setActiveStep('especialistas')}
                      disabled={activeStep === 'fecha' && !selectedHora}
                      className="btn btn-primary px-4 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center border-0 transition-all" 
                      style={{ height: '55px', backgroundColor: '#5bc0de' }}>
                      {activeStep === 'fecha' ? 'Confirmar' : 'Continuar'} 
                      <i className="ti ti-arrow-right ms-2"></i>
                  </button>
                </div>
            )}

              {showModal && (
                  <div className="modal-overlay" style={{
                      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                      zIndex: 3000, display: 'flex', alignItems: 'flex-end'
                  }}>
                      <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%' }} onClick={() => setShowModal(false)}></div>

                          <div className="modal-content animate__animated animate__slideInUp" style={{
                              backgroundColor: '#fff', 
                              width: '100%', 
                              maxWidth: '500px',
                              margin: '0 auto 30px auto', // <--- Añadimos 30px de margen abajo
                              borderTopLeftRadius: '35px', 
                              borderTopRightRadius: '35px',
                              borderBottomLeftRadius: '35px', // <-- Opcional: redondear abajo también
                              borderBottomRightRadius: '35px', // <-- Opcional: redondear abajo también
                              padding: '35px', 
                              boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
                              position: 'relative', 
                              zIndex: 3001,
                              transform: 'translateY(-60px)'
                          }}>
                          
                          {/* Header del Modal */}
                          <div className="text-center mb-4">
                              <div className="bg-light rounded-pill mx-auto mb-3" style={{ width: '40px', height: '4px' }}></div>
                              <h5 className="fw-bold">{step === 1 ? 'Tus Datos' : 'Verifica tu Identidad'}</h5>
                              <p className="text-muted small">
                                  {step === 1 ? 'Ingresa tu documento para continuar' : `Enviamos un código al +57 ${telefono}`}
                              </p>
                          </div>

                          {step === 1 ? (
                              /* PASO 1: RECOPILACIÓN DE DATOS */
                              <div className="animate__animated animate__fadeIn">
                                  <div className="mb-3">
                                      <label className="small fw-bold text-muted mb-1">No. DOCUMENTO</label>
                                      <div className="input-group shadow-sm rounded-3 overflow-hidden border">
                                          <span className="input-group-text bg-white border-0 text-muted">
                                              {isChecking ? (
                                                  <div className="spinner-border spinner-border-sm text-primary"></div>
                                              ) : (
                                                  <i className="ti ti-id"></i>
                                              )}
                                          </span>
                                          <input 
                                              type="number" 
                                              className="form-control border-0 py-3" 
                                              placeholder="Ej: 1065..."
                                              value={identificacion}
                                              onChange={(e) => setIdentificacion(e.target.value)} // Solo actualiza el texto
                                              onBlur={manejarBusquedaBlur} // Aquí ocurre la búsqueda profesional
                                          />
                                      </div>
                                      {isRegistered && (
                                          <div className="animate__animated animate__fadeIn">
                                              <small className="text-success fw-bold d-flex align-items-center mt-1 ms-2">
                                                  <i className="ti ti-circle-check-fill me-1"></i> Cliente reconocido
                                              </small>
                                          </div>
                                      )}
                                  </div>

                                  {!isRegistered && (
                                      <div className="row g-2 animate__animated animate__fadeInDown">
                                          <div className="col-6 mb-3">
                                              <label className="small fw-bold text-muted mb-1">NOMBRE</label>
                                              <input type="text" className="form-control rounded-3" value={nombreNuevo} onChange={(e)=>setNombreNuevo(e.target.value)} />
                                          </div>
                                          <div className="col-6 mb-3">
                                              <label className="small fw-bold text-muted mb-1">APELLIDO</label>
                                              <input type="text" className="form-control rounded-3" value={apellidoNuevo} onChange={(e)=>setApellidoNuevo(e.target.value)} />
                                          </div>
                                      </div>
                                  )}

                                  <div className="mb-4">
                                      <label className="small fw-bold text-muted mb-1 text-uppercase" style={{ fontSize: '10px' }}>
                                          Celular para verificación
                                      </label>
                                      
                                      <div className="input-group shadow-sm rounded-3 overflow-visible border" style={{ background: '#fff' }}>
                                          {/* Contenedor del Dropdown manejado por React */}
                                          <div className="position-relative">
                                              <button 
                                                  className="btn btn-light border-0 d-flex align-items-center bg-white h-100 px-3" 
                                                  type="button" 
                                                  onClick={(e) => {
                                                      e.stopPropagation(); // Evita cerrar el modal por error
                                                      setShowPaises(!showPaises);
                                                  }}
                                                  style={{ 
                                                      fontSize: '14px', 
                                                      borderRight: '1px solid #eee',
                                                      borderTopLeftRadius: '15px',
                                                      borderBottomLeftRadius: '15px',
                                                      minWidth: '85px'
                                                  }}
                                              >
                                                  <span className="me-1">{paises.find(p => p.code === indicativo)?.flag}</span>
                                                  <span className="fw-bold">{indicativo}</span>
                                                  <i className={`ti ti-chevron-down ms-1 small transition-all ${showPaises ? 'rotate-180' : ''}`}></i>
                                              </button>
                                              
                                              {/* Lista de países (se muestra solo si showPaises es true) */}
                                              {showPaises && (
                                                  <>
                                                      {/* Overlay invisible para cerrar el dropdown al hacer click fuera */}
                                                      <div 
                                                          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3999 }} 
                                                          onClick={() => setShowPaises(false)}
                                                      ></div>
                                                      
                                                      <ul className="dropdown-menu show shadow-lg border-0 rounded-3 p-2" 
                                                          style={{ 
                                                              display: 'block',
                                                              position: 'absolute', 
                                                              top: '100%', 
                                                              left: 0, 
                                                              maxHeight: '250px', 
                                                              overflowY: 'auto', 
                                                              zIndex: 4000,
                                                              minWidth: '180px',
                                                              marginTop: '5px'
                                                          }}>
                                                          {paises.map((pais) => (
                                                              <li key={pais.code}>
                                                                  <button 
                                                                      className="dropdown-item d-flex justify-content-between align-items-center py-2 rounded-2" 
                                                                      type="button"
                                                                      onClick={(e) => {
                                                                          e.stopPropagation();
                                                                          setIndicativo(pais.code);
                                                                          setShowPaises(false);
                                                                      }}
                                                                  >
                                                                      <span>{pais.flag} {pais.nombre}</span>
                                                                      <small className="text-muted ms-2">{pais.code}</small>
                                                                  </button>
                                                              </li>
                                                          ))}
                                                      </ul>
                                                  </>
                                              )}
                                          </div>

                                          {/* Input de Teléfono */}
                                          <input 
                                              type="tel" 
                                              className={`form-control ${errores.telefonomovil ? 'is-invalid' : ''}`}
                                              placeholder="300 123 4567"
                                              style={{ 
                                                  fontSize: '16px', 
                                                  boxShadow: 'none',
                                                  borderTopRightRadius: '15px',
                                                  borderBottomRightRadius: '15px' 
                                              }}
                                              value={telefono} 
                                              onChange={(e) => setTelefono(e.target.value)} 
                                          />
                                          {errores.telefonomovil && (<div className="invalid-feedback fw-bold">{errores.telefonomovil[0]}</div>)}
                                      </div>
                                      
                                      <p className="text-muted mt-2 mb-0" style={{ fontSize: '11px' }}>
                                          <i className="ti ti-info-circle me-1"></i>
                                          Asegúrate de que el número tenga acceso a SMS.
                                      </p>
                                  </div>

                                  <button 
                                      onClick={enviarVerificacion}
                                      disabled={!telefono || !nombreNuevo || isChecking}
                                      className="btn btn-primary w-100 py-3 rounded-3 fw-bold shadow-lg border-0"
                                      style={{ backgroundColor: '#24D2DB' }}>
                                      {isChecking ? <span className="spinner-border spinner-border-sm"></span> : 'Siguiente: Verificar celular'}
                                  </button>
                              </div>
                          ) : (
                              /* PASO 2: VERIFICACIÓN OTP */
                              <div className="animate__animated animate__fadeInRight">
                                  <div className="text-center mb-4">
                                      <div className="d-flex justify-content-center gap-2 mb-3">
                                          <input 
                                              type="number" 
                                              className="form-control text-center fw-bold fs-2" 
                                              style={{ width: '260px', letterSpacing: '10px', borderRadius: '15px' }}
                                              maxLength={6}
                                              value={otp}
                                              onChange={(e) => setOtp(e.target.value)}
                                              autoFocus
                                          />
                                      </div>
                                      <div className="text-center mt-3">
                                        {canResend ? (
                                            <button 
                                                onClick={manejarReenvio}
                                                className="btn btn-sm btn-link text-decoration-none text-primary fw-bold animate__animated animate__fadeIn"
                                            >
                                                <i className="ti ti-refresh me-1"></i> Reenviar código
                                            </button>
                                        ) : (
                                            <span className="text-muted small fw-medium d-flex align-items-center justify-content-center">
                                                <span className="spinner-grow spinner-grow-sm me-2 text-primary" style={{ width: '8px', height: '8px' }}></span>
                                                Reenviar en {timer}s
                                            </span>
                                        )}
                                      </div>
                                  </div>

                                  <button 
                                      onClick={manejarConfirmacionFinal}
                                      disabled={otp.length < 4 || isChecking}
                                      className="btn btn-dark w-100 py-3 rounded-3 fw-bold shadow-lg border-0">
                                      {isChecking ? <span className="spinner-border spinner-border-sm"></span> : 'Confirmar y Agendar'}
                                  </button>
                                  
                                  <button onClick={() => setStep(1)} className="btn btn-link w-100 mt-2 text-muted text-decoration-none small">
                                      Corregir datos
                                  </button>
                              </div>
                          )}

                          <button onClick={() => setShowModal(false)} className="btn btn-link w-100 mt-3 text-muted text-decoration-none small">
                              Cancelar reserva
                          </button>
                      </div>
                  </div>
              )}

            <style dangerouslySetInnerHTML={{ __html: `
                .bg-primary-subtle { background-color: #e1f5fe !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .transition-all { transition: all 0.2s ease; }
                .hover-border-primary:hover { border-color: #0095ff !important; }
                .btn-primary { background-color: #0095ff; border: none; }
                body { background-color: #f8fafc; }
            `}} />
        </AppLandingLayout>
    );
}