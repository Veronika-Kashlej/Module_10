import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header';
import { useAuth } from '../../store/contexts/AuthContext';

jest.mock('../../store/contexts/AuthContext');
jest.mock('../Icons/Icons', () => ({
    Icons: {
        SidekickLogo: () => <div data-testid="logo">Logo</div>,
    },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

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
    });

    test('renders logo and burger menu for unauthenticated user', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
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
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
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
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
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
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const burgerDiv = document.querySelector('.burger') as HTMLElement;
        fireEvent.click(burgerDiv);

        const mobileSignUp = screen.getAllByText('Sign Up')[1];
        const mobileSignIn = screen.getAllByText('Sign In')[1];

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

        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        );

        const burgerDiv = document.querySelector('.burger') as HTMLElement;

        fireEvent.click(burgerDiv);

        fireEvent.click(document.body);

        expect(document.body.style.overflow).toBe('');

        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });
});
