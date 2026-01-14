import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SignIn from './SignIn';
import { useAuth } from '../../store/contexts/AuthContext';

jest.mock('../../store/contexts/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('../../components/Forms/Forms', () => ({
    Forms: {
        SignInForm: () => <div data-testid="signin-form">Sign In Form</div>,
        SignUpForm: () => <div>Sign Up Form</div>,
    },
}));

jest.mock('../../components/SimpleHeader/SimpleHeader', () => ({
    SimpleHeader: () => (
        <header data-testid="simple-header">Simple Header</header>
    ),
}));

afterEach(() => {
    jest.clearAllMocks();
});

describe('SignIn Component', () => {
    test('renders SignIn component correctly when not authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        expect(screen.getByText('Sign in into an account')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Enter your email and password to sign in into this app'
            )
        ).toBeInTheDocument();
        expect(screen.getByTestId('signin-form')).toBeInTheDocument();
        expect(screen.getByTestId('simple-header')).toBeInTheDocument();
    });

    test('redirects to home when authenticated', async () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require('react-router'), 'useNavigate').mockReturnValue(
            mockNavigate
        );

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: { id: 1 } as any,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('redirects only when authenticated changes to true', async () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require('react-router'), 'useNavigate').mockImplementation(
            () => mockNavigate
        );

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        const { rerender } = render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        expect(mockNavigate).not.toHaveBeenCalled();

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: { id: 1 } as any,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        rerender(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('shows sign up link', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        expect(
            screen.getByText('Forgot to create an account?')
        ).toBeInTheDocument();
        const signUpLink = screen.getByText('Sign up');
        expect(signUpLink).toBeInTheDocument();
        expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up');
    });

    test('has correct CSS class on main element', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveClass('auth-form-content');
        expect(mainElement).toHaveClass('sign-in');
    });

    test('does not call navigate when not authenticated', async () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require('react-router'), 'useNavigate').mockReturnValue(
            mockNavigate
        );

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('renders form caption correctly', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        const captionHeading = screen.getByRole('heading', { level: 4 });
        const captionSubheading = screen.getByRole('heading', { level: 5 });

        expect(captionHeading).toHaveTextContent('Sign in into an account');
        expect(captionSubheading).toHaveTextContent(
            'Enter your email and password to sign in into this app'
        );
    });

    test('has helper link with correct styling class', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshUser: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
            getCurrentUser: jest.fn(),
        });

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>
        );

        const signUpLink = screen.getByText('Sign up');
        const linkElement = signUpLink.closest('a');

        expect(linkElement).toHaveClass('helper-link');
        expect(linkElement).toHaveAttribute('href', '/sign-up');
    });
});
