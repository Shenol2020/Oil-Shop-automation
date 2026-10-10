import React, { useState, useEffect } from 'react';
import { Truck, Plus, RefreshCw, CheckCircle2, Clock, X, PackagePlus } from 'lucide-react';
import { purchaseOrdersApi, suppliersApi, productsApi } from '../api';

export default function PurchaseOrdersPage({ showToast }) {
  const [orders, setOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [poItems, setPoItems] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    const [poRes, supRes, prodRes] = await Promise.all([
      purchaseOrdersApi.getAll(),
      suppliersApi.getAll(),
      productsApi.getAll()
    ]);
    setOrders(poRes.data || []);
    setSuppliers(supRes.data || []);
    setProducts(prodRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    if (!orderId) {
      showToast({ type: 'danger', message: 'Invalid Purchase Order ID.' });
      return;
    }
    try {
      await purchaseOrdersApi.complete(orderId);
      showToast({ type: 'success', message: `Purchase Order #${orderId} marked COMPLETED & Stock Added!` });
      fetchData();
    } catch (err) {
      showToast({ type: 'danger', message: 'Failed to complete purchase order' });
    }
  };

  const handleAddItemToPo = (product) => {
    const pID = product.pID || product.id;
    setPoItems(prev => {
      const exists = prev.find(i => (i.pID || i.productId) === pID);
      if (exists) {
        return prev.map(i => (i.pID || i.productId) === pID ? { ...i, quantity: i.quantity + 10 } : i);
      }
      return [...prev, {
        pID: pID,
        productId: pID,
        productName: product.p_name || product.name,
        quantity: 10,
        unitPrice: parseFloat(product.price || 0)
      }];
    });
  };

  const handleCreatePo = async () => {
    if (!selectedSupplier || poItems.length === 0) {
      showToast({ type: 'warning', message: 'Please select a supplier and add at least one product.' });
      return;
    }

    try {
      await purchaseOrdersApi.create(selectedSupplier, poItems);
      showToast({ type: 'success', message: 'Purchase Order created in Database!' });
      setShowModal(false);
      setPoItems([]);
      fetchData();
    } catch (err) {
      showToast({ type: 'danger', message: 'Error creating Purchase Order' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      
      {/* Top Controls */}
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
            <Truck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Supplier Restock Purchase Orders</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Connected to Spring Boot PurchaseOrderController</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchData} className="btn btn-secondary">
            <RefreshCw size={16} /> Sync Database
          </button>
          <button onClick={() => { setShowModal(true); if (suppliers.length > 0) setSelectedSupplier(suppliers[0].supplierId || suppliers[0].id); }} className="btn btn-primary">
            <Plus size={18} /> New Purchase Order
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="table-responsive" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Supplier Name</th>
                <th>Status</th>
                <th>Items Count</th>
                <th>Total Amount</th>
                <th style={{ textAlign: 'right' }}>Complete Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Purchase Orders from Database...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No purchase orders recorded.</td></tr>
              ) : (
                orders.map(po => {
                  const poId = po.purchaseOrderId !== undefined ? po.purchaseOrderId : (po.orderId !== undefined ? po.orderId : po.id);
                  const isCompleted = po.status === 'COMPLETED';
                  const supName = po.supplier ? po.supplier.name : (po.supplierName || 'Supplier');
                  return (
                    <tr key={poId || Math.random()}>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        #{poId || 'N/A'}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {po.orderDate || 'Today'}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {supName}
                      </td>
                      <td>
                        {isCompleted ? (
                          <span className="badge badge-success"><CheckCircle2 size={12} /> COMPLETED</span>
                        ) : (
                          <span className="badge badge-warning"><Clock size={12} /> CREATED</span>
                        )}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {po.items ? `${po.items.length} line item(s)` : '1 Item'}
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        Rs.{(parseFloat(po.totalAmount) || 0).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompleteOrder(poId)}
                            className="btn btn-success"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', borderRadius: '8px' }}
                          >
                            <CheckCircle2 size={14} /> Complete & Add Stock
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock Received</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Order Modal */}
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
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <PackagePlus color="var(--primary)" size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Create New Purchase Order</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-icon"><X size={18} /></button>
            </div>

            {/* Supplier select */}
            <div className="form-group">
              <label>Select Supplier</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="form-control"
              >
                <option value="">-- Choose Supplier --</option>
                {suppliers.map(s => {
                  const sId = s.supplierId || s.id;
                  return (
                    <option key={sId} value={sId}>
                      {s.name} ({s.contactName || s.contactPerson || `ID #${sId}`})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Product selector */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
                Add Products to Order
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.5rem',
                maxHeight: '150px',
                overflowY: 'auto',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-color)',
                padding: '0.75rem',
                borderRadius: '12px'
              }}>
                {products.map(prod => {
                  const pID = prod.pID || prod.id;
                  return (
                    <button
                      key={pID}
                      type="button"
                      onClick={() => handleAddItemToPo(prod)}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-main)',
                        fontSize: '0.78rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <div style={{ fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {prod.p_name || prod.name}
                      </div>
                      <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.72rem' }}>+ Add Batch</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Order Items Table */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Order Line Items ({poItems.length})</h4>
              {poItems.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No items added yet. Click products above.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {poItems.map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.82rem'
                    }}>
                      <span style={{ fontWeight: 700, flex: 2 }}>{item.productName}</span>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Qty:</span>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setPoItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: val } : it));
                          }}
                          className="form-control"
                          style={{ width: '65px', padding: '3px 6px', fontSize: '0.8rem', borderRadius: '6px' }}
                        />
                      </div>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', flex: 1, textAlign: 'right' }}>
                        Rs.{(item.quantity * item.unitPrice).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleCreatePo} className="btn btn-primary">Save Purchase Order</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

