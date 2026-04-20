import { type BreadcrumbItem } from '@/types';
import { useEffect, type PropsWithChildren } from 'react';

import AppMasterHeader from '@/components/app-master-header';
import AppMasterSidebar from '@/components/app-master-sidebar';
import AppMasterContent from '@/components/app-master-content';
import AppMasterFooter from '@/components/app-master-footer';

export default function AppMasterLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    
    useEffect(() => {
        // 1. Manejo seguro del Loader (Evita el error de TypeScript)
        const loader = document.querySelector('.loader-bg') as HTMLElement | null;
        if (loader) {
            // Usamos una transición suave en lugar de display: none de golpe
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 400);
        }

        // 2. Reinicializar Feather Icons
        // El chequeo opcional '?' evita errores si el script no ha cargado
        window.feather?.replace();

        // 3. Reset del scroll al cambiar de página (Importante en SPAs)
        //window.scrollTo(0, 0);
        document.body.classList.remove('mob-sidebar-active');

    }, [children]);

    return (
        <>
            {/* Sidebar fijo a la izquierda */}
            <AppMasterSidebar />

            {/* Header fijo arriba */}
            <AppMasterHeader />

            {/* Contenedor de contenido dinámico */}
            <AppMasterContent>
                {/* Aquí podrías insertar un componente de Breadcrumbs global si lo necesitas */}
                {children}
            </AppMasterContent>
            
            <AppMasterFooter />
        </>
    );
}