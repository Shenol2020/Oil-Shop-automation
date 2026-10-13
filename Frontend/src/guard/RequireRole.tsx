import { Navigate, Outlet } from 'react-router-dom';

type AllowedRole = 'MainAdmin' | 'ShopStaff';

type RequireRoleProps = {
  allowedRoles: AllowedRole[];
};

export function RequireRole({ allowedRoles }: RequireRoleProps) {
  const role = localStorage.getItem('user_role') as AllowedRole | null;
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/employee" replace />;
  }
  return <Outlet />;
}
