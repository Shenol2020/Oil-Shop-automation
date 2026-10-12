import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  DollarSign, 
  Tag, 
  Droplet,
  CheckCircle2,
  User,
  ShoppingBag,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { productsApi, salesApi } from '../api';
import { getProductImageUrl } from '../utils/imageStorage';

export default function POSTerminal({ showToast, onSaleCompleted }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [orderNumber, setOrderNumber] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // 'CASH' | 'CARD'
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Categories list
  const categories = ['ALL', 'Engine Oil', 'Gear Oil', 'Filters', 'Grease', 'Coolants', 'Additives', 'Services'];

  const loadProducts = async () => {
    setLoading(true);
    const res = await productsApi.getAll();
    setProducts(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    const pName = (p.p_name || p.name || '').toLowerCase();
    const pCode = (p.code || '').toLowerCase();
    const pBrand = (p.brand || '').toLowerCase();
    const pVisc = (p.viscosity || '').toLowerCase();

    const matchesSearch = pName.includes(searchLower) || pCode.includes(searchLower) || pBrand.includes(searchLower) || pVisc.includes(searchLower);
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Count items per category
  const getCategoryCount = (cat) => {
    if (cat === 'ALL') return products.length;
    return products.filter(p => p.category === cat).length;
  };

  // Cart helper actions
  const addToCart = (product) => {
    const pID = product.pID || product.id;
    const availableStock = product.stockQuantity !== undefined ? product.stockQuantity : (product.current_stock_quantity || 0);

    if (availableStock <= 0 && product.category !== 'Services') {
      showToast({ type: 'danger', message: `${product.p_name || product.name} is Out of Stock!` });
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => (item.pID || item.id) === pID);
      if (existing) {
        if (existing.quantity >= availableStock && product.category !== 'Services') {
          showToast({ type: 'warning', message: `Cannot add more than available stock (${availableStock})` });
          return prev;
        }
        return prev.map(item => (item.pID || item.id) === pID ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, pID, quantity: 1 }];
    });
  };

  const updateQuantity = (pID, delta) => {
    setCart(prev => {
      return prev.map(item => {
        const itemId = item.pID || item.id;
        if (itemId === pID) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          const availableStock = item.stockQuantity !== undefined ? item.stockQuantity : (item.current_stock_quantity || 0);
          if (newQty > availableStock && item.category !== 'Services') {
            showToast({ type: 'warning', message: `Stock limit reached (${availableStock})` });
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (pID) => {
    setCart(prev => prev.filter(item => (item.pID || item.id) !== pID));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    setCashReceived('');
  };

  // Financial Calculations
  const subTotal = cart.reduce((acc, item) => acc + (parseFloat(item.price || 0) * item.quantity), 0);
  const finalDiscount = Math.min(subTotal, Math.max(0, parseFloat(discount) || 0));
  const totalAmount = Math.max(0, subTotal - finalDiscount);
  const numericCashReceived = parseFloat(cashReceived) || 0;
  const balance = paymentMethod === 'CASH' && numericCashReceived > 0 ? numericCashReceived - totalAmount : 0;

  // Checkout POST submit to Spring Boot /api/sales/create
  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast({ type: 'warning', message: 'Cart is empty! Select products first.' });
      return;
    }

    if (paymentMethod === 'CASH' && numericCashReceived < totalAmount) {
      showToast({ type: 'danger', message: `Cash received (Rs.${numericCashReceived}) is less than total amount (Rs.${totalAmount})` });
      return;
    }

    setSubmitting(true);

    try {
      // Send CreateSaleRequest payload to backend
      const res = await salesApi.create(cart);
      const createdSale = res.data;

      showToast({ type: 'success', message: 'Sale successfully completed and stock updated!' });
      
      onSaleCompleted({
        ...createdSale,
        id: createdSale.saleId || createdSale.id,
        saleId: createdSale.saleId || createdSale.id,
        invoiceNumber: createdSale.invoiceNumber || (createdSale.invoice ? createdSale.invoice.invoiceNumber : `INV-${createdSale.saleId || Date.now()}`),
        customerName: `Order #${String(orderNumber).padStart(2, '0')}`,
        paymentMethod,
        subTotal,
        discount: finalDiscount,
        totalAmount,
        cashReceived: paymentMethod === 'CASH' ? numericCashReceived : totalAmount,
        balance: paymentMethod === 'CASH' ? Math.max(0, balance) : 0,
        items: cart.map(item => ({
          productId: item.pID || item.id,
          productName: item.p_name || item.name,
          quantity: item.quantity,
          unitPrice: parseFloat(item.price || 0),
          totalPrice: parseFloat(item.price || 0) * item.quantity
        }))
      });

      clearCart();
      setOrderNumber(prev => prev + 1);
      loadProducts(); // refresh stock from database
    } catch (err) {
      console.error("Sale checkout error:", err);
      showToast({ type: 'danger', message: 'Failed to record sale to backend' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '1.25rem', overflow: 'hidden' }}>
      
      {/* LEFT: Product Catalog & Category Filter */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Search Bar */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
            <input
              type="text"
              placeholder="Search product here (name, viscosity, brand, code)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-control"
              style={{
                paddingLeft: '2.6rem',
                width: '100%',
                borderRadius: '12px',
                fontSize: '0.9rem',
                backgroundColor: '#F8FAFC'
              }}
            />
          </div>
          <div style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            backgroundColor: '#F1F5F9',
            padding: '0.5rem 0.85rem',
            borderRadius: '10px',
            whiteSpace: 'nowrap'
          }}>
            {filteredProducts.length} Products
          </div>
        </div>

        {/* Category Cards (Chili POS Style) */}
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          marginBottom: '0.75rem',
          scrollbarWidth: 'none'
        }}>
          {categories.map(cat => {
            const active = selectedCategory === cat;
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`sheen-pill-btn ${active ? 'sheen-pill-btn-active' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  padding: '0.65rem 1.15rem',
                  minWidth: '115px',
                  borderRadius: '9999px',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: active ? '#FFFFFF' : 'var(--text-main)',
                  whiteSpace: 'nowrap'
                }}>
                  {cat}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: active ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)',
                  marginTop: '2px'
                }}>
                  {count} items
                </div>
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              Loading product catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: 'var(--text-muted)',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px dashed var(--border-color)'
            }}>
              <Droplet size={40} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ fontWeight: 600 }}>No products found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '1rem',
              paddingBottom: '1rem'
            }}>
              {filteredProducts.map((product) => {
                const pID = product.pID || product.id;
                const stock = product.stockQuantity !== undefined ? product.stockQuantity : (product.current_stock_quantity || 0);
                const isOutOfStock = stock <= 0 && product.category !== 'Services';
                const isLowStock = stock > 0 && stock <= (product.minStock || 5) && product.category !== 'Services';
                const inCartItem = cart.find(item => (item.pID || item.id) === pID);

                return (
                  <div
                    key={pID}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: inCartItem ? '1.5px solid var(--primary)' : '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'var(--transition)',
                      position: 'relative'
                    }}
                  >
                    {/* Top tags */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: 'var(--primary)',
                        backgroundColor: '#DCFCE7',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        {product.code || `ID #${pID}`}
                      </span>
                      {product.category === 'Services' ? (
                        <span className="badge badge-info">Service</span>
                      ) : isOutOfStock ? (
                        <span className="badge badge-danger">OUT OF STOCK</span>
                      ) : isLowStock ? (
                        <span className="badge badge-warning">LOW ({stock})</span>
                      ) : (
                        <span className="badge badge-success">{stock} in stock</span>
                      )}
                    </div>

                    {/* Optional Product Image Preview */}
                    {product.pic && (
                      <div style={{
                        width: '100%',
                        height: '110px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        marginBottom: '0.65rem',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid var(--border-color)'
                      }}>
                        <img
                          src={getProductImageUrl(product.pic)}
                          alt={product.p_name || product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    )}

                    {/* Title & Brand */}
                    <div style={{ marginBottom: '0.85rem' }}>
                      <h4 style={{
                        fontSize: '0.94rem',
                        fontWeight: 800,
                        color: 'var(--text-main)',
                        marginBottom: '4px',
                        lineHeight: '1.3'
                      }}>
                        {product.p_name || product.name}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {product.brand && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            {product.brand}
                          </span>
                        )}
                        {product.viscosity && product.viscosity !== 'N/A' && (
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: '#059669',
                            backgroundColor: '#F0FDF4',
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}>
                            {product.viscosity}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price & Action Button (Chili POS Add to Dish style) */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '0.85rem',
                      marginTop: 'auto'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>PRICE</span>
                        <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 800 }}>
                          Rs.{(parseFloat(product.price) || 0).toLocaleString()}
                        </strong>
                      </div>

                      {inCartItem ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          backgroundColor: '#F8FAFC',
                          padding: '3px 6px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)'
                        }}>
                          <button
                            onClick={() => updateQuantity(pID, -1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: '#E2E8F0',
                              color: '#0F172A',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', minWidth: '18px', textAlign: 'center' }}>
                            {inCartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(pID, 1)}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: 'var(--primary)',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled={isOutOfStock}
                          onClick={() => addToCart(product)}
                          className={isOutOfStock ? "btn btn-secondary" : "btn btn-primary"}
                          style={{
                            padding: '0.45rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}
                        >
                          <Plus size={14} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Cart / Order Checkout Panel (Chili POS Right Sidebar Style) */}
      <div style={{
        width: '390px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)'
      }}>
        
        {/* Cart Header - Display only order number and clear cart */}
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
            Order #{String(orderNumber).padStart(2, '0')}
          </h3>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="btn btn-danger"
              style={{
                padding: '4px 12px',
                fontSize: '0.78rem'
              }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Cart Line Items */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          padding: '1rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}>
          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3.5rem 1rem',
              color: 'var(--text-dim)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <ShoppingBag size={40} color="#CBD5E1" />
              <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>Cart is empty</p>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Select items from the catalog on the left</span>
            </div>
          ) : (
            cart.map(item => {
              const pID = item.pID || item.id;
              const lineTotal = (parseFloat(item.price || 0) * item.quantity);
              return (
                <div
                  key={pID}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '2px', lineHeight: '1.2' }}>
                      {item.p_name || item.name}
                    </h5>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Rs.{(parseFloat(item.price) || 0).toLocaleString()} × {item.quantity}
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <button
                      onClick={() => updateQuantity(pID, -1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Minus size={12} />
                    </button>

                    <span style={{
                      minWidth: '20px',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: 'var(--text-main)'
                    }}>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(pID, 1)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#FFFFFF',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={12} />
                    </button>

                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      marginLeft: '0.4rem',
                      minWidth: '65px',
                      textAlign: 'right'
                    }}>
                      Rs.{lineTotal.toLocaleString()}
                    </span>

                    <button
                      onClick={() => removeFromCart(pID)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '3px',
                        marginLeft: '0.2rem'
                      }}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Financial Calculation & Checkout Area */}
        <div style={{
          padding: '1.25rem',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          flexShrink: 0
        }}>
          {/* Summary Lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
              <span>Sub Total</span>
              <strong style={{ color: 'var(--text-main)' }}>Rs.{subTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', alignItems: 'center' }}>
              <span>Discount</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem' }}>Rs.</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="form-control"
                  style={{ width: '85px', padding: '2px 6px', fontSize: '0.8rem', textAlign: 'right', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1.5px dashed var(--border-color)',
              paddingTop: '0.65rem',
              marginTop: '0.2rem'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>Total Amount</span>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
                Rs.{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Payment Method Selector (Cash and Card only) */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
              Select Payment Method
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {[
                { id: 'CASH', label: 'Cash', icon: DollarSign },
                { id: 'CARD', label: 'Card', icon: CreditCard }
              ].map(pm => {
                const Icon = pm.icon;
                const active = paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`sheen-pill-btn ${active ? 'sheen-pill-btn-active' : ''}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 0.5rem',
                      borderRadius: '9999px',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={18} />
                    <span>{pm.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cash Tender & Change (Only when Cash selected) */}
          {paymentMethod === 'CASH' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>Cash Received (Rs.)</span>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="form-control"
                  style={{ width: '130px', padding: '4px 8px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '8px' }}
                />
              </div>

              {/* Quick Amount Suggestion Buttons */}
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                {[totalAmount, Math.ceil(totalAmount / 1000) * 1000, 5000, 10000, 20000].filter((v, i, a) => v > 0 && a.indexOf(v) === i).slice(0, 4).map((amt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashReceived(String(amt))}
                    className="btn btn-secondary"
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      cursor: 'pointer'
                    }}
                  >
                    Rs.{amt.toLocaleString()}
                  </button>
                ))}
              </div>

              {numericCashReceived > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', paddingTop: '4px', borderTop: '1px solid #E2E8F0' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Balance to Return:</span>
                  <strong style={{ color: balance >= 0 ? '#10B981' : '#EF4444', fontWeight: 800 }}>
                    {balance >= 0 ? `Rs.${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : `Short: Rs.${Math.abs(balance).toLocaleString()}`}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* Large Primary Action Button: "Place Order" (Chili POS Style) */}
          <button
            disabled={submitting || cart.length === 0}
            onClick={handleCheckout}
            className="sheen-pill-btn sheen-pill-btn-active"
            style={{
              width: '100%',
              padding: '0.9rem 1.5rem',
              borderRadius: '9999px',
              fontSize: '1rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              cursor: cart.length === 0 || submitting ? 'not-allowed' : 'pointer',
              opacity: cart.length === 0 ? 0.6 : 1
            }}
          >
            {submitting ? (
              <span>Processing Sale...</span>
            ) : (
              <>
                <span>Place Order</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
