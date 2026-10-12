import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  ClipboardList,
  CalendarDays,
  Clock,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const EmployeeDashboard: React.FC = () => {
  const { user, role } = useAuthStore();
  const isMainAdmin = role === 'MainAdmin';

  const sections = [
    {
      title: 'POS System',
      description: 'In-store cashier checkout terminal, product inventory, sales logging & receipts.',
      icon: Calculator,
      link: '/employee/pos',
      color: '#10B981',
      bg: '#ECFDF5',
      badge: 'Active Terminal',
    },
    {
      title: 'Order Management',
      description: 'Review pending online orders submitted by customers, verify items & approve dispatches.',
      icon: ClipboardList,
      link: '/employee/orders',
      color: '#3B82F6',
      bg: '#EFF6FF',
      badge: 'Review & Approve',
    },
    {
      title: 'Leave Management',
      description: 'Submit leave requests, inspect balance allowances & process administrative approvals.',
      icon: CalendarDays,
      link: '/employee/leave',
      color: '#8B5CF6',
      bg: '#F5F3FF',
      badge: 'Staff & Manager',
    },
    {
      title: 'Attendance & Salary',
      description: 'Scan employee QR badges with camera, log arrival/departure & compute daily earnings.',
      icon: Clock,
      link: '/employee/attendance-salary',
      color: '#F59E0B',
      bg: '#FEF3C7',
      badge: 'QR Scanner',
    },
    {
      title: 'Account Creation Tool',
      description: 'Onboard new shop staff members, generate official QR credentials, and manage system users.',
      icon: UserPlus,
      link: '/employee/admin/accounts',
      color: '#D97706',
      bg: '#FEF3C7',
      badge: isMainAdmin ? 'MainAdmin Access' : 'Restricted (MainAdmin)',
      restricted: !isMainAdmin,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFF',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Internal Workspace
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.25rem 0', color: '#FFF' }}>
            Welcome back, {user?.name || 'Staff Member'}
          </h1>
          <p style={{ margin: 0, color: '#CBD5E1', fontSize: '0.9rem' }}>
            Role: <strong style={{ color: isMainAdmin ? '#FBBF24' : '#38BDF8' }}>{role || 'ShopStaff'}</strong> | Status: Online
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.75rem 1.25rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>5</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Core Modules</div>
          </div>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '0.75rem 1.25rem', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>8081</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Backend Port</div>
          </div>
        </div>
      </div>

      {/* Grid of the 5 Sections */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
          Operational Portals
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.title}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  opacity: section.restricted ? 0.75 : 1,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: section.bg,
                        color: section.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px',
                        backgroundColor: section.bg,
                        color: section.color,
                      }}
                    >
                      {section.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                    {section.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    {section.description}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
                  {section.restricted ? (
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' }}>
                      Restricted to MainAdmin role
                    </span>
                  ) : (
                    <Link
                      to={section.link}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: section.color,
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                      }}
                    >
                      Launch Module <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
