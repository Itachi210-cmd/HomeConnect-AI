export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    ...props
}) {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'var(--radius)',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        border: 'none',
        fontFamily: 'inherit',
    };

    const variants = {
        primary: {
            background: 'var(--primary)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)',
        },
        secondary: {
            background: 'var(--input)',
            color: 'var(--foreground)',
        },
        outline: {
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--foreground)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--muted)',
        }
    };

    const sizes = {
        sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    };

    const finalStyle = {
        ...baseStyles,
        ...variants[variant],
        ...sizes[size],
        ...(fullWidth ? { width: '100%' } : {}),
        ...(props.style || {}),
    };

    // Remove style from props to avoid overwriting
    const { style: ignoredStyle, ...restProps } = props;

    return (
        <button className={`btn ${className}`} style={finalStyle} {...restProps}>
            {children}
        </button>
    );
}
