import { render, screen } from '@testing-library/react';
import { Label } from './Label';

test('renders title text', () => {
    render(<Label htmlFor="id" title="Test Label" icon={<div>Icon</div>} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
});

test('links to input with htmlFor', () => {
    render(
        <Label htmlFor="username" title="Username" icon={<div>Icon</div>} />
    );

    const label = screen.getByText('Username').closest('label');
    expect(label).toHaveAttribute('for', 'username');
});

test('includes icon', () => {
    const icon = <div data-testid="test-icon">Icon</div>;
    render(<Label htmlFor="test" title="Test" icon={icon} />);

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
});
