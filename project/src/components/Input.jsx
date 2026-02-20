import React from 'react';

export default function Input({
    id,
    label,
    type = 'text',
    value,
    onChange,
    placeholder,
    disabled = false,
    error,
    autoComplete,
    'aria-describedby': ariaDescribedBy,
}) {
    const errorId = error ? `${id}-error` : undefined;

    return (
        <div className="input-group">
            {label && (
                <label className="input-label" htmlFor={id}>
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                className={`input-field${error ? ' input-field--error' : ''}`}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                aria-invalid={!!error}
                aria-describedby={ariaDescribedBy || errorId}
            />
            {error && (
                <span id={errorId} className="input-error" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
}
