import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Actions } from './Actions';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
    reducer: {
        auth: (state = { user: null }) => state,
    },
});

jest.mock('../../../../utils/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../../../store/contexts/NotificationContext', () => ({
    useCustomNotification: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'pages.profile.actions.title': 'Actions',
                'actions.logout': 'Logout',
                'messages.success.logout': 'You logged out successfully',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../../../../utils/hooks/useShowError', () => ({
    useShowError: jest.fn(),
}));

import { useAuth } from '../../../../utils/hooks/useAuth';
import { useCustomNotification } from '../../../../store/contexts/NotificationContext';
import { useShowError } from '../../../../utils/hooks/useShowError';

const mockUseAuth = useAuth as jest.Mock;
const mockUseCustomNotification = useCustomNotification as jest.Mock;
const mockUseShowError = useShowError as jest.Mock;

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

describe('Actions Component', () => {
    const mockSignOut = jest.fn();
    const mockShowCustomNotification = jest.fn();
    const mockShowError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockNavigate.mockClear();
        mockSignOut.mockClear();
        mockShowCustomNotification.mockClear();
        mockShowError.mockClear();

        mockUseAuth.mockReturnValue({
            signOut: mockSignOut,
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
        });

        mockUseCustomNotification.mockReturnValue({
            showCustomNotification: mockShowCustomNotification,
        });

        mockUseShowError.mockReturnValue(mockShowError);
    });

    test('renders Actions section with title and logout button', () => {
        render(
            <AllProviders>
                <Actions />
            </AllProviders>
        );

        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('calls signOut, navigate and shows success notification on logout', async () => {
        mockSignOut.mockResolvedValue(undefined);

        render(
            <AllProviders>
                <Actions />
            </AllProviders>
        );

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockSignOut).toHaveBeenCalledTimes(1);
        });

        expect(mockNavigate).toHaveBeenCalledWith('/');
        expect(mockShowCustomNotification).toHaveBeenCalledWith(
            'You logged out successfully',
            'success'
        );
        expect(mockShowError).not.toHaveBeenCalled();
    });

    test('shows error notification with error message when logout fails with Error', async () => {
        const errorMessage = 'Logout failed: Invalid token';
        mockSignOut.mockRejectedValue(new Error(errorMessage));

        render(
            <AllProviders>
                <Actions />
            </AllProviders>
        );

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockShowError).toHaveBeenCalledWith(new Error(errorMessage));
        });

        expect(mockSignOut).toHaveBeenCalledTimes(1);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockShowCustomNotification).not.toHaveBeenCalled();
    });

    test('shows generic error notification when logout fails with non-Error', async () => {
        const stringError = 'String error';
        mockSignOut.mockRejectedValue(stringError);

        render(
            <AllProviders>
                <Actions />
            </AllProviders>
        );

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockShowError).toHaveBeenCalledWith(stringError);
        });

        expect(mockSignOut).toHaveBeenCalledTimes(1);
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockShowCustomNotification).not.toHaveBeenCalled();
    });

    test('button is clickable and triggers logout', () => {
        render(
            <AllProviders>
                <Actions />
            </AllProviders>
        );

        const logoutButton = screen.getByText('Logout');
        expect(logoutButton).toBeEnabled();

        fireEvent.click(logoutButton);
        expect(mockSignOut).toHaveBeenCalledTimes(1);
    });
});
