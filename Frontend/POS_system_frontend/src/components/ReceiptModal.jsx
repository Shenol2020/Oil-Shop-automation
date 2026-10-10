import React from 'react';
import { X, Printer, CheckCircle, Droplet, Download } from 'lucide-react';

export default function ReceiptModal({ saleData, invoiceData, onClose }) {
  if (!saleData && !invoiceData) return null;

  const data = saleData || invoiceData;
  const isInvoice = !!invoiceData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(5px)',
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
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header Bar */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle size={20} color="#10b981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {isInvoice ? 'Official Invoice' : 'Transaction Success'}
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>


        {/* Receipt Content Body */}
        <div style={{ padding: '1.5rem' }}>
          <div id="printable-receipt" style={{
            backgroundColor: '#fff',
            color: '#111827',
            padding: '1.5rem',
            borderRadius: '12px',
            fontFamily: "'Courier New', Courier, monospace",
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            {/* Header branding */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                <Droplet size={20} color="#d97706" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '0.05em' }}>
                  DISANAYAKE OIL CENTER
                </h2>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '2px 0' }}>
                High Performance Engine Oils & Service
              </p>
              <p style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                Main Street, Colombo | Tel: +94 77 987 6543
              </p>
            </div>

            <div style={{ borderTop: '1px dashed #9ca3af', margin: '0.8rem 0' }} />

            {/* Invoice Meta */}
            <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px', color: '#374151' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Receipt No:</span>
                <strong>#{data.id || data.saleId || '1001'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Date:</span>
                <span>{new Date(data.saleDate || data.invoiceDate || Date.now()).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Customer:</span>
                <strong>{data.customerName || 'Walk-in Customer'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Payment:</span>
                <strong>{data.paymentMethod || 'CASH'}</strong>
              </div>
            </div>

            <div style={{ borderTop: '1px dashed #9ca3af', margin: '0.8rem 0' }} />

            {/* Items Table */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#111827',
                borderBottom: '1px solid #d1d5db',
                paddingBottom: '4px',
                marginBottom: '6px'
              }}>
                <span style={{ flex: 2 }}>ITEM</span>
                <span style={{ flex: 1, textAlign: 'center' }}>QTY x PRICE</span>
                <span style={{ flex: 1, textAlign: 'right' }}>TOTAL</span>
              </div>

              {data.items && data.items.map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem',
                  padding: '3px 0',
                  color: '#1f2937'
                }}>
                  <span style={{ flex: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '4px' }}>
                    {item.productName || item.name}
                  </span>
                  <span style={{ flex: 1, textAlign: 'center', fontSize: '0.72rem' }}>
                    {item.quantity} x Rs.{(item.unitPrice || item.price || 0).toLocaleString()}
                  </span>
                  <span style={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>
                    Rs.{(item.totalPrice || (item.quantity * (item.unitPrice || item.price || 0))).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px dashed #9ca3af', margin: '0.8rem 0' }} />

            {/* Totals */}
            <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', color: '#1f2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal:</span>
                <span>Rs.{(data.subTotal || data.totalAmount || 0).toLocaleString()}</span>
              </div>
              {data.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                  <span>Discount:</span>
                  <span>- Rs.{parseFloat(data.discount).toLocaleString()}</span>
                </div>
              )}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#111827',
                borderTop: '1px solid #111827',
                paddingTop: '6px',
                marginTop: '4px'
              }}>
                <span>TOTAL:</span>
                <span>Rs.{(data.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>

              {data.cashReceived && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
                    <span>Paid Cash:</span>
                    <span>Rs.{parseFloat(data.cashReceived).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                    <span>Change:</span>
                    <span>Rs.{parseFloat(data.balance || 0).toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ borderTop: '1px dashed #9ca3af', margin: '0.8rem 0' }} />

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#6b7280' }}>
              <p style={{ fontWeight: 600 }}>Thank you for visiting Disanayake Oil Center!</p>
              <p>Safe Driving & Smooth Rides!</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-primary">
            <Printer size={16} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
