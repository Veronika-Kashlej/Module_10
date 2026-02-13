import { render, fireEvent } from '@testing-library/react';
import { Switcher } from './Switcher';

test('toggles circle class when clicked', () => {
    const onClick = jest.fn();
    const { container } = render(<Switcher onClick={onClick} />);

    const button = container.querySelector('.switcher');
    const circle = container.querySelector('.circle');

    fireEvent.click(button!);
    expect(circle).toHaveClass('active');

    fireEvent.click(button!);
    expect(circle).not.toHaveClass('active');
});
