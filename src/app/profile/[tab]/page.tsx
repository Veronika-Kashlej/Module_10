'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PrivateRoute } from '@/components/PrivateRoute/PrivateRoute';
import { ProfileInfo } from '../components/ProfileInfo/ProfileInfo';
import { Statistics } from '../components/Statistics/Statistics';
import { Header } from '@/components/Header/Header';
import './Profile.css';
const tabs = [
    {
        id: 0,
        slug: 'profile',
        label: 'Profile info',
        content: <ProfileInfo />,
    },
    {
        id: 1,
        slug: 'statistics',
        label: 'Statistics',
        content: <Statistics />,
    },
];

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (params.tab) {
            const tabIndex = tabs.findIndex((tab) => tab.slug === params.tab);
            if (tabIndex !== -1) {
                setActiveTab(tabIndex);
            }
        }
    }, [params.tab]);

    const handleTabChange = (tabId: number) => {
        setActiveTab(tabId);
        router.push(`/profile/${tabs[tabId].slug}`, { scroll: false });
    };

    return (
        <PrivateRoute>
            <Header />
            <main className="profile-page">
                <div className="tabs-container">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabChange(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </main>
        </PrivateRoute>
    );
}
