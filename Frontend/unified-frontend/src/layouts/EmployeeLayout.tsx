import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  Store,
  ShieldCheck,
  ShieldAlert,
  Fuel,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const EmployeeLayout: React.FC = () => {
  const { user, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/employee/login');
  };

  const isMainAdmin = role === 'MainAdmin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
      {/* Top Header */}
      <header
        style={{
          height: '68px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          zIndex: 30,
        }}
      >
        {/* Brand & Back Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/employee"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              }}
            >
              <Fuel size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                Disanayake Oil Center
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Employee Operations</div>
            </div>
          </Link>
        </div>

        {/* User profile & actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              textDecoration: 'none',
              fontSize: '0.825rem',
              color: '#475569',
              fontWeight: 600,
              padding: '0.45rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FAFAFA',
            }}
          >
            <Store size={15} />
            <span>Switch to Customer Mart</span>
          </Link>

          <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isMainAdmin ? '#FEF3C7' : '#E0F2FE',
                color: isMainAdmin ? '#B45309' : '#0369A1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'ST'}
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>
                {user?.name || 'Staff User'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}>
                {isMainAdmin ? (
                  <>
                    <ShieldCheck size={12} color="#D97706" />
                    <span style={{ color: '#D97706', fontWeight: 700 }}>MainAdmin</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={12} color="#0284C7" />
                    <span style={{ color: '#0284C7', fontWeight: 700 }}>ShopStaff</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              backgroundColor: '#FFF',
              color: '#EF4444',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </header>

      {/* Page Content Body (Full Width) */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#F8FAFC' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
