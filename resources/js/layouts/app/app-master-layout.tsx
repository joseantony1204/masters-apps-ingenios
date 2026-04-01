import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { type PropsWithChildren } from 'react';

import AppMasterHeader from '@/components/app-master-header';
import AppMasterSidebar from '@/components/app-master-sidebar';
import AppMasterContent from '@/components/app-master-content';
import AppMasterFooter from '@/components/app-master-footer';


export default function AppMasterLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    return (
        <>
            <AppMasterSidebar/>
            <AppMasterHeader />

            <AppMasterContent>
                {children}
            </AppMasterContent>
            
            <AppMasterFooter />
        </>
        
    );
}
