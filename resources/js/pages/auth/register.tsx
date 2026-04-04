import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import AuthMainLayout from '@/layouts/auth-main-layout';

type RegisterForm = {
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        first_name: '',
        last_name: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthMainLayout  title="Crear una cuenta de comercio" description="Ingresa los detalles de tu cuenta">
            <Head title="Register" />

            <div className="d-flex justify-content-between align-items-end mb-4">
                <h3 className="mb-0 fw-bold">Crear cuenta</h3>
                <Link href={route('login')} className="ml-auto text-sm" tabIndex={5}>
                    ¿Ya tienes una cuenta?
                </Link>
            </div>

            <form onSubmit={submit}>
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold">Nombre*</label>
                            <input
                                type="text"
                                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                placeholder="Tu nombre"
                                value={data.first_name}
                                onChange={(e) => setData('first_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.first_name} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label text-muted small fw-bold">Apellido*</label>
                            <input
                                type="text"
                                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                placeholder="Tu apellido"
                                value={data.last_name}
                                onChange={(e) => setData('last_name', e.target.value)}
                                required
                            />
                            <InputError message={errors.last_name} />
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Compañía / Comercio*</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Nombre de tu negocio"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Correo Electrónico*</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="email@ejemplo.com"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">Contraseña*</label>
                    <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        placeholder="••••••••"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="grid gap-2">
                    <label className="form-label text-muted small fw-bold">Confirma Contraseña*</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        required
                        className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                        tabIndex={4}
                        autoComplete="new-password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        disabled={processing}
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <p className="mt-4 text-sm text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                    Al registrarte, aceptas nuestros{' '}
                    <Link href="#" className="text-primary text-decoration-none fw-bold">Términos de Servicio</Link> y{' '}
                    <Link href="#" className="text-primary text-decoration-none fw-bold">Política de Privacidad</Link>.
                </p>

                <div className="d-grid mt-4">
                    <Button 
                        type="submit" 
                        className="btn btn-primary py-2 fw-bold shadow-sm" 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="me-2 h-4 w-4 animate-spin" />}
                        Crear Cuenta
                    </Button>
                </div>
            </form>
        </AuthMainLayout >
    );
}
