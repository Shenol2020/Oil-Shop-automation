// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calculator, ShoppingBag, Receipt, BarChart3, Check, Users, Truck, ArrowLeft } from 'lucide-react';
import POSTerminalView from './POSTerminalView';
import ProductsPageView from './ProductsPageView';
import SalesPageView from './SalesPageView';
import ReportsPageView from './ReportsPageView';
import SuppliersPageView from './SuppliersPageView';
import PurchaseOrdersPageView from './PurchaseOrdersPageView';
import ReceiptModal from './ReceiptModal';

type PosTab = 'terminal' | 'products' | 'sales' | 'reports' | 'suppliers' | 'purchase-orders';

export const POSTerminalPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as PosTab) || 'terminal';
  const [activeTab, setActiveTab] = useState<PosTab>(initialTab);
  const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [preselectedSupplierId, setPreselectedSupplierId] = useState<string | null>(null);

  // Sync tab state with search params if URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab') as PosTab;
    if (tabParam && ['terminal', 'products', 'sales', 'reports', 'suppliers', 'purchase-orders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (newTab: PosTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const showToast = (toastInput: any) => {
    if (!toastInput) return;
    if (typeof toastInput === 'string') {
      setToast({ type: 'success', message: toastInput });
    } else if (typeof toastInput === 'object' && toastInput.message) {
      setToast({
        type: toastInput.type || 'success',
        message: String(toastInput.message),
      });
    }
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaleCompleted = (sale: any) => {
    setReceiptData(sale);
    showToast('Sale transaction recorded successfully!');
  };

  const handleCreatePoForSupplier = (supplierId: number | string) => {
    setPreselectedSupplierId(String(supplierId));
    handleTabChange('purchase-orders');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
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
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            zIndex: 9999,
            fontSize: '0.875rem',
            fontWeight: 600,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            minWidth: '280px',
          }}
        >
          <Check size={18} color={toast.type === 'danger' ? '#EF4444' : toast.type === 'warning' ? '#F59E0B' : '#10B981'} />
          <span style={{ flex: 1 }}>{toast.message}</span>
        </div>
      )}

      {/* Back button and Subtab Navigation Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              In-Store POS & Supply Chain Management
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.8rem', margin: '0.15rem 0 0 0' }}>
              Cashier checkout, live inventory, sales logging, supplier directory, and purchase restock orders.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', backgroundColor: '#F1F5F9', padding: '0.3rem', borderRadius: '10px' }}>
          <button
            onClick={() => handleTabChange('terminal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
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
            onClick={() => handleTabChange('products')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
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
            onClick={() => handleTabChange('sales')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
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
            onClick={() => handleTabChange('suppliers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'suppliers' ? '#059669' : 'transparent',
              color: activeTab === 'suppliers' ? '#FFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Users size={15} /> Suppliers
          </button>
          <button
            onClick={() => handleTabChange('purchase-orders')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === 'purchase-orders' ? '#059669' : 'transparent',
              color: activeTab === 'purchase-orders' ? '#FFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            <Truck size={15} /> Purchase Orders
          </button>
          <button
            onClick={() => handleTabChange('reports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.5rem 0.85rem',
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
        {activeTab === 'suppliers' && (
          <SuppliersPageView
            showToast={showToast}
            onCreatePoForSupplier={handleCreatePoForSupplier}
          />
        )}
        {activeTab === 'purchase-orders' && (
          <PurchaseOrdersPageView
            showToast={showToast}
            initialSupplierId={preselectedSupplierId}
          />
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
