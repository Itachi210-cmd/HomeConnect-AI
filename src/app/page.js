"use client";
import { useState, useEffect } from 'react';
import { useProperties } from '@/context/PropertyContext';
import { Search, MapPin, DollarSign, Home as HomeIcon, ArrowRight, Star, Users, TrendingUp, Shield } from 'lucide-react';
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

          <p style={{ fontSize: '1.25rem', marginBottom: '3rem', color: '#CBD5E1', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Experience the future of property search with our intelligent matching system. We find homes that fit your lifestyle, not just your budget.
          </p>

          {/* Search Bar */}
          <div style={{
            background: 'white',
            padding: '0.75rem',
            borderRadius: '1rem',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <div style={{ flex: 1, minWidth: '180px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '0.75rem' }}>
              <MapPin className="text-primary" size={20} />
              <input type="text" placeholder="Location" style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1E293B', background: 'transparent' }} />
            </div>
            <div style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '0.75rem' }}>
              <HomeIcon className="text-primary" size={20} />
              <select style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1E293B', background: 'transparent', cursor: 'pointer' }}>
                <option>Type</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Condo</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '140px', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: '0.75rem' }}>
              <DollarSign className="text-primary" size={20} />
              <select style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', color: '#1E293B', background: 'transparent', cursor: 'pointer' }}>
                <option>Price</option>
                <option>₹50L - ₹1 Cr</option>
                <option>₹1 Cr - ₹3 Cr</option>
                <option>₹3 Cr+</option>
              </select>
            </div>
            <Button size="lg" style={{ minWidth: '120px', borderRadius: '0.75rem' }} onClick={() => window.location.href = '/properties'}>Search</Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section (Simplified) */}
      <section style={{ padding: '5rem 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Featured Properties</h2>
              <p style={{ color: 'var(--muted)' }}>Handpicked selection of premium properties.</p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = '/properties'}>View All <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} /></Button>
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
      <section style={{ padding: '5rem 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div className="grid-cols-2 md:grid-cols-4" style={{ display: 'grid', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{stats.propertiesSold}</div>
              <div style={{ opacity: 0.9 }}>Properties Sold</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{stats.activeListings}</div>
              <div style={{ opacity: 0.9 }}>Active Listings</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{stats.citiesCovered}</div>
              <div style={{ opacity: 0.9 }}>Cities Covered</div>
            </div>
            <div>
              <div style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{stats.happyClients}</div>
              <div style={{ opacity: 0.9 }}>Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            borderRadius: '2rem',
            padding: '4rem 2rem',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Subscribe to our Newsletter</h2>
              <p style={{ fontSize: '1.125rem', opacity: 0.9, marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Get the latest market updates, hot deals, and exclusive offers sent directly to your inbox.
              </p>
              <div style={{ display: 'flex', gap: '1rem', maxWidth: '500px', margin: '0 auto', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  style={{
                    flex: 1,
                    padding: '1rem 1.5rem',
                    borderRadius: '999px',
                    border: 'none',
                    outline: 'none',
                    minWidth: '250px'
                  }}
                />
                <Button style={{ background: 'white', color: 'var(--primary)', borderRadius: '999px', padding: '1rem 2rem', fontWeight: 'bold' }}>
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Decorative circles */}
            <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '8rem 0', background: 'var(--foreground)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '4rem' }}>What Our Users Say</h2>
          <div className="grid-cols-1 md:grid-cols-3" style={{ display: 'grid', gap: '2rem' }}>
            {[
              { name: "Priya Sharma", role: "Software Engineer", text: "HomeConnect made finding my apartment in Bangalore so easy. The AI recommendations were spot on!" },
              { name: "Rahul Verma", role: "Business Owner", text: "I sold my property in Mumbai within a week. The agent tools are incredibly powerful and easy to use." },
              { name: "Anjali Gupta", role: "First-time Buyer", text: "The mortgage calculator and neighborhood insights gave me the confidence to buy my first home." }
            ].map((testimonial, i) => (
              <div key={i} className="card" style={{ textAlign: 'left', background: '#1E293B', border: '1px solid #334155', color: 'white' }}>
                <div style={{ display: 'flex', gap: '0.25rem', color: '#F59E0B', marginBottom: '1.5rem' }}>
                  <Star fill="#F59E0B" size={18} />
                  <Star fill="#F59E0B" size={18} />
                  <Star fill="#F59E0B" size={18} />
                  <Star fill="#F59E0B" size={18} />
                  <Star fill="#F59E0B" size={18} />
                </div>
                <p style={{ color: '#CBD5E1', marginBottom: '2rem', lineHeight: 1.7, fontSize: '1.125rem', fontStyle: 'italic' }}>
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', background: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{testimonial.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#94A3B8' }}>{testimonial.role}</div>
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
