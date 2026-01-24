'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../store/contexts/AuthContext';
import { ReactNode, useEffect } from 'react';
import { Loader } from '../Loader/Loader';

interface PrivateRouteProps {
    children: ReactNode;
    redirectPath?: string;
}

export function PrivateRoute({
    children,
    redirectPath = '/sign-in',
}: PrivateRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, router, pathname, redirectPath]);

    if (isLoading) {
        return <Loader />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
