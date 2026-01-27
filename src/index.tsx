import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router';
import { startMockingSocial } from '@sidekick-monorepo/internship-backend';
import './i18n';

async function enableMocking() {
    await startMockingSocial();
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    );
});
