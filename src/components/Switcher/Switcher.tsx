import { useState } from 'react';
import './Switcher.css';

interface SwitcherProps {
    onClick: () => void;
}

export function Switcher({ onClick }: SwitcherProps) {
    const [isActive, setIsActive] = useState(false);

    const handleSwitch = () => {
        setIsActive(!isActive);
        onClick();
    };

    return (
        <button onClick={handleSwitch} className="switcher">
            <div className={`circle ${isActive ? 'active' : ''}`}></div>
        </button>
    );
}
