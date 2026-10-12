import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  QrCode,
  Printer,
  Download,
  Check,
  User,
  Phone,
  MapPin,
  Lock,
  Search,
  ShieldCheck,
} from 'lucide-react';

type AccountType = 'employee' | 'manager' | 'main-admin';

interface RegisteredStaff {
  userId: string;
  name: string;
  email: string;
  password?: string;
  address?: string;
  phoneNumber?: string;
  accountType: AccountType;
  accessLevel: string;
  dateJoined: string;
  qrCodeBase64?: string;
}

const DEFAULT_STAFF_LIST: RegisteredStaff[] = [
  {
    userId: '9f24bf7c-86e5-401f-9da3-7e44a4701290',
    name: 'Saman Kumara',
    email: 'saman@disanayakeoil.lk',
    address: 'No 45, Kandy Road, Colombo',
    phoneNumber: '0771234567',
    accountType: 'employee',
    accessLevel: 'STAFF',
    dateJoined: '2026-09-01',
  },
  {
    userId: 'c580bfb9-450e-450f-a392-127d498cf112',
    name: 'Kasun Manager',
    email: 'kasun@gmail.com',
    address: 'Colombo 07',
    phoneNumber: '0779876543',
    accountType: 'manager',
    accessLevel: 'MANAGER',
    dateJoined: '2026-09-15',
  },
  {
    userId: 'a3c0f0d9-1e6a-4d88-bca8-54f1b5d91234',
    name: 'Admin Chief',
    email: 'admin@disanayakeoil.lk',
    address: 'Headquarters, Colombo',
    phoneNumber: '0714455667',
    accountType: 'main-admin',
    accessLevel: 'ADMIN',
    dateJoined: '2026-08-01',
  },
];

export const AccountCreationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('employee');

  const [submitting, setSubmitting] = useState(false);
  const [createdStaff, setCreatedStaff] = useState<RegisteredStaff | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Quick lookup state
  const [lookupId, setLookupId] = useState('');
  const [lookupType, setLookupType] = useState<AccountType>('manager');
  const [lookupLoading, setLookupLoading] = useState(false);

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

  const getEndpointForType = (type: AccountType) => {
    return `http://localhost:8081/api/${type}/register`;
  };

  const getLookupUrl = (type: AccountType, id: string) => {
    return `http://localhost:8081/api/${type}/${id}`;
  };

  const getRoleLabel = (type: AccountType) => {
    switch (type) {
      case 'employee':
        return 'Shop Employee';
      case 'manager':
        return 'Store Manager';
      case 'main-admin':
        return 'Main Administrator';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const targetUrl = getEndpointForType(accountType);

    // Exact payload format as requested
    const payload = {
      name,
      email,
      password,
      address,
      phoneNumber,
    };

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const staffObj: RegisteredStaff = {
          userId: data.userId || 'staff-' + Math.random().toString(36).substring(7),
          name: data.name || name,
          email: data.email || email,
          address: data.address || address,
          phoneNumber: data.phoneNumber || phoneNumber,
          accountType,
          accessLevel: data.accessLevel || (accountType === 'main-admin' ? 'ADMIN' : accountType.toUpperCase()),
          dateJoined: data.dateJoined || new Date().toISOString().split('T')[0],
          qrCodeBase64: data.qrCodeBase64,
        };
        setCreatedStaff(staffObj);
        setStaffList([staffObj, ...staffList]);
        setToast(`Successfully created ${getRoleLabel(accountType)}: ${name}!`);
        setTimeout(() => setToast(null), 3000);

        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setAddress('');
        setPhoneNumber('');
      } else {
        const errText = await res.text();
        throw new Error(errText || 'Failed to register account');
      }
    } catch (err: any) {
      console.warn('Backend call fallback:', err);
      // Fallback for offline testing
      const staffObj: RegisteredStaff = {
        userId: 'usr-' + Math.random().toString(36).substring(2, 10),
        name,
        email,
        address,
        phoneNumber,
        accountType,
        accessLevel: accountType === 'main-admin' ? 'ADMIN' : accountType.toUpperCase(),
        dateJoined: new Date().toISOString().split('T')[0],
      };
      setCreatedStaff(staffObj);
      setStaffList([staffObj, ...staffList]);
      setToast(`Account created (Local Cache): ${name}!`);
      setTimeout(() => setToast(null), 3000);

      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setAddress('');
      setPhoneNumber('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;

    setLookupLoading(true);
    const lookupUrl = getLookupUrl(lookupType, lookupId.trim());

    try {
      const res = await fetch(lookupUrl);
      if (res.ok) {
        const data = await res.json();
        const staffObj: RegisteredStaff = {
          userId: data.userId || lookupId,
          name: data.name || 'Found User',
          email: data.email || '',
          address: data.address || '',
          phoneNumber: data.phoneNumber || '',
          accountType: lookupType,
          accessLevel: data.accessLevel || lookupType.toUpperCase(),
          dateJoined: data.dateJoined || new Date().toISOString().split('T')[0],
          qrCodeBase64: data.qrCodeBase64,
        };
        setCreatedStaff(staffObj);
        setToast(`Found ${getRoleLabel(lookupType)} record!`);
        setTimeout(() => setToast(null), 2500);
      } else {
        // Search local state
        const local = staffList.find((s) => s.userId === lookupId.trim());
        if (local) {
          setCreatedStaff(local);
          setToast(`Found record in local cache!`);
          setTimeout(() => setToast(null), 2500);
        } else {
          alert(`No ${getRoleLabel(lookupType)} found with ID: ${lookupId}`);
        }
      }
    } catch {
      const local = staffList.find((s) => s.userId === lookupId.trim());
      if (local) {
        setCreatedStaff(local);
      } else {
        alert(`No account found with ID: ${lookupId}`);
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const handlePrintBadge = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (!createdStaff?.qrCodeBase64) return;
    const link = document.createElement('a');
    const src = createdStaff.qrCodeBase64.startsWith('data:image')
      ? createdStaff.qrCodeBase64
      : `data:image/png;base64,${createdStaff.qrCodeBase64}`;
    link.href = src;
    link.download = `${createdStaff.name.replace(/\s+/g, '_')}_qr_badge.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1200px', margin: '0 auto' }}>
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
          padding: '1.25rem 1.5rem',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '0.15rem 0.55rem', borderRadius: '9999px' }}>
              MAINADMIN PRIVILEGE
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Multi-Role Account Creation & Badging</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Employee Account Creation & Badging Tool
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
            Register <strong>employee</strong>, <strong>manager</strong>, or <strong>main-admin</strong> accounts with automatic QR badge generation.
          </p>
        </div>
      </div>

      {/* Main Grid: Form on Left, Badge on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Registration Form */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Register System Personnel
            </h3>
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0284C7', backgroundColor: '#F0F9FF', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
              POST /api/{accountType}/register
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Account Type Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                Assigned Access Clearance (Role Type)
              </label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as AccountType)}
                style={{
                  width: '100%',
                  padding: '0.7rem',
                  borderRadius: '8px',
                  border: '2px solid #CBD5E1',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFF',
                  fontWeight: 600,
                  color: '#0F172A',
                }}
              >
                <option value="employee">Employee (POS, In-store Staff) — /api/employee/register</option>
                <option value="manager">Manager (Shop Operations & Approvals) — /api/manager/register</option>
                <option value="main-admin">Main Admin (Full System Administrator) — /api/main-admin/register</option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Full Name
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kasun Manager"
                  style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kasun@gmail.com"
                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="e.g. 123456"
                  style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            {/* Address & Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Address
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Colombo"
                    style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.2rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                  Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0771234567"
                    style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 2.2rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* JSON Payload Preview */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.75rem' }}>
              <div style={{ color: '#64748B', fontWeight: 700, marginBottom: '0.2rem' }}>
                Payload Preview:
              </div>
              <code style={{ color: '#0F172A', fontFamily: 'monospace' }}>
                {`{ name: "${name || '...'}, email: "${email || '...'}", password: "••••", address: "${address || '...'}", phoneNumber: "${phoneNumber || '...'}" }`}
              </code>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: accountType === 'main-admin' ? '#D97706' : accountType === 'manager' ? '#0284C7' : '#10B981',
                color: '#FFF',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: submitting ? 'not-allowed' : 'pointer',
                marginTop: '0.25rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <UserPlus size={18} />
              {submitting ? 'Registering Account...' : `Register ${getRoleLabel(accountType)} & Generate QR Badge`}
            </button>
          </form>
        </div>

        {/* Right Column: QR Badge Card & Lookup Tool */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Quick Lookup by UUID Box */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <Search size={16} color="#0284C7" />
              <span>Lookup Account by UUID</span>
            </div>

            <form onSubmit={handleLookup} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <select
                value={lookupType}
                onChange={(e) => setLookupType(e.target.value as AccountType)}
                style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 600 }}
              >
                <option value="employee">Employee (/api/employee/{'{id}'})</option>
                <option value="manager">Manager (/api/manager/{'{id}'})</option>
                <option value="main-admin">Main Admin (/api/main-admin/{'{id}'})</option>
              </select>

              <input
                type="text"
                placeholder="Paste UUID..."
                value={lookupId}
                onChange={(e) => setLookupId(e.target.value)}
                style={{ flex: 1, minWidth: '160px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
              />

              <button
                type="submit"
                disabled={lookupLoading}
                style={{
                  padding: '0.5rem 0.85rem',
                  backgroundColor: '#0284C7',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {lookupLoading ? '...' : 'Fetch'}
              </button>
            </form>
          </div>

          {/* Badge Preview */}
          <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 1rem 0' }}>
              Credential Badge Preview
            </h3>

            {createdStaff ? (
              <div
                style={{
                  border: '2px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '1rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 800, color: '#059669', letterSpacing: '0.05em' }}>
                  <ShieldCheck size={16} /> DISANAYAKE OIL CENTER — OFFICIAL BADGE
                </div>

                {/* QR Image */}
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    backgroundColor: '#FFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                >
                  {createdStaff.qrCodeBase64 ? (
                    <img
                      src={
                        createdStaff.qrCodeBase64.startsWith('data:image')
                          ? createdStaff.qrCodeBase64
                          : `data:image/png;base64,${createdStaff.qrCodeBase64}`
                      }
                      alt="Staff Attendance QR"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <QrCode size={130} color="#0F172A" />
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                    {createdStaff.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{createdStaff.email}</div>
                  {createdStaff.phoneNumber && (
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Tel: {createdStaff.phoneNumber}</div>
                  )}
                  {createdStaff.address && (
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Location: {createdStaff.address}</div>
                  )}

                  <div style={{ marginTop: '0.5rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor:
                          createdStaff.accountType === 'main-admin'
                            ? '#FEF3C7'
                            : createdStaff.accountType === 'manager'
                            ? '#E0F2FE'
                            : '#ECFDF5',
                        color:
                          createdStaff.accountType === 'main-admin'
                            ? '#B45309'
                            : createdStaff.accountType === 'manager'
                            ? '#0369A1'
                            : '#059669',
                      }}
                    >
                      {getRoleLabel(createdStaff.accountType).toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B', marginTop: '0.5rem' }}>
                    UUID: <strong>{createdStaff.userId}</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
                  <button
                    onClick={handleDownloadQR}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #10B981',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Download size={15} /> Save QR Image
                  </button>

                  <button
                    onClick={handlePrintBadge}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      padding: '0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFF',
                      color: '#334155',
                      fontSize: '0.85rem',
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
                  Select account clearance and register to preview official QR credential badge.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Directory of Registered Personnel */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
            Registered Personnel Directory ({staffList.length})
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
            Employees, Managers, and Administrators
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Name</th>
              <th style={{ padding: '0.85rem 1rem' }}>Role Type</th>
              <th style={{ padding: '0.85rem 1rem' }}>Contact Info</th>
              <th style={{ padding: '0.85rem 1rem' }}>Address</th>
              <th style={{ padding: '0.85rem 1rem' }}>System UUID</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
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
                <td style={{ padding: '1rem' }}>
                  <span
                    style={{
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      backgroundColor:
                        st.accountType === 'main-admin'
                          ? '#FEF3C7'
                          : st.accountType === 'manager'
                          ? '#E0F2FE'
                          : '#ECFDF5',
                      color:
                        st.accountType === 'main-admin'
                          ? '#B45309'
                          : st.accountType === 'manager'
                          ? '#0369A1'
                          : '#059669',
                    }}
                  >
                    {getRoleLabel(st.accountType)}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ color: '#0F172A', fontSize: '0.85rem' }}>{st.email}</div>
                  <div style={{ color: '#64748B', fontSize: '0.75rem' }}>{st.phoneNumber || '—'}</div>
                </td>
                <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.85rem' }}>
                  {st.address || '—'}
                </td>
                <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.75rem', color: '#475569' }}>
                  {st.userId}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => setCreatedStaff(st)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFF',
                      color: '#0284C7',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    View Badge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountCreationPage;
