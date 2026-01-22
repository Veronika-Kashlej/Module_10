import { useCallback, useState } from 'react';
import './Header.css';
import { useAuth } from '../../store/contexts/AuthContext';
import { Link } from 'react-router';
import { Icons } from '../Icons/Icons';

export function Header() {
    const { isAuthenticated, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                                    <Link to={'/sign-up'}>Sign Up</Link>
                                </li>
                                <li>
                                    <Link to={'/sign-in'}>Sign In</Link>
                                </li>
                            </ul>
                        </nav>
                    )}
                    {isAuthenticated && (
                        <Link className="profile-info" to={'/profile'}>
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
                            <Link to={'/profile/profile'}>Profile info</Link>
                        </li>
                        <li>
                            <Link to={'/profile/statistics'}>Statistics</Link>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <Link to={'/sign-up'}>Sign Up</Link>
                        </li>
                        <li>
                            <Link to={'/sign-in'}>Sign In</Link>
                        </li>
                    </ul>
                )}
            </nav>
        </>
    );
}
