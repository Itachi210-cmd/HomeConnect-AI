"use client";
import { useState, useEffect } from 'react';
import { useProperties } from '@/context/PropertyContext';
import { Search, MapPin, DollarSign, Home as HomeIcon, ArrowRight, Star, Users, TrendingUp, Shield, Brain, Sparkles, Zap } from 'lucide-react';
import Button from '@/components/Button';
import PropertyCard from '@/components/PropertyCard';

export default function Home() {
  const { properties, loading } = useProperties();

  // Use first 3 real properties, or fallback to empty array
  // We can filter by "Featured" later if we add that field to DB
  const featuredProperties = properties?.slice(0, 3) || [];
  const [stats, setStats] = useState({
    propertiesSold: '2.5k+',
    activeListings: '1.2k+',
    citiesCovered: '150+',
    happyClients: '12k+'
  });
  const [searchMode, setSearchMode] = useState('buy'); // 'buy' or 'rent'

  useEffect(() => {
    fetch('/api/stats/public')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats({
            propertiesSold: `${data.propertiesSold}+`,
            activeListings: `${data.activeListings}+`,
            citiesCovered: `${data.citiesCovered}+`,
            happyClients: `${data.happyClients}+`
          });
        }
      })
      .catch(err => console.error("Stats fetch failed:", err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 1rem',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=100")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8))',
            backdropFilter: 'blur(2px)'
          }}></div>
        </div>

        <div className="container animate-slide-up" style={{ maxWidth: '900px', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '2rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            ✨ The #1 AI-Powered Real Estate Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: '800',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>
            Find Your Dream Home <br />
            <span style={{
              background: 'linear-gradient(to right, #818CF8, #34D399)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Without The Hassle
            </span>
          </h1>

          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: '#CBD5E1', maxWidth: '600px', margin: '0 auto 3rem', fontWeight: '500', lineHeight: 1.6 }}>
            Experience the future of property search with our intelligent matching system. We find homes that fit your lifestyle, not just your budget.
          </p>

          {/* Search Bar */}
          <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            padding: '1rem',
            borderRadius: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            boxShadow: 'var(--shadow-xl)',
            maxWidth: '900px',
            margin: '0 auto',
            flexDirection: 'column', // Changed to column to stack tabs
            padding: 0, // Reset padding for inner container
            background: 'transparent', // Reset background
            border: 'none', // Reset border
            boxShadow: 'none', // Reset shadow
            backdropFilter: 'none', // Reset blur
          }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setSearchMode('buy')}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '2rem',
                  background: searchMode === 'buy' ? 'white' : 'rgba(255,255,255,0.2)',
                  color: searchMode === 'buy' ? 'var(--primary)' : 'white',
                  fontWeight: '700',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
              >
                Buy
              </button>
              <button
                onClick={() => setSearchMode('rent')}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '2rem',
                  background: searchMode === 'rent' ? 'white' : 'rgba(255,255,255,0.2)',
                  color: searchMode === 'rent' ? 'var(--primary)' : 'white',
                  fontWeight: '700',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  border: 'none'
                }}
              >
                Rent
              </button>
            </div>

            {/* Inputs Container */}
            <div style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(16px)',
              border: '1px solid var(--glass-border)',
              padding: '1rem',
              borderRadius: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-xl)',
              width: '100%'
            }}>
              <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <MapPin className="text-secondary" size={20} />
                <input type="text" placeholder="Location" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'white', background: 'transparent' }} />
              </div>
              <div style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <HomeIcon className="text-secondary" size={20} />
                <select style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'white', background: 'transparent', cursor: 'pointer' }}>
                  <option style={{ color: 'black' }}>Type</option>
                  <option style={{ color: 'black' }}>House</option>
                  <option style={{ color: 'black' }}>Apartment</option>
                  <option style={{ color: 'black' }}>Condo</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <DollarSign className="text-secondary" size={20} />
                <select style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: 'white', background: 'transparent', cursor: 'pointer' }}>
                  <option style={{ color: 'black' }}>Price</option>
                  <option style={{ color: 'black' }}>₹50L - ₹1 Cr</option>
                  <option style={{ color: 'black' }}>₹1 Cr - ₹3 Cr</option>
                  <option style={{ color: 'black' }}>₹3 Cr+</option>
                </select>
              </div>
              <Button size="lg" className="btn-primary" style={{ minWidth: '120px', borderRadius: '1rem' }} onClick={() => window.location.href = '/properties'}>Search</Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section style={{ padding: '4rem 0', position: 'relative', zIndex: 20, background: 'var(--bg-subtle)' }}>
        <div className="container">
          <div className="grid-cols-1 md:grid-cols-3" style={{ display: 'grid', gap: '2rem' }}>
            <div className="card glass hover-scale animate-slide-up delay-100" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '3rem', height: '3rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                <Brain size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Smart Match™</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>We analyze your lifestyle preferences to find homes that truly fit you, beyond just basic filters.</p>
            </div>
            <div className="card glass hover-scale animate-slide-up delay-200" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '3rem', height: '3rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                <TrendingUp size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Price Prediction</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Our AI analyzes market trends to tell you if a property is priced fairly or if you should negotiate.</p>
            </div>
            <div className="card glass hover-scale animate-slide-up delay-300" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', width: '3rem', height: '3rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                <Zap size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem' }}>Instant Support</h3>
              <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Get 24/7 answers to your real estate questions from our specialized AI assistant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section style={{ padding: '6rem 0', background: 'var(--background)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '4rem' }}>
            <div>
              <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '0.5rem', letterSpacing: '-0.02em', display: 'inline-block' }}>Featured Properties</h2>
              <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Handpicked selection of premium properties.</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/properties'} style={{ borderRadius: '0.75rem', fontWeight: '700' }}>
              View All <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
            </Button>
          </div>

          <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ display: 'grid', gap: '2rem' }}>
            {loading ? (
              <div style={{ colSpan: 3, gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                Loading properties...
              </div>
            ) : featuredProperties.length > 0 ? (
              featuredProperties.map(prop => (
                <PropertyCard key={prop.id} property={prop} />
              ))
            ) : (
              <div style={{ colSpan: 3, gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                No properties found. <br /> <br />
                <Button variant="outline" onClick={() => window.location.href = '/agent/dashboard/add-property'}>Add Property (Agent)</Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-subtle)' }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="grid-cols-2 md:grid-cols-4" style={{ display: 'grid', gap: '2rem' }}>
            <div className="hover-scale animate-slide-up delay-100" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                <HomeIcon size={40} />
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem', color: 'var(--foreground)', lineHeight: 1 }}>{stats.propertiesSold}</div>
              <div style={{ color: 'var(--muted)', fontWeight: '600' }}>Properties Sold</div>
            </div>
            <div className="hover-scale animate-slide-up delay-200" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--secondary)' }}>
                <Search size={40} />
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem', color: 'var(--foreground)', lineHeight: 1 }}>{stats.activeListings}</div>
              <div style={{ color: 'var(--muted)', fontWeight: '600' }}>Active Listings</div>
            </div>
            <div className="hover-scale animate-slide-up delay-300" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                <MapPin size={40} />
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem', color: 'var(--foreground)', lineHeight: 1 }}>{stats.citiesCovered}</div>
              <div style={{ color: 'var(--muted)', fontWeight: '600' }}>Cities Covered</div>
            </div>
            <div className="hover-scale animate-slide-up delay-300" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '1.5rem', border: '1px solid var(--border)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: '#8B5CF6' }}>
                <Users size={40} />
              </div>
              <div style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '0.5rem', color: 'var(--foreground)', lineHeight: 1 }}>{stats.happyClients}</div>
              <div style={{ color: 'var(--muted)', fontWeight: '600' }}>Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ padding: '8rem 0', background: 'var(--background)' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)',
            borderRadius: '3rem',
            padding: '5rem 2rem',
            textAlign: 'center',
            color: 'var(--foreground)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1rem', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #818CF8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Subscribe to our Newsletter</h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--muted)', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
                Join 10,000+ owners and buyers receiving exclusive market insights and hot property alerts.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap', padding: '0.5rem', background: 'var(--input)', borderRadius: '999px', border: '1px solid var(--border)' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  style={{
                    flex: 1,
                    padding: '1rem 2rem',
                    borderRadius: '999px',
                    border: 'none',
                    outline: 'none',
                    minWidth: '200px',
                    background: 'transparent',
                    color: 'var(--foreground)',
                    fontSize: '1rem'
                  }}
                />
                <Button style={{ borderRadius: '999px', padding: '0.75rem 2rem', fontWeight: '700', boxShadow: 'none' }}>
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
            <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '10rem 0', background: 'var(--input)', color: 'var(--foreground)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '5rem', letterSpacing: '-0.02em', display: 'inline-block' }}>What Our Users Say</h2>
          <div className="grid-cols-1 md:grid-cols-3" style={{ display: 'grid', gap: '2.5rem' }}>
            {[
              { name: "Priya Sharma", role: "Software Engineer", text: "HomeConnect made finding my apartment in Bangalore so easy. The AI recommendations were spot on!" },
              { name: "Rahul Verma", role: "Business Owner", text: "I sold my property in Mumbai within a week. The agent tools are incredibly powerful and easy to use." },
              { name: "Anjali Gupta", role: "First-time Buyer", text: "The mortgage calculator and neighborhood insights gave me the confidence to buy my first home." }
            ].map((testimonial, i) => (
              <div key={i} className="card glass hover-scale" style={{ textAlign: 'left', padding: '2.5rem', borderRadius: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                </div>
                <p style={{ color: 'var(--muted)', marginBottom: '2.5rem', lineHeight: 1.8, fontSize: '1.15rem', fontStyle: 'italic', fontWeight: '500' }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '1.25rem',
                    boxShadow: 'var(--shadow)'
                  }}>
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--foreground)' }}>{testimonial.name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '700' }}>{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
