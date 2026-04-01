import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

export default function AppMasterContent({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="pc-container">
                <div className="pc-content">
                {children}
                </div>
            </div>
        </>
    );
}

