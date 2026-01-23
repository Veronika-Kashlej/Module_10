import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { PrivateRoute } from './PrivateRoute';
import { useAuth } from '../../store/contexts/AuthContext';

jest.mock('../../store/contexts/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const ProtectedPage = () => <div>Protected</div>;
const SignInPage = () => <div>Sign In</div>;

describe('PrivateRoute', () => {
    test('allows access when authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/private']}>
                <Routes>
                    <Route
                        path="/private"
                        element={
                            <PrivateRoute>
                                <ProtectedPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Protected')).toBeInTheDocument();
    });

    test('redirects when not authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/private']}>
                <Routes>
                    <Route
                        path="/private"
                        element={
                            <PrivateRoute>
                                <ProtectedPage />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/sign-in" element={<SignInPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    test('shows nothing while loading', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
        });

        const { container } = render(
            <MemoryRouter>
                <PrivateRoute>
                    <ProtectedPage />
                </PrivateRoute>
            </MemoryRouter>
        );

        expect(container.firstChild).toBeNull();
    });
});
