import React, { useState, useEffect } from 'react';
import { RefreshCw, Wifi } from 'lucide-react';
import apiClient from '../api/config';

export default function Navbar({ activeTab, onRefresh }) {
  const [serverConnected, setServerConnected] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkServerStatus = async () => {
    setIsChecking(true);
    try {
      await apiClient.get('/api/products/all', { timeout: 3000 });
      setServerConnected(true);
    } catch (err) {
      if (err.response) {
        setServerConnected(true);
      } else {
        setServerConnected(false);
      }
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkServerStatus();
  }, []);

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'billing': return 'POS Billing Terminal';
      case 'products': return 'Product & Inventory Management';
      case 'sales': return 'Sales History';
      case 'purchase-orders': return 'Supplier Purchase Orders';
      case 'suppliers': return 'Supplier Directory';
      case 'reports': return 'Sales Reports & Analytics';
      default: return 'POS Billing Terminal';
    }
  };

  return (
    <header style={{
      height: '65px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      zIndex: 5,
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      {/* Title */}
      <div>
        <h1 style={{
          fontSize: '1.2rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          letterSpacing: '-0.01em'
        }}>
          {getPageTitle(activeTab)}
        </h1>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Connection Badge */}
        <div 
          onClick={checkServerStatus}
          title="Click to check http://localhost:8081 status"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            backgroundColor: serverConnected 
              ? '#DCFCE7' 
              : '#FEE2E2',
            border: `1px solid ${serverConnected ? '#86EFAC' : '#FCA5A5'}`,
            cursor: 'pointer',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: serverConnected ? '#15803D' : '#DC2626'
          }}
        >
          <Wifi size={14} className={isChecking ? 'spin' : ''} />
          <span>{serverConnected ? 'API Connected (8081)' : 'Offline / Standalone Mode'}</span>
        </div>

        {/* Refresh Sync Button */}
        <button
          onClick={onRefresh}
          className="btn-icon"
          title="Refresh Data"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}

