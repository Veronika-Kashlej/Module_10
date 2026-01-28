import {
    login,
    register,
    logout,
    checkAuth,
    clearError,
} from '../../store/slices/authSlice';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';

export const useAuth = () => {
    const dispatch = useAppDispatch();
    const { user, token, isAuthenticated, isLoading, error } = useAppSelector(
        (state) => state.auth
    );

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,

        signIn: (email: string, password: string) =>
            dispatch(login({ email, password })),
        signUp: (email: string, password: string) =>
            dispatch(register({ email, password })),
        signOut: () => dispatch(logout()),
        checkAuth: () => dispatch(checkAuth()),
        clearError: () => dispatch(clearError()),

        getUser: () => user,
        getToken: () => token,
    };
};
