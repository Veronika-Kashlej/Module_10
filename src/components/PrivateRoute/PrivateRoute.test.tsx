import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { PrivateRoute } from './PrivateRoute';
import { useAuth } from '../../utils/hooks/useAuth';
import { createMockAuth } from '../../utils/api/api.test';

jest.mock('../../store/contexts/AuthContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const ProtectedPage = () => <div>Protected</div>;
const SignInPage = () => <div>Sign In</div>;

describe('PrivateRoute', () => {
    test('allows access when authenticated', () => {
        mockUseAuth.mockReturnValue(createMockAuth({ isAuthenticated: true }));
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
        mockUseAuth.mockReturnValue(createMockAuth());

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
        mockUseAuth.mockReturnValue(createMockAuth());

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
