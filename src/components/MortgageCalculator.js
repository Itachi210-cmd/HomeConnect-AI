"use client";
import { useState, useEffect } from 'react';
import { X, Calculator, DollarSign, Percent, Calendar } from 'lucide-react';
import Button from '@/components/Button';
import Input from '@/components/Input';

export default function MortgageCalculator({ isOpen, onClose, propertyPrice = 0 }) {
    const [amount, setAmount] = useState(propertyPrice);
    const [rate, setRate] = useState(8.5);
    const [term, setTerm] = useState(20);
    const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        if (isOpen && propertyPrice) {
            setAmount(propertyPrice);
            setDownPayment(propertyPrice * 0.2);
        }
    }, [isOpen, propertyPrice]);

    useEffect(() => {
        calculatePayment();
    }, [amount, rate, term, downPayment]);

    const calculatePayment = () => {
        const principal = amount - downPayment;
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = term * 12;

        if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
            const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            setMonthlyPayment(payment);
        } else {
            setMonthlyPayment(0);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)'
        }} onClick={onClose}>
            <div
                style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    width: '100%',
                    maxWidth: '500px',
                    position: 'relative',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                onClick={e => e.stopPropagation()}
                className="animate-in fade-in zoom-in duration-300"
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--muted)' }}
                >
                    <X size={24} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                    <div style={{ padding: '0.5rem', background: '#DBEAFE', borderRadius: '0.5rem' }}>
                        <Calculator size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--foreground)' }}>Mortgage Calculator</h2>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <Input
                        label="Property Price (₹)"
                        type="number"
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                    />

                    <Input
                        label="Down Payment (₹)"
                        type="number"
                        value={downPayment}
                        onChange={e => setDownPayment(Number(e.target.value))}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input
                            label="Interest Rate (%)"
                            type="number"
                            step="0.1"
                            value={rate}
                            onChange={e => setRate(Number(e.target.value))}
                        />
                        <Input
                            label="Loan Term (Years)"
                            type="number"
                            value={term}
                            onChange={e => setTerm(Number(e.target.value))}
                        />
                    </div>

                    <div style={{
                        marginTop: '1.5rem',
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #2563EB 100%)',
                        borderRadius: '0.75rem',
                        color: 'white',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.25rem' }}>Estimated Monthly Payment</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(monthlyPayment)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
