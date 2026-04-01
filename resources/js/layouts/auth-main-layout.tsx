import AuthMasterLayout from '@/layouts/auth/auth-master-layout';

export default function AuthMainLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthMasterLayout title={title} description={description} {...props}>
            {children}
        </AuthMasterLayout>
    );
}
