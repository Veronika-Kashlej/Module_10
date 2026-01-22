import {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useContext,
} from 'react';
import { User } from '../types';
import { authAPI } from '../api/api';
import { useAuth } from './AuthContext';

interface UserContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

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
                    localStorage.removeItemo('user');
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
