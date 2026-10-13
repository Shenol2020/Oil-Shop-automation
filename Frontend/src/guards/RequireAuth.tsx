import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RequireAuthProps {
  portalType?: 'customer' | 'employee';
}

export function RequireAuth({ portalType = 'customer' }: RequireAuthProps) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    const redirectUrl = portalType === 'employee' ? '/employee/login' : '/login';
    return <Navigate to={redirectUrl} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
export default RequireAuth;
