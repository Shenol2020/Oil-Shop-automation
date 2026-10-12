// @ts-nocheck
import React, { useState } from 'react';
import { Calculator, ShoppingBag, Receipt, BarChart3, Check } from 'lucide-react';
import POSTerminalView from './POSTerminalView';
import ProductsPageView from './ProductsPageView';
import SalesPageView from './SalesPageView';
import ReportsPageView from './ReportsPageView';
import ReceiptModal from './ReceiptModal';

export const POSTerminalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'products' | 'sales' | 'reports'>('terminal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaleCompleted = (sale: any) => {
    setReceiptData(sale);
    showToast('Sale transaction recorded successfully!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Toast Alert */}
      {toastMessage && (
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
          {toastMessage}
        </div>
      )}

      {/* Subtab Navigation Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            In-Store POS Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.825rem', margin: '0.15rem 0 0 0' }}>
            Instant retail billing, inventory modification, transaction logging, and revenue reporting.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: '#F1F5F9', padding: '0.3rem', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('terminal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'terminal' ? '#059669' : 'transparent',
              color: activeTab === 'terminal' ? '#FFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Calculator size={15} /> Cashier Terminal
          </button>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'products' ? '#059669' : 'transparent',
              color: activeTab === 'products' ? '#FFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <ShoppingBag size={15} /> Inventory
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'sales' ? '#059669' : 'transparent',
              color: activeTab === 'sales' ? '#FFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Receipt size={15} /> Sales History
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'reports' ? '#059669' : 'transparent',
              color: activeTab === 'reports' ? '#FFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <BarChart3 size={15} /> Reports
          </button>
        </div>
      </div>

      {/* Render Active View */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {activeTab === 'terminal' && (
          <POSTerminalView showToast={showToast} onSaleCompleted={handleSaleCompleted} />
        )}
        {activeTab === 'products' && <ProductsPageView showToast={showToast} />}
        {activeTab === 'sales' && (
          <SalesPageView onViewReceipt={(sale) => setReceiptData(sale)} />
        )}
        {activeTab === 'reports' && <ReportsPageView showToast={showToast} />}
      </div>

      {/* Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          saleData={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}
    </div>
  );
};

export default POSTerminalPage;
