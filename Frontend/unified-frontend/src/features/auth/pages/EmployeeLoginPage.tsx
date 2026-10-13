import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Key, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const EmployeeLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<'EMPLOYEE' | 'MainAdmin' | 'Manager'>('EMPLOYEE');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      // Retrieve the shopStaff data directly from the backend
      const response = await fetch('http://localhost:8081/api/staff');
      if (!response.ok) {
        throw new Error('Unable to fetch shopStaff data');
      }

      const staffList: any[] = await response.json();

      // Find staff record by email
      const matched = staffList.find(
        (staff) => staff.email && staff.email.trim().toLowerCase() === email.trim().toLowerCase()
      );

      // Verify that the account exists and password matches
      if (!matched || (matched.password && matched.password !== password)) {
        setErrorMessage('You cannot log in.');
        setIsLoading(false);
        return;
      }

      // Check access_level database column in the response
      const dbAccessLevel = (matched.accessLevel || matched.access_level || '').trim();

      // Compare database field to the role the user selected
      let roleMatches = false;
      if (roleSelection === 'EMPLOYEE') {
        roleMatches = dbAccessLevel.toUpperCase() === 'EMPLOYEE';
      } else if (roleSelection === 'MainAdmin') {
        roleMatches =
          dbAccessLevel.toUpperCase() === 'ADMIN' ||
          dbAccessLevel.toUpperCase() === 'MAINADMIN' ||
          dbAccessLevel.toUpperCase() === 'MAIN_ADMIN';
      } else if (roleSelection === 'Manager') {
        roleMatches =
          dbAccessLevel.toUpperCase() === 'MANAGER' ||
          dbAccessLevel.toUpperCase() === 'MANAGEMENT';
      }

      // If the selected role does not match the database access_level, display error
      if (!roleMatches) {
        setErrorMessage('You cannot log in.');
        setIsLoading(false);
        return;
      }

      // Granted access based entirely on the validated assigned operational role
      setUser({
        userId: matched.userId || matched.id,
        name: matched.name || matched.email,
        email: matched.email,
        role: roleSelection === 'EMPLOYEE' ? 'ShopStaff' : roleSelection,
        accessLevel: dbAccessLevel,
        dateJoined: matched.dateJoined,
        qrCodeBase64: matched.qrCodeBase64,
      });

      navigate('/employee');
    } catch (err) {
      console.error('Error during operational staff login:', err);
      setErrorMessage('You cannot log in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
        <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748B', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}>
          <ArrowLeft size={14} /> Back to Customer Mart
        </Link>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
        Shop Staff Sign Portal
      </h2>

      {errorMessage && (
        <div
          id="login-error-message"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1rem',
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
            Work Email
          </label>
          <input
            id="work-email-input"
            type="email"
            required
            placeholder="e.g. shenoldisanayaka@gmail.com"
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
            id="password-input"
            type="password"
            required
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
          />
        </div>

        <div>
          <label
            htmlFor="assigned-operational-role"
            style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}
          >
            Assigned Operational Role
          </label>
          <select
            id="assigned-operational-role"
            value={roleSelection}
            onChange={(e) => setRoleSelection(e.target.value as 'EMPLOYEE' | 'MainAdmin' | 'Manager')}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="MainAdmin">MainAdmin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        <button
          type="submit"
          id="enter-portal-button"
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            backgroundColor: roleSelection === 'MainAdmin' ? '#D97706' : roleSelection === 'Manager' ? '#4F46E5' : '#0284C7',
            color: '#FFF',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Validating Credentials...
            </>
          ) : roleSelection === 'MainAdmin' ? (
            <>
              <ShieldCheck size={18} /> Enter Employee Portal
            </>
          ) : (
            <>
              <Key size={18} /> Enter Employee Portal
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EmployeeLoginPage;
