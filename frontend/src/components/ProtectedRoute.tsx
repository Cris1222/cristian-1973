import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const storedSession = localStorage.getItem('session');

  if (!storedSession) {
    return <Navigate to="/login" replace />;
  }

  try {
    const session = JSON.parse(storedSession);

    if (!session.active) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem('session');
    return <Navigate to="/login" replace />;
  }
};