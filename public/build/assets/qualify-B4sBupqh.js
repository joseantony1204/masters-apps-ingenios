import{r as L,m as A,j as e,L as H}from"./app-D4JI7wYz.js";import{A as R}from"./app-landing-layout-CELyw1ZZ.js";/* empty css            */function W({comercio:o,calificacion:t,error:p}){var y,w,N,k,S,_,z,C,E,D;const[d,x]=L.useState(0),[u,m]=L.useState(null),{data:a,setData:b,post:I,processing:g,wasSuccessful:F}=A({token:(t==null?void 0:t.token)||"",estrellas:(t==null?void 0:t.estrellas)||0,comentario:(t==null?void 0:t.comentario)||""}),r=(N=(w=(y=t==null?void 0:t.detalle)==null?void 0:y.empleadoservicio)==null?void 0:w.empleado)==null?void 0:N.persona,n=r==null?void 0:r.personasnaturales,l=(n==null?void 0:n.nombrecompleto)||"Nuestro Especialista",h=((k=n==null?void 0:n.nombre)==null?void 0:k.charAt(0).toUpperCase())||"E",T=((z=(_=(S=t==null?void 0:t.detalle)==null?void 0:S.empleadoservicio)==null?void 0:_.servicio)==null?void 0:z.nombre)||"Servicio",f=(C=r==null?void 0:r.soportes)==null?void 0:C.find(s=>s.predeterminado==="1"&&s.tipo_id===1),c=f?`storage/${f.ruta}`:null,v=(E=t==null?void 0:t.detalle)!=null&&E.totalapagar?new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(t.detalle.totalapagar):null,j=(D=t==null?void 0:t.detalle)!=null&&D.fecha?new Date(t.detalle.fecha+"T00:00:00").toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"numeric"}):null,B=s=>{s.preventDefault(),a.estrellas!==0&&I(route("public.save-qualify"),{preserveScroll:!0})},M=s=>{switch(s){case 1:return"Mal servicio 😞";case 2:return"Regular 😐";case 3:return"Bueno, Puede Mejorar 🙂";case 4:return"¡Excelente atención!  😀";case 5:return"¡Espectacular servicio! 🌟";default:return"Selecciona tu puntuación"}};return e.jsxs(R,{comercio:o,children:[e.jsx(H,{title:"Vantify - Calificación Servicios"}),e.jsx("div",{className:"pb-5 mb-5 px-3 d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light-gradient",children:e.jsxs("div",{className:"w-100 bg-white rounded-3 p-4 shadow-lg border-0 text-center animate__animated animate__fadeIn position-relative overflow-hidden",style:{maxWidth:"440px",marginTop:"2rem"},children:[e.jsx("div",{className:"position-absolute top-0 start-0 w-100 bg-primary-gradient",style:{height:"6px"}}),p?e.jsxs("div",{className:"py-5",children:[e.jsx("div",{className:"bg-light-danger text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4 wave-animation",style:{width:"80px",height:"80px"},children:e.jsx("i",{className:"ti ti-alert-triangle",style:{fontSize:"42px",fill:"currentColor"}})}),e.jsx("h4",{className:"fw-extrabold text-dark mb-2",children:"Enlace no disponible"}),e.jsx("p",{className:"text-muted small px-3 mb-0",children:p})]}):F?e.jsxs("div",{className:"py-5 animate__animated animate__zoomIn animate__faster",children:[e.jsx("div",{className:"bg-light-success text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-4 shadow-sm",style:{width:"85px",height:"85px",boxShadow:"0 8px 24px rgba(34, 197, 94, 0.2)"},children:e.jsx("i",{className:"ti ti-circle-check",style:{fontSize:"45px",fill:"currentColor"}})}),e.jsx("h4",{className:"fw-extrabold text-dark mb-2",children:"¡Calificación Enviada!"}),e.jsxs("p",{className:"text-muted small px-4 mb-0",children:["Tu opinión es vital para mantener la excelencia en ",e.jsx("strong",{className:"text-dark",children:(o==null?void 0:o.nombre)||"nuestro comercio"}),". ¡Te esperamos pronto!"]})]}):e.jsxs("form",{onSubmit:B,className:"pt-2",children:[e.jsx("h4",{className:"fw-extrabold text-dark mb-4",style:{letterSpacing:"-0.5px"},children:"¿Cómo estuvo tu atención?"}),e.jsxs("div",{className:"d-flex align-items-center gap-3 text-start mb-4 px-1",children:[e.jsxs("div",{className:"position-relative flex-shrink-0",children:[c?e.jsx("div",{className:"p-0-5 rounded-circle bg-white shadow-sm border cursor-zoom-in",style:{width:"68px",height:"68px"},onClick:()=>m(c),children:e.jsx("img",{src:c,className:"w-100 h-100 rounded-circle object-cover",alt:l,onError:s=>{s.target.style.display="none";const i=s.target.parentElement;i&&(i.classList.remove("cursor-zoom-in"),i.innerHTML=`<div class="w-100 h-100 rounded-circle d-flex align-items-center justify-content-center text-white fw-bold bg-primary-gradient fs-4">${h}</div>`)}})}):e.jsx("div",{className:"bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-extrabold shadow-sm animate__animated animate__scaleIn",style:{width:"65px",height:"65px",fontSize:"22px",background:"linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%)"},children:h}),e.jsx("span",{className:"position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-1-5 shadow-sm"})]}),e.jsxs("div",{className:"d-flex flex-column",children:[e.jsx("span",{className:"text-muted small lh-sm",children:"Tu opinión ayuda a calificar el desempeño de:"}),e.jsx("strong",{className:"text-dark fw-bold text-uppercase mt-0-5",style:{fontSize:"14.5px",letterSpacing:"-0.2px"},children:l})]})]}),e.jsxs("div",{className:"bg-light-subtle rounded-3 p-3 mb-4 border border-light text-start d-flex justify-content-between align-items-center",children:[e.jsxs("div",{className:"d-flex align-items-center gap-2",children:[e.jsx("div",{className:"bg-primary-light text-primary p-2 rounded-3",children:e.jsx("i",{className:"ti ti-scissors fs-4"})}),e.jsxs("div",{children:[e.jsx("div",{className:"fw-bold text-dark small",style:{fontSize:"13.5px"},children:T}),j&&e.jsx("div",{className:"text-muted style-date",children:j})]})]}),v&&e.jsx("div",{className:"fw-extrabold text-dark",style:{fontSize:"14px"},children:v})]}),e.jsxs("div",{className:"d-flex flex-column align-items-center mb-4",children:[e.jsx("div",{className:"d-flex justify-content-center gap-2 mb-2",children:[1,2,3,4,5].map(s=>{const i=s<=(d||a.estrellas);return e.jsx("button",{type:"button",className:"btn p-0 border-0 focus-none star-button",onClick:()=>b("estrellas",s),onMouseEnter:()=>x(s),onMouseLeave:()=>x(0),children:e.jsx("i",{className:`ti ti-star star-icon ${i?"active":"inactive"}`,style:{fontSize:"42px"}})},s)})}),e.jsx("span",{className:`small fw-bold text-capitalize ${a.estrellas>0||d>0?"text-primary":"text-muted opacity-50"}`,style:{fontSize:"12px",transition:"color 0.2s"},children:M(d||a.estrellas)})]}),e.jsxs("div",{className:"mb-4 text-start",children:[e.jsxs("label",{className:"form-label text-dark fw-bold small ps-1 mb-1",style:{fontSize:"12.5px"},children:["¿Quieres dejar un mensaje, observación, comentario o aspécto para mejorar? ",e.jsx("span",{className:"text-muted fw-normal fs-7",children:"(Opcional)"})]}),e.jsxs("div",{className:"position-relative",children:[e.jsx("textarea",{className:"form-control rounded-3 border-light bg-light-subtle small custom-input text-area-icon-padding",rows:3,placeholder:"Escribe tu opinión sobre el especialista o el servicio...",maxLength:500,value:a.comentario,onChange:s=>b("comentario",s.target.value),style:{fontSize:"13px",resize:"none"}}),e.jsx("div",{className:"position-absolute top-0 start-0 pt-2-5 ps-3 text-muted opacity-50",children:e.jsx("i",{className:"ti ti-message-2 fs-4"})})]})]}),e.jsx("button",{type:"submit",disabled:g||a.estrellas===0,className:"btn w-100 fw-bold text-white rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2 border-0 bg-primary-gradient btn-submit-luxury",style:{height:"48px"},children:g?e.jsx("span",{className:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"}):e.jsxs(e.Fragment,{children:["Confirmar calificación",e.jsx("i",{className:"ti ti-circle-check fs-5"})]})})]})]})}),u&&e.jsx("div",{className:"position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate__animated animate__fadeIn",style:{backgroundColor:"rgba(0, 0, 0, 0.82)",zIndex:3e3,backdropFilter:"blur(6px)",transition:"all 0.2s ease"},onClick:()=>m(null),children:e.jsxs("div",{className:"position-relative text-center p-3 animate__animated animate__zoomIn animate__faster",onClick:s=>s.stopPropagation(),children:[e.jsx("button",{className:"btn btn-sm btn-dark rounded-circle position-absolute d-flex align-items-center justify-content-center shadow",style:{top:"-15px",right:"-15px",width:"34px",height:"34px",padding:0,border:"2px solid rgba(255,255,255,0.2)"},onClick:()=>m(null),children:e.jsx("i",{className:"ti ti-x fs-4"})}),e.jsx("img",{src:u,className:"img-fluid rounded-4 shadow-lg border border-dark",style:{maxHeight:"70vh",maxWidth:"85vw",objectFit:"contain"},alt:l}),e.jsx("div",{className:"text-white fw-bold mt-3 fs-5 text-uppercase",style:{letterSpacing:"0.5px"},children:l})]})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                .bg-light-gradient {
                    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
                }
                .bg-primary-gradient {
                    background: linear-gradient(135deg, #24D2DB 0%, #1FBCC5 100%) !important;
                }
                .bg-primary-light {
                    background-color: rgba(36, 210, 219, 0.1) !important;
                }
                .bg-light-success { background-color: #e8f5e9 !important; }
                .bg-light-danger { background-color: #ffebee !important; }
                
                .star-button {
                    transition: transform 0.1s ease-in-out;
                    background: transparent !important;
                }
                .star-button:hover {
                    transform: scale(1.15);
                }
                .star-icon {
                    display: inline-block;
                    transition: all 0.15s ease-in-out;
                }
                .star-icon.active {
                    color: #ffb703 !important;
                    fill: #ffb703 !important;
                    filter: drop-shadow(0 2px 4px rgba(255, 183, 3, 0.25));
                }
                .star-icon.inactive {
                    color: #cbd5e1 !important;
                    fill: transparent !important;
                }
                
                .object-cover { object-fit: cover !important; }
                .fw-extrabold { font-weight: 800 !important; }
                .fs-7 { font-size: 11px !important; }
                .shadow-md { box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important; }
                .style-date { font-size: 11px; font-weight: 500; }
                
                .focus-none:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
                
                .cursor-zoom-in {
                    cursor: zoom-in !important;
                }
                
                .custom-input {
                    transition: all 0.2s ease-in-out;
                    background-color: #fafafa;
                }
                .custom-input:focus {
                    border-color: #24D2DB !important;
                    box-shadow: 0 0 0 3px rgba(36, 219, 215, 0.12) !important;
                    background-color: #fff;
                }
                .text-area-icon-padding {
                    padding: 0.65rem 0.75rem 0.65rem 2.5rem !important;
                }
                .pt-2-5 { padding-top: 0.7rem !important; }
                .p-0-5 { padding: 0.15rem !important; }
                .mt-0-5 { margin-top: 0.15rem !important; }
                .p-1-5 { padding: 0.22rem !important; }
                
                .btn-submit-luxury {
                    transition: all 0.25s ease;
                }
                .btn-submit-luxury:disabled {
                    background: #cbd5e1 !important;
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .btn-submit-luxury:not(:disabled):hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(36, 210, 219, 0.3) !important;
                }
                
                @keyframes pulse-wave {
                    0% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.2); }
                    70% { box-shadow: 0 0 0 12px rgba(220, 53, 69, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
                }
                .wave-animation {
                    animation: pulse-wave 2s infinite;
                }
            `}})]})}export{W as default};
