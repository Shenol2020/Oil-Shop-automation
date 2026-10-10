import apiClient from './config';
import {
  MOCK_PRODUCTS,
  MOCK_SALES,
  MOCK_INVOICES,
  MOCK_PURCHASE_ORDERS,
  MOCK_SUPPLIERS,
  MOCK_REPORTS
} from './mockData';

// Category maps matching Spring Boot categoryID
export const CATEGORY_NAME_MAP = {
  1: 'Engine Oil',
  2: 'Gear Oil',
  3: 'Filters',
  4: 'Grease',
  5: 'Coolants',
  6: 'Additives',
  7: 'Services'
};

export const CATEGORY_ID_MAP = {
  'Engine Oil': 1,
  'Gear Oil': 2,
  'Filters': 3,
  'Grease': 4,
  'Coolants': 5,
  'Additives': 6,
  'Services': 7
};

// Normalizer to convert Spring Boot Product entity to Frontend View Model
export function normalizeProduct(p) {
  if (!p) return null;
  const pID = p.pID || p.id;
  const priceVal = parseFloat(p.price || 0);
  const stockVal = p.current_stock_quantity !== undefined ? p.current_stock_quantity : (p.stockQuantity || 0);
  const catName = p.category || CATEGORY_NAME_MAP[p.categoryID] || 'Engine Oil';

  return {
    id: pID,
    pID: pID,
    code: p.code || (pID ? `OIL-${String(pID).padStart(3, '0')}` : 'OIL-000'),
    name: p.p_name || p.name || 'Unnamed Product',
    p_name: p.p_name || p.name,
    category: catName,
    categoryID: p.categoryID || CATEGORY_ID_MAP[catName] || 1,
    price: priceVal,
    priceString: String(p.price || '0'),
    costPrice: parseFloat(p.costPrice || 0),
    stockQuantity: stockVal,
    current_stock_quantity: stockVal,
    minStock: p.minStock || 5,
    brand: p.brand || '',
    volume: p.volume || '',
    viscosity: p.volume || p.viscosity || 'N/A',
    description: p.p_description || p.description || '',
    p_description: p.p_description || p.description || '',
    supplierID: p.supplierID || 1,
    unit: p.unit || p.volume || 'Can',
    pic: p.pic || p.image || ''
  };
}

// Normalizer for Spring Boot Sale entity / SaleResponse to Frontend View Model
export function normalizeSale(s) {
  if (!s) return null;
  const sId = s.saleId || s.id;
  const invNum = s.invoiceNumber || (s.invoice ? s.invoice.invoiceNumber : `INV-${sId}`);
  return {
    ...s,
    id: sId,
    saleId: sId,
    invoiceNumber: invNum,
    saleDate: s.saleDate || s.date || new Date().toISOString().split('T')[0],
    subtotal: parseFloat(s.subtotal !== undefined ? s.subtotal : s.totalAmount || 0),
    totalAmount: parseFloat(s.totalAmount !== undefined ? s.totalAmount : s.subtotal || 0),
    items: (s.items || []).map(item => ({
      ...item,
      productId: item.productId || (item.product ? (item.product.pID || item.product.id) : null),
      productName: item.productName || (item.product ? (item.product.p_name || item.product.name) : 'Product'),
      quantity: item.quantity || 1,
      unitPrice: parseFloat(item.unitPrice || item.price || 0),
      totalPrice: parseFloat(item.lineTotal || (item.unitPrice * item.quantity) || 0)
    }))
  };
}

// Memory cache fallback in case backend DB has 0 items initially or network error
let localProducts = [...MOCK_PRODUCTS];
let localSales = [...MOCK_SALES];
let localInvoices = [...MOCK_INVOICES];
let localPurchaseOrders = [...MOCK_PURCHASE_ORDERS];
let localSuppliers = [...MOCK_SUPPLIERS];
let localReports = [...MOCK_REPORTS];


async function handleRequest(apiFunc, fallbackData, isArray = true) {
  try {
    const response = await apiFunc();
    if (response && response.data !== undefined && response.data !== null) {
      // If array response is empty, return array
      return { data: response.data, isMock: false };
    }
    return { data: fallbackData, isMock: true };
  } catch (error) {
    console.warn(`[Spring Boot API Endpoint Call] ${error.config?.url} returned: ${error.message}`);
    return { data: fallbackData, isMock: true, error: error.message };
  }
}

// ---------------------- PRODUCTS API ----------------------
// Backend endpoints:
// GET /api/products/all
// GET /api/products/getProduct/{pID}
// POST /api/products/add
// PUT /api/products/updateStock/{pID}
// PUT /api/products/updatePrice/{pID}
// DELETE /api/products/remove/{pID}

export const productsApi = {
  getAll: async () => {
    const res = await handleRequest(() => apiClient.get('/api/products/all'), localProducts);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      const normalizedList = res.data.map(normalizeProduct);
      localProducts = normalizedList;
      return { data: normalizedList, isMock: res.isMock };
    }
    return { data: localProducts, isMock: res.isMock };
  },

  getById: async (pID) => {
    const fallback = localProducts.find(p => p.pID === Number(pID)) || localProducts[0];
    const res = await handleRequest(() => apiClient.get(`/api/products/getProduct/${pID}`), fallback, false);
    return { data: normalizeProduct(res.data) || fallback, isMock: res.isMock };
  },

  create: async (formProduct) => {
    const categoryID = CATEGORY_ID_MAP[formProduct.category] || formProduct.categoryID || 1;
    
    // Map to exact Spring Boot Product model fields
    const backendPayload = {
      p_name: formProduct.name || formProduct.p_name,
      volume: formProduct.volume || formProduct.viscosity || 'Can',
      categoryID: categoryID,
      brand: formProduct.brand || 'DOC',
      supplierID: parseInt(formProduct.supplierID || 1),
      price: String(formProduct.price || '0'),
      current_stock_quantity: parseInt(formProduct.stockQuantity || formProduct.current_stock_quantity || 0),
      p_description: formProduct.description || formProduct.p_description || '',
      pic: formProduct.pic || ''
    };

    const newLocalProd = normalizeProduct({ ...backendPayload, pID: Date.now() });
    localProducts = [newLocalProd, ...localProducts];

    const res = await handleRequest(() => apiClient.post('/api/products/add', backendPayload), newLocalProd, false);
    return { data: normalizeProduct(res.data) || newLocalProd, isMock: res.isMock };
  },

  updateStock: async (pID, newStockQuantity) => {
    const backendPayload = {
      current_stock_quantity: parseInt(newStockQuantity)
    };
    localProducts = localProducts.map(p => 
      p.pID === Number(pID) ? { ...p, stockQuantity: parseInt(newStockQuantity), current_stock_quantity: parseInt(newStockQuantity) } : p
    );
    const updated = localProducts.find(p => p.pID === Number(pID));
    const res = await handleRequest(() => apiClient.put(`/api/products/updateStock/${pID}`, backendPayload), updated, false);
    return { data: normalizeProduct(res.data) || updated, isMock: res.isMock };
  },

  updatePrice: async (pID, newPrice) => {
    const backendPayload = {
      price: String(newPrice)
    };
    localProducts = localProducts.map(p =>
      p.pID === Number(pID) ? { ...p, price: parseFloat(newPrice), priceString: String(newPrice) } : p
    );
    const updated = localProducts.find(p => p.pID === Number(pID));
    const res = await handleRequest(() => apiClient.put(`/api/products/updatePrice/${pID}`, backendPayload), updated, false);
    return { data: normalizeProduct(res.data) || updated, isMock: res.isMock };
  },

  update: async (pID, formProduct) => {
    // Call updateStock and updatePrice
    await productsApi.updateStock(pID, formProduct.stockQuantity || formProduct.current_stock_quantity || 0);
    await productsApi.updatePrice(pID, formProduct.price);

    const categoryID = CATEGORY_ID_MAP[formProduct.category] || formProduct.categoryID || 1;
    const backendPayload = {
      pID: Number(pID),
      p_name: formProduct.name || formProduct.p_name,
      volume: formProduct.volume || formProduct.viscosity || 'Can',
      categoryID: categoryID,
      brand: formProduct.brand || 'DOC',
      supplierID: parseInt(formProduct.supplierID || 1),
      price: String(formProduct.price || '0'),
      current_stock_quantity: parseInt(formProduct.stockQuantity || formProduct.current_stock_quantity || 0),
      p_description: formProduct.description || formProduct.p_description || '',
      pic: formProduct.pic || ''
    };

    localProducts = localProducts.map(p => p.pID === Number(pID) ? normalizeProduct(backendPayload) : p);
    const updated = localProducts.find(p => p.pID === Number(pID));
    return { data: updated, isMock: false };
  },

  delete: async (pID) => {
    localProducts = localProducts.filter(p => p.pID !== Number(pID));
    const res = await handleRequest(() => apiClient.delete(`/api/products/remove/${pID}`), { pID }, false);
    return { data: res.data, isMock: res.isMock };
  }
};

// ---------------------- SALES API ----------------------
// Backend endpoints:
// POST /api/sales/create (expects CreateSaleRequest: { saleDate: "YYYY-MM-DD", items: [ { productId: pID, quantity: qty, unitPrice: price } ] })
// GET /api/sales/all
// GET /api/sales/{saleId}

export const salesApi = {
  getAll: async () => {
    const res = await handleRequest(() => apiClient.get('/api/sales/all'), localSales);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      const normalizedList = res.data.map(normalizeSale);
      localSales = normalizedList;
      return { data: normalizedList, isMock: res.isMock };
    }
    const normalizedLocal = localSales.map(normalizeSale);
    return { data: normalizedLocal, isMock: res.isMock };
  },

  getById: async (saleId) => {
    const fallback = localSales.find(s => s.saleId === Number(saleId) || s.id === Number(saleId)) || localSales[0];
    const res = await handleRequest(() => apiClient.get(`/api/sales/${saleId}`), fallback, false);
    return { data: normalizeSale(res.data) || normalizeSale(fallback), isMock: res.isMock };
  },

  create: async (cartItems, dateString = null) => {
    const todayStr = dateString || new Date().toISOString().split('T')[0];

    // Build backend CreateSaleRequest format: { saleDate, items: [ { productId, quantity, unitPrice } ] }
    const requestPayload = {
      saleDate: todayStr,
      items: cartItems.map(item => ({
        productId: item.pID || item.id,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.price || item.unitPrice || 0)
      }))
    };

    // Calculate subtotal for local fallback
    const totalAmount = cartItems.reduce((a, c) => a + (parseFloat(c.price || 0) * c.quantity), 0);
    const localFallback = normalizeSale({
      saleId: Date.now(),
      saleDate: todayStr,
      subtotal: totalAmount,
      totalAmount: totalAmount,
      invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
      items: cartItems.map(item => ({
        productId: item.pID || item.id,
        productName: item.p_name || item.name,
        quantity: item.quantity,
        unitPrice: parseFloat(item.price || 0),
        lineTotal: parseFloat(item.price || 0) * item.quantity
      }))
    });

    localSales = [localFallback, ...localSales];

    // Decrease local stock for mock fallback
    cartItems.forEach(item => {
      const pID = item.pID || item.id;
      localProducts = localProducts.map(p => {
        if (p.pID === pID) {
          const newQty = Math.max(0, (p.current_stock_quantity || p.stockQuantity || 0) - item.quantity);
          return { ...p, current_stock_quantity: newQty, stockQuantity: newQty };
        }
        return p;
      });
    });

    const res = await handleRequest(() => apiClient.post('/api/sales/create', requestPayload), localFallback, false);
    const resultObj = res.data ? normalizeSale(res.data) : localFallback;
    return { data: resultObj, isMock: res.isMock };
  }
};

// ---------------------- INVOICE API ----------------------
// Backend endpoints:
// GET /api/invoices/number/{invoiceNumber}
// GET /api/invoices/sale/{saleId}

export const invoicesApi = {
  getByNumber: async (invoiceNumber) => {
    const fallback = localInvoices.find(i => i.invoiceNumber === invoiceNumber) || localInvoices[0];
    const res = await handleRequest(() => apiClient.get(`/api/invoices/number/${invoiceNumber}`), fallback, false);
    return { data: res.data || fallback, isMock: res.isMock };
  },

  getBySaleId: async (saleId) => {
    const fallback = localInvoices.find(i => i.saleId === Number(saleId)) || localInvoices[0];
    const res = await handleRequest(() => apiClient.get(`/api/invoices/sale/${saleId}`), fallback, false);
    return { data: res.data || fallback, isMock: res.isMock };
  },

  getAll: async () => {
    // If backend doesn't have an /api/invoices/all endpoint, map from sales
    const salesRes = await salesApi.getAll();
    if (salesRes.data && Array.isArray(salesRes.data)) {
      const extractedInvoices = salesRes.data
        .filter(s => s.invoice)
        .map(s => s.invoice);
      if (extractedInvoices.length > 0) {
        return { data: extractedInvoices, isMock: salesRes.isMock };
      }
    }
    return { data: localInvoices, isMock: true };
  }
};

// ---------------------- SUPPLIERS API ----------------------
// Backend endpoints:
// GET /api/suppliers/all
// GET /api/suppliers/{id}
// POST /api/suppliers/add (expects { name, contactName, phone, email, address })
// PUT /api/suppliers/update/{id}
// DELETE /api/suppliers/remove/{id}

export const suppliersApi = {
  getAll: async () => {
    const res = await handleRequest(() => apiClient.get('/api/suppliers/all'), localSuppliers);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      localSuppliers = res.data;
      return { data: res.data, isMock: res.isMock };
    }
    return { data: localSuppliers, isMock: res.isMock };
  },

  getById: async (id) => {
    const fallback = localSuppliers.find(s => s.supplierId === Number(id)) || localSuppliers[0];
    const res = await handleRequest(() => apiClient.get(`/api/suppliers/${id}`), fallback, false);
    return { data: res.data || fallback, isMock: res.isMock };
  },

  create: async (formSupplier) => {
    const payload = {
      name: formSupplier.name,
      contactName: formSupplier.contactName || formSupplier.contactPerson || '',
      phone: formSupplier.phone || '',
      email: formSupplier.email || '',
      address: formSupplier.address || ''
    };
    const newLocal = { supplierId: Date.now(), ...payload };
    localSuppliers = [newLocal, ...localSuppliers];

    const res = await handleRequest(() => apiClient.post('/api/suppliers/add', payload), newLocal, false);
    return { data: res.data || newLocal, isMock: res.isMock };
  },

  update: async (id, formSupplier) => {
    const payload = {
      supplierId: Number(id),
      name: formSupplier.name,
      contactName: formSupplier.contactName || formSupplier.contactPerson || '',
      phone: formSupplier.phone || '',
      email: formSupplier.email || '',
      address: formSupplier.address || ''
    };
    localSuppliers = localSuppliers.map(s => s.supplierId === Number(id) ? payload : s);

    const res = await handleRequest(() => apiClient.put(`/api/suppliers/update/${id}`, payload), payload, false);
    return { data: res.data || payload, isMock: res.isMock };
  },

  delete: async (id) => {
    localSuppliers = localSuppliers.filter(s => s.supplierId !== Number(id));
    const res = await handleRequest(() => apiClient.delete(`/api/suppliers/remove/${id}`), { supplierId: id }, false);
    return { data: res.data, isMock: res.isMock };
  }
};

// Helper to normalize Purchase Orders from Spring Boot backend entity or mock
export function normalizePurchaseOrder(po) {
  if (!po) return null;
  const id = po.purchaseOrderId !== undefined ? po.purchaseOrderId : (po.orderId !== undefined ? po.orderId : (po.id !== undefined ? po.id : po.purchase_order_id));
  return {
    ...po,
    id: id,
    orderId: id,
    purchaseOrderId: id,
    orderDate: po.orderDate || po.date || new Date().toISOString().split('T')[0],
    supplierName: po.supplierName || (po.supplier ? po.supplier.name : 'Supplier'),
    status: po.status || 'CREATED',
    items: po.items || [],
    totalAmount: po.totalAmount !== undefined ? po.totalAmount : (po.items ? po.items.reduce((sum, item) => sum + ((parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 1)), 0) : 0)
  };
}

// ---------------------- PURCHASE ORDERS API ----------------------
// Backend endpoints:
// POST /api/purchase-orders/create (expects CreatePurchaseOrderRequest: { supplierId, orderDate, items })
// PUT /api/purchase-orders/complete/{orderId}
// GET /api/purchase-orders/all
// GET /api/purchase-orders/{orderId}

export const purchaseOrdersApi = {
  getAll: async () => {
    const res = await handleRequest(() => apiClient.get('/api/purchase-orders/all'), localPurchaseOrders);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      const normalizedList = res.data.map(normalizePurchaseOrder);
      localPurchaseOrders = normalizedList;
      return { data: normalizedList, isMock: res.isMock };
    }
    const normalizedLocal = localPurchaseOrders.map(normalizePurchaseOrder);
    return { data: normalizedLocal, isMock: res.isMock };
  },

  getById: async (orderId) => {
    const fallback = localPurchaseOrders.find(po => po.orderId === Number(orderId) || po.purchaseOrderId === Number(orderId) || po.id === Number(orderId)) || localPurchaseOrders[0];
    const res = await handleRequest(() => apiClient.get(`/api/purchase-orders/${orderId}`), fallback, false);
    return { data: normalizePurchaseOrder(res.data) || normalizePurchaseOrder(fallback), isMock: res.isMock };
  },

  create: async (supplierId, items, orderDate = null) => {
    const todayStr = orderDate || new Date().toISOString().split('T')[0];

    const payload = {
      supplierId: parseInt(supplierId),
      orderDate: todayStr,
      items: items.map(item => ({
        productId: item.pID || item.productId || item.id,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice || item.price || 0)
      }))
    };

    const newLocal = normalizePurchaseOrder({
      purchaseOrderId: Date.now(),
      orderId: Date.now(),
      orderDate: todayStr,
      status: 'CREATED',
      supplier: { supplierId: parseInt(supplierId) },
      items: items
    });

    localPurchaseOrders = [newLocal, ...localPurchaseOrders];

    const res = await handleRequest(() => apiClient.post('/api/purchase-orders/create', payload), newLocal, false);
    const resultObj = res.data ? normalizePurchaseOrder(res.data) : newLocal;
    return { data: resultObj, isMock: res.isMock };
  },

  complete: async (orderId) => {
    const validOrderId = Number(orderId);
    localPurchaseOrders = localPurchaseOrders.map(po => {
      if (po.purchaseOrderId === validOrderId || po.orderId === validOrderId || po.id === validOrderId) {
        return { ...po, status: 'COMPLETED' };
      }
      return po;
    });

    const res = await handleRequest(() => apiClient.put(`/api/purchase-orders/complete/${orderId}`), { status: 'COMPLETED' }, false);
    return { data: res.data, isMock: res.isMock };
  }
};


// ---------------------- REPORTS API ----------------------
// Backend endpoints:
// POST /api/reports/daily?date=YYYY-MM-DD
// POST /api/reports/monthly?year=YYYY&month=M
// GET /api/reports/all

export const reportsApi = {
  getAllReports: async () => {
    const res = await handleRequest(() => apiClient.get('/api/reports/all'), localReports);
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      localReports = res.data;
      return { data: res.data, isMock: res.isMock };
    }
    return { data: localReports, isMock: res.isMock };
  },

  createDailyReport: async (dateString) => {
    const todayStr = dateString || new Date().toISOString().split('T')[0];
    const newReport = {
      reportId: Date.now(),
      reportType: 'DAILY',
      periodStart: todayStr,
      periodEnd: todayStr,
      numberOfSales: localSales.filter(s => (s.saleDate || '').startsWith(todayStr)).length || 1,
      totalRevenue: localSales.reduce((a, c) => a + (parseFloat(c.totalAmount) || 0), 0),
      totalSales: localSales.reduce((a, c) => a + (parseFloat(c.totalAmount) || 0), 0)
    };
    localReports = [newReport, ...localReports];

    const res = await handleRequest(() => apiClient.post(`/api/reports/daily?date=${todayStr}`), newReport, false);
    return { data: res.data || newReport, isMock: res.isMock };
  },

  createMonthlyReport: async (year, month) => {
    const y = parseInt(year);
    const m = parseInt(month);
    const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const lastDay = new Date(y, m, 0).getDate();
    const endDate = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    
    const newReport = {
      reportId: Date.now(),
      reportType: 'MONTHLY',
      periodStart: startDate,
      periodEnd: endDate,
      numberOfSales: localSales.length || 5,
      totalRevenue: localSales.reduce((a, c) => a + (parseFloat(c.totalAmount) || 0), 0),
      totalSales: localSales.reduce((a, c) => a + (parseFloat(c.totalAmount) || 0), 0)
    };
    localReports = [newReport, ...localReports];

    const res = await handleRequest(() => apiClient.post(`/api/reports/monthly?year=${y}&month=${m}`), newReport, false);
    return { data: res.data || newReport, isMock: res.isMock };
  }
};

