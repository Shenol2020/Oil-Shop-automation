import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  ClipboardList,
  CalendarDays,
  Clock,
  UserPlus,
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

  const navItems = [
    {
      to: '/employee',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/employee/pos',
      label: 'POS System',
      icon: Calculator,
      description: 'Point of sale, sales & billing',
    },
    {
      to: '/employee/orders',
      label: 'Order Management',
      icon: ClipboardList,
      description: 'Online customer orders approval',
    },
    {
      to: '/employee/leave',
      label: 'Leave Management',
      icon: CalendarDays,
      description: 'Leave requests & approval hub',
    },
    {
      to: '/employee/attendance-salary',
      label: 'Attendance & Salary',
      icon: Clock,
      description: 'QR scanner & daily wages',
    },
    {
      to: '/employee/admin/accounts',
      label: 'Account Creation',
      icon: UserPlus,
      description: 'MainAdmin staff onboarding',
      restricted: true,
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 30,
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A', letterSpacing: '-0.01em' }}>
                Disanayake Oil Center
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Employee Operations</div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Core Operations
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isItemDisabled = item.restricted && !isMainAdmin;

            return (
              <NavLink
                key={item.to}
                to={isItemDisabled ? '#' : item.to}
                end={item.end}
                onClick={(e) => {
                  if (isItemDisabled) {
                    e.preventDefault();
                    alert('Access Restricted: This tool is exclusively accessible to MainAdmin users.');
                  }
                }}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                  backgroundColor: !isItemDisabled && isActive ? '#F0F9FF' : 'transparent',
                  color: isItemDisabled ? '#94A3B8' : isActive ? '#0284C7' : '#334155',
                  cursor: isItemDisabled ? 'not-allowed' : 'pointer',
                  opacity: isItemDisabled ? 0.65 : 1,
                })}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.restricted && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '9999px',
                      backgroundColor: isMainAdmin ? '#FEF3C7' : '#F1F5F9',
                      color: isMainAdmin ? '#D97706' : '#94A3B8',
                    }}
                  >
                    {isMainAdmin ? 'Admin' : 'Locked'}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}>
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              fontSize: '0.825rem',
              color: '#475569',
              fontWeight: 600,
              padding: '0.5rem',
              borderRadius: '8px',
            }}
          >
            <Store size={16} />
            <span>Switch to Customer Mart</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header
          style={{
            height: '64px',
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748B' }}>Workspace:</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0F172A' }}>Disanayake Oil Center Operations</span>
          </div>

          {/* User profile & actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
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
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                  {user?.name || 'Staff User'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem' }}>
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
                border: '1px solid #E2E8F0',
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

        {/* Page Content Body */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
