import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const CustomerLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Direct integration or mock session for scaffolding
      const res = await fetch('http://localhost:8081/api/customer_accounts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const customer = await res.json();
        setUser({
          userId: customer.userId || 'cust-1',
          name: customer.name || email.split('@')[0],
          email: customer.email,
          role: 'Customer',
        });
        navigate('/shop');
      } else {
        // Fallback for demo / scaffold if backend is offline or credentials don't match
        setError('Invalid email or password. Please verify your credentials.');
      }
    } catch {
      // Allow seamless scaffold testing
      setUser({
        userId: 'demo-customer',
        name: email.split('@')[0] || 'Demo Customer',
        email,
        role: 'Customer',
      });
      navigate('/shop');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 0.25rem 0', letterSpacing: '-0.02em' }}>
          Customer Sign In
        </h2>
        <p style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.72)', margin: 0 }}>
          Access your orders and precision lubricant history.
        </p>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.25)',
            border: '1px solid rgba(248, 113, 113, 0.45)',
            color: '#FEE2E2',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem' }}>
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem' }}>
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFF',
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '0.5rem',
            boxShadow: '0 8px 20px -2px rgba(16, 185, 129, 0.45)',
          }}
        >
          <LogIn size={18} /> Sign In
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.75)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#34D399', fontWeight: 700, textDecoration: 'none' }}>
          Create an account
        </Link>
      </div>

      <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', textAlign: 'center' }}>
        <Link
          to="/employee/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            color: '#FCD34D',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Are you a staff member? Employee Login <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
