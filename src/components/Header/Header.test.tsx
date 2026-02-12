import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
    reducer: {
        auth: (state = { user: null }) => state,
    },
});

jest.mock('../Icons/Icons', () => ({
    Icons: {
        SidekickLogo: () => <div data-testid="logo">Logo</div>,
    },
}));

const mockI18n = {
    language: 'en',
    changeLanguage: jest.fn(),
    t: (key: string) => key,
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'actions.signUp': 'Sign Up',
                'actions.signIn': 'Sign In',
                'nav.profile': 'Profile info',
                'nav.statistics': 'Statistics',
            };
            return translations[key] || key;
        },
        i18n: mockI18n,
    }),
}));

jest.mock('../../utils/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../store/contexts/UserContext', () => ({
    useUser: jest.fn(),
}));

import { useAuth } from '../../utils/hooks/useAuth';
import { useUser } from '../../store/contexts/UserContext';

const mockUseAuth = useAuth as jest.Mock;
const mockUseUser = useUser as jest.Mock;

const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <Provider store={mockStore}>
        <MemoryRouter>{children}</MemoryRouter>
    </Provider>
);

describe('Header', () => {
    beforeAll(() => {
        Object.defineProperty(window, 'scrollTo', {
            value: jest.fn(),
            writable: true,
        });
    });

    beforeEach(() => {
        jest.clearAllMocks();
        document.body.style.overflow = '';
        document.body.innerHTML = '';

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockUseUser.mockReturnValue({
            user: null,
            refreshUser: jest.fn(),
        });
    });

    test('renders logo and burger menu for unauthenticated user', () => {
        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        expect(screen.getByTestId('logo')).toBeInTheDocument();

        const signUpLinks = screen.getAllByText('Sign Up');
        const signInLinks = screen.getAllByText('Sign In');

        expect(signUpLinks).toHaveLength(2);
        expect(signInLinks).toHaveLength(2);

        const desktopMenu = document.querySelector('.desktop-menu');
        expect(desktopMenu).toBeInTheDocument();
    });

    test('opens and closes mobile menu', () => {
        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        const burgerDiv = document.querySelector('.burger') as HTMLElement;
        const mobileMenu = document.querySelector(
            '.mobile-menu'
        ) as HTMLElement;
        const header = document.querySelector('.header') as HTMLElement;

        expect(mobileMenu).not.toHaveClass('open');
        expect(header).not.toHaveClass('open');

        fireEvent.click(burgerDiv);

        expect(mobileMenu).toHaveClass('open');
        expect(header).toHaveClass('open');
        expect(document.body.style.overflow).toBe('hidden');
    });

    test('mobile menu shows correct links for authenticated user', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockUseUser.mockReturnValue({
            user: {
                firstName: 'John',
                secondName: 'Doe',
                profileImage: 'test.jpg',
                username: 'johndoe',
                email: 'john@example.com',
                description: '',
            },
            refreshUser: jest.fn(),
        });

        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        const burgerDiv = document.querySelector('.burger') as HTMLElement;
        fireEvent.click(burgerDiv);

        expect(screen.getByText('Profile info')).toBeInTheDocument();
        expect(screen.getByText('Statistics')).toBeInTheDocument();

        const signUpLinks = screen.queryAllByText('Sign Up');
        const signInLinks = screen.queryAllByText('Sign In');
        expect(signUpLinks).toHaveLength(0);
        expect(signInLinks).toHaveLength(0);
    });

    test('mobile menu shows correct links for unauthenticated user', () => {
        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        const burgerDiv = document.querySelector('.burger') as HTMLElement;
        fireEvent.click(burgerDiv);

        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileSignUp = mobileMenu?.querySelector('a[href="/sign-up"]');
        const mobileSignIn = mobileMenu?.querySelector('a[href="/sign-in"]');

        expect(mobileSignUp).toBeInTheDocument();
        expect(mobileSignIn).toBeInTheDocument();

        expect(screen.queryByText('Profile info')).not.toBeInTheDocument();
        expect(screen.queryByText('Statistics')).not.toBeInTheDocument();
    });

    test('closeMenu removes event listener and resets styles', () => {
        const addEventListenerSpy = jest.spyOn(
            document.body,
            'addEventListener'
        );
        const removeEventListenerSpy = jest.spyOn(
            document.body,
            'removeEventListener'
        );

        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        const burgerDiv = document.querySelector('.burger') as HTMLElement;

        fireEvent.click(burgerDiv);

        fireEvent.click(document.body);

        expect(document.body.style.overflow).toBe('');

        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });

    test('renders user profile info when authenticated', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockUseUser.mockReturnValue({
            user: {
                firstName: 'John',
                secondName: 'Doe',
                profileImage: 'profile.jpg',
                username: 'johndoe',
                email: 'john@example.com',
                description: '',
            },
            refreshUser: jest.fn(),
        });

        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        const profileImage = screen.getByAltText('profile');
        expect(profileImage).toBeInTheDocument();
        expect(profileImage).toHaveAttribute('src', 'profile.jpg');
        expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
        expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
    });

    test('closes menu when clicking outside', () => {
        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        const burgerDiv = document.querySelector('.burger') as HTMLElement;
        const mobileMenu = document.querySelector(
            '.mobile-menu'
        ) as HTMLElement;

        fireEvent.click(burgerDiv);
        expect(mobileMenu).toHaveClass('open');

        fireEvent.click(document.body);
        expect(mobileMenu).not.toHaveClass('open');
    });

    test('LanguageSwitcher renders correctly', () => {
        render(
            <AllProviders>
                <Header />
            </AllProviders>
        );

        const languageButton = screen.getByLabelText('change language');
        expect(languageButton).toBeInTheDocument();
    });
});
