// Initial Mock Data for Disanayake Oil Center POS

export const MOCK_PRODUCTS = [
  {
    id: 1,
    code: 'OIL-MOB-5W30',
    name: 'Mobil 1 Super 3000 5W-30 (4L)',
    category: 'Engine Oil',
    price: 14500.00,
    costPrice: 12000.00,
    stockQuantity: 24,
    minStock: 5,
    unit: 'Can',
    viscosity: '5W-30',
    brand: 'Mobil',
    description: 'Fully synthetic engine oil for high performance petrol & diesel vehicles.'
  },
  {
    id: 2,
    code: 'OIL-CAS-10W40',
    name: 'Castrol GTX 10W-40 (4L)',
    category: 'Engine Oil',
    price: 11800.00,
    costPrice: 9500.00,
    stockQuantity: 18,
    minStock: 5,
    unit: 'Can',
    viscosity: '10W-40',
    brand: 'Castrol',
    description: 'Premium multigrade motor oil with anti-sludge formula.'
  },
  {
    id: 3,
    code: 'OIL-VAL-20W50',
    name: 'Valvoline Premium Protection 20W-50 (4L)',
    category: 'Engine Oil',
    price: 9800.00,
    costPrice: 7800.00,
    stockQuantity: 4,
    minStock: 10,
    unit: 'Can',
    viscosity: '20W-50',
    brand: 'Valvoline',
    description: 'Formulated for high mileage engines requiring thick protection.'
  },
  {
    id: 4,
    code: 'OIL-SHE-75W90',
    name: 'Shell Spirax S2 G 75W-90 Gear Oil (1L)',
    category: 'Gear Oil',
    price: 3200.00,
    costPrice: 2400.00,
    stockQuantity: 35,
    minStock: 8,
    unit: 'Bottle',
    viscosity: '75W-90',
    brand: 'Shell',
    description: 'High performance manual transmission fluid.'
  },
  {
    id: 5,
    code: 'FLT-TOY-001',
    name: 'Toyota Genuine Oil Filter (90915-YZZE1)',
    category: 'Filters',
    price: 2400.00,
    costPrice: 1600.00,
    stockQuantity: 42,
    minStock: 15,
    unit: 'Pcs',
    viscosity: 'N/A',
    brand: 'Toyota',
    description: 'OEM Oil filter for Corolla, Yaris, Vitz, Allion.'
  },
  {
    id: 6,
    code: 'FLT-NIS-002',
    name: 'Nissan Air Filter Element (16546-ED000)',
    category: 'Filters',
    price: 2800.00,
    costPrice: 1900.00,
    stockQuantity: 3,
    minStock: 5,
    unit: 'Pcs',
    viscosity: 'N/A',
    brand: 'Nissan',
    description: 'Engine air filter for Sunny, Tiida, Bluebird.'
  },
  {
    id: 7,
    code: 'GRS-EP2-500G',
    name: 'Lanka Grease EP2 Lithium Grease (500g)',
    category: 'Grease',
    price: 1850.00,
    costPrice: 1200.00,
    stockQuantity: 20,
    minStock: 6,
    unit: 'Tub',
    viscosity: 'EP2',
    brand: 'Lanka IOC',
    description: 'Extreme pressure heavy-duty chassis and bearing grease.'
  },
  {
    id: 8,
    code: 'CLT-RED-1L',
    name: 'Toyota Super Long Life Coolant Red (1L)',
    category: 'Coolants',
    price: 2150.00,
    costPrice: 1550.00,
    stockQuantity: 28,
    minStock: 10,
    unit: 'Bottle',
    viscosity: 'N/A',
    brand: 'Toyota',
    description: 'Pre-diluted 50/50 ethylene glycol radiator coolant.'
  },
  {
    id: 9,
    code: 'ADD-STP-INJ',
    name: 'STP Complete Fuel System Cleaner (5.25oz)',
    category: 'Additives',
    price: 3400.00,
    costPrice: 2400.00,
    stockQuantity: 15,
    minStock: 4,
    unit: 'Bottle',
    viscosity: 'N/A',
    brand: 'STP',
    description: 'Restores engine performance and cleans injectors.'
  },
  {
    id: 10,
    code: 'SRV-OIL-CHG',
    name: 'Full Lubrication & Oil Change Service Charge',
    category: 'Services',
    price: 1500.00,
    costPrice: 0.00,
    stockQuantity: 999,
    minStock: 0,
    unit: 'Job',
    viscosity: 'N/A',
    brand: 'DOC Service',
    description: 'Labor fee for oil drainage, filter replacement & 15-point check.'
  }
];

export const MOCK_SUPPLIERS = [
  {
    id: 1,
    name: 'McLarens Lubricants Ltd (Mobil Sri Lanka)',
    contactPerson: 'Kamal Perera',
    phone: '+94 77 123 4567',
    email: 'kamal.p@mclarens.lk',
    address: 'No. 260, Bauddhaloka Mawatha, Colombo 07',
    suppliedItems: 'Mobil Engine Oils & Industrial Lubricants'
  },
  {
    id: 2,
    name: 'Lanka IOC PLC',
    contactPerson: 'Sunil Fernando',
    phone: '+94 11 249 7800',
    email: 'sales@lankaioc.com',
    address: 'World Trade Center, West Tower, Colombo 01',
    suppliedItems: 'IOC Oils, Servo Lubricants, EP2 Grease'
  },
  {
    id: 3,
    name: 'United Motors Lanka PLC',
    contactPerson: 'Nimal Jayasinghe',
    phone: '+94 11 244 8444',
    email: 'parts@unitedmotors.lk',
    address: 'Hyde Park Corner, Colombo 02',
    suppliedItems: 'Mitsubishi & OEM Auto Filters, Brake Fluids'
  }
];

export const MOCK_SALES = [
  {
    id: 1001,
    saleDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: 'Saman Kumara (WP CAG-4589)',
    paymentMethod: 'CASH',
    subTotal: 16900.00,
    discount: 500.00,
    tax: 0.00,
    totalAmount: 16400.00,
    cashReceived: 17000.00,
    balance: 600.00,
    items: [
      { productId: 1, productName: 'Mobil 1 Super 3000 5W-30 (4L)', quantity: 1, unitPrice: 14500.00, totalPrice: 14500.00 },
      { productId: 5, productName: 'Toyota Genuine Oil Filter (90915-YZZE1)', quantity: 1, unitPrice: 2400.00, totalPrice: 2400.00 }
    ]
  },
  {
    id: 1002,
    saleDate: new Date(Date.now() - 3600000 * 26).toISOString(),
    customerName: 'Roshan Silva (WP CAR-1029)',
    paymentMethod: 'CARD',
    subTotal: 13950.00,
    discount: 0.00,
    tax: 0.00,
    totalAmount: 13950.00,
    cashReceived: 13950.00,
    balance: 0.00,
    items: [
      { productId: 2, productName: 'Castrol GTX 10W-40 (4L)', quantity: 1, unitPrice: 11800.00, totalPrice: 11800.00 },
      { productId: 8, productName: 'Toyota Super Long Life Coolant Red (1L)', quantity: 1, unitPrice: 2150.00, totalPrice: 2150.00 }
    ]
  }
];

export const MOCK_INVOICES = [
  {
    id: 'INV-2026-001',
    saleId: 1001,
    invoiceDate: new Date(Date.now() - 3600000 * 2).toISOString(),
    customerName: 'Saman Kumara (WP CAG-4589)',
    totalAmount: 16400.00,
    status: 'PAID'
  },
  {
    id: 'INV-2026-002',
    saleId: 1002,
    invoiceDate: new Date(Date.now() - 3600000 * 26).toISOString(),
    customerName: 'Roshan Silva (WP CAR-1029)',
    totalAmount: 13950.00,
    status: 'PAID'
  }
];

export const MOCK_PURCHASE_ORDERS = [
  {
    id: 501,
    orderNumber: 'PO-2026-001',
    supplierId: 1,
    supplierName: 'McLarens Lubricants Ltd (Mobil Sri Lanka)',
    orderDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'RECEIVED',
    totalAmount: 240000.00,
    items: [
      { productId: 1, productName: 'Mobil 1 Super 3000 5W-30 (4L)', quantity: 20, unitPrice: 12000.00, totalPrice: 240000.00 }
    ]
  },
  {
    id: 502,
    orderNumber: 'PO-2026-002',
    supplierId: 3,
    supplierName: 'United Motors Lanka PLC',
    orderDate: new Date().toISOString(),
    status: 'PENDING',
    totalAmount: 80000.00,
    items: [
      { productId: 5, productName: 'Toyota Genuine Oil Filter (90915-YZZE1)', quantity: 50, unitPrice: 1600.00, totalPrice: 80000.00 }
    ]
  }
];

export const MOCK_REPORTS = [
  {
    reportId: 1,
    reportType: 'DAILY',
    periodStart: new Date().toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    numberOfSales: 12,
    totalRevenue: 68500.00,
    totalSales: 68500.00
  },
  {
    reportId: 2,
    reportType: 'MONTHLY',
    periodStart: '2026-09-01',
    periodEnd: '2026-09-30',
    numberOfSales: 184,
    totalRevenue: 942300.00,
    totalSales: 942300.00
  }
];

