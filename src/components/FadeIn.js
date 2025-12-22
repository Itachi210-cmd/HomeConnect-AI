"use client";
import { useEffect, useState } from 'react';

export default function FadeIn({ children, delay = 0 }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
            }}
        >
            {children}
        </div>
    );
}
