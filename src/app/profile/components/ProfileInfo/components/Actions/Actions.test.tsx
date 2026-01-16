import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Actions } from './Actions';
import { useAuth } from '../../../../../../store/contexts/AuthContext';
import { useCustomNotification } from '../../../../../../store/contexts/NotificationContext';

jest.mock('../../../../../../store/contexts/AuthContext');
jest.mock('../../../../../../store/contexts/NotificationContext');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseCustomNotification = useCustomNotification as jest.MockedFunction<
    typeof useCustomNotification
>;

describe('Actions Component', () => {
    const mockSignOut = jest.fn();
    const mockShowCustomNotification = jest.fn();
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAuth.mockReturnValue({
            signOut: mockSignOut,
            signIn: jest.fn(),
            signUp: jest.fn(),
            refreshUser: jest.fn(),
            user: null,
            isAuthenticated: false,
            getCurrentUser: jest.fn(),
            isLoading: false,
        });

        mockUseCustomNotification.mockReturnValue({
            showCustomNotification: mockShowCustomNotification,
        });

        jest.spyOn(require('react-router'), 'useNavigate').mockReturnValue(
            mockNavigate
        );
    });

    test('renders Actions section with title and logout button', () => {
        render(
            <MemoryRouter>
                <Actions />
            </MemoryRouter>
        );

        expect(screen.getByText('Actions')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    test('calls signOut, navigate and shows success notification on logout', async () => {
        render(
            <MemoryRouter>
                <Actions />
            </MemoryRouter>
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
    });

    test('shows error notification with error message when logout fails with Error', async () => {
        const errorMessage = 'Logout failed: Invalid token';
        mockSignOut.mockRejectedValue(new Error(errorMessage));

        render(
            <MemoryRouter>
                <Actions />
            </MemoryRouter>
        );

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockShowCustomNotification).toHaveBeenCalledWith(
                errorMessage,
                'error'
            );
        });

        expect(mockNavigate).not.toHaveBeenCalledWith('/');
    });

    test('shows generic error notification when logout fails with non-Error', async () => {
        mockSignOut.mockRejectedValue('String error');

        render(
            <MemoryRouter>
                <Actions />
            </MemoryRouter>
        );

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        await waitFor(() => {
            expect(mockShowCustomNotification).toHaveBeenCalledWith(
                'Something went wrong',
                'error'
            );
        });

        expect(mockNavigate).not.toHaveBeenCalledWith('/');
    });
});
