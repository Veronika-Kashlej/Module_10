'use client';
import { createContext, ReactNode, useContext, useState } from 'react';
import { CustomNotificationProps, CustomNotificationType } from '../types';
import { CustomNotification } from '../../components/Notification/Notification';

interface CustomNotificationContextType {
    showCustomNotification: (
        message: string,
        type: CustomNotificationType
    ) => void;
}

const CustomNotificationContext = createContext<
    CustomNotificationContextType | undefined
>(undefined);

export const useCustomNotification = () => {
    const context = useContext(CustomNotificationContext);
    if (!context) {
        throw new Error(
            'useNotification must be used within NotificationProvider'
        );
    }
    return context;
};

interface CustomNotificationProviderProps {
    children: ReactNode;
}

export const CustomNotificationProvider = ({
    children,
}: CustomNotificationProviderProps) => {
    const [notification, setNotification] =
        useState<CustomNotificationProps | null>(null);

    const showCustomNotification = (
        message: string,
        type: CustomNotificationType
    ) => {
        setNotification({ message, type });
    };

    return (
        <CustomNotificationContext value={{ showCustomNotification }}>
            {children}
            {notification && (
                <CustomNotification
                    message={notification.message}
                    type={notification.type}
                />
            )}
        </CustomNotificationContext>
    );
};
