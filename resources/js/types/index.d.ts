import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface Modulo {
    id: number;
    nombre: string;
    icon: string;
    roles: {
      nombre: string;
      ruta: string;
      icon: string;
      ruta_name: string;
    }[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    modulos: Modulo[];
    [key: string]: unknown; // This allows for additional properties...
}

export interface Cfmaestra {
    id: number;
    codigo: string;
    nombre: string;
    padre: string;
    observacion: string;
    orden: string;
    visible: string;
    jerarquia: string;
}

export interface Sgrolesperfiles {
    id: number;
    perfil_id: string;
    rol_id: string;
    estado: string;
    created_at: string;
    observacion: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}

export interface Productos {
    id: number;
    codigo: string;            
    codigobarra: string;       
    nombre: string;      
    duracion: string;      
    descripcion: string; 
    minimostock: string;  
    precioingreso: string;     
    preciosalida: string;    
    acumulapuntos: string;      
    observacion: string;           
    padre: number;        
    tipo_id: number;        
    unidad_id: number;     
    ubicacion_id: number;      
    impuesto_id: number;     
    categoria_id: number;         
    marca_id: number;            
    estado_id: number;                         
    sede_id: number;                         
    created_by: number;                         
    updated_by: number;                         
    deleted_by: number;                         
}

export interface Personas {
    id: number;
    identificacion: string;
    digitoverificacion: string;
    lugarexpedicion: string;
    fechaexpedicion: string;
    telefono: string;
    telefonomovil: string;
    sendsms: string;
    email: string;
    sendemail: string;
    foto: string;
    firma: string;
    direccion: string;
    pais_id: string;
    departamento_id: string;
    ciudad_id: string;
    barrio: string;
    tipoidentificacion_id: string;
    tiporegimen_id: string;
    observaciones: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
    personanatural:Personanaturales;
    comercio:Comercios;
    empleado:Cfempleados;
}

export interface Personasnaturales {
    fechanacimiento: string;
    nombre: string;
    segundonombre: string;
    apellido: string;
    segundoapellido: string;
    persona_id: string;
    zona_id: string;
    sexo_id: string;
    estadocivil_id: string;
    niveleducacion_id: string;
    religion_id: string;
    etnia_id: string;
    tiposangre_id: string;
    rh_id: string;
    ocupacion_id: string;
    estrato_id: string;
    discapacidad_id: string;
    tiporegimen_id: string;
    observaciones: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}

export interface Clientes {
    id: number;
    fechaingreso: date;
    persona_id: string;
    referido_id: string;
    estado_id: string;
    comercio_id: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}

export interface Cfempleados {
    id: number;
    fechaingreso: date;
    persona_id: string;
    comercio_id: string;
    estado_id: string;
    observaciones: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
    persona: Personas;
    estado: Cfmaestra;
}

export interface Adclientes {
    id: number;
    fechaingreso: date;
    persona_id: string;
    comercio_id: string;
    estado_id: string;
    referido_id: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
    persona: Personas;
    estado: Cfmaestra;
}

export interface Adcitas {
    id: number;
    fecha: date;
    codigo: string;
    cliente_id: string;
    horainicio: string;
    horafinal: string;
    descripcion: string;
    cupon: string;
    estado_id: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}

export interface Comercios {
    id: number;
    nombre: string;
    objetocomercial: string;
    persona_id: string;
    observaciones: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}

export interface Ftfacturas {
    id: number;
    codigoseguridad: string;
    numero: string;
    fecha: string;
    fechanavencimiento: string;
    model_type: string;
    model_type_id: string;
    origen_id: string;
    destino_id: string;
    tipo_id: string;
    turno_id: string;
    estado_id: string;
    comercio_id: string;
    persona_id: string;
    observaciones: string;
    created_by: string;
    updated_by: string;
    deleted_by: string;
}