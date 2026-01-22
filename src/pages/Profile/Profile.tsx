import { useEffect, useState } from 'react';
import './Profile.css';
import { ProfileInfo } from './components/ProfileInfo/ProfileInfo';
import { Statistics } from './components/Statistics/Statistics';
import { Header } from '../../components/Header/Header';
import { useNavigate, useParams } from 'react-router';
const tabs = [
    {
        id: 0,
        label: 'Profile info',
        content: <ProfileInfo />,
        slug: 'profile',
    },
    {
        id: 1,
        label: 'Statistics',
        content: <Statistics />,
        slug: 'statistics',
    },
];

function Profile() {
    const { tab: tabParam } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    useEffect(() => {
        if (tabParam) {
            const tabIndex = tabs.findIndex((tab) => tab.slug === tabParam);
            if (tabIndex !== -1) {
                setActiveTab(tabIndex);
            }
        }
    }, [tabParam]);

    const handleTabChange = (tabId: number) => {
        setActiveTab(tabId);
        navigate(`/profile/${tabs[tabId].slug}`);
    };

    return (
        <>
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
        </>
    );
}

export default Profile;
