import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from './TextArea';

describe('TextArea', () => {
    test('renders as textarea', () => {
        render(<TextArea />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('can be typed into', () => {
        render(<TextArea />);

        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Test input' } });

        expect(textarea).toHaveValue('Test input');
    });

    test('shows initial value', () => {
        render(<TextArea value="Starting value" />);
        expect(screen.getByRole('textbox')).toHaveValue('Starting value');
    });
});
