'use client';
import { useCallback, useEffect, useState } from 'react';
import './Header.css';
import { useAuth } from '../../store/contexts/AuthContext';
import { Icons } from '../Icons/Icons';
import Link from 'next/link';
import Image from 'next/image';

export function Header() {
    const { isAuthenticated, user } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
    }, []);

    const openMenu = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(true);
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isMenuOpen) {
                const target = e.target as HTMLElement;
                const isBurger = target.closest('.burger');
                const isMenu = target.closest('.mobile-menu');

                if (!isBurger && !isMenu) {
                    closeMenu();
                }
            }
        };

        if (isMenuOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen, closeMenu]);

    return (
        <>
            {isMenuOpen && <div className="menu-overlay" />}
            <header className={`header ${isMenuOpen ? 'open' : ''}`}>
                <div className="header-content">
                    <Link href={'/'} aria-label="to home">
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
                                    <Link href={'/sign-up'}>Sign Up</Link>
                                </li>
                                <li>
                                    <Link href={'/sign-in'}>Sign In</Link>
                                </li>
                            </ul>
                        </nav>
                    )}
                    {isAuthenticated && (
                        <Link className="profile-info" href={'/profile'}>
                            <Image
                                className="profile-image"
                                src={user!.profileImage}
                                width={24}
                                height={24}
                                alt="profile"
                            ></Image>
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
                            <Link href={'/profile'}>Profile info</Link>
                        </li>
                        <li>
                            <Link href={'/profile'}>Statistics</Link>
                        </li>
                    </ul>
                ) : (
                    <ul>
                        <li>
                            <Link href={'/sign-up'}>Sign Up</Link>
                        </li>
                        <li>
                            <Link href={'/sign-in'}>Sign In</Link>
                        </li>
                    </ul>
                )}
            </nav>
        </>
    );
}
