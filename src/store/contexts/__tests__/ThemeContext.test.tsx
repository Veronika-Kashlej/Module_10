import {
    render,
    screen,
    act,
    fireEvent,
    waitFor,
} from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { useEffect } from 'react';

const mockLocalStorage = (global as any).mockLocalStorage || {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn(),
    removeItem: jest.fn(),
    key: jest.fn(),
    length: 0,
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

const mockSetAttribute = jest.fn();
Object.defineProperty(document.documentElement, 'setAttribute', {
    value: mockSetAttribute,
});

const TestComponent = () => {
    const { theme, setTheme, toggleTheme } = useTheme();

    return (
        <div>
            <div data-testid="current-theme">{theme}</div>
            <button
                data-testid="set-light-btn"
                onClick={() => setTheme('light')}
            >
                Set Light
            </button>
            <button data-testid="set-dark-btn" onClick={() => setTheme('dark')}>
                Set Dark
            </button>
            <button data-testid="toggle-btn" onClick={toggleTheme}>
                Toggle
            </button>
        </div>
    );
};

const ComponentWithoutProvider = () => {
    const { theme } = useTheme();
    return <div>{theme}</div>;
};

describe('ThemeContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockLocalStorage.clear();
    });

    describe('ThemeProvider', () => {
        test('provides default dark theme when no localStorage value', () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'dark'
            );
        });

        test('uses theme from localStorage on initial render', () => {
            mockLocalStorage.getItem.mockReturnValue('light');

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'light'
            );
        });

        test('sets data-theme attribute on document element', () => {
            mockLocalStorage.getItem.mockReturnValue('dark');

            render(
                <ThemeProvider>
                    <div>Test</div>
                </ThemeProvider>
            );

            expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
        });

        test('updates data-theme when theme changes', () => {
            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');

            act(() => {
                screen.getByTestId('set-light-btn').click();
            });

            expect(mockSetAttribute).toHaveBeenCalledWith(
                'data-theme',
                'light'
            );
        });
    });

    describe('useTheme hook', () => {
        test('returns theme context values', () => {
            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'dark'
            );
        });

        test('setTheme updates the theme', async () => {
            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'dark'
            );

            fireEvent.click(screen.getByTestId('set-light-btn'));

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'light'
            );
        });

        test('throws error when used outside ThemeProvider', () => {
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            expect(() => render(<ComponentWithoutProvider />)).toThrow(
                'useTheme must be used within a ThemeProvider'
            );

            consoleSpy.mockRestore();
        });
    });

    describe('ThemeContext toggle functionality', () => {
        test('toggle from dark to light', async () => {
            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            fireEvent.click(screen.getByTestId('toggle-btn'));

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'light'
            );
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'theme',
                'light'
            );
            expect(mockSetAttribute).toHaveBeenCalledWith(
                'data-theme',
                'light'
            );
        });

        test('toggle from light to dark', async () => {
            mockLocalStorage.getItem.mockReturnValue('light');

            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            fireEvent.click(screen.getByTestId('toggle-btn'));

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'dark'
            );
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'theme',
                'dark'
            );
            expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
        });
    });

    describe('ThemeContext value integrity', () => {
        test('context value has all required properties', async () => {
            const TestConsumer = ({
                onReady,
            }: {
                onReady: (value: any) => void;
            }) => {
                const contextValue = useTheme();

                useEffect(() => {
                    onReady(contextValue);
                }, [contextValue, onReady]);

                return null;
            };

            let capturedValue: any = null;
            const handleReady = (value: any) => {
                capturedValue = value;
            };

            render(
                <ThemeProvider>
                    <TestConsumer onReady={handleReady} />
                </ThemeProvider>
            );

            await waitFor(() => {
                expect(capturedValue).toBeDefined();
                expect(capturedValue).toHaveProperty('theme');
                expect(capturedValue).toHaveProperty('setTheme');
                expect(capturedValue).toHaveProperty('toggleTheme');
                expect(typeof capturedValue.setTheme).toBe('function');
                expect(typeof capturedValue.toggleTheme).toBe('function');
            });
        });
    });
});
