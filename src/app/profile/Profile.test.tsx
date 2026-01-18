import { render, screen, fireEvent } from '@testing-library/react';
import Profile from './page';

jest.mock('@/components/PrivateRoute/PrivateRoute', () => ({
    PrivateRoute: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="private-route">{children}</div>
    ),
}));

jest.mock('../../components/Header/Header', () => ({
    Header: () => <header data-testid="header">Header</header>,
}));

jest.mock('./components/ProfileInfo/ProfileInfo', () => ({
    ProfileInfo: () => (
        <div data-testid="profile-info">Profile Info Content</div>
    ),
}));

jest.mock('./components/Statistics/Statistics', () => ({
    Statistics: () => <div data-testid="statistics">Statistics Content</div>,
}));

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: () => '/profile',
}));

describe('Profile Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Profile page with header', () => {
        render(<Profile />);

        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    test('renders tabs with correct labels', () => {
        render(<Profile />);

        expect(screen.getByText('Profile info')).toBeInTheDocument();
        expect(screen.getByText('Statistics')).toBeInTheDocument();

        const tabs = screen.getAllByRole('button');
        expect(tabs).toHaveLength(2);
    });

    test('shows Profile info tab as active by default', () => {
        render(<Profile />);

        const profileTab = screen.getByText('Profile info');
        const statisticsTab = screen.getByText('Statistics');

        expect(profileTab).toHaveClass('active');
        expect(statisticsTab).not.toHaveClass('active');
        expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    });

    test('switches to Statistics tab when clicked', () => {
        render(<Profile />);

        const statisticsTab = screen.getByText('Statistics');
        fireEvent.click(statisticsTab);

        expect(statisticsTab).toHaveClass('active');
        expect(screen.getByText('Profile info')).not.toHaveClass('active');
        expect(screen.getByTestId('statistics')).toBeInTheDocument();
    });

    test('switches back to Profile info tab when clicked', () => {
        render(<Profile />);

        const statisticsTab = screen.getByText('Statistics');
        fireEvent.click(statisticsTab);
        expect(screen.getByTestId('statistics')).toBeInTheDocument();

        const profileTab = screen.getByText('Profile info');
        fireEvent.click(profileTab);

        expect(profileTab).toHaveClass('active');
        expect(statisticsTab).not.toHaveClass('active');
        expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    });
});
