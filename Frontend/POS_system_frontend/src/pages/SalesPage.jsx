import React, { useState, useEffect } from 'react';
import { Receipt, Search, Eye, DollarSign, RefreshCw, ShoppingBag } from 'lucide-react';
import { salesApi } from '../api';

export default function SalesPage({ onViewReceipt }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const salesRes = await salesApi.getAll();
    setSales(salesRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSales = sales.filter(s => {
    const sId = String(s.saleId || s.id || '');
    const query = search.toLowerCase();
    return sId.includes(query) || (s.customerName && s.customerName.toLowerCase().includes(query));
  });

  const totalSalesVal = sales.reduce((a, c) => a + (parseFloat(c.totalAmount) || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      
      {/* Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <DollarSign size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Sales Revenue</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              Rs.{totalSalesVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#E0F2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--secondary)'
          }}>
            <ShoppingBag size={26} />
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Completed Transactions</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
              {sales.length} Sales Recorded
            </h3>
          </div>
        </div>
      </div>

      {/* Main Control Header */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
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
            <Receipt size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Sales History Log</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Real-time sales transactions from database</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, maxWidth: '420px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by Sale ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.6rem', width: '100%', borderRadius: '12px' }}
            />
          </div>
          <button onClick={fetchData} className="btn btn-secondary" title="Sync Data">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Content Table */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="table-responsive" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Date</th>
                <th>Items Count</th>
                <th>Subtotal</th>
                <th>Total Amount</th>
                <th>Invoice Number</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading Sales History...</td></tr>
              ) : filteredSales.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No sales history records found.</td></tr>
              ) : (
                filteredSales.map(sale => {
                  const sId = sale.saleId || sale.id;
                  const itemsCount = sale.items ? sale.items.length : 1;
                  const invNumber = sale.invoice ? sale.invoice.invoiceNumber : (sale.invoiceNumber || 'INV-GEN-00' + sId);
                  return (
                    <tr key={sId}>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        #{sId}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {sale.saleDate ? sale.saleDate : 'Today'}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {itemsCount} Line Item(s)
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        Rs.{(parseFloat(sale.subtotal) || parseFloat(sale.totalAmount) || 0).toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        Rs.{(parseFloat(sale.totalAmount) || 0).toLocaleString()}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--secondary)', fontWeight: 600 }}>
                        {invNumber}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => onViewReceipt({
                            ...sale,
                            id: sId,
                            customerName: sale.customerName || 'Walk-in Customer',
                            items: sale.items ? sale.items.map(i => ({
                              productName: i.product ? (i.product.p_name || i.product.name) : (i.productName || 'Item'),
                              quantity: i.quantity,
                              unitPrice: i.unitPrice,
                              totalPrice: i.lineTotal || (i.quantity * i.unitPrice)
                            })) : []
                          })}
                          className="btn btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem', borderRadius: '8px' }}
                        >
                          <Eye size={14} /> View Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

