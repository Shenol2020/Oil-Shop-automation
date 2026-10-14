import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  CheckCircle,
  XCircle,
  User,
  Check,
  RefreshCw,
  Bell,
  BellRing
} from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { API_BASE_URL } from '@/services/api';

interface LeaveItem {
  id: number;
  userId: string | number;
  userName: string;
  leaveType: 'ANNUAL' | 'CASUAL' | 'SICK' | 'OTHER'; // Removed 'MATERNITY'
  startDate: string;
  endDate: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminComment?: string;
}

interface NotificationItem {
  id: number;
  userId: string | number;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

const DEFAULT_LEAVES: LeaveItem[] = [
  {
    id: 1,
    userId: '1',
    userName: 'Kasun Bandara',
    leaveType: 'CASUAL',
    startDate: '2026-10-15',
    endDate: '2026-10-16',
    reason: 'Family urgent commitment in Kandy',
    status: 'PENDING',
  },
  {
    id: 2,
    userId: '2',
    userName: 'Nuwan Pradeep',
    leaveType: 'SICK',
    startDate: '2026-10-18',
    endDate: '2026-10-19',
    reason: 'Doctor prescribed bed rest following fever',
    status: 'APPROVED',
    adminComment: 'Approved by MainAdmin',
  },
  {
    id: 3,
    userId: '1',
    userName: 'Kasun Bandara',
    leaveType: 'ANNUAL',
    startDate: '2026-09-02',
    endDate: '2026-09-05',
    reason: 'Annual personal leave',
    status: 'APPROVED',
    adminComment: 'Annual quota utilized',
  },
];

// Defined total leave quotas
const LEAVE_QUOTAS = {
  ANNUAL: 14,
  CASUAL: 8,
  SICK: 8,
  OTHER: 5
};

export const LeaveManagementPage: React.FC = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'MainAdmin';

  const [leaves, setLeaves] = useState<LeaveItem[]>(() => {
    try {
      const stored = localStorage.getItem('doc_leave_records');
      return stored ? JSON.parse(stored) : DEFAULT_LEAVES;
    } catch {
      return DEFAULT_LEAVES;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('doc_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // State to hold utilized leave balances
  const [utilizedBalances, setUtilizedBalances] = useState({
    ANNUAL: 0,
    CASUAL: 0,
    SICK: 0,
    OTHER: 0
  });

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [leaveType, setLeaveType] = useState<'ANNUAL' | 'CASUAL' | 'SICK' | 'OTHER'>('ANNUAL'); // Removed 'MATERNITY'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('doc_leave_records', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('doc_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Fetch or calculate leave balances when 'leaves' changes
  useEffect(() => {
    if (isAdmin) return;

    const fetchBalances = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/leaves/balances/${user?.userId}`);
        if (res.ok) {
          const data = await res.json();
          setUtilizedBalances({
            ANNUAL: data.annual || 0,
            CASUAL: data.casual || 0,
            SICK: data.sick || 0,
            OTHER: data.other || 0,
          });
          return;
        }
      } catch {
        const userApprovedLeaves = leaves.filter(
            (l) => String(l.userId) === String(user?.userId) && l.status === 'APPROVED'
        );

        const calculated = { ANNUAL: 0, CASUAL: 0, SICK: 0, OTHER: 0 };

        userApprovedLeaves.forEach((leave) => {
          const start = new Date(leave.startDate);
          const end = new Date(leave.endDate);
          const diffTime = Math.abs(end.getTime() - start.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

          if (leave.leaveType === 'ANNUAL') calculated.ANNUAL += diffDays;
          if (leave.leaveType === 'CASUAL') calculated.CASUAL += diffDays;
          if (leave.leaveType === 'SICK') calculated.SICK += diffDays;
          if (leave.leaveType === 'OTHER') calculated.OTHER += diffDays;
        });

        setUtilizedBalances(calculated);
      }
    };

    fetchBalances();
  }, [leaves, user?.userId, isAdmin]);

  const userNotifications = notifications
      .filter((n) => String(n.userId) === String(user?.userId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
        prev.map((n) => (String(n.userId) === String(user?.userId) ? { ...n, read: true } : n))
    );
  };

  const loadBackendLeaves = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/leaves/all`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: LeaveItem[] = data.map((d: any) => ({
            id: d.id,
            userId: d.employee?.userId || '1',
            userName: d.employee?.name || 'Staff Member',
            leaveType: d.leaveType || 'ANNUAL',
            startDate: d.startDate,
            endDate: d.endDate,
            reason: d.reason,
            status: d.status || 'PENDING',
            adminComment: d.adminComment,
          }));
          setLeaves(mapped);
          setToast('Loaded leave records from database.');
          setTimeout(() => setToast(null), 2500);
        }
      }
    } catch {
      // Backend not running
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      employee: {
        userId: user?.userId ? parseInt(user.userId.replace(/\D/g, '') || '1', 10) : 1,
      },
      startDate,
      endDate,
      reason,
      leaveType,
    };

    try {
      await fetch(`${API_BASE_URL}/api/leaves/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const newRecord: LeaveItem = {
        id: Math.floor(100 + Math.random() * 900),
        userId: user?.userId || '1',
        userName: user?.name || 'Staff Member',
        leaveType,
        startDate,
        endDate,
        reason,
        status: 'PENDING',
      };
      setLeaves([newRecord, ...leaves]);
    } catch {
      const newRecord: LeaveItem = {
        id: Math.floor(100 + Math.random() * 900),
        userId: user?.userId || '1',
        userName: user?.name || 'Staff Member',
        leaveType,
        startDate,
        endDate,
        reason,
        status: 'PENDING',
      };
      setLeaves([newRecord, ...leaves]);
    } finally {
      setSubmitting(false);
      setShowApplyModal(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      setToast('Leave request submitted for review!');
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDecision = async (id: number, decision: 'APPROVED' | 'REJECTED') => {
    const comment = prompt(`Enter optional comment for ${decision.toLowerCase()} action:`, '') || '';
    const leaveRecord = leaves.find((l) => l.id === id);

    try {
      const endpoint = decision === 'APPROVED' ? 'approve' : 'reject';
      await fetch(`${API_BASE_URL}/api/leaves/${endpoint}/${id}?adminComment=${encodeURIComponent(comment)}`, {
        method: 'PUT',
      });
    } catch {
      // Offline fallback
    }

    setLeaves((prev) =>
        prev.map((l) => (l.id === id ? { ...l, status: decision, adminComment: comment } : l))
    );

    if (leaveRecord) {
      const newNotif: NotificationItem = {
        id: Date.now(),
        userId: leaveRecord.userId,
        title: `Leave ${decision.charAt(0) + decision.slice(1).toLowerCase()}`,
        message: `Your ${leaveRecord.leaveType.toLowerCase()} leave request from ${leaveRecord.startDate} to ${leaveRecord.endDate} has been ${decision.toLowerCase()}. ${comment ? `Note: ${comment}` : ''}`,
        date: new Date().toLocaleString(),
        read: false,
      };
      setNotifications((prev) => [...prev, newNotif]);
    }

    setToast(`Leave application #${id} marked as ${decision}!`);
    setTimeout(() => setToast(null), 2500);
  };

  const filteredLeaves = leaves.filter((l) => {
    if (!isAdmin && String(l.userId) !== String(user?.userId)) return false;
    return filter === 'ALL' || l.status === filter;
  });

  return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Leave Management System
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.15rem 0 0 0' }}>
              Submit leave requests, track remaining allowances, and review staff leave authorizations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {!isAdmin && (
                <div style={{ position: 'relative' }}>
                  <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications && unreadCount > 0) markAllNotificationsAsRead();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#F8FAFC',
                        color: '#475569',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                  >
                    {unreadCount > 0 ? <BellRing size={18} color="#0284C7" /> : <Bell size={18} />}
                    {unreadCount > 0 && (
                        <span
                            style={{
                              position: 'absolute',
                              top: '-4px',
                              right: '-4px',
                              backgroundColor: '#EF4444',
                              color: 'white',
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              width: '18px',
                              height: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                            }}
                        >
                    {unreadCount}
                  </span>
                    )}
                  </button>

                  {showNotifications && (
                      <div
                          style={{
                            position: 'absolute',
                            top: '115%',
                            right: 0,
                            width: '320px',
                            backgroundColor: '#FFF',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                            border: '1px solid #E2E8F0',
                            zIndex: 50,
                            overflow: 'hidden',
                          }}
                      >
                        <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>Notifications</span>
                          {userNotifications.length > 0 && (
                              <button onClick={() => setNotifications(prev => prev.filter(n => String(n.userId) !== String(user?.userId)))} style={{ border: 'none', background: 'none', fontSize: '0.75rem', color: '#64748B', cursor: 'pointer' }}>Clear All</button>
                          )}
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                          {userNotifications.length === 0 ? (
                              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem' }}>
                                No notifications yet
                              </div>
                          ) : (
                              userNotifications.map((n) => (
                                  <div key={n.id} style={{ padding: '1rem', borderBottom: '1px solid #F1F5F9', backgroundColor: n.read ? '#FFF' : '#F0F9FF' }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>{n.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>{n.message}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.4rem' }}>{n.date}</div>
                                  </div>
                              ))
                          )}
                        </div>
                      </div>
                  )}
                </div>
            )}

            <button
                onClick={loadBackendLeaves}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFF',
                  color: '#475569',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
            >
              <RefreshCw size={14} /> Refresh
            </button>

            {!isAdmin && (
                <button
                    onClick={() => setShowApplyModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      backgroundColor: '#0284C7',
                      color: '#FFF',
                      padding: '0.55rem 1.15rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                >
                  <PlusCircle size={16} /> Request Leave
                </button>
            )}
          </div>
        </div>

        {!isAdmin && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Annual Leave</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                  {LEAVE_QUOTAS.ANNUAL - utilizedBalances.ANNUAL} / {LEAVE_QUOTAS.ANNUAL}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{utilizedBalances.ANNUAL} days utilized</div>
              </div>

              <div style={{ backgroundColor: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Casual Leave</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                  {LEAVE_QUOTAS.CASUAL - utilizedBalances.CASUAL} / {LEAVE_QUOTAS.CASUAL}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{utilizedBalances.CASUAL} days utilized</div>
              </div>

              <div style={{ backgroundColor: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Sick Leave</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                  {LEAVE_QUOTAS.SICK - utilizedBalances.SICK} / {LEAVE_QUOTAS.SICK}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{utilizedBalances.SICK} days utilized</div>
              </div>

              <div style={{ backgroundColor: '#FFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Other Leave</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: '0.25rem 0' }}>
                  {LEAVE_QUOTAS.OTHER - utilizedBalances.OTHER} / {LEAVE_QUOTAS.OTHER}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{utilizedBalances.OTHER} days utilized</div>
              </div>
            </div>
        )}

        {isAdmin && (
            <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '8px', width: 'fit-content' }}>
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
                  <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: filter === tab ? '#0284C7' : 'transparent',
                        color: filter === tab ? '#FFF' : '#64748B',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                  >
                    {tab}
                  </button>
              ))}
            </div>
        )}

        <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Staff Member</th>
              <th style={{ padding: '0.85rem 1rem' }}>Leave Type</th>
              <th style={{ padding: '0.85rem 1rem' }}>Dates Duration</th>
              <th style={{ padding: '0.85rem 1rem' }}>Reason</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem' }}>Comment</th>
              {isAdmin && <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Approval Actions</th>}
            </tr>
            </thead>
            <tbody>
            {filteredLeaves.map((l) => (
                <tr key={l.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#0F172A' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <User size={15} color="#0284C7" />
                      <span>{l.userName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#0284C7', fontWeight: 700, fontSize: '0.8rem' }}>
                    {l.leaveType}
                  </td>
                  <td style={{ padding: '1rem', color: '#334155', fontSize: '0.825rem' }}>
                    {l.startDate} → {l.endDate}
                  </td>
                  <td style={{ padding: '1rem', color: '#64748B', maxWidth: '240px', fontSize: '0.825rem' }}>
                    {l.reason}
                  </td>
                  <td style={{ padding: '1rem' }}>
                  <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor:
                            l.status === 'APPROVED' ? '#ECFDF5' : l.status === 'PENDING' ? '#FEF3C7' : '#FEF2F2',
                        color:
                            l.status === 'APPROVED' ? '#059669' : l.status === 'PENDING' ? '#D97706' : '#DC2626',
                      }}
                  >
                    {l.status}
                  </span>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#64748B', fontStyle: 'italic' }}>
                    {l.adminComment || '—'}
                  </td>

                  {isAdmin && (
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        {l.status === 'PENDING' ? (
                            <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                              <button
                                  onClick={() => handleDecision(l.id, 'APPROVED')}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#10B981',
                                    color: '#FFF',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                              >
                                <CheckCircle size={13} /> Approve
                              </button>
                              <button
                                  onClick={() => handleDecision(l.id, 'REJECTED')}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#EF4444',
                                    color: '#FFF',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                        ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Concluded</span>
                        )}
                      </td>
                  )}
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {showApplyModal && (
            <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(15,23,42,0.5)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 100,
                  padding: '1rem',
                }}
            >
              <div
                  style={{
                    backgroundColor: '#FFF',
                    borderRadius: '16px',
                    maxWidth: '480px',
                    width: '100%',
                    padding: '2rem',
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                  }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                    Submit Leave Application
                  </h3>
                  <button
                      onClick={() => setShowApplyModal(false)}
                      style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Leave Category
                    </label>
                    <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value as any)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem', backgroundColor: '#FFF' }}
                    >
                      <option value="ANNUAL">Annual Leave</option>
                      <option value="CASUAL">Casual Leave</option>
                      <option value="SICK">Sick / Medical Leave</option>
                      <option value="OTHER">Other Reason</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                        Start Date
                      </label>
                      <input
                          type="date"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                        End Date
                      </label>
                      <input
                          type="date"
                          required
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.3rem' }}>
                      Reason & Notes
                    </label>
                    <textarea
                        required
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Detail the circumstances of this leave application..."
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          backgroundColor: '#0284C7',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: submitting ? 'not-allowed' : 'pointer',
                        }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowApplyModal(false)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default LeaveManagementPage;