import { ErrorIcon } from '../Icons/Icons';
import { SimpleHeader } from '../SimpleHeader/SimpleHeader';
import './ErrorBoundaryFallback.css';

export function ErrorBoundaryFallback() {
    return (
        <>
            <SimpleHeader />
            <main className="error-page">
                <ErrorIcon />
                <h1>
                    Oops... <br />
                    Something bad has just happened
                </h1>
            </main>
        </>
    );
}
