import './Actions.css';
import { useNavigate } from 'react-router';
import { useCustomNotification } from '../../../../store/contexts/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useShowError } from '../../../../utils/hooks/useShowError';
import { useAuth } from '../../../../utils/hooks/useAuth';

export function Actions() {
    const { showCustomNotification } = useCustomNotification();
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const showError = useShowError();
    const { t } = useTranslation();

    async function handleLogout() {
        try {
            await signOut();
            navigate('/');
            showCustomNotification(t('messages.success.logout'), 'success');
        } catch (err) {
            showError(err);
        }
    }

    return (
        <section className="actions-section">
            <h3>{t('pages.profile.actions.title')}</h3>
            <button onClick={handleLogout} className="logout-btn">
                {t('actions.logout')}
            </button>
        </section>
    );
}
