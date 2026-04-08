import AppMasterLogo from '@/components/app-master-logo';
import { type BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthMasterLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {

    return (
        <>
            <div className="auth-main">
                <div className="auth-wrapper v3">
                    <div className="auth-form">
                        <div className="auth-header">
                            <Link href='dashboard' prefetch>
                                <AppMasterLogo className="custom-class" alt="Masters Apps Ingenios" />
                            </Link>
                        </div>
                        <div className="card my-5">
                            <div className="card-body">
                                {children}
                            </div>
                        </div>
                        <div className="auth-footer row">
                            <div className="">
                                <div className="col my-1">
                                    <p className="m-0">Copyright © <a href="#">INGENIOS SAS</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </> 
    );
}
