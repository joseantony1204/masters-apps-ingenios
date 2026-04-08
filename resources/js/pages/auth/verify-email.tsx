// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import AuthMainLayout from '@/layouts/auth-main-layout';
export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthMainLayout title="Verify email" description="Please verify your email address by clicking on the link we just emailed to you.">
            <Head title="Email verification" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico que proporcionaste durante el registro.
                </div>
            )}
            <form onSubmit={submit} className="space-y-6 text-center">
                <div className="card-body">
                    <div className="mb-4">
                        <h3 className="mb-2"><b>Verificar correo electrónico</b></h3>
                        <p className="text-muted">Por favor, verifique su dirección de correo electrónico haciendo clic en el enlace que le acabamos de enviar.</p>
                    </div>
                    <div className="d-grid mt-3">
                        <button 
                        className="btn btn-primary"
                        disabled={processing}
                        >
                            {processing && <span className="spinner-border spinner-border-sm me-2"></span>}
                            Reenviar correo electrónico de verificación
                        </button>
                    </div> 
                    <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                        Cerrar sesión
                    </TextLink>
                </div>
            </form>
        </AuthMainLayout>
    );
}
