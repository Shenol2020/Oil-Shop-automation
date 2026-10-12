import { createBrowserRouter, Navigate } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';
import EmployeeLayout from '../layouts/EmployeeLayout';
import AuthLayout from '../layouts/AuthLayout';
import RequireRole from '../guards/RequireRole';

// Customer pages
import CatalogPage from '../features/customer/pages/CatalogPage';
import ProductDetailPage from '../features/customer/pages/ProductDetailPage';
import CartPage from '../features/customer/pages/CartPage';
import CheckoutPage from '../features/customer/pages/CheckoutPage';

// Auth pages
import CustomerLoginPage from '../features/auth/pages/CustomerLoginPage';
import CustomerRegisterPage from '../features/auth/pages/CustomerRegisterPage';
import EmployeeLoginPage from '../features/auth/pages/EmployeeLoginPage';

// Employee pages
import EmployeeDashboard from '../features/employee/pages/EmployeeDashboard';
import POSTerminalPage from '../features/employee/pos/POSTerminalPage';
import OrderManagementPage from '../features/employee/orders/OrderManagementPage';
import LeaveManagementPage from '../features/employee/leave/LeaveManagementPage';
import AttendanceSalaryPage from '../features/employee/attendance-salary/AttendanceSalaryPage';
import AccountCreationPage from '../features/employee/admin/AccountCreationPage';

export const router = createBrowserRouter([
  // Public Customer Portal
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/shop" replace />,
      },
      {
        path: 'shop',
        element: <CatalogPage />,
      },
      {
        path: 'product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
    ],
  },

  // Auth pages (Clean centered card layout)
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <CustomerLoginPage />,
      },
      {
        path: 'signup',
        element: <CustomerRegisterPage />,
      },
      {
        path: 'employee/login',
        element: <EmployeeLoginPage />,
      },
    ],
  },

  // Internal Employee Portal (Protected)
  {
    path: 'employee',
    element: <RequireRole allowedRoles={['ShopStaff', 'MainAdmin']} fallbackUrl="/employee/login" />,
    children: [
      {
        element: <EmployeeLayout />,
        children: [
          {
            index: true,
            element: <EmployeeDashboard />,
          },
          {
            path: 'pos',
            element: <POSTerminalPage />,
          },
          {
            path: 'orders',
            element: <OrderManagementPage />,
          },
          {
            path: 'leave',
            element: <LeaveManagementPage />,
          },
          {
            path: 'attendance-salary',
            element: <AttendanceSalaryPage />,
          },
          // Section 5: Strictly restricted to MainAdmin role
          {
            element: <RequireRole allowedRoles={['MainAdmin']} fallbackUrl="/employee" />,
            children: [
              {
                path: 'admin/accounts',
                element: <AccountCreationPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  // Fallback Catch-all
  {
    path: '*',
    element: <Navigate to="/shop" replace />,
  },
]);

export default router;
