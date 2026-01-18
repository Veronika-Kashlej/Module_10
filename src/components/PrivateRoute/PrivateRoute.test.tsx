import { render, screen } from '@testing-library/react';
import { PrivateRoute } from './PrivateRoute';
import { useAuth } from '../../store/contexts/AuthContext';

jest.mock('../../store/contexts/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const ProtectedPage = () => <div>Protected</div>;

describe('PrivateRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('allows access when authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            user: null,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getCurrentUser: jest.fn(),
            refreshUser: jest.fn(),
        });

        render(
            <PrivateRoute>
                <ProtectedPage />
            </PrivateRoute>
        );

        expect(screen.getByText('Protected')).toBeInTheDocument();
    });

    test('redirects when not authenticated', () => {
        const mockRouter = (global as any).mockRouter;
        mockRouter.push.mockClear();

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getCurrentUser: jest.fn(),
            refreshUser: jest.fn(),
        });

        render(
            <PrivateRoute>
                <ProtectedPage />
            </PrivateRoute>
        );

        expect(mockRouter.push).toHaveBeenCalledWith('/sign-in');
    });
});
