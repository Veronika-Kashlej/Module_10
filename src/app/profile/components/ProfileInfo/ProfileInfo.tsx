import { Actions } from '../Actions/Actions';
import { EditProfile } from '../EditProfile/EditProfile';
import { Preferences } from '../Preferences/Preferences';

export function ProfileInfo() {
    return (
        <section className="tab-profile-info" aria-label="profile info">
            <EditProfile />
            <div>
                <Preferences />
                <Actions />
            </div>
        </section>
    );
}
