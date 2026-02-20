import React from 'react';

export default function Button({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    className = '',
    id,
    'aria-label': ariaLabel,
}) {
    return (
        <button
            id={id}
            type="button"
            className={`btn btn-${variant} ${className}`}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}
