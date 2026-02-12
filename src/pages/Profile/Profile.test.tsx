import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Profile from './Profile';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'nav.profile': 'Profile info',
                'nav.statistics': 'Statistics',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('./components/ProfileInfo/ProfileInfo', () => ({
    ProfileInfo: () => (
        <div data-testid="profile-info">Profile Info Content</div>
    ),
}));

jest.mock('./components/Statistics/Statistics', () => ({
    Statistics: () => <div data-testid="statistics">Statistics Content</div>,
}));

jest.mock('../../components/Header/Header', () => ({
    Header: () => <header data-testid="header">Header</header>,
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    Outlet: () => <div data-testid="outlet" />,
}));

describe('Profile Component', () => {
    test('renders Profile page with header', () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    test('renders tabs with correct labels', () => {
        render(
            <MemoryRouter initialEntries={['/profile']}>
                <Profile />
            </MemoryRouter>
        );

        expect(screen.getByText('Profile info')).toBeInTheDocument();
        expect(screen.getByText('Statistics')).toBeInTheDocument();

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);
    });

    test('shows Profile info tab as active by default', () => {
        render(
            <MemoryRouter initialEntries={['/profile']}>
                <Profile />
            </MemoryRouter>
        );

        const profileTab = screen.getByText('Profile info');
        const statisticsTab = screen.getByText('Statistics');

        expect(profileTab).toHaveClass('active');
        expect(statisticsTab).not.toHaveClass('active');

        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    test('navigates to Statistics tab when clicked', () => {
        render(
            <MemoryRouter initialEntries={['/profile']}>
                <Profile />
            </MemoryRouter>
        );

        const statisticsTab = screen.getByText('Statistics');
        fireEvent.click(statisticsTab);

        expect(statisticsTab).toHaveClass('active');
        expect(screen.getByText('Profile info')).not.toHaveClass('active');
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    test('navigates back to Profile info tab when clicked', () => {
        render(
            <MemoryRouter initialEntries={['/statistics']}>
                <Profile />
            </MemoryRouter>
        );

        expect(screen.getByTestId('outlet')).toBeInTheDocument();

        const profileTab = screen.getByText('Profile info');
        fireEvent.click(profileTab);

        expect(profileTab).toHaveClass('active');
        expect(screen.getByText('Statistics')).not.toHaveClass('active');
        expect(screen.getByTestId('outlet')).toBeInTheDocument();
    });

    test('has correct ARIA attributes', () => {
        render(
            <MemoryRouter initialEntries={['/profile']}>
                <Profile />
            </MemoryRouter>
        );

        const tabsContainer = screen.getByRole('tablist');
        expect(tabsContainer).toBeInTheDocument();

        const profileTab = screen.getByText('Profile info');
        const statisticsTab = screen.getByText('Statistics');

        expect(profileTab).toHaveAttribute('aria-selected', 'true');
        expect(statisticsTab).toHaveAttribute('aria-selected', 'false');
        expect(profileTab).toHaveAttribute('role', 'tab');
        expect(statisticsTab).toHaveAttribute('role', 'tab');
    });
});
