"use client";
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, User as UserIcon, LogOut, Bell, Settings, ChevronDown } from 'lucide-react';
import { useSession, signOut } from "next-auth/react"
import { useProperties } from '@/context/PropertyContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session } = useSession()
  const user = session?.user
  const pathname = usePathname();
  const profileRef = useRef(null);
  const { compareList } = useProperties() || { compareList: [] };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => pathname === path;

  const linkStyle = (path) => ({
    fontWeight: 600,
    color: isActive(path) ? 'var(--primary)' : 'var(--foreground)',
    position: 'relative',
    transition: 'color 0.2s'
  });

  return (
    <nav style={{
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '4rem' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem' }}>
          <div style={{
            background: 'var(--gradient-primary)',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Home size={24} />
          </div>
          <span className="text-gradient">HomeConnect</span>
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/properties" style={linkStyle('/properties')}>
            Properties
            {isActive('/properties') && <span style={{ position: 'absolute', bottom: '-4px', left: 0, right: 0, height: '2px', background: 'var(--primary)', borderRadius: '2px' }}></span>}
          </Link>

          {(user?.role === 'ADMIN' || user?.role === 'admin') && (
            <Link href="/admin/dashboard" style={linkStyle('/admin/dashboard')}>
              Admin Console
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <Link
                href={
                  (user.role === 'ADMIN' || user.role === 'admin') ? '/admin/dashboard' :
                    (user.role === 'buyer' || user.role === 'BUYER') ? '/buyer/dashboard' : '/agent/dashboard'
                }
                style={linkStyle(
                  (user.role === 'ADMIN' || user.role === 'admin') ? '/admin/dashboard' :
                    (user.role === 'buyer' || user.role === 'BUYER') ? '/buyer/dashboard' : '/agent/dashboard'
                )}
              >
                Dashboard
              </Link>

              <Link href="/messages" style={linkStyle('/messages')}>
                Messages
              </Link>

              {(user.role === 'buyer' || user.role === 'BUYER') && (
                <Link href="/buyer/wishlist" style={linkStyle('/buyer/wishlist')}>
                  Saved
                </Link>
              )}

              {(user.role === 'buyer' || user.role === 'BUYER') && (
                <Link href="/buyer/compare" style={linkStyle('/buyer/compare')}>
                  Compare {compareList.length > 0 && <span style={{ background: 'var(--primary)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '1rem', fontSize: '0.75rem' }}>{compareList.length}</span>}
                </Link>
              )}

              <NotificationBell />

              {/* User Dropdown */}
              <div style={{ position: 'relative' }} ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: 'var(--foreground)', cursor: 'pointer' }}
                >
                  <div style={{ width: '32px', height: '32px', background: '#E2E8F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
                    <UserIcon size={18} />
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown size={16} style={{ transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>

                {isProfileOpen && (
                  <div style={{
                    position: 'absolute',
                    top: '120%',
                    right: 0,
                    width: '200px',
                    background: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)',
                    padding: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                    animation: 'fadeIn 0.2s ease-out'
                  }}>
                    <Link href="/profile" className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.25rem', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                      <UserIcon size={16} /> Profile
                    </Link>
                    <Link href="/settings" className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.25rem', color: 'var(--foreground)', fontSize: '0.9rem' }}>
                      <Settings size={16} /> Settings
                    </Link>
                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.25rem 0' }}></div>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '0.25rem', color: '#EF4444', fontSize: '0.9rem', width: '100%', textAlign: 'left' }}>
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/buyer/dashboard" style={linkStyle('/buyer/dashboard')}>For Buyers</Link>
              <Link href="/agent/dashboard" style={linkStyle('/agent/dashboard')}>For Agents</Link>
              <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
              <Link href="/login" style={{ fontWeight: 600, color: 'var(--foreground)' }}>Log In</Link>
              <Link href="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'none', color: 'var(--foreground)' }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: 'var(--shadow)'
        }}>
          <Link href="/properties" onClick={() => setIsOpen(false)} style={{ color: isActive('/properties') ? 'var(--primary)' : 'var(--foreground)', fontWeight: '600' }}>Properties</Link>
          {(user?.role === 'ADMIN' || user?.role === 'admin') && (
            <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>
              Admin Console
            </Link>
          )}

          {user ? (
            <>
              <Link href={user.role === 'buyer' || user.role === 'BUYER' ? '/buyer/dashboard' : '/agent/dashboard'} onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>
                Dashboard
              </Link>
              <Link href="/messages" onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>
                Messages
              </Link>
              {(user.role === 'buyer' || user.role === 'BUYER') && (
                <>
                  <Link href="/buyer/wishlist" onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>
                    Saved Properties
                  </Link>
                  <Link href="/buyer/compare" onClick={() => setIsOpen(false)} style={{ fontWeight: '600' }}>
                    Compare Properties
                  </Link>
                </>
              )}
              <Link href="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserIcon size={18} /> Profile
              </Link>
              <Link href="/settings" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={18} /> Settings
              </Link>
              <button onClick={() => { signOut({ callbackUrl: '/' }); setIsOpen(false); }} style={{ textAlign: 'left', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/buyer/dashboard" onClick={() => setIsOpen(false)}>For Buyers</Link>
              <Link href="/agent/dashboard" onClick={() => setIsOpen(false)}>For Agents</Link>
              <hr style={{ borderColor: 'var(--border)' }} />
              <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
              <Link href="/register" className="btn btn-primary" onClick={() => setIsOpen(false)} style={{ textAlign: 'center' }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
        .dropdown-item:hover {
          background-color: #F1F5F9;
        }
      `}</style>
    </nav>
  );
}
