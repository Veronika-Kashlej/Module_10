import './Profile.css';
import { Header } from '../../components/Header/Header';
import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';

function Profile() {
    const { t } = useTranslation();
    return (
        <>
            <Header />
            <main className="profile-page">
                <div className="tabs-container">
                    <NavLink to={'/profile'} className={'tab'}>
                        {t('nav.profile')}
                    </NavLink>
                    <NavLink to={'/statistics'} className={'tab'}>
                        {t('nav.statistics')}
                    </NavLink>
                </div>
                <Outlet />
            </main>
        </>
    );
}

export default Profile;
