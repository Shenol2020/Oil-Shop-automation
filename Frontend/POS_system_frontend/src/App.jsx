import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ReceiptModal from './components/ReceiptModal';
import Toast from './components/Toast';

import POSTerminal from './pages/POSTerminal';
import ProductsPage from './pages/ProductsPage';
import SalesPage from './pages/SalesPage';
import PurchaseOrdersPage from './pages/PurchaseOrdersPage';
import SuppliersPage from './pages/SuppliersPage';
import ReportsPage from './pages/ReportsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('billing');
  const [toast, setToast] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = ({ type = 'success', message }) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSaleCompleted = (saleData) => {
    setReceiptData(saleData);
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    showToast({ type: 'info', message: 'Data synced with backend' });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'billing':
        return <POSTerminal key={refreshKey} showToast={showToast} onSaleCompleted={handleSaleCompleted} />;
      case 'products':
        return <ProductsPage key={refreshKey} showToast={showToast} />;
      case 'sales':
        return <SalesPage key={refreshKey} onViewReceipt={(data) => setReceiptData(data)} />;
      case 'purchase-orders':
        return <PurchaseOrdersPage key={refreshKey} showToast={showToast} />;
      case 'suppliers':
        return <SuppliersPage key={refreshKey} showToast={showToast} />;
      case 'reports':
        return <ReportsPage key={refreshKey} showToast={showToast} />;
      default:
        return <POSTerminal key={refreshKey} showToast={showToast} onSaleCompleted={handleSaleCompleted} />;
    }
  };


  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <div className="main-wrapper">
        <Navbar activeTab={activeTab} onRefresh={handleRefresh} />
        
        <main className="page-content">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Thermal & Printable Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          saleData={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}

      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

