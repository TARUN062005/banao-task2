import React from 'react';

export default function Button({
    children,
    onClick,
    variant = 'primary',
    type = 'button',
    disabled = false,
    className = '',
    id,
    'aria-label': ariaLabel,
}) {
    return (
        <button
            id={id}
            type={type}
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}
