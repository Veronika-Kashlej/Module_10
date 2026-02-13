import { useCallback, useState } from 'react';
import './Header.css';
import { useUser } from '../../store/contexts/UserContext';
import { Link } from 'react-router';
import { Icons } from '../Icons/Icons';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../utils/hooks/useAuth';

export function Header() {
    const { isAuthenticated } = useAuth();
    const { user } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
        document.body.removeEventListener('click', closeMenu);
    }, []);

    const openMenu = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            setIsMenuOpen(true);
            window.scrollTo(0, 0);
            document.body.style.overflow = 'hidden';
            document.body.addEventListener('click', closeMenu);
        },
        [closeMenu]
    );

    return (
        <>
            {isMenuOpen && <div className="menu-overlay" />}
            <header className={`header ${isMenuOpen ? 'open' : ''}`}>
                <div className="header-content">
                    <Link to={'/'}>
                        <Icons.SidekickLogo />
                    </Link>
                    <LanguageSwitcher />
                    <div
                        className={`burger ${isMenuOpen ? 'open' : ''}`}
                        onClick={openMenu}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    {!isAuthenticated && (
                        <nav className="desktop-menu">
                            <ul>
                                <li>
                                    <Link to={'/sign-up'}>
                                        {t('actions.signUp')}
                                    </Link>
                                </li>
                                <li>
                                    <Link to={'/sign-in'}>
                                        {t('actions.signIn')}
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    )}
                    {isAuthenticated && (
                        <Link className="profile-info" to={'/profile/profile'}>
                            <img
                                className="profile-image"
                                src={user?.profileImage}
                                alt="profile"
                            ></img>
                            <p className="user-name">
                                {user?.firstName} {user?.secondName}
                            </p>
                        </Link>
                    )}
                </div>
            </header>
            <nav className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                {isAuthenticated ? (
                    <ul>
                        <li>
                            <Link to={'/profile'}>{t('nav.profile')}</Link>
                        </li>
                        <li>
                            <Link to={'/statistics'}>
                                {t('nav.statistics')}
                            </Link>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <Link to={'/sign-up'}>{t('actions.signUp')}</Link>
                        </li>
                        <li>
                            <Link to={'/sign-in'}>{t('actions.signIn')}</Link>
                        </li>
                    </ul>
                )}
            </nav>
        </>
    );
}
