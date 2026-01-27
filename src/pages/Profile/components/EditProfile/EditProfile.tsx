import { Forms } from '../../../../forms/Forms';
import './EditProfile.css';
import { useTranslation } from 'react-i18next';

export function EditProfile() {
    const { t } = useTranslation();

    return (
        <section className="edit-profile-section" role="tabpanel">
            <h3>{t('pages.profile.editProfile.title')}</h3>
            <Forms.EditProfileForm />
        </section>
    );
}
