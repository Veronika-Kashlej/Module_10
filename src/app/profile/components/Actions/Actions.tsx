import './Actions.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/contexts/AuthContext';
import { useCustomNotification } from '@/store/contexts/NotificationContext';

export function Actions() {
    const { showCustomNotification } = useCustomNotification();
    const { signOut } = useAuth();
    const router = useRouter();

    async function handleLogout() {
        try {
            await signOut();
            router.push('/');
            showCustomNotification('You logged out successfully', 'success');
        } catch (err) {
            if (err instanceof Error) {
                showCustomNotification(err.message, 'error');
            } else {
                showCustomNotification('Something went wrong', 'error');
            }
        }
    }

    return (
        <section className="actions-section">
            <h3>Actions</h3>
            <button
                onClick={handleLogout}
                className="logout-btn"
                aria-label="logout"
            >
                Logout
            </button>
        </section>
    );
}
