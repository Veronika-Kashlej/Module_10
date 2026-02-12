import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SignIn from './SignIn';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
    reducer: {
        auth: (state = { user: null }) => state,
    },
});

jest.mock('../../utils/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'pages.signIn.title': 'Sign in into an account',
                'pages.signIn.subtitle':
                    'Enter your email and password to sign in into this app',
                'pages.signIn.smallText': 'Forgot to create an account?',
                'pages.signIn.linkToSignUp': 'Sign up',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../../forms/Forms', () => ({
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

import { useAuth } from '../../utils/hooks/useAuth';

const mockUseAuth = useAuth as jest.Mock;

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <Provider store={mockStore}>
        <MemoryRouter>{children}</MemoryRouter>
    </Provider>
);

describe('SignIn Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockClear();

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });
    });

    test('renders SignIn component correctly when not authenticated', () => {
        render(
            <AllProviders>
                <SignIn />
            </AllProviders>
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
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        render(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('redirects only when authenticated changes to true', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        const { rerender } = render(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        expect(mockNavigate).not.toHaveBeenCalled();

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        rerender(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    test('shows sign up link', () => {
        render(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        expect(
            screen.getByText('Forgot to create an account?')
        ).toBeInTheDocument();

        const signUpLink = screen.getByText('Sign up');
        expect(signUpLink).toBeInTheDocument();
        expect(signUpLink.closest('a')).toHaveAttribute('href', '/sign-up');
    });

    test('has correct CSS class on main element', () => {
        render(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveClass('auth-form-content');
        expect(mainElement).toHaveClass('sign-in');
    });

    test('does not call navigate when not authenticated', async () => {
        render(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        await waitFor(
            () => {
                expect(mockNavigate).not.toHaveBeenCalled();
            },
            { timeout: 100 }
        );
    });

    test('renders form caption correctly', () => {
        render(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        const captionHeading = screen.getByRole('heading', { level: 4 });
        const captionSubheading = screen.getByRole('heading', { level: 5 });

        expect(captionHeading).toHaveTextContent('Sign in into an account');
        expect(captionSubheading).toHaveTextContent(
            'Enter your email and password to sign in into this app'
        );
    });

    test('has helper link with correct styling class', () => {
        render(
            <AllProviders>
                <SignIn />
            </AllProviders>
        );

        const signUpLink = screen.getByText('Sign up');
        const linkElement = signUpLink.closest('a');

        expect(linkElement).toHaveClass('helper-link');
        expect(linkElement).toHaveAttribute('href', '/sign-up');
    });
});
