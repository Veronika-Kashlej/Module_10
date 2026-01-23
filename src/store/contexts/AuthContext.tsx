import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from 'react';
import { AuthResponse } from '../types';
import { authAPI } from '../../utils/api/api';

interface AuthContextType {
    isAuthenticated: boolean;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            setIsLoading(true);
            try {
                if (token) {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const setAuthData = (token: string) => {
        localStorage.setItem('accessToken', token);
        setIsAuthenticated(true);
    };

    const clearAuthData = () => {
        localStorage.removeItem('accessToken');
        setIsAuthenticated(false);
    };

    const signUp = async (
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        try {
            await authAPI.signup(email, password);
            return await signIn(email, password);
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Registration failed');
            }
            throw new Error('Registration failed due to unknown error');
        }
    };

    const signIn = async (
        email: string,
        password: string
    ): Promise<AuthResponse> => {
        try {
            const response = await authAPI.login(email, password);
            const { token } = response.data;

            setAuthData(token);
            return response.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(error.message || 'Login failed');
            }
            throw new Error('Login failed due to unknown error');
        }
    };

    const signOut = async (): Promise<void> => {
        try {
            await authAPI.logout();
        } finally {
            clearAuthData();
        }
    };

    const value: AuthContextType = {
        isAuthenticated,
        signUp,
        signIn,
        signOut,
        isLoading,
    };

    return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
