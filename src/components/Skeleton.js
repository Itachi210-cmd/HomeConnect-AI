"use client";
import React from 'react';

const Skeleton = ({ width, height, borderRadius = "4px", className = "" }) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width: width || "100%",
                height: height || "1rem",
                borderRadius
            }}
        />
    );
};

export const PropertyCardSkeleton = () => (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <Skeleton height="200px" borderRadius="0" />
        <div style={{ padding: '1.5rem' }}>
            <Skeleton width="60%" height="1.5rem" className="mb-2" />
            <Skeleton width="40%" height="1rem" className="mb-4" />
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <Skeleton width="30%" height="0.75rem" />
                <Skeleton width="30%" height="0.75rem" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton width="40%" height="1.5rem" />
                <Skeleton width="25%" height="2rem" borderRadius="8px" />
            </div>
        </div>
    </div>
);

export const StatSkeleton = () => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Skeleton width="3rem" height="3rem" borderRadius="12px" />
        <div style={{ flex: 1 }}>
            <Skeleton width="50%" height="0.75rem" className="mb-2" />
            <Skeleton width="80%" height="1.5rem" />
        </div>
    </div>
);

export default Skeleton;
