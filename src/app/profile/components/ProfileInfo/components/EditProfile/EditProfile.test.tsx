import { render, screen } from '@testing-library/react';
import { EditProfile } from './EditProfile';

jest.mock('../../../../../../components/Forms/Forms', () => ({
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
});
