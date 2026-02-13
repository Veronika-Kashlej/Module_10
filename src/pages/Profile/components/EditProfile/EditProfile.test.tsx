import { render, screen } from '@testing-library/react';
import { EditProfile } from './EditProfile';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'pages.profile.editProfile.title': 'Edit Profile',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../../../../forms/Forms', () => ({
    Forms: {
        EditProfileForm: () => (
            <div data-testid="edit-profile-form">Edit Profile Form</div>
        ),
    },
}));

describe('EditProfile Component', () => {
    test('renders EditProfile section with title', () => {
        render(<EditProfile />);

        expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });

    test('renders EditProfileForm component', () => {
        render(<EditProfile />);

        expect(screen.getByTestId('edit-profile-form')).toBeInTheDocument();
    });

    test('has correct ARIA attributes', () => {
        render(<EditProfile />);

        const section = screen.getByRole('tabpanel');
        expect(section).toHaveAttribute('aria-labelledby', 'tab1');
        expect(section).toHaveClass('edit-profile-section');
    });
});
