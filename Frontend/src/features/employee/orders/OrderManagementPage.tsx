import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '@/services/api';
import {
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Eye,
  User,
  CreditCard,
  Phone,
  MapPin,
  Check,
  ArrowLeft,
} from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderRecord {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  status: 'Pending' | 'Approved' | 'Cancelled';
}

export const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'Pending' | 'Approved' | 'Cancelled'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchBackendOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const mapped: OrderRecord[] = data.map((o: any) => ({
            id: o.order_id || o.orderId || o.id,
            customerName: o.customer?.name || 'Online Customer',
            email: o.customer?.email || 'N/A',
            phone: o.customer?.phoneNumber || 'N/A',
            address: o.customer?.address || 'Store Pickup',
            date: o.oder_date || o.orderDate ? new Date(o.oder_date || o.orderDate).toLocaleString() : 'Recent',
            items: (o.orderItems || []).map((item: any) => ({
              name: item.product?.p_name || item.product?.name || 'Automotive Oil',
              quantity: item.quantity,
              price: item.unit_price_at_order || item.unitPriceAtOrder || 0,
            })),
            total: o.total_amount || o.totalAmount || 0,
            paymentMethod: o.payment || 'Cash',
            status: o.order_status === 'Approved' || o.orderStatus === 'Approved' ? 'Approved' : o.order_status === 'Cancelled' ? 'Cancelled' : 'Pending',
          }));
          setOrders(mapped);
          return;
        }
      }
      setOrders([]);
    } catch (err) {
      console.error('Failed to load orders from server:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendOrders();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: 'Approved' | 'Cancelled') => {
    try {
      await fetch(`${API_BASE_URL}/api/orders/${id}/status?status=${newStatus}`, {
        method: 'PUT',
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      setToast(`Order #${id} marked as ${newStatus}!`);
      setTimeout(() => setToast(null), 2500);
    } catch {
      alert('Failed to update status on server');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = filter === 'ALL' || o.status === filter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toString().includes(search) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

      {/* Header and Controls */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/employee"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.8rem',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              color: '#334155',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Online Customer Order Management
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0.15rem 0 0 0' }}>
              Review pending orders from the customer mart, verify lubricant items, and approve dispatches.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={fetchBackendOrders}
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

          <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: '#F1F5F9', padding: '0.25rem', borderRadius: '8px' }}>
            {(['ALL', 'Pending', 'Approved', 'Cancelled'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: filter === tab ? '#059669' : 'transparent',
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
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
        <input
          type="text"
          placeholder="Filter by Order ID or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 0.75rem 0.65rem 2.5rem',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            backgroundColor: '#FFF',
            fontSize: '0.875rem',
          }}
        />
      </div>

      {/* Orders Table */}
      <div style={{ backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.85rem 1rem' }}>Order Ref</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
              <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
              <th style={{ padding: '0.85rem 1rem' }}>Items Summary</th>
              <th style={{ padding: '0.85rem 1rem' }}>Total Amount</th>
              <th style={{ padding: '0.85rem 1rem' }}>Payment</th>
              <th style={{ padding: '0.85rem 1rem' }}>Status</th>
              <th style={{ padding: '0.85rem 1rem', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
                  Loading online customer orders from database...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                  No online customer orders found in database.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem', fontWeight: 800, color: '#0F172A' }}>#{order.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{order.phone}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} /> {order.date}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#334155' }}>
                    {order.items.map((i, idx) => (
                      <div key={idx} style={{ fontSize: '0.8rem' }}>
                        {i.name} <strong>(×{i.quantity})</strong>
                      </div>
                    ))}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 800, color: '#0F172A' }}>
                    Rs. {order.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', color: '#64748B', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <CreditCard size={14} /> {order.paymentMethod}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        backgroundColor:
                          order.status === 'Approved'
                            ? '#ECFDF5'
                            : order.status === 'Pending'
                            ? '#FEF3C7'
                            : '#FEF2F2',
                        color:
                          order.status === 'Approved'
                            ? '#059669'
                            : order.status === 'Pending'
                            ? '#D97706'
                            : '#DC2626',
                      }}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.4rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#FFF',
                          color: '#334155',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={13} /> View
                      </button>

                      {order.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Approved')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.4rem 0.65rem',
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
                            onClick={() => handleUpdateStatus(order.id, 'Cancelled')}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '0.4rem 0.65rem',
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
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
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
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                  Order Details #{selectedOrder.id}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{selectedOrder.date}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {/* Customer info */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0F172A' }}>
                <User size={15} color="#059669" /> {selectedOrder.customerName} ({selectedOrder.email})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B' }}>
                <Phone size={15} /> {selectedOrder.phone}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748B' }}>
                <MapPin size={15} /> {selectedOrder.address}
              </div>
            </div>

            {/* Items */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#0F172A' }}>
                Ordered Products
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '0.4rem', borderBottom: '1px solid #F1F5F9' }}>
                    <span>
                      {it.name} <strong>× {it.quantity}</strong>
                    </span>
                    <span style={{ fontWeight: 700 }}>Rs. {(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Status</span>
                <div style={{ fontWeight: 800, color: selectedOrder.status === 'Approved' ? '#059669' : '#D97706' }}>
                  {selectedOrder.status}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Total</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A' }}>
                  Rs. {selectedOrder.total.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              {selectedOrder.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Approved')}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      backgroundColor: '#10B981',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Approve Order
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      backgroundColor: '#EF4444',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Reject Order
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '0.7rem 1.25rem',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagementPage;
