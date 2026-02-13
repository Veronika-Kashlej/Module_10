import './Notification.css';
import { Portal } from '../Portal/Portal';
import { CustomNotificationProps } from '../../store/types';

export function CustomNotification({
    message,
    type,
    onClose,
}: CustomNotificationProps) {
    return (
        <Portal>
            <div
                className={`notification-container ${type === 'success' ? '' : 'error'}`}
            >
                <p role="alert">{message}</p>
                <p className="close-natification-btn" onClick={onClose}>
                    ×
                </p>
            </div>
        </Portal>
    );
}
