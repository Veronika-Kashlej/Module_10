import { Forms } from '../../../../forms/Forms';
import './EditProfile.css';

export function EditProfile() {
    return (
        <section className="edit-profile-section" role="tabpanel">
            <h3>Edit Profile</h3>
            <Forms.EditProfileForm />
        </section>
    );
}
