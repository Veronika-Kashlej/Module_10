import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../../utils/hooks/useAuth';

export function PrivateRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
}
