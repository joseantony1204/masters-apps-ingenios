import React, { useEffect } from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({ show, onClose, children, maxWidth = 'md' }: ModalProps) {
    // Bloquear el scroll del body cuando la modal está abierta
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [show]);

    if (!show) return null;

    return (
        <div 
            className="modal fade show d-block" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
            tabIndex={-1}
            onClick={onClose}
        >
            <div 
                className={`modal-dialog modal-dialog-centered modal-${maxWidth}`}
                onClick={e => e.stopPropagation()} // Evita que se cierre al hacer clic dentro
            >
                <div className="modal-content border-0 shadow-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}