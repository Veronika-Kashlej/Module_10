import { Forms } from '../../../../../../components/Forms/Forms';
import './EditProfile.css';

export function EditProfile() {
    return (
        <section className="edit-profile-section" role="tabpanel">
            <h3>Edit Profile</h3>
            <Forms.EditProfileForm />
        </section>
    );
}
