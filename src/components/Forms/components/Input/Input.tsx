import { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    value?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, value, ...props }, ref) => {
        const [inputValue, setInputValue] = useState(value || '');

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(event.target.value);
        };

        return (
            <input
                className={className}
                onChange={handleChange}
                value={inputValue}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';
