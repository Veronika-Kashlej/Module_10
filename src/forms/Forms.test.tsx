import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ReactNode } from 'react';
import { Forms } from './Forms';

jest.mock('../../store/contexts/AuthContext', () => ({
    useAuth: () => ({
        signIn: jest.fn(),
        signUp: jest.fn(),
        refreshUser: jest.fn(),
        user: {
            firstName: 'John',
            secondName: 'Doe',
            username: 'johndoe',
            email: 'john@example.com',
            description: 'Test description',
            profileImage: 'test.jpg',
        },
    }),
}));

jest.mock('../../store/contexts/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light', toggleTheme: jest.fn() }),
}));

jest.mock('../../store/contexts/NotificationContext', () => ({
    useCustomNotification: () => ({ showNotification: jest.fn() }),
}));

jest.mock('../../store/api/api', () => ({
    postsAPI: {
        createPost: jest.fn(),
    },
    profileApi: {
        updateProfile: jest.fn(),
    },
}));

jest.mock('./components/BaseForm/BaseForm', () => ({
    BaseForm: ({
        children,
        submitButtonText,
    }: {
        children: ReactNode;
        submitButtonText: string;
    }) => (
        <div>
            {children}
            <button>{submitButtonText}</button>
        </div>
    ),
}));

interface MockInputProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    [key: string]: unknown;
}

jest.mock('./components/Input/Input', () => ({
    Input: (props: MockInputProps) => {
        const { value, defaultValue, ...restProps } = props;
        return (
            <input {...restProps} defaultValue={value || defaultValue || ''} />
        );
    },
}));

jest.mock('./components/TextArea/TextArea', () => ({
    TextArea: (props: MockInputProps) => {
        const { value, defaultValue, ...restProps } = props;
        return (
            <textarea
                {...restProps}
                defaultValue={value || defaultValue || ''}
            />
        );
    },
}));

jest.mock('./components/Label/Label', () => ({
    Label: ({ title, htmlFor }: { title: string; htmlFor: string }) => (
        <label htmlFor={htmlFor}>{title}</label>
    ),
}));

jest.mock('./components/FileUploadInput/FileUploadInput', () => ({
    FileUploadInput: () => <input type="file" data-testid="file-upload" />,
}));

jest.mock('../SectionItem/SectionItem', () => ({
    SectionItem: () => <div data-testid="section-item">Section Item</div>,
}));

jest.mock('../Icons/Icons', () => ({
    Icons: {
        EmailIcon: () => <span data-testid="email-icon">📧</span>,
        PasswordIcon: () => <span data-testid="password-icon">🔒</span>,
        PencilIcon: () => <span data-testid="pencil-icon">✏️</span>,
        UsernameIcon: () => <span data-testid="username-icon">👤</span>,
        InfoIcon: () => <span data-testid="info-icon">ℹ️</span>,
    },
}));

jest.mock('react-router', () => {
    const actual = jest.requireActual('react-router');
    return {
        ...actual,
        useNavigate: () => jest.fn(),
    };
});

describe('Forms', () => {
    describe('AuthForm', () => {
        test('SignInForm shows correct button text', () => {
            render(
                <MemoryRouter>
                    <Forms.SignInForm />
                </MemoryRouter>
            );
            expect(screen.getByText('Sign In')).toBeInTheDocument();
        });

        test('SignUpForm shows correct button text', () => {
            render(
                <MemoryRouter>
                    <Forms.SignUpForm />
                </MemoryRouter>
            );
            expect(screen.getByText('Sign Up')).toBeInTheDocument();
        });
    });

    describe('AddCommentForm', () => {
        test('allows typing comment', () => {
            const mockOnAddComment = jest.fn();
            render(
                <Forms.AddCommentForm
                    postId={1}
                    onAddComment={mockOnAddComment}
                />
            );

            const textarea = screen.getByPlaceholderText(
                'Write description here...'
            );
            fireEvent.change(textarea, { target: { value: 'Test comment' } });

            expect(textarea).toHaveValue('Test comment');
        });

        test('calls onAddComment when button is clicked', () => {
            const mockOnAddComment = jest.fn();
            render(
                <Forms.AddCommentForm
                    postId={1}
                    onAddComment={mockOnAddComment}
                />
            );

            const textarea = screen.getByPlaceholderText(
                'Write description here...'
            );
            const button = screen.getByRole('button', {
                name: /add a comment/i,
            });

            fireEvent.change(textarea, { target: { value: 'Test comment' } });
            fireEvent.click(button);

            expect(mockOnAddComment).toHaveBeenCalledWith('Test comment');
        });

        test('clears textarea after submitting comment', () => {
            const mockOnAddComment = jest.fn();
            render(
                <Forms.AddCommentForm
                    postId={1}
                    onAddComment={mockOnAddComment}
                />
            );

            const textarea = screen.getByPlaceholderText(
                'Write description here...'
            );
            const button = screen.getByRole('button', {
                name: /add a comment/i,
            });

            fireEvent.change(textarea, { target: { value: 'Test comment' } });
            fireEvent.click(button);

            expect(textarea).toHaveValue('');
        });
    });

    describe('CreatePostForm', () => {
        test('renders create button', () => {
            const mockOnAddPost = jest.fn();
            const mockOnClose = jest.fn();

            render(
                <Forms.CreatePostForm
                    onAddPost={mockOnAddPost}
                    onClose={mockOnClose}
                />
            );

            expect(screen.getByText('Create')).toBeInTheDocument();
        });

        test('renders form fields', () => {
            const mockOnAddPost = jest.fn();
            const mockOnClose = jest.fn();

            render(
                <Forms.CreatePostForm
                    onAddPost={mockOnAddPost}
                    onClose={mockOnClose}
                />
            );

            expect(
                screen.getByPlaceholderText('Enter post title')
            ).toBeInTheDocument();
            expect(
                screen.getByPlaceholderText('Write description here...')
            ).toBeInTheDocument();
            expect(screen.getByTestId('file-upload')).toBeInTheDocument();
        });
    });

    describe('EditProfileForm', () => {
        test('renders save button', () => {
            render(<Forms.EditProfileForm />);
            expect(
                screen.getByText('Save Profile Changes')
            ).toBeInTheDocument();
        });

        test('renders section item', () => {
            render(<Forms.EditProfileForm />);
            expect(screen.getByTestId('section-item')).toBeInTheDocument();
        });
    });
});
