import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

test('renders input that can be typed into', () => {
    render(<Input />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'Test' } });
    expect(input).toHaveValue('Test');
});

test('shows initial value', () => {
    render(<Input value="Initial" />);
    expect(screen.getByRole('textbox')).toHaveValue('Initial');
});
