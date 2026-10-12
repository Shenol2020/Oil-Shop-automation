import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Key } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const EmployeeLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@disanayakeoil.lk');
  const [password, setPassword] = useState('password123');
  const [roleSelection, setRoleSelection] = useState<'ShopStaff' | 'MainAdmin'>('MainAdmin');
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      userId: roleSelection === 'MainAdmin' ? 'admin-uuid-001' : 'staff-uuid-002',
      name: roleSelection === 'MainAdmin' ? 'Admin Manager' : 'Shop Staff User',
      email,
      role: roleSelection,
      accessLevel: roleSelection === 'MainAdmin' ? 'ADMIN' : 'STAFF',
    });
    navigate('/employee');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748B', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
          <ArrowLeft size={14} /> Back to Customer Mart
        </Link>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
        Employee Portal Sign In
      </h2>
      <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.5rem' }}>
        Restricted to authorized ShopStaff and MainAdmin personnel.
      </p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
            Work Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
            Assigned Operational Role
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setRoleSelection('ShopStaff')}
              style={{
                padding: '0.6rem',
                borderRadius: '8px',
                border: roleSelection === 'ShopStaff' ? '2px solid #0284C7' : '1px solid #CBD5E1',
                backgroundColor: roleSelection === 'ShopStaff' ? '#F0F9FF' : '#FFF',
                color: roleSelection === 'ShopStaff' ? '#0284C7' : '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ShopStaff
            </button>
            <button
              type="button"
              onClick={() => setRoleSelection('MainAdmin')}
              style={{
                padding: '0.6rem',
                borderRadius: '8px',
                border: roleSelection === 'MainAdmin' ? '2px solid #D97706' : '1px solid #CBD5E1',
                backgroundColor: roleSelection === 'MainAdmin' ? '#FEF3C7' : '#FFF',
                color: roleSelection === 'MainAdmin' ? '#B45309' : '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              MainAdmin
            </button>
          </div>
        </div>

        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: roleSelection === 'MainAdmin' ? '#D97706' : '#0284C7',
            color: '#FFF',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '0.5rem',
          }}
        >
          {roleSelection === 'MainAdmin' ? <ShieldCheck size={18} /> : <Key size={18} />} Enter Employee Portal
        </button>
      </form>
    </div>
  );
};

export default EmployeeLoginPage;
