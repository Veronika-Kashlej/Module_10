import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundaryFallback } from './ErrorBoundaryFallback';

jest.mock('../SimpleHeader/SimpleHeader', () => ({
    SimpleHeader: () => <div>Simple Header</div>,
}));

jest.mock('../Icons/Icons', () => ({
    Icons: {
        ErrorIcon: () => <div>Error Icon</div>,
    },
}));

describe('ErrorBoundaryFallback', () => {
    test('renders error page', () => {
        render(<ErrorBoundaryFallback />);

        expect(
            screen.getByText(/Something bad has just happened/)
        ).toBeInTheDocument();
    });
});
