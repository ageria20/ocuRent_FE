import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'user:', user, 'requireAdmin:', requireAdmin); // Debug

  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login'); // Debug
    // Reindirizza al login se non autenticato
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    console.log('User not admin, redirecting to home'); // Debug
    // Reindirizza alla home se non admin
    return <Navigate to="/" replace />;
  }

  console.log('User authorized, rendering children'); // Debug
  return <>{children}</>;
};

export default ProtectedRoute;
