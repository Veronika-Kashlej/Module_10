import { render, screen, fireEvent } from '@testing-library/react';
import { Preferences } from './Preferences';
import { useTheme } from '../../../../store/contexts/ThemeContext';

jest.mock('../../../../../../components/Switcher/Switcher', () => ({
    Switcher: ({ onClick }: { onClick: () => void }) => (
        <button data-testid="switcher" onClick={onClick}>
            Switcher
        </button>
    ),
}));

jest.mock('../../../../../../store/contexts/ThemeContext');
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('Preferences Component', () => {
    const mockToggleTheme = jest.fn();
    const mockSetTheme = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Preferences section with title', () => {
        mockUseTheme.mockReturnValue({
            theme: 'light',
            toggleTheme: mockToggleTheme,
            setTheme: mockSetTheme,
        });

        render(<Preferences />);

        expect(screen.getByText('Preferences')).toBeInTheDocument();
    });

    test('shows Light theme when theme is light', () => {
        mockUseTheme.mockReturnValue({
            theme: 'light',
            toggleTheme: mockToggleTheme,
            setTheme: mockSetTheme,
        });

        render(<Preferences />);

        expect(screen.getByText('Light theme')).toBeInTheDocument();
    });

    test('shows Dark theme when theme is dark', () => {
        mockUseTheme.mockReturnValue({
            theme: 'dark',
            toggleTheme: mockToggleTheme,
            setTheme: mockSetTheme,
        });

        render(<Preferences />);

        expect(screen.getByText('Dark theme')).toBeInTheDocument();
    });

    test('calls toggleTheme when Switcher is clicked', () => {
        mockUseTheme.mockReturnValue({
            theme: 'light',
            toggleTheme: mockToggleTheme,
            setTheme: mockSetTheme,
        });

        render(<Preferences />);

        const switcher = screen.getByTestId('switcher');
        fireEvent.click(switcher);

        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
});
