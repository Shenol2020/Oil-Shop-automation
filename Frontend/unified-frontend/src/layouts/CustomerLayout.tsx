import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, LogOut, Fuel, ArrowRight } from 'lucide-react';
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Brand */}
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: '#0F172A',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
              }}
            >
              <Fuel size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.02em', color: '#0F172A' }}>
                Disanayake Oil Center
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>Customer Mart & Online Orders</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <NavLink
              to="/shop"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isActive ? '#059669' : '#475569',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                backgroundColor: isActive ? '#ECFDF5' : 'transparent',
              })}
            >
              <ShoppingBag size={17} />
              Catalog
            </NavLink>

            <NavLink
              to="/cart"
              style={({ isActive }) => ({
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                color: isActive ? '#059669' : '#475569',
                padding: '0.4rem 0.8rem',
                borderRadius: '8px',
                backgroundColor: isActive ? '#ECFDF5' : 'transparent',
              })}
            >
              <ShoppingCart size={17} />
              Cart
              {totalItems > 0 && (
                <span
                  style={{
                    backgroundColor: '#10B981',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '9999px',
                    padding: '0.1rem 0.45rem',
                    marginLeft: '0.2rem',
                  }}
                >
                  {totalItems}
                </span>
              )}
            </NavLink>

            {/* User Auth Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              {user && user.role === 'Customer' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#334155' }}>
                    <User size={16} color="#059669" />
                    <span style={{ fontWeight: 600 }}>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.35rem 0.65rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.8rem',
                      color: '#64748B',
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Link
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#059669',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #10B981',
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#FFF',
                      backgroundColor: '#10B981',
                      padding: '0.45rem 0.95rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Portal Switcher */}
              <Link
                to="/employee/login"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#64748B',
                  backgroundColor: '#F1F5F9',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  marginLeft: '0.5rem',
                }}
              >
                Staff Portal <ArrowRight size={13} />
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '1.5rem' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0', padding: '1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', fontSize: '0.825rem', color: '#64748B' }}>
          © 2026 Disanayake Oil Center. Unified Retail & Enterprise Portal.
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
