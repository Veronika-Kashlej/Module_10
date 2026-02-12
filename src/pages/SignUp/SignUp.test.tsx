import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import SignUp from './SignUp';
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
                'pages.signUp.title': 'Create an account',
                'pages.signUp.subtitle':
                    'Enter your email and password to sign up for this app',
                'pages.signUp.legal.prefix':
                    'By clicking continue, you agree to our',
                'pages.signUp.legal.terms': 'Terms of Service',
                'pages.signUp.legal.conjunction': 'and',
                'pages.signUp.legal.privacy': 'Privacy Policy',
                'pages.signUp.smallText': 'Already have an account?',
                'pages.signUp.linkToSignIn': 'Sign in',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../../forms/Forms', () => ({
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

describe('SignUp Component', () => {
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

    test('renders SignUp component correctly when not authenticated', () => {
        render(
            <AllProviders>
                <SignUp />
            </AllProviders>
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
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        await act(async () => {
            render(
                <AllProviders>
                    <SignUp />
                </AllProviders>
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
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
                <SignUp />
            </AllProviders>
        );

        expect(mockNavigate).not.toHaveBeenCalled();

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        await act(async () => {
            rerender(
                <AllProviders>
                    <SignUp />
                </AllProviders>
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('shows terms and privacy links', () => {
        render(
            <AllProviders>
                <SignUp />
            </AllProviders>
        );

        expect(screen.getByText('Terms of Service')).toBeInTheDocument();
        expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
        expect(
            screen.getByText('Already have an account?')
        ).toBeInTheDocument();
        expect(screen.getByText('Sign in')).toBeInTheDocument();
    });

    test('contains sign in link', () => {
        render(
            <AllProviders>
                <SignUp />
            </AllProviders>
        );

        const signInLink = screen.getByText('Sign in');
        expect(signInLink).toBeInTheDocument();
        expect(signInLink.closest('a')).toHaveAttribute('href', '/sign-in');
        expect(signInLink.closest('a')).toHaveClass('helper-link');
    });

    test('does not render content when authenticated', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        await act(async () => {
            render(
                <AllProviders>
                    <SignUp />
                </AllProviders>
            );
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('terms and privacy links have correct attributes', () => {
        render(
            <AllProviders>
                <SignUp />
            </AllProviders>
        );

        const termsLink = screen.getByText('Terms of Service');
        const privacyLink = screen.getByText('Privacy Policy');

        expect(termsLink.closest('a')).toHaveAttribute('rel', 'noreffer');
        expect(termsLink.closest('a')).toHaveAttribute(
            'href',
            'https://www.google.com/'
        );

        expect(privacyLink.closest('a')).toHaveAttribute('rel', 'noreffer');
        expect(privacyLink.closest('a')).toHaveAttribute(
            'href',
            'https://www.google.com/'
        );
    });

    test('has correct CSS class on main element', () => {
        render(
            <AllProviders>
                <SignUp />
            </AllProviders>
        );

        const mainElement = screen.getByRole('main');
        expect(mainElement).toHaveClass('auth-form-content');
        expect(mainElement).toHaveClass('sign-up');
    });
});
