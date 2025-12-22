"use client";
import FadeIn from "@/components/FadeIn";

export default function AboutPage() {
    return (
        <div style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            <FadeIn>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), #2563EB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>About HomeConnect</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--muted)', maxWidth: '700px', margin: '0 auto' }}>Reimagining the real estate experience with technology, transparency, and trust.</p>
                </div>
            </FadeIn>

            <FadeIn delay={0.2}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '4rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Our Mission</h2>
                        <p style={{ lineHeight: 1.8, color: 'var(--muted)', fontSize: '1.1rem' }}>
                            At HomeConnect, we believe that finding your dream home should be an exciting journey, not a stressful chore. Our mission is to empower buyers, sellers, and agents with cutting-edge tools and data-driven insights.
                            <br /><br />
                            We are building a platform where transparency is the norm, and every interaction is seamless. Whether you are looking for a cozy apartment or a luxury villa, we are here to guide you home.
                        </p>
                    </div>
                    <div style={{ height: '400px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                        <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Our Office"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </FadeIn>

            <FadeIn delay={0.4}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '3rem' }}>Why Choose Us?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: "Wide Selection", desc: "Access thousands of verified listings across the country." },
                            { title: "Trusted Agents", desc: "Work with top-rated professionals who know the market." },
                            { title: "Smart Technology", desc: "Use AI-powered tools to find the perfect match." }
                        ].map((item, i) => (
                            <div key={i} className="card" style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--primary)' }}>{item.title}</h3>
                                <p style={{ color: 'var(--muted)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </div>
    );
}
