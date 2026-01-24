'use client';
import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from 'react';
import { User } from '../types';
import { useAuth } from './AuthContext';
import { authAPI } from '../../utils/api/api';

interface UserContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        const getUser = async () => {
            setIsLoading(true);
            try {
                if (isAuthenticated) {
                    const response = await authAPI.getMe();
                    localStorage.setItem('user', JSON.stringify(response.data));
                    setUser(response.data);
                } else {
                    setUser(null);
                    localStorage.removeItem('user');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        getUser();
    }, [isAuthenticated]);

    const refreshUser = async (): Promise<void> => {
        try {
            const response = await authAPI.getMe();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const value: UserContextType = {
        user,
        refreshUser,
        isLoading,
    };

    return <UserContext value={value}>{children}</UserContext>;
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within an UserProvider');
    }
    return context;
}
