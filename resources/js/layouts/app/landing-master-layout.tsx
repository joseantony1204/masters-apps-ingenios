import { PropsWithChildren } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppMasterLogo from '@/components/app-master-logo';

interface LandingLayoutProps {
    title?: string;
    description?: string;
}

export default function LandingMasterLayout({ children, title }: PropsWithChildren<LandingLayoutProps>) {
    return (
        <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
            <Head title={title} />
            
            {/* Opcional: Podrías añadir un Navbar aquí */}
            <main className="w-full">
                {/* Contenedor responsivo centralizado */}
                <div className="container-fluid px-4 px-md-5">
                    <div className="mx-auto" style={{ maxWidth: '1300px' }}>
                        {children}
                    </div>
                </div>
            </main>

            {/* Opcional: Podrías añadir un Footer aquí */}
            
            <style dangerouslySetInnerHTML={{ __html: `
                body { overflow-x: hidden; }
                .selection\\:bg-primary::selection { background-color: #0095ff; color: white; }
            `}} />
        </div>
    );
}