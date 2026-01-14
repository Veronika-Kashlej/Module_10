import { render, screen, act, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../ThemeContext';

const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
    };
})();

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

        test('saves theme to localStorage', () => {
            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'theme',
                'dark'
            );

            act(() => {
                screen.getByTestId('set-light-btn').click();
            });

            expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
                'theme',
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

        test('toggleTheme switches between dark and light', async () => {
            render(
                <ThemeProvider>
                    <TestComponent />
                </ThemeProvider>
            );

            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'dark'
            );

            await fireEvent.click(screen.getByTestId('toggle-btn'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'light'
            );

            fireEvent.click(screen.getByTestId('toggle-btn'));
            expect(screen.getByTestId('current-theme')).toHaveTextContent(
                'dark'
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
        test('context value has all required properties', () => {
            let contextValue: any;

            const TestConsumer = () => {
                contextValue = useTheme();
                return null;
            };

            render(
                <ThemeProvider>
                    <TestConsumer />
                </ThemeProvider>
            );

            expect(contextValue).toHaveProperty('theme');
            expect(contextValue).toHaveProperty('setTheme');
            expect(contextValue).toHaveProperty('toggleTheme');
            expect(typeof contextValue.setTheme).toBe('function');
            expect(typeof contextValue.toggleTheme).toBe('function');
        });
    });
});
