import LandingMasterLayout from '@/layouts/app/landing-master-layout';

export default function LandingMainLayout({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <LandingMasterLayout title={title}>
            {children}
        </LandingMasterLayout>
    );
}