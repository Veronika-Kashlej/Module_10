import React, { ReactNode } from 'react';
import { useCustomNotification } from '../../../../store/contexts/NotificationContext';

interface BaseFormProps {
    children: ReactNode;
    onSubmit: () => void;
    successMessage: string;
    submitButtonText?: string;
    className?: string;
}

export function BaseForm({
    children,
    onSubmit,
    successMessage,
    submitButtonText = 'Submit',
    className,
}: BaseFormProps) {
    const { showCustomNotification } = useCustomNotification();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await onSubmit();
            showCustomNotification(successMessage, 'success');
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                showCustomNotification(err.message, 'error');
            } else {
                showCustomNotification('Something went wrong', 'error');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className={className}>
            {children}
            <button type="submit">{submitButtonText}</button>
        </form>
    );
}
