import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, ShoppingCart, Check, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import { productsApi } from '../../../services/posApi';
import type { Product } from '../../../types';

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const { addToCart } = useCartStore();

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8081/api/products/all');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, loading local catalog cache', err);
      }

      // Fallback to posApi products cache
      try {
        const fallbackRes = await productsApi.getAll();
        const fallback = fallbackRes.data || [];
        if (isMounted) {
          setProducts(
            fallback.map((p: any) => ({
              pID: p.pID || p.id,
              p_name: p.p_name || p.name,
              categoryID: p.categoryID || 1,
              price: p.price,
              current_stock_quantity: p.stockQuantity ?? p.current_stock_quantity ?? 10,
              description: p.description,
            }))
          );
        }
      } catch {
        // graceful handle
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddToCart = (prod: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(prod, 1);
    setAddedToast(prod.p_name);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const categories = ['ALL', 'Engine Oil', 'Gear Oil', 'Coolants', 'Filters', 'Additives'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.p_name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Toast notification */}
      {addedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#059669',
            color: '#FFF',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px rgba(5, 150, 105, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            zIndex: 100,
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <Check size={18} />
          Added "{addedToast}" to your cart!
        </div>
      )}

      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
          borderRadius: '16px',
          padding: '2.5rem',
          color: '#FFF',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
            Direct Online Ordering
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.35rem 0 0.5rem 0', color: '#FFF' }}>
            Genuine Lubricants & Auto Fluids
          </h1>
          <p style={{ margin: 0, opacity: 0.95, fontSize: '0.95rem', maxWidth: '580px', lineHeight: 1.5 }}>
            Order factory sealed engine oils, coolants, and brake fluids directly with prompt store pickup or home dispatch.
          </p>
        </div>

        <Link
          to="/cart"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#FFF',
            color: '#059669',
            padding: '0.75rem 1.35rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          }}
        >
          <ShoppingCart size={18} />
          View Cart
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Category tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? '#059669' : '#FFF',
                color: selectedCategory === cat ? '#FFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search by oil name, brand, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.75rem 0.65rem 2.5rem',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFF',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748B' }}>
          Loading products catalog from database...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: '#FFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <ShoppingBag size={48} color="#94A3B8" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.5rem 0' }}>No products match your search</h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem', margin: 0 }}>Try clearing your filters or search keywords.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filteredProducts.map((p) => {
            const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
            const inStock = (p.current_stock_quantity ?? 0) > 0;

            return (
              <div
                key={p.pID}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                {/* Visual Header */}
                <div
                  style={{
                    height: '140px',
                    background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <ShoppingBag size={44} color="#94A3B8" />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      backgroundColor: inStock ? '#ECFDF5' : '#FEF2F2',
                      color: inStock ? '#059669' : '#DC2626',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '9999px',
                    }}
                  >
                    {inStock ? `In Stock (${p.current_stock_quantity})` : 'Out of Stock'}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '12px',
                      fontSize: '0.7rem',
                      color: '#64748B',
                      fontWeight: 700,
                    }}
                  >
                    SKU #{p.pID}
                  </span>
                </div>

                {/* Details */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem 0', lineHeight: 1.3 }}>
                    {p.p_name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1rem 0', flex: 1, lineHeight: 1.4 }}>
                    {p.description || 'Premium formulated automotive lubricant.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Price</span>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>
                        Rs. {(isNaN(price) ? 0 : price).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <Link
                      to={`/product/${p.pID}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFF',
                        color: '#334155',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Eye size={14} /> Details
                    </Link>
                    <button
                      disabled={!inStock}
                      onClick={(e) => handleAddToCart(p, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        padding: '0.6rem',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: inStock ? '#059669' : '#CBD5E1',
                        color: '#FFF',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: inStock ? 'pointer' : 'not-allowed',
                      }}
                    >
                      <ShoppingCart size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
