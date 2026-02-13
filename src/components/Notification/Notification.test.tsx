import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomNotification } from './Notification';

jest.mock('../Portal/Portal', () => ({
    Portal: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

describe('CustomNotification', () => {
    test('renders message', () => {
        render(<CustomNotification message="Hello" type="success" />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    test('has success class for success type', () => {
        render(<CustomNotification message="Test" type="success" />);

        const container = screen
            .getByText('Test')
            .closest('.notification-container');
        expect(container).toHaveClass('notification-container');
        expect(container).not.toHaveClass('error');
    });

    test('has error class for error type', () => {
        render(<CustomNotification message="Test" type="error" />);

        const container = screen
            .getByText('Test')
            .closest('.notification-container');
        expect(container).toHaveClass('error');
    });

    test('closes when clicking close button', () => {
        const mockOnClose = jest.fn();

        render(
            <CustomNotification
                message="Test"
                type="success"
                onClose={mockOnClose}
            />
        );

        const closeButton = screen.getByText('×');
        fireEvent.click(closeButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('renders close button', () => {
        render(<CustomNotification message="Test" type="success" />);
        expect(screen.getByText('×')).toBeInTheDocument();
    });

    test('close button has correct class name', () => {
        render(<CustomNotification message="Test" type="success" />);

        const closeButton = screen.getByText('×');
        expect(closeButton).toHaveClass('close-natification-btn');
    });
});
