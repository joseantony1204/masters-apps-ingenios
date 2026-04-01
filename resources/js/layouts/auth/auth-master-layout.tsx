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
                            
                            <div className="saprator mt-3">
                                <span>Login with</span>
                            </div>
                            <div className="row">
                                <div className="col-4">
                                    <div className="d-grid">
                                        <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                            <img src="../assets/images/authentication/google.svg" alt="img"/> <span className="d-none d-sm-inline-block"> Google</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="d-grid">
                                        <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                            <img src="../assets/images/authentication/twitter.svg" alt="img"/> <span className="d-none d-sm-inline-block"> Twitter</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="d-grid">
                                        <button type="button" className="btn mt-2 btn-light-primary bg-light text-muted">
                                            <img src="../assets/images/authentication/facebook.svg" alt="img"/> <span className="d-none d-sm-inline-block"> Facebook</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="auth-footer row">
                        <div className="">
                            <div className="col my-1">
                                <p className="m-0">Copyright © <a href="#">Codedthemes</a></p>
                            </div>
                            <div className="col-auto my-1">
                                <ul className="list-inline footer-link mb-0">
                                    <li className="list-inline-item"><a href="#">Home</a></li>
                                    <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
                                    <li className="list-inline-item"><a href="#">Contact us</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </> 
    );
}
