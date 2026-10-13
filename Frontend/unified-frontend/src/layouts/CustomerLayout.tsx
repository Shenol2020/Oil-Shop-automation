import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, ArrowRight, Droplets, PhoneCall } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export const CustomerLayout: React.FC = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/shop');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#07080B', color: '#F8FAFC' }}>
      {/* Top Navbar matching Reference Design */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(7, 8, 11, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.12)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0.85rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Brand Logo - Bold Minimalist like 'MORPHO' */}
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              color: '#FFFFFF',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.35)',
              }}
            >
              <Droplets size={20} color="#000" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif" }}>
                DISANAYAKE
              </div>
              <div style={{ fontSize: '0.65rem', color: '#E5A93C', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}>
                MOTOR OILS & FLUIDS
              </div>
            </div>
          </Link>

          {/* Center Floating Docked Pill Menu */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '0.3rem 0.65rem',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.06), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <NavLink
              to="/shop"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                color: isActive ? '#F59E0B' : '#CBD5E1',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                backgroundColor: isActive ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <Droplets size={14} color="#F59E0B" />
              <span>Our Oils</span>
            </NavLink>

            <a
              href="#contact-section"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.825rem',
                color: '#CBD5E1',
                padding: '0.45rem 0.95rem',
                borderRadius: '9999px',
                transition: 'all 0.2s ease',
              }}
            >
              <PhoneCall size={14} />
              <span>Store Contact</span>
            </a>
          </nav>

          {/* Right Controls: Language, Promo, Cart & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>

            {/* Promo Pill Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#CBD5E1',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
              }}
            >
              <span style={{ color: '#F59E0B' }}>20% off</span>
              <span style={{ border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.7rem', color: '#FDE68A', fontFamily: 'monospace' }}>
                DOCSYNTH20
              </span>
              <span style={{ color: '#64748B', fontSize: '0.7rem' }}>Through Oct. 15 ↗</span>
            </div>

            {/* Cart Pill Button matching 'Shop MORPHO ↗' */}
            <Link
              to="/cart"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#FFFFFF',
                color: '#07080B',
                padding: '0.55rem 1.15rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '0.825rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(255, 255, 255, 0.15)',
                transition: 'all 0.2s ease',
              }}
            >
              <ShoppingCart size={15} color="#07080B" />
              <span>Shoping Cart ({totalItems})</span>
              <span style={{ fontSize: '0.85rem' }}>↗</span>
            </Link>

            {/* Auth Info */}
            {user && user.role === 'Customer' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#CBD5E1' }}>
                  <User size={15} color="#F59E0B" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.3rem 0.55rem',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                  }}
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  color: '#CBD5E1',
                  textDecoration: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '0.45rem 0.75rem',
                }}
              >
                Sign In
              </Link>
            )}

            {/* Staff Portal Link */}
            <Link
              to="/employee/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#E5A93C',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '0.4rem 0.7rem',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              <span>Staff Portal</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Outlet */}
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>

      {/* Luxury Dark Footer */}
      <footer
        id="contact-section"
        style={{
          backgroundColor: '#050608',
          borderTop: '1px solid rgba(245, 158, 11, 0.15)',
          padding: '3rem 2rem 2rem',
          color: '#94A3B8',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.35rem', color: '#FFF', fontFamily: "'Space Grotesk', sans-serif" }}>
                DISANAYAKE OIL CENTER
              </div>
              <p style={{ maxWidth: '380px', fontSize: '0.85rem', color: '#64748B', marginTop: '0.4rem', lineHeight: 1.6 }}>
                Sri Lanka's leading automotive lubricant and fluid specialist. Formulated for extreme tropical heat, heavy load cycles, and extended engine longevity.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', fontSize: '0.825rem' }}>
              <div>
                <h4 style={{ color: '#FFF', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                  Motor Lubricants
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <a href="#catalog-section" style={{ color: '#94A3B8', textDecoration: 'none' }}>0W-20 Ultra Synthetic</a>
                  <a href="#catalog-section" style={{ color: '#94A3B8', textDecoration: 'none' }}>5W-40 Titanium Synthetic</a>
                  <a href="#catalog-section" style={{ color: '#94A3B8', textDecoration: 'none' }}>10W-30 Turbo Diesel Spec</a>
                  <a href="#catalog-section" style={{ color: '#94A3B8', textDecoration: 'none' }}>75W-90 GL-5 Gear Oil</a>
                </div>
              </div>

              <div>
                <h4 style={{ color: '#FFF', fontWeight: 800, marginBottom: '0.75rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                  Customer Care
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span>Hotline: +94 77 123 4567</span>
                  <span>WhatsApp: +94 71 922 3844</span>
                  <span>Location: Kurunegala, Sri Lanka</span>
                  <span>Store Hours: Mon - Sat 8:00 AM - 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem' }}>
            <span>© 2026 Disanayake Oil Center. All Rights Reserved. Engineered with Pride.</span>
            <span style={{ color: '#E5A93C' }}>Powered by Pure Viscosity & High-Performance Lubrication.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
