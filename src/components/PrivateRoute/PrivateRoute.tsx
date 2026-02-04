import { Outlet, Route } from 'react-router';
import { useAuth } from '../../utils/hooks/useAuth';
import SignIn from '../../pages/SignIn/SignIn';

export function PrivateRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) return null;
    return isAuthenticated ? (
        <Outlet />
    ) : (
        <Route path="/sign-in" element={<SignIn />} />
    );
}
