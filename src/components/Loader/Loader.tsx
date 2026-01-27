import './Loader.css';
import { useTranslation } from 'react-i18next';

interface LoaderProps {
    message?: string;
}

export function Loader({ message }: LoaderProps) {
    const { t } = useTranslation();

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader-spinner" />
                <div className="loader-text">
                    {message || t('states.loading')}
                </div>
            </div>
        </div>
    );
}
