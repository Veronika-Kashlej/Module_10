import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from 'react';
import { AuthResponse, User } from '../types';
import { authAPI } from '../api';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    signIn: (email: string, password: string) => Promise<AuthResponse>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    getCurrentUser: () => User | null;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');
            setIsLoading(true);
            try {
                if (token) {
                    const response = await authAPI.getMe();
                    setUser(response.data);
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

    const setAuthData = (token: string, userData: User) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    const clearAuthData = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
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
            const { token, user } = response.data;

            setAuthData(token, user);
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

    const refreshUser = async (): Promise<void> => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const getCurrentUser = (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    };

    const value: AuthContextType = {
        isAuthenticated,
        user,
        signUp,
        signIn,
        signOut,
        refreshUser,
        getCurrentUser,
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
