import React, { useState, useEffect } from 'react';
import { UserPlus, QrCode, Printer, Check, User } from 'lucide-react';

interface RegisteredStaff {
  userId: string;
  name: string;
  email: string;
  accessLevel: string;
  dateJoined: string;
  qrCodeBase64?: string;
}

const DEFAULT_STAFF_LIST: RegisteredStaff[] = [
  {
    userId: '9f24bf7c-86e5-401f-9da3-7e44a4701290',
    name: 'Saman Kumara',
    email: 'saman@disanayakeoil.lk',
    accessLevel: 'STAFF',
    dateJoined: '2026-09-01',
  },
  {
    userId: 'c580bfb9-450e-450f-a392-127d498cf112',
    name: 'Kasun Bandara',
    email: 'kasun@disanayakeoil.lk',
    accessLevel: 'STAFF',
    dateJoined: '2026-09-15',
  },
];

export const AccountCreationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accessLevel, setAccessLevel] = useState('STAFF');
  const [submitting, setSubmitting] = useState(false);
  const [createdStaff, setCreatedStaff] = useState<RegisteredStaff | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [staffList, setStaffList] = useState<RegisteredStaff[]>(() => {
    try {
      const stored = localStorage.getItem('doc_registered_staff');
      return stored ? JSON.parse(stored) : DEFAULT_STAFF_LIST;
    } catch {
      return DEFAULT_STAFF_LIST;
    }
  });

  useEffect(() => {
    localStorage.setItem('doc_registered_staff', JSON.stringify(staffList));
  }, [staffList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('http://localhost:8081/api/staff/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        const data = await res.json();
        const staffObj: RegisteredStaff = {
          userId: data.userId || 'staff-' + Math.random().toString(36).substring(7),
          name: data.name || name,
          email: data.email || email,
          accessLevel,
          dateJoined: data.dateJoined || new Date().toISOString().split('T')[0],
          qrCodeBase64: data.qrCodeBase64,
        };
        setCreatedStaff(staffObj);
        setStaffList([staffObj, ...staffList]);
        setToast(`Staff account for ${name} registered!`);
        setTimeout(() => setToast(null), 3000);
      } else {
        throw new Error('Registration failed');
      }
    } catch {
      // Offline fallback
      const staffObj: RegisteredStaff = {
        userId: 'staff-' + Math.random().toString(36).substring(7),
        name,
        email,
        accessLevel,
        dateJoined: new Date().toISOString().split('T')[0],
      };
      setCreatedStaff(staffObj);
      setStaffList([staffObj, ...staffList]);
      setToast(`Account created in offline mode for ${name}!`);
      setTimeout(() => setToast(null), 3000);
    } finally {
      setSubmitting(false);
      setName('');
      setEmail('');
    }
  };

  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Toast Alert */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0F172A',
            color: '#FFF',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 100,
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <Check size={18} color="#10B981" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#FFF',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
              MAINADMIN ROLE PRIVILEGE
            </span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Employee Account Creation & Badging Tool
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.15rem 0 0 0' }}>
            Register new ShopStaff members, configure permission clearance, and generate official QR badges for attendance.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Registration Form */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            New Staff Member Registration
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kasun Chamara"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Official Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kasun@disanayakeoil.lk"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.35rem' }}>
                Assigned Access Clearance
              </label>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFF' }}
              >
                <option value="STAFF">ShopStaff (POS Terminal & Operational modules)</option>
                <option value="ADMIN">MainAdmin (Full administrative & account privileges)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#D97706',
                color: '#FFF',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                marginTop: '0.5rem',
              }}
            >
              <UserPlus size={18} /> {submitting ? 'Generating Account...' : 'Generate Account & QR Badge'}
            </button>
          </form>
        </div>

        {/* QR Badge Card */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
            Credential Badge Preview
          </h3>

          {createdStaff ? (
            <div
              style={{
                border: '2px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', letterSpacing: '0.05em' }}>
                DISANAYAKE OIL CENTER — STAFF BADGE
              </div>

              {/* QR Image */}
              <div
                style={{
                  width: '160px',
                  height: '160px',
                  backgroundColor: '#FFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  padding: '8px',
                }}
              >
                {createdStaff.qrCodeBase64 ? (
                  <img
                    src={`data:image/png;base64,${createdStaff.qrCodeBase64}`}
                    alt="Staff Attendance QR"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <QrCode size={120} color="#0F172A" />
                )}
              </div>

              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>{createdStaff.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{createdStaff.email}</div>
                <div style={{ display: 'inline-block', marginTop: '0.35rem', backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.15rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                  Role: {createdStaff.accessLevel}
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B', marginTop: '0.4rem' }}>
                  UUID: {createdStaff.userId}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <button
                  onClick={handlePrintBadge}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.6rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFF',
                    color: '#334155',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={15} /> Print Badge
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', textAlign: 'center', padding: '2rem' }}>
              <QrCode size={56} style={{ marginBottom: '1rem', opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Submit the staff onboarding form to generate their official attendance QR credential.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Directory of Registered Staff */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>
          Directory of Registered Staff ({staffList.length})
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Employee Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Email Address</th>
              <th style={{ padding: '0.85rem 1rem' }}>System UUID</th>
              <th style={{ padding: '0.85rem 1rem' }}>Access Level</th>
              <th style={{ padding: '0.85rem 1rem' }}>Date Joined</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((st) => (
              <tr key={st.userId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '1rem', fontWeight: 700, color: '#0F172A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={15} color="#0284C7" /> {st.name}
                  </div>
                </td>
                <td style={{ padding: '1rem', color: '#64748B' }}>{st.email}</td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>
                  {st.userId}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      padding: '0.15rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: st.accessLevel === 'ADMIN' ? '#FEF3C7' : '#EFF6FF',
                      color: st.accessLevel === 'ADMIN' ? '#B45309' : '#2563EB',
                    }}
                  >
                    {st.accessLevel}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.8rem' }}>{st.dateJoined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountCreationPage;
