'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider } from 'store/contexts/ThemeContext';
import { CustomNotificationProvider } from 'store/contexts/NotificationContext';
import { AuthProvider } from 'store/contexts/AuthContext';
import { Footer } from '@/components/Footer/Footer';
import { Loader } from '@/components/Loader/Loader';

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMockingInitialized, setIsMockingInitialized] = useState(false);

    useEffect(() => {
        const initMocks = async () => {
            try {
                const { startMockingSocial } =
                    await import('@sidekick-monorepo/internship-backend');
                await startMockingSocial();
                console.log('Mocking started successfully');
                setIsMockingInitialized(true);
            } catch (error) {
                console.error('Failed to start mocking:', error);
                setIsMockingInitialized(true);
            }
        };

        initMocks();
    }, []);

    if (!isMockingInitialized) {
        return <Loader message="Initializing application..." />;
    }

    return (
        <div id="root">
            <ThemeProvider>
                <CustomNotificationProvider>
                    <AuthProvider>
                        {children}
                        <Footer />
                    </AuthProvider>
                </CustomNotificationProvider>
            </ThemeProvider>
            <div id="modal-root"></div>
        </div>
    );
}
