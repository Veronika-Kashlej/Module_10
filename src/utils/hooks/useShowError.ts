import { useCustomNotification } from '../../store/contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

export function useShowError() {
    const { showCustomNotification } = useCustomNotification();
    const { t } = useTranslation();

    const showError = (err: unknown) => {
        if (err instanceof Error) {
            showCustomNotification(err.message, 'error');
        } else {
            showCustomNotification(t('messages.error.defaultError'), 'error');
        }
    };

    return showError;
}
