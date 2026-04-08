import { Head, useForm, Link} from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthMainLayout from '@/layouts/auth-main-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthMainLayout title="Inicio de sessión con tu cuenta" description="Ingresar email y contraseña para ingresar">
            <Head title="Inicio de sessión" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <h3 className="mb-0"><b>Login</b></h3>
                    <Link href={route('register')} className="ml-auto text-sm" tabIndex={5}>
                        ¿No tienes una cuenta?, crea tu negocio aquí.
                    </Link>
                </div>
                
                <div className="form-group mb-3">
                        <Label htmlFor="email" className="form-label">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            className="form-control"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="form-group mb-3">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="form-label">Contraseña</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm" tabIndex={5}>
                                    Olvidé mi contraseña?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="form-control"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Contraseña"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="d-grid mt-4">
                        <Button type="submit" className="btn btn-primary" tabIndex={4} disabled={processing}>
                            {processing && <span className="spinner-border spinner-border-sm me-2"></span>}
                            Iniciar sessión
                        </Button>
                    </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthMainLayout>
    );
}
