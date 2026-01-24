import { useCustomNotification } from '../../store/contexts/NotificationContext';

export function useShowError() {
    const { showCustomNotification } = useCustomNotification();

    const showError = (err: unknown) => {
        if (err instanceof Error) {
            showCustomNotification(err.message, 'error');
        } else {
            showCustomNotification('Something went wrong', 'error');
        }
    };

    return showError;
}
