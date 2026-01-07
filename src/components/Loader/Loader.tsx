import './Loader.css';

interface LoaderProps {
    message?: string;
}

export function Loader({ message = 'Loading...' }: LoaderProps) {
    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="loader-spinner" />
                <div className="loader-text">{message}</div>
            </div>
        </div>
    );
}
