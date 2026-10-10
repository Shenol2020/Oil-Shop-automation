import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw,
  X,
  PackageCheck,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { productsApi, suppliersApi, CATEGORY_NAME_MAP } from '../api';
import { saveUploadedImage, getProductImageUrl } from '../utils/imageStorage';

export default function ProductsPage({ showToast }) {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    p_name: '',
    category: 'Engine Oil',
    brand: '',
    volume: '4L',
    price: '',
    current_stock_quantity: '',
    supplierID: '',
    p_description: '',
    pic: ''
  });

  const categories = ['Engine Oil', 'Gear Oil', 'Filters', 'Grease', 'Coolants', 'Additives', 'Services'];

  const fetchProductsAndSuppliers = async () => {
    setLoading(true);
    const [prodRes, supRes] = await Promise.all([
      productsApi.getAll(),
      suppliersApi.getAll()
    ]);
    setProducts(prodRes.data || []);
    setSuppliers(supRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProductsAndSuppliers();
  }, []);

  const handleOpenAdd = () => {
    setEditProduct(null);
    const defaultSupplierId = suppliers.length > 0 ? (suppliers[0].supplierId || suppliers[0].id) : 1;
    setFormData({
      p_name: '',
      category: 'Engine Oil',
      brand: '',
      volume: '4L',
      price: '',
      current_stock_quantity: '',
      supplierID: defaultSupplierId,
      p_description: '',
      pic: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditProduct(prod);
    setFormData({
      p_name: prod.p_name || prod.name || '',
      category: prod.category || CATEGORY_NAME_MAP[prod.categoryID] || 'Engine Oil',
      brand: prod.brand || '',
      volume: prod.volume || prod.viscosity || '4L',
      price: prod.price !== undefined ? String(prod.price) : '',
      current_stock_quantity: prod.current_stock_quantity !== undefined ? prod.current_stock_quantity : prod.stockQuantity || '',
      supplierID: prod.supplierID || (suppliers.length > 0 ? (suppliers[0].supplierId || suppliers[0].id) : 1),
      p_description: prod.p_description || prod.description || '',
      pic: prod.pic || prod.image || ''
    });
    setShowModal(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast({ type: 'warning', message: 'Please select a valid image file.' });
        return;
      }
      try {
        const imagePath = await saveUploadedImage(file, formData.p_name || formData.brand || 'product');
        setFormData(prev => ({ ...prev, pic: imagePath }));
        showToast({ type: 'success', message: `Image stored to ${imagePath}` });
      } catch (err) {
        showToast({ type: 'danger', message: 'Could not process and save image.' });
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, pic: '' }));
  };

  const handleDelete = async (pID, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await productsApi.delete(pID);
        showToast({ type: 'success', message: `${name} deleted from Database.` });
        fetchProductsAndSuppliers();
      } catch (err) {
        showToast({ type: 'danger', message: 'Failed to delete product.' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.p_name || !formData.price) {
      showToast({ type: 'warning', message: 'Please enter product name and price.' });
      return;
    }

    try {
      if (editProduct) {
        await productsApi.update(editProduct.pID || editProduct.id, {
          ...formData,
          stockQuantity: formData.current_stock_quantity
        });
        showToast({ type: 'success', message: 'Product updated in Spring Boot backend.' });
      } else {
        await productsApi.create({
          ...formData,
          stockQuantity: formData.current_stock_quantity
        });
        showToast({ type: 'success', message: 'Product added to Database.' });
      }
      setShowModal(false);
      fetchProductsAndSuppliers();
    } catch (err) {
      showToast({ type: 'danger', message: 'Error saving product.' });
    }
  };

  // Filter products
  const filtered = products.filter(p => {
    const pName = (p.p_name || p.name || '').toLowerCase();
    const pCode = (p.code || '').toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = pName.includes(query) || pCode.includes(query);
    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      
      {/* Header Controls */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '300px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by product name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: '2.6rem', width: '100%', borderRadius: '12px' }}
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-control"
            style={{ width: '170px', borderRadius: '12px' }}
          >
            <option value="ALL">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchProductsAndSuppliers} className="btn btn-secondary">
            <RefreshCw size={16} /> Sync Database
          </button>
          <button onClick={handleOpenAdd} className="btn btn-primary">
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="table-responsive" style={{ flex: 1, overflowY: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '56px' }}>Image</th>
                <th>Product ID</th>
                <th>Product Name (p_name)</th>
                <th>Category</th>
                <th>Volume/Viscosity</th>
                <th>Price (LKR)</th>
                <th>Stock Qty</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading Inventory from Spring Boot Backend...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No products found in database.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => {
                  const pID = prod.pID || prod.id;
                  const stock = prod.current_stock_quantity !== undefined ? prod.current_stock_quantity : prod.stockQuantity;
                  const isOut = stock <= 0 && prod.category !== 'Services';
                  const isLow = stock > 0 && stock <= 5 && prod.category !== 'Services';

                  return (
                    <tr key={pID}>
                      <td style={{ width: '56px' }}>
                        {prod.pic ? (
                          <img
                            src={getProductImageUrl(prod.pic)}
                            alt={prod.p_name || prod.name}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              border: '1px solid var(--border-color)',
                              display: 'block'
                            }}
                          />
                        ) : (
                          <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            backgroundColor: '#F1F5F9',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#94A3B8'
                          }}>
                            <ImageIcon size={18} />
                          </div>
                        )}
                      </td>
                      <td style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--primary)' }}>
                        #{pID}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{prod.p_name || prod.name}</div>
                        {prod.brand && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Brand: {prod.brand}</div>}
                      </td>
                      <td>
                        <span style={{
                          backgroundColor: '#F1F5F9',
                          color: '#334155',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}>
                          {prod.category}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {prod.volume || prod.viscosity || 'N/A'}
                      </td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>
                        Rs.{(parseFloat(prod.price) || 0).toLocaleString()}
                      </td>
                      <td>
                        {prod.category === 'Services' ? (
                          <span className="badge badge-info">Service</span>
                        ) : isOut ? (
                          <span className="badge badge-danger">OUT OF STOCK (0)</span>
                        ) : isLow ? (
                          <span className="badge badge-warning">LOW ({stock})</span>
                        ) : (
                          <span className="badge badge-success">{stock} units</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button onClick={() => handleOpenEdit(prod)} className="btn-icon" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => handleDelete(pID, prod.p_name || prod.name)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
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
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <PackageCheck color="var(--primary)" size={22} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {editProduct ? `Edit Product #${editProduct.pID || editProduct.id}` : 'Add New Product to Database'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-icon"><X size={18} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Product Image (pic) Selector from Device */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Product Image (pic)</span>
                  {formData.pic && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>Image Ready</span>
                  )}
                </label>
                
                <input
                  type="file"
                  id="product-pic-input"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

                {formData.pic ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-color)',
                    backgroundColor: '#F8FAFC'
                  }}>
                    <img
                      src={getProductImageUrl(formData.pic)}
                      alt="Product preview"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        border: '1px solid #CBD5E1'
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                        Image Stored in Frontend:
                      </span>
                      <span style={{
                        fontSize: '0.72rem',
                        color: 'var(--primary)',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 700,
                        wordBreak: 'break-all',
                        display: 'block'
                      }}>
                        {formData.pic}
                      </span>
                    </div>
                    <label
                      htmlFor="product-pic-input"
                      className="btn btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      Change
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="btn-icon"
                      style={{ color: 'var(--danger)' }}
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="product-pic-input"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.25rem 1rem',
                      border: '1.5px dashed #CBD5E1',
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = '#F0FDF4'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                  >
                    <Upload size={22} color="var(--primary)" style={{ marginBottom: '4px' }} />
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      Click to select product image from device
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Supports PNG, JPG, or WebP (up to 2MB)
                    </span>
                  </label>
                )}
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Product Name (p_name)</label>
                <input
                  type="text"
                  placeholder="e.g. Mobil 1 Super 3000 5W-30 (4L)"
                  value={formData.p_name}
                  onChange={(e) => setFormData({ ...formData, p_name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-control"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Volume / Spec</label>
                  <input
                    type="text"
                    placeholder="e.g. 4L, 1L, EP2"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Mobil, Castrol, Toyota"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Price (LKR)</label>
                  <input
                    type="text"
                    placeholder="14500.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Current Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={formData.current_stock_quantity}
                    onChange={(e) => setFormData({ ...formData, current_stock_quantity: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Select Supplier</label>
                  <select
                    value={formData.supplierID}
                    onChange={(e) => setFormData({ ...formData, supplierID: e.target.value })}
                    className="form-control"
                  >
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => {
                      const sId = s.supplierId || s.id;
                      return (
                        <option key={sId} value={sId}>
                          {s.name} ({s.contactName || s.contactPerson || `ID #${sId}`})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Description</label>
                <input
                  type="text"
                  placeholder="Engine oil description..."
                  value={formData.p_description}
                  onChange={(e) => setFormData({ ...formData, p_description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">{editProduct ? 'Save Changes' : 'Add to Database'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

