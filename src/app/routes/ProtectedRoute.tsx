import { Navigate, Outlet } from 'react-router-dom';

import { routePaths } from './routePaths';

import useAuthStore from '@/features/auth/store/authStore';

const ProtectedRoute = () => {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!accessToken) {
    return <Navigate to={routePaths.login} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
