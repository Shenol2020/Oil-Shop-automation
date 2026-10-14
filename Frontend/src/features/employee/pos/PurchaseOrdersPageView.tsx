import React, { useState, useEffect } from 'react';
import { Truck, Plus, RefreshCw, CheckCircle2, Clock, X, PackagePlus, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '@/services/api';

interface PurchaseOrderItem {
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice: number;
  lineTotal?: number;
}

interface PurchaseOrder {
  purchaseOrderId: number;
  orderId?: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  supplier?: {
    supplierId: number;
    name: string;
    contactName?: string;
    phone?: string;
  };
  supplierName?: string;
  items?: PurchaseOrderItem[];
}

interface PurchaseOrdersPageViewProps {
  showToast: (msg: string) => void;
}

export const PurchaseOrdersPageView: React.FC<PurchaseOrdersPageViewProps> = ({ showToast }) => {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [poItems, setPoItems] = useState<{ productId: number; productName: string; quantity: number; unitPrice: number }[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [poRes, supRes, prodRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/purchase-orders/all`),
        fetch(`${API_BASE_URL}/api/suppliers/all`),
        fetch(`${API_BASE_URL}/api/products/all`),
      ]);

      if (poRes.ok) {
        const poData = await poRes.json();
        setOrders(Array.isArray(poData) ? poData : []);
      }
      if (supRes.ok) {
        const supData = await supRes.json();
        setSuppliers(Array.isArray(supData) ? supData : []);
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(Array.isArray(prodData) ? prodData : []);
      }
    } catch (err: any) {
      console.error(err);
      setError('Unable to load purchase orders from database.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteOrder = async (orderId: number) => {
    if (!orderId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/purchase-orders/complete/${orderId}`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Failed to complete order');
      showToast(`Purchase Order #${orderId} marked COMPLETED & Stock added!`);
      fetchData();
    } catch (err) {
      alert('Failed to complete purchase order.');
    }
  };

  const handleAddItemToPo = (prod: any) => {
    const pID = prod.pID || prod.id;
    setPoItems((prev) => {
      const exists = prev.find((i) => i.productId === pID);
      if (exists) {
        return prev.map((i) => (i.productId === pID ? { ...i, quantity: i.quantity + 10 } : i));
      }
      return [
        ...prev,
        {
          productId: pID,
          productName: prod.p_name || prod.name || `Product #${pID}`,
          quantity: 10,
          unitPrice: parseFloat(prod.price || 0),
        },
      ];
    });
  };

  const handleCreatePo = async () => {
    if (!selectedSupplier || poItems.length === 0) {
      alert('Please select a supplier and add at least one product batch.');
      return;
    }

    try {
      const payload = {
        supplierId: parseInt(selectedSupplier),
        orderDate: new Date().toISOString().split('T')[0],
        items: poItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      const res = await fetch(`${API_BASE_URL}/api/purchase-orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to create purchase order');
      showToast('Purchase Order created in database successfully!');
      setShowModal(false);
      setPoItems([]);
      fetchData();
    } catch (err) {
      alert('Error creating purchase order in database.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Top Header */}
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
            <Truck size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Supplier Restock Purchase Orders
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0.15rem 0 0 0' }}>
              Connected directly to Spring Boot PurchaseOrderController
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchData}
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
            onClick={() => {
              setShowModal(true);
              if (suppliers.length > 0) setSelectedSupplier(String(suppliers[0].supplierId || suppliers[0].id));
            }}
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
            <Plus size={16} /> New Purchase Order
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

      {/* Orders Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1.25rem' }}>Order ID</th>
                <th style={{ padding: '0.85rem 1rem' }}>Order Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Supplier Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Items Count</th>
                <th style={{ padding: '0.85rem 1rem' }}>Total Amount</th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Complete Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    Loading Purchase Orders from live Database...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
                    No purchase orders recorded in database.
                  </td>
                </tr>
              ) : (
                orders.map((po) => {
                  const poId = po.purchaseOrderId !== undefined ? po.purchaseOrderId : (po.orderId !== undefined ? po.orderId : 0);
                  const isCompleted = po.status === 'COMPLETED';
                  const supName = po.supplier ? po.supplier.name : (po.supplierName || 'Supplier');

                  return (
                    <tr key={poId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'monospace', fontWeight: 700, color: '#059669' }}>
                        #{poId}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748B' }}>
                        {po.orderDate || 'Today'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0F172A' }}>
                        {supName}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {isCompleted ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              backgroundColor: '#DCFCE7',
                              color: '#15803D',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            <CheckCircle2 size={12} /> COMPLETED
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '9999px',
                              backgroundColor: '#FEF3C7',
                              color: '#B45309',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}
                          >
                            <Clock size={12} /> CREATED
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748B' }}>
                        {po.items ? `${po.items.length} line item(s)` : '1 Item'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: '#0F172A' }}>
                        Rs. {(parseFloat(String(po.totalAmount)) || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompleteOrder(poId)}
                            style={{
                              padding: '0.4rem 0.85rem',
                              fontSize: '0.78rem',
                              borderRadius: '8px',
                              border: 'none',
                              backgroundColor: '#059669',
                              color: '#FFF',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle2 size={13} style={{ display: 'inline', marginRight: '4px' }} /> Complete & Add Stock
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700 }}>Stock Added</span>
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
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.1rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <PackagePlus color="#059669" size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Create New Purchase Order
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Supplier select */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Select Supplier
              </label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.9rem' }}
              >
                <option value="">-- Choose Supplier --</option>
                {suppliers.map((s) => {
                  const sId = s.supplierId || s.id;
                  return (
                    <option key={sId} value={sId}>
                      {s.name} ({s.contactName || `ID #${sId}`})
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Product Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Add Products to Order (Click to add batch)
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '0.5rem',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '0.75rem',
                  borderRadius: '10px',
                }}
              >
                {products.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'center' }}>
                    No products found in database.
                  </div>
                ) : (
                  products.map((prod) => {
                    const pID = prod.pID || prod.id;
                    return (
                      <button
                        key={pID}
                        type="button"
                        onClick={() => handleAddItemToPo(prod)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          color: '#0F172A',
                          fontSize: '0.78rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {prod.p_name || prod.name}
                        </div>
                        <div style={{ color: '#059669', fontWeight: 700, fontSize: '0.72rem' }}>+ Add 10 Units</div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Order Items List */}
            <div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
                Order Line Items ({poItems.length})
              </h4>
              {poItems.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                  No items added yet. Click product cards above.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {poItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                      }}
                    >
                      <span style={{ fontWeight: 700, flex: 2, color: '#0F172A' }}>{item.productName}</span>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setPoItems((prev) => prev.map((it, i) => (i === idx ? { ...it, quantity: val } : it)));
                          }}
                          style={{ width: '65px', padding: '3px 6px', fontSize: '0.8rem', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                      </div>
                      <span style={{ fontWeight: 800, color: '#059669', flex: 1, textAlign: 'right' }}>
                        Rs. {(item.quantity * item.unitPrice).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
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
                onClick={handleCreatePo}
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
                Save Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrdersPageView;
