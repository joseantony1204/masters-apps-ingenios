import{j as e,L as n,S as d}from"./app-B3TnjwLy.js";import{A as o}from"./app-main-layout-BFWTi0C3.js";/* empty css            */import"./use-mobile-navigation-D3RAPG1m.js";import"./default-8QqiYnI7.js";import"./app-master-logo-DduMZ78R.js";function f({planes:r}){const a=s=>{const i=parseFloat(s);return i===0?"Gratis":new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(i)},c=s=>{const i=s.toUpperCase();return i.includes("FREE")?{icon:"ti-gift",theme:"success"}:i.includes("MENSUAL")?{icon:"ti-calendar",theme:"primary"}:i.includes("TRIMESTRAL")?{icon:"ti-package",theme:"info"}:i.includes("SEMESTRAL")?{icon:"ti-star",theme:"warning"}:i.includes("ANUAL")?{icon:"ti-crown",theme:"dark"}:{icon:"ti-circle",theme:"secondary"}},l=s=>{d.post(route("scsuscripciones.checkout"),{plan_id:s.id})};return e.jsxs(o,{children:[e.jsx(n,{title:"Planes"}),e.jsx("div",{className:"page-header",children:e.jsx("div",{className:"page-block",children:e.jsxs("div",{className:"row align-items-center",children:[e.jsx("div",{className:"col-md-12",children:e.jsxs("ul",{className:"breadcrumb",children:[e.jsx("li",{className:"breadcrumb-item",children:e.jsx("a",{href:route("dashboard"),children:"Inicio"})}),e.jsx("li",{className:"breadcrumb-item",children:e.jsx("a",{href:route("scplanes.index"),children:" Membresías"})}),e.jsx("li",{className:"breadcrumb-item","aria-current":"page",children:"Listado"})]})}),e.jsx("div",{className:"col-md-12",children:e.jsx("div",{className:"page-header-title",children:e.jsx("h2",{className:"mb-0",children:"Membresías disponibles"})})})]})})}),e.jsx("div",{className:"row justify-content-center py-2",children:e.jsxs("div",{className:"col-md-8 text-center",children:[e.jsxs("h2",{className:"display-5 fw-black text-dark mb-3",children:["Membresías ",e.jsx("span",{className:"text-primary text-gradient",children:"Exclusivas"})]}),e.jsx("p",{className:"lead text-muted",children:"Impulsa tu comercio con herramientas de marketing automatizado."})]})}),e.jsx("div",{className:"row g-4 justify-content-center align-items-center pb-5",children:r.map(s=>{const i=c(s.nombre),t=s.codigo==="180";return e.jsx("div",{className:`col-sm-12 col-md-6 col-lg-4 col-xl ${t?"z-3":"z-1"}`,style:{maxWidth:"330px"},children:e.jsxs("div",{className:`card h-100 border-0 transition-gold ${t?"shadow-premium scale-up border-gradient":"shadow-sm"}`,children:[t&&e.jsx("div",{className:"ribbon-premium",children:e.jsx("span",{children:"MEJOR VALOR"})}),e.jsxs("div",{className:"card-body p-4 p-xl-5 text-center d-flex flex-column",children:[e.jsx("div",{className:`avtar avtar-xl bg-light-${i.theme} rounded-circle mb-4 mx-auto`,children:e.jsx("i",{className:`ti ${i.icon} f-30 text-${i.theme}`})}),e.jsx("h5",{className:"text-uppercase fw-bold text-muted mb-2 tracking-widest f-12",children:s.nombre}),e.jsxs("div",{className:"mb-4",children:[e.jsx("span",{className:"h1 fw-black text-dark mb-0",children:a(s.observacion)}),e.jsxs("div",{className:"f-13 text-muted mt-1 fw-medium",children:[s.codigo," días de servicio"]})]}),e.jsx("hr",{className:"my-4 opacity-25"}),e.jsxs("ul",{className:"list-group list-group-flush text-start mb-5 flex-grow-1",children:[e.jsxs("li",{className:"list-group-item border-0 px-0 py-2 d-flex align-items-center",children:[e.jsx("i",{className:"ti ti-circle-check-filled text-success me-2 f-18"}),e.jsx("span",{className:"text-dark f-14",children:"Módulo de IA Cumpleaños"})]}),e.jsxs("li",{className:"list-group-item border-0 px-0 py-2 d-flex align-items-center",children:[e.jsx("i",{className:"ti ti-circle-check-filled text-success me-2 f-18"}),e.jsx("span",{className:"text-dark f-14",children:"WhatsApp Ilimitado"})]}),e.jsxs("li",{className:"list-group-item border-0 px-0 py-2 d-flex align-items-center",children:[e.jsx("i",{className:"ti ti-circle-check-filled text-success me-2 f-18"}),e.jsx("span",{className:"text-dark f-14",children:"Soporte Prioritario"})]})]}),e.jsx("div",{className:"d-grid mt-auto",children:e.jsx("button",{className:`btn btn-lg fw-bold rounded-pill ${t?"btn-primary":"btn-outline-dark"}`,onClick:()=>l(s),children:"Seleccionar plan"})})]})]})},s.id)})}),e.jsx("style",{dangerouslySetInnerHTML:{__html:`
                .fw-black { font-weight: 900; }
                .tracking-widest { letter-spacing: 0.15em; }
                .text-gradient { background: linear-gradient(45deg, #2196F3, #047edf); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                /* Efectos de Tarjeta Premium */
                .transition-gold {
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    border-radius: 2rem;
                    background: #fff;
                }

                .transition-gold:hover {
                    transform: translateY(-10px);
                }

                .scale-up {
                    transform: scale(1.08);
                }

                .shadow-premium {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
                }

                .border-gradient {
                    border: 2px solid #2196F3 !important;
                }

                /* Cinta decorativa */
                .ribbon-premium {
                    position: absolute;
                    top: 20px;
                    right: -10px;
                    background: #FFD700;
                    color: #000;
                    padding: 5px 15px;
                    font-weight: 800;
                    font-size: 10px;
                    border-radius: 4px 0 0 4px;
                    box-shadow: -2px 2px 4px rgba(0,0,0,0.1);
                }

                .avtar.avtar-xl {
                    width: 70px;
                    height: 70px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 992px) {
                    .scale-up { transform: scale(1); margin-bottom: 20px; }
                    .z-3 { z-index: 1 !important; }
                }
            `}})]})}export{f as default};
