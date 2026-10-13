import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  CheckCircle,
  Clock,
  AlertCircle,
  StopCircle,
  ArrowLeft,
  Settings,
  Save,
  UserCheck,
} from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuthStore } from '../../../store/authStore';

interface ScanEventResponse {
  action: 'ARRIVAL' | 'DEPARTURE';
  record: {
    id: string | number;
    userId: string;
    workDate: string;
    arrivalTime: string;
    departureTime?: string | null;
    workHours?: number;
  };
  totalPay: number;
}

interface AttendanceRecordItem {
  id: number | string;
  userId: string;
  workDate: string;
  arrivalTime: string;
  departureTime?: string | null;
}

interface StaffMember {
  userId: string;
  name: string;
  email?: string;
  accessLevel?: string;
}

export const AttendanceSalaryPage: React.FC = () => {
  const { user, role } = useAuthStore();
  const isMainAdmin = role === 'MainAdmin' || (user && 'accessLevel' in user && user.accessLevel === 'ADMIN');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanEventResponse | null>(null);
  const [manualUserId, setManualUserId] = useState('');
  const [loading, setLoading] = useState(false);

  // Live database records & staff mapping
  const [todayRecords, setTodayRecords] = useState<AttendanceRecordItem[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, string>>({});
  const [todayLoading, setTodayLoading] = useState(true);

  // Dynamic Salary Settings for Admin
  const [baseSalary, setBaseSalary] = useState<number>(3000);
  const [overtimeRate, setOvertimeRate] = useState<number>(500);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<string | null>(null);

  // Fetch staff list to map UUIDs to actual employee names
  const fetchStaffMap = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/staff');
      if (res.ok) {
        const staffList: StaffMember[] = await res.json();
        const mapping: Record<string, string> = {};
        staffList.forEach((s) => {
          if (s.userId) {
            mapping[s.userId] = s.name || s.email || s.userId;
          }
        });
        setStaffMap(mapping);
      }
    } catch (err) {
      console.error('Failed to fetch staff mapping:', err);
    }
  };

  // Fetch today's live scan records from database
  const fetchTodayScans = async () => {
    setTodayLoading(true);
    try {
      const res = await fetch('http://localhost:8081/api/attendance/today');
      if (res.ok) {
        const data = await res.json();
        setTodayRecords(Array.isArray(data) ? data : []);
      } else {
        setTodayRecords([]);
      }
    } catch {
      setTodayRecords([]);
    } finally {
      setTodayLoading(false);
    }
  };

  // Fetch dynamic salary settings from backend
  const fetchSalarySettings = async () => {
    try {
      const res = await fetch('http://localhost:8081/api/attendance/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.baseSalary !== undefined) setBaseSalary(data.baseSalary);
        if (data.overtimeRatePerHour !== undefined) setOvertimeRate(data.overtimeRatePerHour);
      }
    } catch (err) {
      console.error('Failed to fetch salary settings:', err);
    }
  };

  useEffect(() => {
    fetchStaffMap();
    fetchTodayScans();
    fetchSalarySettings();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleSaveSalarySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsStatus(null);
    try {
      const res = await fetch('http://localhost:8081/api/attendance/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseSalary: Number(baseSalary),
          overtimeRatePerHour: Number(overtimeRate),
        }),
      });
      if (res.ok) {
        setSettingsStatus('Settings updated successfully!');
        setTimeout(() => setSettingsStatus(null), 3500);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch {
      setSettingsStatus('Error updating settings on server.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const devices = await Html5Qrcode.getCameras();
      if (!devices || devices.length === 0) {
        setCameraError('No video camera was detected on this workstation.');
        return;
      }

      const backCam = devices.find((d) => d.label.toLowerCase().includes('back'));
      const cameraId = backCam ? backCam.id : devices[0].id;

      const html5QrCode = new Html5Qrcode('qr-camera-element');
      scannerRef.current = html5QrCode;

      setIsScanning(true);
      await html5QrCode.start(
        cameraId,
        {
          fps: 15,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const boxSize = Math.max(Math.floor(minEdge * 0.85), 280);
            return {
              width: boxSize,
              height: boxSize,
            };
          },
        },
        async (decodedText) => {
          await stopCamera();
          await processScan(decodedText);
        },
        () => {}
      );
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(err.message || 'Unable to access camera.');
      setIsScanning(false);
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const processScan = async (userId: string) => {
    if (!userId.trim()) return;
    setLoading(true);
    setCameraError(null);

    try {
      const res = await fetch('http://localhost:8081/api/attendance/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim() }),
      });

      if (res.ok) {
        const data: ScanEventResponse = await res.json();
        setScanResult(data);
        fetchTodayScans();
      } else {
        const errJson = await res.json().catch(() => null);
        const errMessage = errJson?.error || errJson?.message || 'Scan could not be processed.';
        setCameraError(errMessage);
      }
    } catch {
      setCameraError('Network error connecting to attendance backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/employee"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              color: '#334155',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} /> Back to Operational Portals
          </Link>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Attendance & Salary Terminal
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.15rem 0 0 0' }}>
              Scan employee QR badges to record arrival and departure timestamps and automatically compute daily wages.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Exclusive: Dynamic Salary & Overtime Rate Configuration */}
      {isMainAdmin && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '2px solid #F59E0B',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 2px 10px rgba(245, 158, 11, 0.08)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={20} color="#D97706" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Admin Configuration: Dynamic Daily Salary & Overtime Rates
              </h3>
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: '9999px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
              }}
            >
              MainAdmin Exclusive Setting
            </span>
          </div>

          <form
            onSubmit={handleSaveSalarySettings}
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Daily Base Salary (Rs.)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700 }}>
                  Rs.
                </span>
                <input
                  type="number"
                  step="50"
                  min="0"
                  required
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                />
              </div>
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Hourly Overtime Rate (Rs./hr)
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700 }}>
                  Rs.
                </span>
                <input
                  type="number"
                  step="25"
                  min="0"
                  required
                  value={overtimeRate}
                  onChange={(e) => setOvertimeRate(parseFloat(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.6rem 0.6rem 2.2rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSavingSettings}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#D97706',
                color: '#FFF',
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: isSavingSettings ? 'not-allowed' : 'pointer',
              }}
            >
              <Save size={16} /> Save Dynamic Settings
            </button>

            {settingsStatus && (
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: settingsStatus.includes('success') ? '#059669' : '#DC2626' }}>
                {settingsStatus}
              </span>
            )}
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Left: Camera Feed & Input */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0F172A' }}>
              <Camera size={18} color="#0284C7" />
              <span>Camera Badge Scanner</span>
            </div>
            {isScanning && (
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                Camera Active
              </span>
            )}
          </div>

          {/* Camera Viewport */}
          <div
            style={{
              position: 'relative',
              minHeight: '420px',
              backgroundColor: '#0F172A',
              borderRadius: '14px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div id="qr-camera-element" style={{ width: '100%', minHeight: '420px' }} />

            {!isScanning && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', gap: '0.75rem' }}>
                <Camera size={44} style={{ opacity: 0.6 }} />
                <span style={{ fontSize: '0.85rem' }}>Camera preview is currently idle</span>
                <button
                  onClick={startCamera}
                  style={{
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
                  Start Live Camera
                </button>
              </div>
            )}
          </div>

          {isScanning && (
            <button
              onClick={stopCamera}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                backgroundColor: '#EF4444',
                color: '#FFF',
                padding: '0.65rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              <StopCircle size={16} /> Stop Camera
            </button>
          )}

          {cameraError && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '0.65rem', borderRadius: '8px', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={15} /> {cameraError}
            </div>
          )}

          {/* Manual Input Fallback */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Manual Scanner / Staff Badge UUID
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Paste or enter Staff UUID..."
                value={manualUserId}
                onChange={(e) => setManualUserId(e.target.value)}
                style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
              />
              <button
                disabled={loading || !manualUserId}
                onClick={() => processScan(manualUserId)}
                style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: '#059669',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: !manualUserId ? 'not-allowed' : 'pointer',
                }}
              >
                Log Scan
              </button>
            </div>
          </div>
        </div>

        {/* Right: Scan Results & Salary Output */}
        <div style={{ backgroundColor: '#FFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Attendance & Salary Computation
          </h3>

          {scanResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Event Badge */}
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  backgroundColor: scanResult.action === 'ARRIVAL' ? '#ECFDF5' : '#EFF6FF',
                  border: scanResult.action === 'ARRIVAL' ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: scanResult.action === 'ARRIVAL' ? '#10B981' : '#2563EB',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                    {scanResult.action} RECORDED
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#0F172A', marginTop: '2px' }}>
                    Employee: <strong>{staffMap[scanResult.record.userId] || scanResult.record.userId}</strong>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#64748B' }}>
                    ID: {scanResult.record.userId}
                  </div>
                </div>
              </div>

              {/* Timing info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Arrival Timestamp</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginTop: '0.2rem' }}>
                    {new Date(scanResult.record.arrivalTime).toLocaleTimeString()}
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Departure Timestamp</div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', marginTop: '0.2rem' }}>
                    {scanResult.record.departureTime
                      ? new Date(scanResult.record.departureTime).toLocaleTimeString()
                      : 'Pending Checkout'}
                  </div>
                </div>
              </div>

              {/* Wage Calculator Output */}
              <div style={{ backgroundColor: '#FEF3C7', padding: '1.25rem', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '0.8rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase' }}>
                  Computed Shift Payout
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#B45309', margin: '0.25rem 0' }}>
                  Rs. {scanResult.totalPay.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#78350F' }}>
                  {scanResult.action === 'ARRIVAL'
                    ? 'Shift started. Salary formula will finalize upon departure checkout.'
                    : 'Shift concluded. Remuneration computed using current dynamic rates.'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8' }}>
              <Clock size={44} style={{ marginBottom: '0.75rem', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                Position the employee QR badge in front of the camera or enter their Staff UUID to record attendance.
              </p>
            </div>
          )}

          {/* Today's Scan Activity: Live Database with Actual Employee Names */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Today's Scan Activity
              </h4>
              <button
                onClick={fetchTodayScans}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: '#0284C7',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Refresh
              </button>
            </div>

            {todayLoading ? (
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center', padding: '1rem' }}>
                Loading today's scan activity...
              </div>
            ) : todayRecords.length === 0 ? (
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#64748B',
                  textAlign: 'center',
                  padding: '1.25rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px dashed #CBD5E1',
                }}
              >
                No scan activity recorded today.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '220px', overflowY: 'auto' }}>
                {todayRecords.map((rec) => {
                  const empName = staffMap[rec.userId] || `Staff ID: ${rec.userId.substring(0, 8)}...`;
                  const hasDeparted = !!rec.departureTime;

                  return (
                    <div
                      key={rec.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        padding: '0.6rem 0.8rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <UserCheck size={16} color="#059669" />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0F172A' }}>{empName}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                            In: {new Date(rec.arrivalTime).toLocaleTimeString()}
                            {hasDeparted && ` | Out: ${new Date(rec.departureTime!).toLocaleTimeString()}`}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '9999px',
                          backgroundColor: hasDeparted ? '#EFF6FF' : '#ECFDF5',
                          color: hasDeparted ? '#1D4ED8' : '#047857',
                        }}
                      >
                        {hasDeparted ? 'CHECKED OUT' : 'ON SHIFT'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSalaryPage;
