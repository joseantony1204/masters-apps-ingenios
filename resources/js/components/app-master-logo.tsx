import React from 'react';
import logo from '/public/assets/images/logo-dark.svg';

export default function AppMasterLogo({ className = '', alt = 'Logo' }) {
    return (
        <>
            <img
                src={logo}
                className={`img-fluid logo-lg ${className}`}
                alt={alt}
                loading="lazy"
            />
        </>
    );
}

