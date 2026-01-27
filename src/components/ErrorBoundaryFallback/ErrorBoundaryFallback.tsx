import { Icons } from '../Icons/Icons';
import { SimpleHeader } from '../SimpleHeader/SimpleHeader';
import './ErrorBoundaryFallback.css';
import { useTranslation } from 'react-i18next';

export function ErrorBoundaryFallback() {
    const { t } = useTranslation();

    return (
        <>
            <SimpleHeader />
            <main className="error-page">
                <Icons.ErrorIcon />
                <h1>{t('pages.error.title')}</h1>
            </main>
        </>
    );
}
