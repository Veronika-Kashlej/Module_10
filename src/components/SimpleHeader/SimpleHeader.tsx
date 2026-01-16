import Link from 'next/link';
import './SimpleHeader.css';
import { SidekickLogo } from '@/components/Icons/Icons';

export function SimpleHeader() {
    return (
        <header className="header">
            <div className="header-content">
                <Link href={'/'}>
                    <SidekickLogo />
                </Link>
            </div>
        </header>
    );
}
