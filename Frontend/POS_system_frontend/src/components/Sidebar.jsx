import React from 'react';
import {
  ShoppingCart,
  Package,
  Receipt,
  Truck,
  Users,
  BarChart3,
  Droplet
} from 'lucide-react';
import SheenPillButton from '@/components/ui/sheen-pill-button';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'billing', label: 'POS Terminal', icon: ShoppingCart, badge: 'LIVE' },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'sales', label: 'Sales History', icon: Receipt },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: Truck },
    { id: 'suppliers', label: 'Supplier Directory', icon: Users },
    { id: 'reports', label: 'Sales Reports', icon: BarChart3 },
  ];

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#FFFFFF',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none',
      zIndex: 10,
      boxShadow: '2px 0 10px rgba(0,0,0,0.02)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          color: '#FFF'
        }}>
          <Droplet size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            letterSpacing: '0.01em',
            lineHeight: '1.2'
          }}>
            Disanayaka Oil shop POS
          </h2>
          <p style={{
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--primary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            OIL & INVENTORY
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ padding: '1.25rem 0.85rem', flex: 1 }}>
        <p style={{
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0.5rem 0.75rem',
          marginBottom: '0.5rem'
        }}>
          MAIN MENU
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <SheenPillButton
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              active={isActive}
              width="100%"
              height={46}
              highlight={18}
              style={{
                marginBottom: '0.45rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
                <Icon size={19} color={isActive ? '#FFFFFF' : 'var(--text-muted)'} strokeWidth={2.2} />
                <span>{item.label}</span>
              </div>
            </SheenPillButton>
          );
        })}
      </nav>
    </aside>
  );
}

