import { render, screen, fireEvent } from '@testing-library/react';
import {
    CustomNotificationProvider,
    useCustomNotification,
} from '../NotificationContext';
import { CustomNotificationType } from '@/store/types';

jest.mock('../../../components/Notification/Notification', () => ({
    CustomNotification: ({
        message,
        type,
    }: {
        message: string;
        type: CustomNotificationType;
    }) => {
        return (
            <div data-testid="custom-notification" data-type={type}>
                {message}
            </div>
        );
    },
}));

const TestComponentWithoutProvider = () => {
    useCustomNotification();
    return null;
};

describe('CustomNotificationProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useCustomNotification hook', () => {
        test('should throw error when used outside of provider', () => {
            const consoleError = jest.spyOn(console, 'error');
            consoleError.mockImplementation(() => undefined);

            expect(() => {
                render(<TestComponentWithoutProvider />);
            }).toThrow(
                'useNotification must be used within NotificationProvider'
            );

            consoleError.mockRestore();
        });

        test('should return context value when used within provider', () => {
            let contextValue: any;

            const TestConsumer = () => {
                contextValue = useCustomNotification();
                return null;
            };

            render(
                <CustomNotificationProvider>
                    <TestConsumer />
                </CustomNotificationProvider>
            );

            expect(contextValue).toBeDefined();
            expect(typeof contextValue.showCustomNotification).toBe('function');
        });

        test('showCustomNotification function should update notification state', async () => {
            const TestConsumer = () => {
                const { showCustomNotification } = useCustomNotification();

                return (
                    <button
                        data-testid="test-button"
                        onClick={() =>
                            showCustomNotification('Test message', 'success')
                        }
                    >
                        Show Notification
                    </button>
                );
            };

            render(
                <CustomNotificationProvider>
                    <TestConsumer />
                </CustomNotificationProvider>
            );

            expect(
                screen.queryByTestId('custom-notification')
            ).not.toBeInTheDocument();

            fireEvent.click(screen.getByTestId('test-button'));

            const notification = await screen.findByTestId(
                'custom-notification'
            );
            expect(notification).toBeInTheDocument();
            expect(notification).toHaveTextContent('Test message');
        });
    });
});
