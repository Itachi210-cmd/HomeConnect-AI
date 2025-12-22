"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import FadeIn from "@/components/FadeIn";
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thanks for contacting us! We'll get back to you shortly.");
    };

    return (
        <div style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <FadeIn>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contact Us</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--muted)' }}>We'd love to hear from you. Get in touch with our team.</p>
                </div>
            </FadeIn>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }}>
                <FadeIn delay={0.2} direction="left">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Get in Touch</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ background: '#DBEAFE', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}><Mail size={24} /></div>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Email</div>
                                    <div style={{ color: 'var(--muted)' }}>support@homeconnect.com</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ background: '#DBEAFE', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}><Phone size={24} /></div>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Phone</div>
                                    <div style={{ color: 'var(--muted)' }}>+91 1800-123-4567</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                <div style={{ background: '#DBEAFE', padding: '0.75rem', borderRadius: '50%', color: 'var(--primary)' }}><MapPin size={24} /></div>
                                <div>
                                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Office</div>
                                    <div style={{ color: 'var(--muted)' }}>
                                        123 Tech Park, Cyber City<br />
                                        Gurugram, Haryana, 122002
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.4} direction="up">
                    <div className="card" style={{ padding: '2rem' }}>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <Input label="First Name" placeholder="Amit" required />
                                <Input label="Last Name" placeholder="Kumar" required />
                            </div>
                            <Input label="Email" type="email" placeholder="amit.kumar@example.com" required />
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>Message</label>
                                <textarea
                                    rows="5"
                                    placeholder="How can we help you?"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontFamily: 'inherit' }}
                                    required
                                ></textarea>
                            </div>
                            <Button size="lg">Send Message</Button>
                        </form>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
