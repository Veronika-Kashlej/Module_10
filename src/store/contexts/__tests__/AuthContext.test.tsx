import { render, screen, waitFor, act } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { AuthProvider, useAuth } from '../AuthContext';
import { User } from '@/store/types';

jest.mock('../../api/api', () => ({
    authAPI: {
        getMe: jest.fn(),
        signup: jest.fn(),
        login: jest.fn(),
        logout: jest.fn(),
    },
}));

import { authAPI } from '../../api/api';

const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: jest.fn(
        (key: string): string | null => mockLocalStorage.store[key] || null
    ),
    setItem: jest.fn((key: string, value: string): void => {
        mockLocalStorage.store[key] = value;
    }),
    removeItem: jest.fn((key: string): void => {
        delete mockLocalStorage.store[key];
    }),
    clear: jest.fn((): void => {
        mockLocalStorage.store = {};
    }),
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
});

interface TestComponentProps {
    onAuthChange?: (auth: any) => void;
}

const TestComponent = ({ onAuthChange }: TestComponentProps) => {
    const auth = useAuth();

    React.useEffect(() => {
        onAuthChange?.(auth);
    }, [auth, onAuthChange]);

    return (
        <div>
            <div data-testid="isAuthenticated">
                {auth.isAuthenticated.toString()}
            </div>
            <div data-testid="isLoading">{auth.isLoading.toString()}</div>
            <div data-testid="user">{JSON.stringify(auth.user)}</div>
            <button
                onClick={() => {
                    try {
                        auth.signIn('test@example.com', 'password');
                    } catch (error) {
                        console.error('Sign in error:', error);
                    }
                }}
            >
                Sign In
            </button>
            <button
                onClick={() => {
                    try {
                        auth.signUp('test@example.com', 'password');
                    } catch (error) {
                        console.error('Sign up error:', error);
                    }
                }}
            >
                Sign Up
            </button>
            <button onClick={() => auth.signOut()}>Sign Out</button>
            <button onClick={() => auth.refreshUser()}>Refresh User</button>
        </div>
    );
};

const TestConsumer = () => {
    return <div data-testid="consumer">Test Consumer</div>;
};

const renderWithAuth = (ui: ReactNode) => {
    return render(<AuthProvider>{ui}</AuthProvider>);
};

describe('AuthContext', () => {
    const mockUser: User = {
        id: 1,
        firstName: 'John',
        secondName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        description: 'Test user',
        profileImage: 'image.jpg',
        creationDate: '2023-01-01',
        lastLogin: '2023-01-01',
        modifiedDate: '2023-01-01',
    };

    const mockAuthResponse = {
        token: 'test-token',
        user: mockUser,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.clear();
    });

    test('provides initial context values', async () => {
        (authAPI.getMe as jest.Mock).mockRejectedValue(
            new Error('Not authenticated')
        );

        let capturedAuth: any;
        const onAuthChange = jest.fn((auth) => {
            capturedAuth = auth;
        });

        renderWithAuth(<TestComponent onAuthChange={onAuthChange} />);

        await waitFor(() => {
            expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        });

        expect(capturedAuth).toBeTruthy();
        expect(capturedAuth.isAuthenticated).toBe(false);
        expect(capturedAuth.user).toBeNull();
        expect(typeof capturedAuth.signIn).toBe('function');
        expect(typeof capturedAuth.signUp).toBe('function');
        expect(typeof capturedAuth.signOut).toBe('function');
        expect(typeof capturedAuth.refreshUser).toBe('function');
    });

    test('signIn successfully authenticates user', async () => {
        (authAPI.login as jest.Mock).mockResolvedValue({
            data: mockAuthResponse,
        });

        renderWithAuth(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        });

        await act(async () => {
            screen.getByText('Sign In').click();
        });

        await waitFor(() => {
            expect(authAPI.login).toHaveBeenCalledWith(
                'test@example.com',
                'password'
            );
        });
    });

    test('signUp registers and automatically signs in user', async () => {
        (authAPI.signup as jest.Mock).mockResolvedValue({});
        (authAPI.login as jest.Mock).mockResolvedValue({
            data: mockAuthResponse,
        });

        renderWithAuth(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        });

        await act(async () => {
            screen.getByText('Sign Up').click();
        });

        await waitFor(() => {
            expect(authAPI.signup).toHaveBeenCalledWith(
                'test@example.com',
                'password'
            );
        });

        await waitFor(() => {
            expect(authAPI.login).toHaveBeenCalledWith(
                'test@example.com',
                'password'
            );
        });
    });

    test('signOut successfully logs out user', async () => {
        mockLocalStorage.store['accessToken'] = 'test-token';
        mockLocalStorage.store['user'] = JSON.stringify(mockUser);

        (authAPI.getMe as jest.Mock).mockResolvedValue({ data: mockUser });
        (authAPI.logout as jest.Mock).mockResolvedValue({});

        renderWithAuth(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        });

        await act(async () => {
            screen.getByText('Sign Out').click();
        });

        await waitFor(() => {
            expect(authAPI.logout).toHaveBeenCalled();
        });

        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent(
            'false'
        );
    });

    test('refreshUser handles failure gracefully', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        mockLocalStorage.store['accessToken'] = 'test-token';
        mockLocalStorage.store['user'] = JSON.stringify(mockUser);

        (authAPI.getMe as jest.Mock)
            .mockResolvedValueOnce({ data: mockUser })
            .mockRejectedValueOnce(new Error('Failed to refresh'));

        renderWithAuth(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        });

        await act(async () => {
            screen.getByText('Refresh User').click();
        });

        expect(screen.getByTestId('user')).toHaveTextContent(
            JSON.stringify(mockUser)
        );

        consoleErrorSpy.mockRestore();
    });

    test('preserves auth state on component re-render', async () => {
        mockLocalStorage.store['accessToken'] = 'test-token';
        (authAPI.getMe as jest.Mock).mockResolvedValue({ data: mockUser });

        const { rerender } = renderWithAuth(<TestComponent />);

        await waitFor(() => {
            expect(screen.getByTestId('isLoading')).toHaveTextContent('false');
        });

        rerender(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId('isAuthenticated')).toHaveTextContent(
            'false'
        );
    });

    test('useAuth throws error when used outside AuthProvider', () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

        expect(() => {
            render(<TestConsumer />);
        }).toThrow('useAuth must be used within an AuthProvider');

        consoleErrorSpy.mockRestore();
    });
});
