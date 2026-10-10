import React, { useState, useEffect } from 'react';
import { Users, Plus, Phone, Mail, MapPin, Edit, Trash2, RefreshCw, X, Building2 } from 'lucide-react';
import { suppliersApi } from '../api';

export default function SuppliersPage({ showToast }) {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    phone: '',
    email: '',
    address: ''
  });

  const fetchSuppliers = async () => {
    setLoading(true);
    const res = await suppliersApi.getAll();
    setSuppliers(res.data || []);
    setLoading(false);
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
      address: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (s) => {
    setEditSupplier(s);
    setFormData({
      name: s.name || '',
      contactName: s.contactName || s.contactPerson || '',
      phone: s.phone || '',
      email: s.email || '',
      address: s.address || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (sId, name) => {
    if (window.confirm(`Are you sure you want to delete supplier "${name}"?`)) {
      try {
        await suppliersApi.delete(sId);
        showToast({ type: 'success', message: `Supplier "${name}" deleted from Database.` });
        fetchSuppliers();
      } catch (err) {
        showToast({ type: 'danger', message: 'Failed to delete supplier.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast({ type: 'warning', message: 'Supplier Name is required.' });
      return;
    }

    try {
      if (editSupplier) {
        await suppliersApi.update(editSupplier.supplierId || editSupplier.id, formData);
        showToast({ type: 'success', message: 'Supplier details updated in Database.' });
      } else {
        await suppliersApi.create(formData);
        showToast({ type: 'success', message: 'New supplier saved to Database.' });
      }
      setShowModal(false);
      fetchSuppliers();
    } catch (err) {
      showToast({ type: 'danger', message: 'Error saving supplier.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      
      {/* Header Controls */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Users size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Oil & Spare Part Suppliers</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supplier entity directory from Spring Boot backend</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchSuppliers} className="btn btn-secondary">
            <RefreshCw size={16} /> Sync Database
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add New Supplier
          </button>
        </div>
      </div>

      {/* Supplier Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem',
        overflowY: 'auto',
        flex: 1
      }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading Suppliers from Database...
          </div>
        ) : suppliers.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No suppliers found. Click Add New Supplier.
          </div>
        ) : (
          suppliers.map((s) => {
            const sId = s.supplierId || s.id;
            const contact = s.contactName || s.contactPerson;
            return (
              <div key={sId} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>supplierId: #{sId}</span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.3', marginTop: '2px' }}>
                        {s.name}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => handleOpenEdit(s)} className="btn-icon" title="Edit Supplier">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(sId, s.name)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete Supplier">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    {contact && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={15} color="var(--primary)" />
                        <span>Contact: <strong style={{ color: 'var(--text-main)' }}>{contact}</strong></span>
                      </div>
                    )}
                    {s.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={15} color="var(--secondary)" />
                        <span>{s.phone}</span>
                      </div>
                    )}
                    {s.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={15} color="#8B5CF6" />
                        <span>{s.email}</span>
                      </div>
                    )}
                    {s.address && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={15} color="#F43F5E" />
                        <span>{s.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Supplier Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9000,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '520px',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 color="var(--primary)" size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {editSupplier ? `Edit Supplier #${editSupplier.supplierId || editSupplier.id}` : 'Add New Supplier'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Company Name (name)</label>
                <input
                  type="text"
                  placeholder="e.g. McLarens Lubricants Ltd"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Contact Name (contactName)</label>
                <input
                  type="text"
                  placeholder="e.g. Kamal Perera"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="sales@supplier.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Office Address</label>
                <input
                  type="text"
                  placeholder="Colombo, Sri Lanka"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save to Database</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

