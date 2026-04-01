import { type BreadcrumbItem } from '@/types';
import AppMasterLayout from './app/app-master-layout';
import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import AppMasterToasthMessage from '@/components/app-master-toast-message';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}
interface FlashMessagesData {
    success?: string;
    info?: string;
    warning?: string;
    error?: string;
}

export default function ({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const { flash = {} } = usePage().props as { flash?: FlashMessagesData };
    return (
        <AppMasterLayout breadcrumbs={breadcrumbs} {...props}>
            <AppMasterToasthMessage success={flash.success} info={flash.info} warning={flash.warning} error={flash.error} />
            {children}
        </AppMasterLayout>         
    );
}
