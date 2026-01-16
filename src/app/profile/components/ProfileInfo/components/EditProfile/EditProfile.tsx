import { Forms } from '../../../../../../components/Forms/Forms';
import './EditProfile.css';

export function EditProfile() {
    return (
        <section
            className="edit-profile-section"
            role="tabpanel"
            aria-label="edit profile"
        >
            <h3>Edit Profile</h3>
            <Forms.EditProfileForm />
        </section>
    );
}
