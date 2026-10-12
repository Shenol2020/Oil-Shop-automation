import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

type AllowedRole = 'Customer' | 'ShopStaff' | 'MainAdmin';

interface RequireRoleProps {
  allowedRoles: AllowedRole[];
  fallbackUrl?: string;
}

export function RequireRole({ allowedRoles, fallbackUrl = '/employee' }: RequireRoleProps) {
  const { role, user } = useAuthStore();

  if (!user) {
    return <Navigate to="/employee/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallbackUrl} replace />;
  }

  return <Outlet />;
}

export default RequireRole;
