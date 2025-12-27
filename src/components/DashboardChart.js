"use client";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function DashboardChart({ type = 'line', data, options }) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: { size: 12, weight: '600' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
                callbacks: {
                    labelColor: (context) => ({
                        borderColor: context.dataset.borderColor,
                        backgroundColor: context.dataset.borderColor,
                    })
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b' }
            },
            y: {
                grid: { color: '#f1f5f9' },
                ticks: { color: '#64748b' }
            }
        },
        ...options,
    };

    if (!data) return <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>No data available to display.</div>;

    // Apply linear gradients if datasets specify them
    const processedData = {
        ...data,
        datasets: data.datasets.map(dataset => {
            if (dataset.useGradient && typeof shadowRoot === 'undefined') {
                return {
                    ...dataset,
                    backgroundColor: (context) => {
                        const chart = context.chart;
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return null;
                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                        gradient.addColorStop(0, dataset.gradientColors?.[0] || 'rgba(79, 70, 229, 0)');
                        gradient.addColorStop(1, dataset.gradientColors?.[1] || 'rgba(79, 70, 229, 0.4)');
                        return gradient;
                    },
                    fill: true,
                    tension: 0.4
                };
            }
            if (dataset.isProjected) {
                return {
                    ...dataset,
                    borderDash: [5, 5],
                    pointStyle: 'circle',
                    pointRadius: 4,
                };
            }
            return dataset;
        })
    };

    if (type === 'bar') return <Bar data={processedData} options={defaultOptions} />;
    if (type === 'doughnut') return <Doughnut data={processedData} options={defaultOptions} />;
    return <Line data={processedData} options={defaultOptions} />;
}
