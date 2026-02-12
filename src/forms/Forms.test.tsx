import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Forms } from './Forms';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const mockStore = configureStore({
    reducer: {
        auth: (state = { user: null }) => state,
    },
});

jest.mock('../store/contexts/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

jest.mock('../store/contexts/NotificationContext', () => ({
    useCustomNotification: () => ({ showNotification: jest.fn() }),
    showCustomNotification: jest.fn(),
}));

jest.mock('../utils/api/api', () => ({
    postsAPI: {
        createPost: jest.fn(),
    },
    profileApi: {
        updateProfile: jest.fn(),
    },
}));

jest.mock('./components/Label/Label', () => ({
    Label: ({ title, htmlFor }: { title: string; htmlFor: string }) => (
        <label htmlFor={htmlFor}>{title}</label>
    ),
}));

jest.mock('./components/FileUploadInput/FileUploadInput', () => ({
    FileUploadInput: ({
        onFileSelect,
    }: {
        onFileSelect: (file: File) => void;
    }) => (
        <input
            type="file"
            data-testid="file-upload"
            onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelect(file);
            }}
        />
    ),
}));

jest.mock('../components/SectionItem/SectionItem', () => ({
    SectionItem: ({ title }: { title: string }) => (
        <div data-testid="section-item">{title}</div>
    ),
}));

jest.mock('../components/Icons/Icons', () => ({
    Icons: {
        EmailIcon: () => <span data-testid="email-icon"></span>,
        PasswordIcon: () => <span data-testid="password-icon"></span>,
        PencilIcon: () => <span data-testid="pencil-icon"></span>,
        UsernameIcon: () => <span data-testid="username-icon"></span>,
        InfoIcon: ({ isValid }: { isValid?: boolean }) => (
            <span data-testid="info-icon" data-valid={isValid}></span>
        ),
    },
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'actions.signIn': 'Sign In',
                'actions.signUp': 'Sign Up',
                'actions.addComment': 'Add a comment',
                'actions.create': 'Create',
                'actions.saveProfileChanges': 'Save Profile Changes',
                'actions.changePhoto': 'Change profile photo',
                'forms.addComment.placeholder': 'Write description here...',
                'forms.postTitle.placeholder': 'Enter post title',
                'forms.description.placeholder': 'Write description here...',
                'forms.description.validation.minLength':
                    'Description must be at least 10 characters if provided',
                'states.creating': 'Creating...',
                'states.adding': 'Adding...',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../utils/hooks/useAuth', () => ({
    useAuth: () => ({
        signIn: jest.fn(),
        signUp: jest.fn(),
    }),
}));

jest.mock('../store/contexts/UserContext', () => ({
    useUser: () => ({
        user: {
            username: 'testuser',
            email: 'test@example.com',
            firstName: 'John',
            secondName: 'Doe',
            profileImage: '',
            description: '',
        },
        refreshUser: jest.fn(),
    }),
    UserProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../utils/hooks/useShowError', () => ({
    useShowError: () => jest.fn(),
}));

jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => jest.fn(),
}));

jest.mock('../utils/hooks/useAppDispatch', () => ({
    useAppDispatch: () => jest.fn(),
}));

const AllProviders = ({ children }: { children: React.ReactNode }) => (
    <Provider store={mockStore}>
        <MemoryRouter>{children}</MemoryRouter>
    </Provider>
);

describe('Forms', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('AuthForm', () => {
        test('renders Sign In button', () => {
            render(
                <AllProviders>
                    <Forms.SignInForm />
                </AllProviders>
            );
            expect(screen.getByText('Sign In')).toBeInTheDocument();
        });

        test('renders Sign Up button', () => {
            render(
                <AllProviders>
                    <Forms.SignUpForm />
                </AllProviders>
            );
            expect(screen.getByText('Sign Up')).toBeInTheDocument();
        });
    });

    describe('AddCommentForm', () => {
        test('adds comment', async () => {
            const mockOnAddComment = jest.fn();

            await act(async () => {
                render(
                    <AllProviders>
                        <Forms.AddCommentForm
                            postId={1}
                            onAddComment={mockOnAddComment}
                        />
                    </AllProviders>
                );
            });

            const textarea = screen.getByPlaceholderText(
                'Write description here...'
            );

            await act(async () => {
                fireEvent.change(textarea, { target: { value: 'Test' } });
            });

            const button = screen.getByRole('button', {
                name: 'Add a comment',
            });

            await act(async () => {
                fireEvent.click(button);
            });

            expect(mockOnAddComment).toHaveBeenCalledWith('Test');
        });
    });

    describe('CreatePostForm', () => {
        test('renders form elements', () => {
            render(
                <AllProviders>
                    <Forms.CreatePostForm
                        onAddPost={jest.fn()}
                        onClose={jest.fn()}
                    />
                </AllProviders>
            );

            expect(
                screen.getByPlaceholderText('Enter post title')
            ).toBeInTheDocument();
            expect(
                screen.getByPlaceholderText('Write description here...')
            ).toBeInTheDocument();
            expect(screen.getByTestId('file-upload')).toBeInTheDocument();
            expect(screen.getByText('Create')).toBeInTheDocument();
        });

        test('handles file selection', async () => {
            render(
                <AllProviders>
                    <Forms.CreatePostForm
                        onAddPost={jest.fn()}
                        onClose={jest.fn()}
                    />
                </AllProviders>
            );

            const fileInput = screen.getByTestId('file-upload');
            const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

            await act(async () => {
                fireEvent.change(fileInput, { target: { files: [file] } });
            });

            expect(fileInput).toBeInTheDocument();
        });
    });

    describe('EditProfileForm', () => {
        test('renders save button', () => {
            render(
                <AllProviders>
                    <Forms.EditProfileForm />
                </AllProviders>
            );

            expect(
                screen.getByText('Save Profile Changes')
            ).toBeInTheDocument();
        });

        test('renders user info', () => {
            render(
                <AllProviders>
                    <Forms.EditProfileForm />
                </AllProviders>
            );

            expect(screen.getByTestId('section-item')).toHaveTextContent(
                'John Doe'
            );
        });
    });
});
