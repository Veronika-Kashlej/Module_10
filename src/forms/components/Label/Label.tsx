import { ReactNode } from 'react';

interface LabelProps {
    htmlFor: string;
    className?: string;
    title: string;
    icon: ReactNode;
}

export function Label({ htmlFor, className, title, icon }: LabelProps) {
    return (
        <label className={className} htmlFor={htmlFor}>
            <>{icon}</>
            <span>{title}</span>
        </label>
    );
}
