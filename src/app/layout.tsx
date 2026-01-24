import { Inter, Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import './global.css';

const inter = Inter({
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
    variable: '--font-inter',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    preload: true,
});

const poppins = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    preload: false,
});

export const metadata: Metadata = {
    title: 'Sidekick',
    description:
        'Connect with friends, share posts, and join communities on Sidekick social network.',
    keywords: ['social network', 'community', 'posts', 'friends', 'connect'],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body>
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}
