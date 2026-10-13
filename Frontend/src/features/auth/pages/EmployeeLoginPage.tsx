import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, Loader2, Eye, EyeOff, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export const EmployeeLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleSelection, setRoleSelection] = useState<'EMPLOYEE' | 'MainAdmin' | 'Manager'>('EMPLOYEE');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotHint, setShowForgotHint] = useState(false);

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
      {/* Title Header matching reference */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontSize: '1.9rem',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em',
          }}
        >
          Login
        </h1>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div
          id="login-error-message"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.25)',
            border: '1px solid rgba(248, 113, 113, 0.45)',
            color: '#FEE2E2',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <AlertCircle size={17} color="#FCA5A5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Forgot Hint Alert */}
      {showForgotHint && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            padding: '0.65rem 0.9rem',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#FEF3C7',
            borderRadius: '12px',
            fontSize: '0.78rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <HelpCircle size={15} color="#FCD34D" />
            <span>Please contact administrator at <strong>admin@disanayakeoil.com</strong></span>
          </div>
          <button
            type="button"
            onClick={() => setShowForgotHint(false)}
            style={{ background: 'none', border: 'none', color: '#FEF3C7', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800 }}
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Role Segmented Tabs & Synced Select */}
        <div style={{ marginBottom: '1.15rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.88)' }}>
              Assigned Role
            </label>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.35rem',
              padding: '4px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {[
              { id: 'EMPLOYEE', label: 'Staff' },
              { id: 'Manager', label: 'Manager' },
              { id: 'MainAdmin', label: 'Admin' },
            ].map((r) => {
              const active = roleSelection === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleSelection(r.id as any)}
                  style={{
                    padding: '0.5rem 0.25rem',
                    borderRadius: '9px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: active ? 700 : 500,
                    backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                    color: active ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                    boxShadow: active ? '0 2px 8px rgba(0, 0, 0, 0.25)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Synchronized select element preserved for automation tests */}
          <select
            id="assigned-operational-role"
            value={roleSelection}
            onChange={(e) => setRoleSelection(e.target.value as any)}
            style={{ display: 'none' }}
          >
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="MainAdmin">MainAdmin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>

        {/* Email Field matching reference */}
        <div style={{ marginBottom: '1rem' }}>
          <label
            htmlFor="work-email-input"
            style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem' }}
          >
            Email
          </label>
          <input
            id="work-email-input"
            type="email"
            required
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6366F1';
              e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.35)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
            }}
          />
        </div>

        {/* Password Field with eye icon toggle matching reference */}
        <div style={{ marginBottom: '0.45rem' }}>
          <label
            htmlFor="password-input"
            style={{ display: 'block', fontSize: '0.825rem', fontWeight: 500, color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem' }}
          >
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="password-input"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 2.85rem 0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#6366F1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.35)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.08)';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Forgot Password Link matching reference */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setShowForgotHint(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.78)',
              fontSize: '0.78rem',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.78)')}
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign in Button matching vibrant blue pill button in reference */}
        <button
          type="submit"
          id="enter-portal-button"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '0.8rem 1rem',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #3B82F6 100%)',
            color: '#FFFFFF',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 8px 20px -2px rgba(79, 70, 229, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: isLoading ? 0.8 : 1,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 12px 25px -2px rgba(79, 70, 229, 0.65)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px -2px rgba(79, 70, 229, 0.5)';
          }}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Validating Credentials...</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>

        {/* Footer Link matching reference "Don't have an account yet? Register for free" */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.75)' }}>
          Customer mart?{' '}
          <Link
            to="/shop"
            style={{
              color: '#FFFFFF',
              fontWeight: 700,
              textDecoration: 'none',
              borderBottom: '1px dashed rgba(255, 255, 255, 0.4)',
            }}
          >
            Return to Shop
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EmployeeLoginPage;
