import './NotFound.css';
import { NotFoundIcon } from '@/components/Icons/Icons';
import { SimpleHeader } from '@/components/SimpleHeader/SimpleHeader';

function NotFound() {
    return (
        <>
            <SimpleHeader />
            <main className="not-found-page">
                <NotFoundIcon />
                <h1>Page not found</h1>
            </main>
        </>
    );
}

export default NotFound;
