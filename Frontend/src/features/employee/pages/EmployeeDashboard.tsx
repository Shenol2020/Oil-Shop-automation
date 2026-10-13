import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import HoverRevealCards, { type CardItem } from '@/components/ui/cards';

export const EmployeeDashboard: React.FC = () => {
  const { user, role } = useAuthStore();
  const isMainAdmin = role === 'MainAdmin';

  const portalItems: CardItem[] = [
    {
      id: 'pos',
      title: 'POS System',
      subtitle: 'Checkout & Stock',
      imageUrl: '/portal_pos.jpg',
      link: '/employee/pos',
    },
    {
      id: 'orders',
      title: 'Order Management',
      subtitle: 'Dispatch & Packing',
      imageUrl: '/portal_orders.jpg',
      link: '/employee/orders',
    },
    {
      id: 'leave',
      title: 'Leave Management',
      subtitle: 'Time-Off & Vacation',
      imageUrl: '/portal_leave.jpg',
      link: '/employee/leave',
    },
    {
      id: 'attendance',
      title: 'Attendance & Salary',
      subtitle: 'QR Clock & Payroll',
      imageUrl: '/portal_attendance.jpg',
      link: '/employee/attendance-salary',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFF',
          padding: '2rem 2.25rem',
          borderRadius: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Operational Workspace
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0.25rem 0', color: '#FFF' }}>
            Welcome back, {user?.name || 'Staff Member'}
          </h1>
          <p style={{ margin: 0, color: '#CBD5E1', fontSize: '0.9rem' }}>
            Role: <strong style={{ color: isMainAdmin ? '#FBBF24' : '#38BDF8' }}>{role || 'ShopStaff'}</strong> | Status: Online
          </p>
        </div>

        {isMainAdmin && (
          <Link
            to="/employee/admin/accounts"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#FCD34D',
              padding: '0.65rem 1.15rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            <ShieldCheck size={16} />
            <span>Account Creation Tool</span>
          </Link>
        )}
      </div>

      {/* Minimalist 4-Card Portal Grid using HoverRevealCards */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Operational Portals
            </h2>
          </div>
        </div>

        {/* Hover Reveal Card Grid */}
        <HoverRevealCards items={portalItems} className="max-w-none p-0" />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
