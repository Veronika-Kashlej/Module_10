import { Icons } from '../../components/Icons/Icons';
import { SimpleHeader } from '../../components/SimpleHeader/SimpleHeader';
import './NotFound.css';
import { useTranslation } from 'react-i18next';

function NotFound() {
    const { t } = useTranslation();

    return (
        <>
            <SimpleHeader />
            <main className="not-found-page">
                <Icons.NotFoundIcon />
                <h1>{t('pages.notFound.title')}</h1>
            </main>
        </>
    );
}

export default NotFound;
