import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { Toaster } from 'react-hot-toast'; // 1. Importa el Toaster

// 1. Importamos el proveedor de la modal global
// Asegúrate de que la ruta coincida con donde creaste el archivo
import { ClienteModalProvider } from './hooks/use-cliente-context';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // 2. Envolvemos el componente <App /> con el Provider.
        // Esto permite que todas las páginas de Inertia compartan el mismo estado de la modal.
        root.render(
            <ClienteModalProvider>
                <App {...props} />
                <Toaster position="top-right" reverseOrder={false} /> {/* 2. Añádelo aquí */}
            </ClienteModalProvider>
        );
    },
    progress: {
        color: '#1890ff', // Cambiado al azul de Vantify para coherencia
    },
});

// Inicializa el modo claro/oscuro
initializeTheme();