import {
    render,
    screen,
    fireEvent,
    act,
    waitFor,
} from '@testing-library/react';
import { CreatePostSection } from './CreatePostSection';
import { User } from '../../../../store/types';

jest.mock('../../../../store/contexts/UserContext', () => ({
    useUser: jest.fn(),
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string): string => {
            const translations: Record<string, string> = {
                'pages.home.createPost.title': "What's happening?",
                'actions.share': 'Tell everyone',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('../../../../components/Loader/Loader', () => ({
    Loader: () => <div data-testid="loader">Loading...</div>,
}));

const mockCreatePostModal = ({
    onClose,
    onAddPost,
}: {
    onClose: () => void;
    onAddPost: () => void;
}) => (
    <div data-testid="create-post-modal">
        <button onClick={onClose} data-testid="close-modal-btn">
            Close Modal
        </button>
        <button onClick={onAddPost} data-testid="submit-post-btn">
            Submit Post
        </button>
    </div>
);

jest.mock('../CreatePostModal/CreatePostModal', () => ({
    __esModule: true,
    default: mockCreatePostModal,
}));

import { useUser } from '../../../../store/contexts/UserContext';

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('CreatePostSection Component', () => {
    const mockOnAddPost = jest.fn();

    const mockUser: User = {
        id: 1,
        firstName: 'John',
        secondName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        profileImage: 'test-image.jpg',
        description: 'Test description',
        creationDate: '2023-01-01T00:00:00.000Z',
        lastLogin: '',
        modifiedDate: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockOnAddPost.mockClear();

        mockUseUser.mockReturnValue({
            user: mockUser,
            refreshUser: jest.fn(),
            isLoading: false,
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders user profile image and prompt text', () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        const profileImage = screen.getByAltText('avatar');
        expect(profileImage).toBeInTheDocument();
        expect(profileImage).toHaveAttribute('src', 'test-image.jpg');
        expect(profileImage).toHaveClass('create-post-image');

        expect(screen.getByText("What's happening?")).toBeInTheDocument();
        expect(screen.getByText('Tell everyone')).toBeInTheDocument();
    });

    test('opens modal when button is clicked', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        expect(
            screen.queryByTestId('create-post-modal')
        ).not.toBeInTheDocument();

        const shareButton = screen.getByText('Tell everyone');

        await act(async () => {
            fireEvent.click(shareButton);
        });

        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();
    });

    test('closes modal when close function is called', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        const shareButton = screen.getByText('Tell everyone');

        await act(async () => {
            fireEvent.click(shareButton);
        });

        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();

        const closeButton = screen.getByTestId('close-modal-btn');

        await act(async () => {
            fireEvent.click(closeButton);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('create-post-modal')
            ).not.toBeInTheDocument();
        });
    });

    test('calls onAddPost when post is submitted', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        const shareButton = screen.getByText('Tell everyone');

        await act(async () => {
            fireEvent.click(shareButton);
        });

        const submitButton = screen.getByTestId('submit-post-btn');

        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(mockOnAddPost).toHaveBeenCalledTimes(1);
    });

    test('modal does not render when isModalOpen is false', () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        expect(
            screen.queryByTestId('create-post-modal')
        ).not.toBeInTheDocument();
        expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    });

    test('button has correct onClick handler', () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        const shareButton = screen.getByText('Tell everyone');

        fireEvent.click(shareButton);

        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();
    });

    test('section has correct CSS class', () => {
        const { container } = render(
            <CreatePostSection onAddPost={mockOnAddPost} />
        );

        const section = container.querySelector('.create-post-section');
        expect(section).toBeInTheDocument();
    });

    test('renders user info correctly', () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        const profileImage = screen.getByAltText('avatar');
        expect(profileImage).toHaveAttribute('src', mockUser.profileImage);

        const promptText = screen.getByText("What's happening?");
        expect(promptText).toBeInTheDocument();
    });

    test('calls openCreatePostModal when button is clicked', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        expect(
            screen.queryByTestId('create-post-modal')
        ).not.toBeInTheDocument();

        const shareButton = screen.getByText('Tell everyone');

        await act(async () => {
            fireEvent.click(shareButton);
        });

        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();
    });

    test('calls closeCreatePostModal when modal close button is clicked', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        const shareButton = screen.getByText('Tell everyone');

        await act(async () => {
            fireEvent.click(shareButton);
        });

        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();

        const closeButton = screen.getByTestId('close-modal-btn');

        await act(async () => {
            fireEvent.click(closeButton);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('create-post-modal')
            ).not.toBeInTheDocument();
        });
    });

    test('handles multiple modal opens and closes', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        for (let i = 0; i < 3; i++) {
            const shareButton = screen.getByText('Tell everyone');

            await act(async () => {
                fireEvent.click(shareButton);
            });

            expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();

            const closeButton = screen.getByTestId('close-modal-btn');

            await act(async () => {
                fireEvent.click(closeButton);
            });

            await waitFor(() => {
                expect(
                    screen.queryByTestId('create-post-modal')
                ).not.toBeInTheDocument();
            });
        }
    });
});
