import { Link } from 'react-router';
import { Icons } from '../Icons/Icons';
import './SimpleHeader.css';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

export function SimpleHeader() {
    return (
        <header className="header">
            <div className="header-content">
                <Link to={'/'}>
                    <Icons.SidekickLogo />
                </Link>
                <LanguageSwitcher />
            </div>
        </header>
    );
}
