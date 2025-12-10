import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useAuth';
import { getAccessToken, getRefreshToken } from '../lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { data: user, isLoading, error } = useUser();
  const hasAccessToken = !!getAccessToken();
  const hasRefreshToken = !!getRefreshToken();

  // If no tokens at all, redirect immediately
  if (!hasAccessToken && !hasRefreshToken) {
    return <Navigate to="/login" replace />;
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white'
      }}>
        Loading...
      </div>
    );
  }

  // If error (401 or token expired), redirect to login
  if (error || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

