export default function Input({
    label,
    error,
    className = '',
    value,
    ...props
}) {
    // Check if label should float: has value OR has placeholder
    // Note: props.placeholder might be present but empty if passed explicitly as ""
    // Check if label should float: has value OR has placeholder
    // Note: props.placeholder might be present but empty if passed explicitly as ""
    const hasPlaceholder = props.placeholder && props.placeholder.trim().length > 0;
    // Strict check: if value is present (even if 0), floating label should be active
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const isActive = hasValue || hasPlaceholder;

    return (
        <div style={{ position: 'relative', width: '100%', marginBottom: error ? '1.5rem' : '1rem' }}>
            <input
                value={value}
                placeholder=" "
                style={{
                    padding: '1rem 1rem 0.5rem',
                    borderRadius: 'var(--radius)',
                    border: error ? '1px solid #EF4444' : '1px solid var(--border)',
                    background: 'var(--input)',
                    color: 'var(--foreground)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    height: '3.5rem'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = error ? '#EF4444' : 'var(--border)'}
                className={`floating-input ${className}`}
                {...props}
            />
            {label && (
                <label
                    className={`floating-label ${isActive ? 'active' : ''}`}
                    style={{
                        position: 'absolute',
                        left: '1rem',
                        top: '1rem', // Default position (overridden by CSS when active/focus)
                        fontSize: '1rem', // Default size
                        color: 'var(--muted)',
                        pointerEvents: 'none',
                        transition: 'all 0.2s ease',
                        transformOrigin: 'left top'
                    }}
                >
                    {label}
                </label>
            )}
            {error && (
                <span style={{ fontSize: '0.75rem', color: '#EF4444', position: 'absolute', bottom: '-1.25rem', left: '0.25rem' }}>{error}</span>
            )}
            <style jsx>{`
                /* Float label when Input is Focused OR when it has content (active class) */
                .floating-input:focus + .floating-label,
                .floating-label.active {
                    top: 0.5rem !important;
                    font-size: 0.75rem !important;
                }
                
                .floating-input:focus + .floating-label {
                    color: var(--primary) !important;
                }
                
                /* Auto-fill fix */
                .floating-input:-webkit-autofill + .floating-label {
                   top: 0.5rem !important;
                   font-size: 0.75rem !important;
                }
            `}</style>
        </div>
    );
}
