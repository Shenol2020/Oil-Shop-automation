import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, MapPin, Edit, Trash2, RefreshCw, X, Building2, AlertCircle, Search, Truck } from 'lucide-react';

interface Supplier {
  supplierId: number;
  name: string;
  contactName?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface SuppliersPageViewProps {
  showToast: (msg: string) => void;
  onCreatePoForSupplier?: (supplierId: number | string) => void;
}

export const SuppliersPageView: React.FC<SuppliersPageViewProps> = ({ showToast, onCreatePoForSupplier }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8081/api/suppliers/all');
      if (!res.ok) throw new Error('Failed to fetch suppliers from backend');
      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load suppliers from server.');
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleOpenAdd = () => {
    setEditSupplier(null);
    setFormData({
      name: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s: Supplier) => {
    setEditSupplier(s);
    setFormData({
      name: s.name || '',
      contactName: s.contactName || '',
      phone: s.phone || '',
      email: s.email || '',
      address: s.address || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (sId: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete supplier "${name}"?`)) {
      try {
        const res = await fetch(`http://localhost:8081/api/suppliers/remove/${sId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          showToast(`Supplier "${name}" deleted.`);
          fetchSuppliers();
        } else {
          throw new Error('Failed to delete supplier');
        }
      } catch {
        alert('Failed to delete supplier from database.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Supplier Company Name is required.');
      return;
    }

    try {
      if (editSupplier) {
        const res = await fetch(`http://localhost:8081/api/suppliers/update/${editSupplier.supplierId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supplierId: editSupplier.supplierId,
            ...formData,
          }),
        });
        if (!res.ok) throw new Error('Failed to update supplier');
        showToast('Supplier updated successfully.');
      } else {
        const res = await fetch('http://localhost:8081/api/suppliers/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to add supplier');
        showToast('New supplier registered successfully.');
      }
      setShowModal(false);
      fetchSuppliers();
    } catch {
      alert('Error saving supplier to database.');
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.contactName || '').toLowerCase().includes(q) ||
      (s.phone || '').toLowerCase().includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.address || '').toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Top Header Controls */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#059669',
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Oil & Spare Part Suppliers
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
              Live supplier directory fetched directly from Spring Boot backend ({suppliers.length} active)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.1rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.825rem',
                outline: 'none',
              }}
            />
          </div>

          <button
            onClick={fetchSuppliers}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFF',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} /> Sync Database
          </button>
          <button
            onClick={handleOpenAdd}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#059669',
              color: '#FFF',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <Plus size={16} /> Add New Supplier
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.25rem',
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Supplier Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem',
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            Loading Suppliers from live Database...
          </div>
        ) : filteredSuppliers.length === 0 ? (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              color: '#64748B',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px dashed #CBD5E1',
            }}
          >
            {searchQuery ? 'No suppliers match your search.' : 'No suppliers found in database. Click Add New Supplier to register one.'}
          </div>
        ) : (
          filteredSuppliers.map((s) => (
            <div
              key={s.supplierId}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#059669', fontFamily: 'monospace', fontWeight: 700 }}>
                      ID: #{s.supplierId}
                    </span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', lineHeight: '1.3', margin: '2px 0 0 0' }}>
                      {s.name}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      onClick={() => handleOpenEdit(s)}
                      title="Edit Supplier"
                      style={{
                        padding: '0.4rem',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFF',
                        color: '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.supplierId, s.name)}
                      title="Delete Supplier"
                      style={{
                        padding: '0.4rem',
                        borderRadius: '6px',
                        border: '1px solid #FCA5A5',
                        backgroundColor: '#FFF',
                        color: '#EF4444',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem', color: '#64748B' }}>
                  {s.contactName && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={14} color="#059669" />
                      <span>Contact: <strong style={{ color: '#0F172A' }}>{s.contactName}</strong></span>
                    </div>
                  )}
                  {s.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} color="#0284C7" />
                      <a href={`tel:${s.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{s.phone}</a>
                    </div>
                  )}
                  {s.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} color="#8B5CF6" />
                      <a href={`mailto:${s.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{s.email}</a>
                    </div>
                  )}
                  {s.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} color="#F43F5E" />
                      <span>{s.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                <button
                  type="button"
                  onClick={() => onCreatePoForSupplier && onCreatePoForSupplier(s.supplierId)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Truck size={14} color="#059669" /> Create Purchase Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Supplier Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 color="#059669" size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {editSupplier ? `Edit Supplier #${editSupplier.supplierId}` : 'Add New Supplier'}
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Company Name (Required)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lanka Lubricants Ltd"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nimal Perera"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="077 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="sales@supplier.lk"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Office Address
                </label>
                <input
                  type="text"
                  placeholder="No 22, Kandy Road, Kurunegala"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '0.6rem 1.1rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#FFF',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#059669',
                    color: '#FFF',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Save to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersPageView;
