import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import App from './App';

jest.mock('./pages/Profile/components/Statistics/Statistics', () => ({
    Statistics: () => <div data-testid="statistics-page">Statistics Page</div>,
}));

jest.mock('./pages/SignUp/SignUp', () => ({
    __esModule: true,
    default: () => <div data-testid="signup-page">SignUp Page</div>,
}));

jest.mock('./pages/SignIn/SignIn', () => ({
    __esModule: true,
    default: () => <div data-testid="signin-page">SignIn Page</div>,
}));

jest.mock('./pages/Profile/Profile', () => ({
    __esModule: true,
    default: () => <div data-testid="profile-page">Profile Page</div>,
}));

jest.mock('./pages/Profile/components/ProfileInfo/ProfileInfo', () => ({
    ProfileInfo: () => (
        <div data-testid="profile-info-page">Profile Info Page</div>
    ),
}));

jest.mock('./pages/NotFound/NotFound', () => ({
    __esModule: true,
    default: () => <div data-testid="notfound-page">Not Found Page</div>,
}));

jest.mock('./store/contexts/ThemeContext', () => ({
    ThemeProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="theme-provider">{children}</div>
    ),
}));

jest.mock('./store/contexts/NotificationContext', () => ({
    CustomNotificationProvider: ({
        children,
    }: {
        children: React.ReactNode;
    }) => <div data-testid="notification-provider">{children}</div>,
}));

jest.mock('./store/contexts/UserContext', () => ({
    UserProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="auth-provider">{children}</div>
    ),
}));

jest.mock('./components/Footer/Footer', () => ({
    Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('./components/PrivateRoute/PrivateRoute', () => ({
    PrivateRoute: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="private-route">{children}</div>
    ),
}));

jest.mock('./components/ErrorBoundaryFallback/ErrorBoundaryFallback', () => ({
    ErrorBoundaryFallback: () => (
        <div data-testid="error-boundary-fallback">Error</div>
    ),
}));

jest.mock('./components/Loader/Loader', () => ({
    Loader: ({ message }: { message: string }) => (
        <div data-testid="loader">{message}</div>
    ),
}));

jest.mock('pages/Home/Home', () => ({
    __esModule: true,
    default: () => <div data-testid="home-page">Home Page</div>,
}));

describe('App Component', () => {
    test('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    });

    test('contains all context providers', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
        expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
        expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    });

    test('renders footer component', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );

        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
});
