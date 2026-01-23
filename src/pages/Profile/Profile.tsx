import './Profile.css';
import { Header } from '../../components/Header/Header';
import { NavLink, Outlet } from 'react-router';

function Profile() {
    return (
        <>
            <Header />
            <main className="profile-page">
                <div className="tabs-container">
                    <NavLink to={'/profile'} className={'tab'}>
                        Profile Info
                    </NavLink>
                    <NavLink to={'/statistics'} className={'tab'}>
                        Statistics
                    </NavLink>
                </div>
                <Outlet />
            </main>
        </>
    );
}

export default Profile;
