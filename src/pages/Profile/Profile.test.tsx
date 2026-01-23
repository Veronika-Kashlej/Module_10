import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Profile from './Profile';

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
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        expect(screen.getByText('Profile info')).toBeInTheDocument();
        expect(screen.getByText('Statistics')).toBeInTheDocument();

        const tabs = screen.getAllByRole('button');
        expect(tabs).toHaveLength(2);
    });

    test('shows Profile info tab as active by default', () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        const profileTab = screen.getByText('Profile info');
        const statisticsTab = screen.getByText('Statistics');

        expect(profileTab).toHaveClass('active');
        expect(statisticsTab).not.toHaveClass('active');
        expect(screen.getByTestId('profile-info')).toBeInTheDocument();
    });

    test('switches to Statistics tab when clicked', () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        const statisticsTab = screen.getByText('Statistics');
        fireEvent.click(statisticsTab);

        expect(statisticsTab).toHaveClass('active');
        expect(screen.getByText('Profile info')).not.toHaveClass('active');
        expect(screen.getByTestId('statistics')).toBeInTheDocument();
    });

    test('switches back to Profile info tab when clicked', () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

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
