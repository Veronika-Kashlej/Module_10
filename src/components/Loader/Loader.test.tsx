import { render, screen } from '@testing-library/react';
import { Loader } from './Loader';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'states.loading': 'Loading...',
            };
            return translations[key] || key;
        },
    }),
}));

describe('Loader', () => {
    test('renders loader with custom message', () => {
        render(<Loader message="Please, wait..." />);
        expect(screen.getByText('Please, wait...')).toBeInTheDocument();
    });

    test('renders loader with default message when no message provided', () => {
        render(<Loader />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('has correct CSS classes', () => {
        render(<Loader message="Test message" />);

        const overlay = document.querySelector('.loader-overlay');
        const container = document.querySelector('.loader-container');
        const spinner = document.querySelector('.loader-spinner');
        const text = document.querySelector('.loader-text');

        expect(overlay).toBeInTheDocument();
        expect(container).toBeInTheDocument();
        expect(spinner).toBeInTheDocument();
        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent('Test message');
    });

    test('updates when message prop changes', () => {
        const { rerender } = render(<Loader message="Initial message" />);
        expect(screen.getByText('Initial message')).toBeInTheDocument();

        rerender(<Loader message="Updated message" />);
        expect(screen.getByText('Updated message')).toBeInTheDocument();
    });
});
