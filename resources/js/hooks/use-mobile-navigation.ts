import { useCallback } from 'react';

export function useMobileNavigation() {
    const cleanup = useCallback(() => {
        // 1. Limpia el bloqueo de clics
        document.body.style.removeProperty('pointer-events');
        
        // 2. Limpia el bloqueo de scroll (común en plantillas)
        document.body.style.removeProperty('overflow');
        
        // 3. Quitamos las clases de la plantilla que bloquean el layout
        document.body.classList.remove('mob-sidebar-active');
        document.body.classList.remove('pc-sidebar-hide');
    }, []);

    return cleanup;
}