import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'supervisor' | 'ejecutivo';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // If user tries to access a route they don't have permission for, redirect to their dashboard
    return <Navigate to={user?.role === 'supervisor' ? '/supervisor' : '/ejecutivo'} replace />;
  }

  return <>{children}</>;
}
