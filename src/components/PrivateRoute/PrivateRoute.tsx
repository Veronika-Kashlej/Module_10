import { Navigate } from 'react-router';
import { ReactNode } from 'react';
import { useAuth } from '../../utils/hooks/useAuth';

interface PrivateRouteProps {
    children: ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    return isAuthenticated ? <>{children}</> : <Navigate to="/sign-in" />;
}
