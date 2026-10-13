import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Fuel } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(10, 15, 29, 0.45) 0%, rgba(7, 10, 20, 0.8) 100%), url("/login_oil_bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        padding: '2rem 1.25rem',
        overflow: 'hidden',
      }}
    >
      {/* Ambient optical glow orbs behind glass card */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '28%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '18%',
          right: '28%',
          width: '380px',
          height: '380px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Frosted Glassmorphism Card matching user reference */}
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.28)',
          boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)',
          padding: '2.5rem 2.25rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* "Your logo" header matching reference */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.65rem',
              textDecoration: 'none',
              color: '#FFFFFF',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Return to Customer Mart"
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
              }}
            >
              <Fuel size={20} color="#FFFFFF" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.925rem', fontWeight: 800, letterSpacing: '0.12em', color: '#FFFFFF', lineHeight: 1.15 }}>
                DISANAYAKE
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.22em', color: '#FCD34D', textTransform: 'uppercase' }}>
                OIL CENTER
              </div>
            </div>
          </Link>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
