import { forwardRef, useState } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string;
    value?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, value, ...props }, ref) => {
        const [textAreaValue, setTextAreaValue] = useState(value || '');

        const handleChange = (
            event: React.ChangeEvent<HTMLTextAreaElement>
        ) => {
            setTextAreaValue(event.target.value);
        };

        return (
            <textarea
                className={className}
                onChange={handleChange}
                value={textAreaValue}
                ref={ref}
                {...props}
            />
        );
    }
);

TextArea.displayName = 'TextArea';
