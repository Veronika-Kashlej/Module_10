import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SignUp from './SignUp';
import { useAuth } from '../../store/contexts/AuthContext';

jest.mock('../../store/contexts/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

jest.mock('../../components/Forms/Forms', () => ({
    Forms: {
        SignUpForm: () => <div data-testid="signup-form">Sign Up Form</div>,
        SignInForm: () => <div>Sign In Form</div>,
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

describe('SignUp Component', () => {
    test('renders SignUp component correctly when not authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        expect(screen.getByText('Create an account')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Enter your email and password to sign up for this app'
            )
        ).toBeInTheDocument();
        expect(screen.getByTestId('signup-form')).toBeInTheDocument();
        expect(screen.getByTestId('simple-header')).toBeInTheDocument();
    });

    test('redirects to home when authenticated', async () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require('react-router'), 'useNavigate').mockImplementation(
            () => mockNavigate
        );

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('redirects only when authenticated changes to true', async () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require('react-router'), 'useNavigate').mockImplementation(
            () => mockNavigate
        );

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        const { rerender } = render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        expect(mockNavigate).not.toHaveBeenCalled();

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        await act(async () => {
            rerender(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('shows terms and privacy links', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
        expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
        expect(
            screen.getByText('Already have an account?')
        ).toBeInTheDocument();
        expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    test('contains sign in link', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <SignUp />
            </MemoryRouter>
        );

        const signInLink = screen.getByText('Sign in');
        expect(signInLink).toBeInTheDocument();
        expect(signInLink.closest('a')).toHaveAttribute('href', '/sign-in');
    });

    test('does not render content when authenticated', async () => {
        const mockNavigate = jest.fn();

        jest.spyOn(require('react-router'), 'useNavigate').mockImplementation(
            () => mockNavigate
        );

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signUp: jest.fn(),
            signIn: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        await act(async () => {
            render(
                <MemoryRouter>
                    <SignUp />
                </MemoryRouter>
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
