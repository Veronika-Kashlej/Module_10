import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'pages.error.title': 'Something bad has just happened',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../SimpleHeader/SimpleHeader', () => ({
    SimpleHeader: () => <div data-testid="simple-header">Simple Header</div>,
}));

jest.mock('../Icons/Icons', () => ({
    Icons: {
        ErrorIcon: () => <div data-testid="error-icon">Error Icon</div>,
    },
}));

describe('ErrorBoundaryFallback', () => {
    test('renders error page with correct title', () => {
        render(<ErrorBoundaryFallback />);

        expect(
            screen.getByText('Something bad has just happened')
        ).toBeInTheDocument();
    });

    test('renders header and error icon', () => {
        render(<ErrorBoundaryFallback />);

        expect(screen.getByTestId('simple-header')).toBeInTheDocument();
        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
    });

    test('has correct ARIA attributes', () => {
        render(<ErrorBoundaryFallback />);

        const heading = screen.getByRole('alert');
        expect(heading).toBeInTheDocument();
        expect(heading.tagName).toBe('H1');
    });

    test('has correct CSS class', () => {
        render(<ErrorBoundaryFallback />);

        const mainElement = document.querySelector('.error-page');
        expect(mainElement).toBeInTheDocument();
    });
});
