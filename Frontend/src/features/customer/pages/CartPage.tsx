import React from 'react';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Your Shopping Cart
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
            Review selected items before proceeding to checkout.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              background: 'none',
              border: 'none',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '3rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <ShoppingCart size={40} color="#94A3B8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>
            Your cart is currently empty
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Explore our oil categories and add lubricants to your cart.
          </p>
          <Link
            to="/shop"
            style={{
              backgroundColor: '#10B981',
              color: '#FFF',
              padding: '0.65rem 1.25rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
          {/* Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item) => (
              <div
                key={item.product.pID}
                style={{
                  backgroundColor: '#FFF',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                    {item.product.p_name}
                  </div>
                  <div style={{ color: '#64748B', fontSize: '0.8rem' }}>Rs. {item.product.price} each</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
                    <button
                      onClick={() => updateQuantity(item.product.pID, item.quantity - 1)}
                      style={{ padding: '0.2rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0.2rem 0.6rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.pID, item.quantity + 1)}
                      style={{ padding: '0.2rem 0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.pID)}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              backgroundColor: '#FFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '1.5rem',
              height: 'fit-content',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: '0 0 1rem 0' }}>
              Order Summary
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#64748B' }}>Total:</span>
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.15rem' }}>
                Rs. {getTotalPrice().toFixed(2)}
              </span>
            </div>
            <Link
              to="/checkout"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#10B981',
                color: '#FFF',
                padding: '0.75rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginTop: '1rem',
              }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
