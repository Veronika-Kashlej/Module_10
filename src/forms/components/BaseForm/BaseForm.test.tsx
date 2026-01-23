import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BaseForm } from './BaseForm';

const mockShowCustomNotification = jest.fn();
jest.mock('../../../../store/contexts/NotificationContext', () => ({
    useCustomNotification: () => ({
        showCustomNotification: mockShowCustomNotification,
    }),
}));

const consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);

describe('BaseForm', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        mockOnSubmit.mockClear();
        mockShowCustomNotification.mockClear();
    });

    afterAll(() => {
        consoleErrorSpy.mockRestore();
    });

    test('renders form with children and submit button', () => {
        render(
            <BaseForm onSubmit={mockOnSubmit} successMessage="Success!">
                <input type="text" placeholder="Name" />
            </BaseForm>
        );

        expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Submit' })
        ).toBeInTheDocument();
    });

    test('shows custom submit button text', () => {
        render(
            <BaseForm
                onSubmit={mockOnSubmit}
                successMessage="Success!"
                submitButtonText="Save"
            >
                <div>Form content</div>
            </BaseForm>
        );

        expect(
            screen.getByRole('button', { name: 'Save' })
        ).toBeInTheDocument();
    });

    test('calls onSubmit and shows success notification on success', async () => {
        mockOnSubmit.mockResolvedValue(undefined);

        render(
            <BaseForm
                onSubmit={mockOnSubmit}
                successMessage="Operation successful!"
            >
                <input type="text" />
            </BaseForm>
        );

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockShowCustomNotification).toHaveBeenCalledWith(
                'Operation successful!',
                'success'
            );
        });
    });

    test('shows error notification when onSubmit throws error', async () => {
        const errorMessage = 'Something went wrong';
        mockOnSubmit.mockRejectedValue(new Error(errorMessage));

        render(
            <BaseForm onSubmit={mockOnSubmit} successMessage="Success">
                <input type="text" />
            </BaseForm>
        );

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockShowCustomNotification).toHaveBeenCalledWith(
                errorMessage,
                'error'
            );
        });
    });

    test('applies custom className', () => {
        render(
            <BaseForm
                onSubmit={mockOnSubmit}
                successMessage="Success"
                className="custom-form"
            >
                <div>Content</div>
            </BaseForm>
        );

        const form = screen.getByRole('button').closest('form');
        expect(form).toHaveClass('custom-form');
    });

    test('shows generic error notification when onSubmit throws non-Error object', async () => {
        mockOnSubmit.mockRejectedValue('Some string error');

        render(
            <BaseForm onSubmit={mockOnSubmit} successMessage="Success">
                <input type="text" />
            </BaseForm>
        );

        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockShowCustomNotification).toHaveBeenCalledWith(
                'Something went wrong',
                'error'
            );
        });
    });
});
