import{r as p,j as e,$ as y}from"./app-Dm7qo0hz.js";import{A as v}from"./app-landing-layout-CBCDy8ZM.js";/* empty css            */function z({comercio:x,citas:n}){var l;const{citasAgrupadas:d,fechasDisponibles:c}=p.useMemo(()=>{var m;const t={},r=new Date().toISOString().split("T")[0];(m=n.detallescitas)==null||m.forEach(i=>{const a=i.cita.fecha;a>=r&&(t[a]||(t[a]=[]),t[a].push(i))});const o=Object.keys(t).sort((i,a)=>new Date(i).getTime()-new Date(a).getTime());return{citasAgrupadas:o.reduce((i,a)=>(i[a]=t[a].sort((w,j)=>w.cita.horainicio.localeCompare(j.cita.horainicio)),i),{}),fechasDisponibles:o}},[n]),[s,f]=p.useState(()=>{const t=new Date().toISOString().split("T")[0];return c.includes(t)?t:c[0]||""}),h=t=>{const r=["DOM","LUN","MAR","MIÉ","JUE","VIE","SÁB"],o=new Date(t+"T00:00:00");return r[o.getDay()]},b=t=>t.split("-")[2],g=t=>new Date(t+"T00:00:00").toLocaleDateString("es-ES",{month:"short"}).replace(".","").toUpperCase(),u=t=>{const r=new Date().toISOString().split("T")[0];return t===r?"Hoy":new Date(t+"T00:00:00").toLocaleDateString("es-ES",{weekday:"long"})};return e.jsxs(v,{comercio:x,children:[e.jsxs("div",{className:"pb-5 mb-5 px-3",children:[e.jsxs("div",{className:"bg-white border-0 rounded-3 p-3 mb-4 shadow-sm d-flex align-items-center mt-3 animate__animated animate__fadeInDown",children:[e.jsx("div",{className:"me-3 bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-800 shadow-sm",style:{width:"56px",height:"56px",fontSize:"22px",minWidth:"56px"},children:((l=n.persona.personasnaturales.nombre)==null?void 0:l.charAt(0).toUpperCase())||"E"}),e.jsxs("div",{children:[e.jsx("h5",{className:"fw-800 mb-0 text-dark text-uppercase",style:{letterSpacing:"-0.5px"},children:n.persona.personasnaturales.nombrecompleto}),e.jsx("p",{className:"text-muted mb-0 fw-bold small text-uppercase",style:{fontSize:"11px",opacity:.8},children:"Agenda / Próximas Citas"})]})]}),e.jsx("h6",{className:"fw-bold mb-3 text-uppercase text-muted",style:{fontSize:"10px",letterSpacing:"1px"},children:"Calendario Próximo"}),e.jsx("div",{className:"d-flex overflow-auto gap-3 mb-4 pb-3 no-scrollbar",style:{paddingLeft:"2px",paddingRight:"2px"},children:c.length>0?c.map(t=>{const r=s===t,o=t===new Date().toISOString().split("T")[0];return e.jsxs("div",{onClick:()=>f(t),className:`calendar-card d-flex flex-column align-items-center justify-content-center transition-all ${r?"active shadow-blue":"bg-white border-light-subtle shadow-sm"}`,children:[e.jsx("div",{className:"day-name",children:h(t)}),e.jsxs("div",{className:"day-number",children:[b(t),o&&e.jsx("div",{className:"today-dot"})]})]},t)}):e.jsx("div",{className:"small text-muted p-2",children:"No hay citas futuras programadas"})}),s&&d[s]?e.jsxs("div",{className:"animate__animated animate__fadeIn",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-4",children:[e.jsxs("div",{children:[e.jsx("h5",{className:"fw-800 text-dark text-capitalize mb-0",children:u(s)}),e.jsxs("p",{className:"text-muted small mb-0",children:[d[s].length," servicios para este día"]})]}),e.jsx("span",{className:"badge bg-light-primary text-primary rounded-pill px-3 py-2 fw-800 shadow-sm",children:g(s)})]}),e.jsx("div",{className:"ms-2 border-start ps-4 position-relative",children:d[s].map(t=>e.jsxs("div",{className:"mb-4 position-relative",children:[e.jsx("div",{className:"timeline-dot"}),e.jsxs("div",{className:"bg-white rounded-3 border-0 p-3 shadow-sm hover-card transition-all",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-start mb-2",children:[e.jsxs("div",{className:"d-flex align-items-center",children:[e.jsx("div",{className:"time-badge me-2",children:t.cita.horainicio.substring(0,5)}),e.jsxs("span",{className:"text-muted small fw-bold",children:[e.jsx("i",{className:"ti ti-clock me-1"}),t.empleadoservicio.duracionpersonalizado," min"]})]}),e.jsx("span",{className:`badge rounded-pill bg-light-${t.cita.estado.observacion||"primary"} text-${t.cita.estado.observacion||"primary"} px-3 fw-bold`,children:t.cita.estado.nombre})]}),e.jsx("h6",{className:"fw-800 text-dark mb-1 fs-5",children:e.jsx("span",{children:t.cita.cliente.persona.personasnaturales.nombrecompleto})}),e.jsx("p",{className:"text-muted f-12 mb-0",children:t.cita.cliente.persona.telefonomovil}),e.jsxs("div",{className:"d-flex align-items-center justify-content-between pt-2 border-top mt-2",children:[e.jsxs("div",{className:"text-primary fw-800",style:{fontSize:"13px"},children:[e.jsx("i",{className:"ti ti-scissors me-1"}),t.empleadoservicio.servicio.nombre]}),e.jsxs("div",{className:"d-flex gap-2",children:[e.jsx("a",{href:`https://wa.me/57${t.cita.cliente.persona.telefonomovil}`,target:"_blank",className:"btn-action bg-light-success text-success",children:e.jsx("i",{className:"ti ti-brand-whatsapp fs-5"})}),e.jsx(y,{href:"#",className:"btn-action bg-light-primary text-primary",children:e.jsx("i",{className:"ti ti-user fs-5"})})]})]})]})]},t.id))})]}):e.jsxs("div",{className:"text-center py-5 bg-white rounded-3 border border-dashed mt-4 shadow-sm",children:[e.jsx("i",{className:"ti ti-calendar-off fs-1 text-muted opacity-25"}),e.jsx("p",{className:"text-muted mt-3 fw-bold",children:"Sin citas para mostrar."})]})]}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                body { background-color: #f8fafc; }
                .fw-800 { font-weight: 800 !important; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

                /* Indicador de hoy */
                .today-dot {
                    width: 6px;
                    height: 6px;
                    background-color: #0095ff;
                    border-radius: 50%;
                    margin: 2px auto 0;
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                .active .today-dot { background-color: #fff; }

                /* Calendario Premium Compacto */
                .calendar-card {
                    min-width: 72px;
                    height: 90px;
                    background-color: #ffffff;
                    border: 1.5px solid #f1f5f9;
                    border-radius: 16px;
                    cursor: pointer;
                    flex-shrink: 0;
                    position: relative;
                }
                .calendar-card .day-name {
                    font-size: 11px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                    margin-bottom: 2px;
                }
                .calendar-card .day-number {
                    font-size: 26px;
                    font-weight: 800;
                    color: #1e293b;
                    line-height: 1;
                    position: relative;
                }
                .calendar-card.active {
                    background-color: #0095ff !important;
                    border-color: #0095ff !important;
                    transform: translateY(-4px);
                }
                .calendar-card.active .day-name, .calendar-card.active .day-number {
                    color: #ffffff !important;
                }
                .shadow-blue {
                    box-shadow: 0 10px 20px -5px rgba(0, 149, 255, 0.45) !important;
                }

                /* Agenda/Timeline */
                .timeline-dot {
                    position: absolute;
                    width: 14px;
                    height: 14px;
                    background-color: #0095ff;
                    border: 3px solid #fff;
                    border-radius: 50%;
                    left: -32px;
                    top: 10px;
                    box-shadow: 0 0 0 4px rgba(0, 149, 255, 0.1);
                    z-index: 2;
                }
                .time-badge {
                    background-color: #f1f5f9;
                    color: #1e293b;
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 13px;
                }
                .hover-card:hover {
                    transform: translateX(5px);
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06) !important;
                }
                .btn-action {
                    width: 38px;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 10px;
                    transition: 0.2s;
                    border: none;
                    text-decoration: none;
                }
                .btn-action:hover { opacity: 0.8; transform: scale(1.1); }
                
                .bg-light-primary { background-color: #e0f2fe !important; }
                .bg-light-success { background-color: #dcfce7 !important; }
                .text-primary { color: #0095ff !important; }
                .bg-primary { background-color: #0095ff !important; }
            `}})]})}export{z as default};
