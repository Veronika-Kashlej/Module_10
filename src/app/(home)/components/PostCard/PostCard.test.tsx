import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { PostCard } from './PostCard';
import { useAuth } from '../../../../store/contexts/AuthContext';
import { postsAPI } from '../../../../store/api/api';
import { LikedPost } from '../../../../store/types';
import Image from 'next/image';
jest.mock('@/store/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('@/store/api/api', () => ({
    postsAPI: {
        getUser: jest.fn(),
    },
}));

jest.mock('@/components/SectionItem/SectionItem', () => ({
    SectionItem: ({ title, subtitle, image }: any) => (
        <div data-testid="section-item">
            <div data-testid="section-title">{title}</div>
            <div data-testid="section-subtitle">{subtitle}</div>
            <Image src={image} alt="section" data-testid="section-image" />
        </div>
    ),
}));

jest.mock('./components/Comments/Comments', () => ({
    Comments: ({ areVisibleComments, onChangeCommentsCount }: any) => (
        <div data-testid="comments-component">
            <div data-testid="comments-visible">
                {areVisibleComments.toString()}
            </div>
            <button onClick={() => onChangeCommentsCount(5)}>
                Change Count
            </button>
        </div>
    ),
}));

jest.mock('./components/Likes/LikesSection', () => ({
    LikesSection: () => <div data-testid="likes-section">Likes Section</div>,
}));

jest.mock('./components/PostDescription/PostDescription', () => ({
    PostDescription: ({ content }: any) => (
        <div data-testid="post-description">{content}</div>
    ),
}));

jest.mock(
    '@/components/Skeletons/SectionItemSkeleton/SectionItemSkeleton',
    () => ({
        SectionItemSkeleton: () => <div data-testid="skeleton">Loading...</div>,
    })
);

jest.mock('@/components/Icons/Icons', () => ({
    Icons: {
        MessageIcon: () => <div data-testid="message-icon">💬</div>,
        ShowCommentIcon: ({ areVisibleComments, onClick }: any) => (
            <button
                data-testid="show-comment-icon"
                onClick={onClick}
                data-visible={areVisibleComments}
            >
                {areVisibleComments ? 'visible' : 'unvisible'}
            </button>
        ),
    },
}));

jest.mock('@/store/utils/formatCreationDate', () => ({
    formatCreationDate: (date: string) => `Formatted: ${date}`,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockPostsAPI = postsAPI as jest.Mocked<typeof postsAPI>;

describe('PostCard Component', () => {
    const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content for the post',
        likedByUsers: [],
        comments: [],
        image: 'test-image.jpg',
        creationDate: '2023-01-01T00:00:00.000Z',
        authorId: 1,
        author: { id: 1, username: 'author1' },
        commentsCount: 3,
    } as any;

    const mockLikedPosts: LikedPost[] = [];
    const mockAuthor = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        profileImage: 'author-image.jpg',
        description: '',
        creationDate: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            user: { id: 1 },
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            refreshUser: jest.fn(),
            getCurrentUser: jest.fn(),
            isLoading: false,
        } as any);
    });

    test('renders post content after loading', async () => {
        mockPostsAPI.getUser.mockResolvedValue({ data: mockAuthor } as any);

        await act(async () => {
            render(<PostCard post={mockPost} likedPosts={mockLikedPosts} />);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('section-title')).toHaveTextContent('John');
        expect(screen.getByTestId('section-image')).toHaveAttribute(
            'src',
            'author-image.jpg'
        );
        expect(screen.getByTestId('post-description')).toHaveTextContent(
            'Test content for the post'
        );

        const postImage = screen.getByAltText('post-image');
        expect(postImage).toHaveAttribute('src', 'test-image.jpg');
    });

    test('renders post without image', async () => {
        const postWithoutImage = { ...mockPost, image: '' };
        mockPostsAPI.getUser.mockResolvedValue({ data: mockAuthor } as any);

        await act(async () => {
            render(
                <PostCard post={postWithoutImage} likedPosts={mockLikedPosts} />
            );
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.queryByAltText('post-image')).not.toBeInTheDocument();
    });

    test('toggles comments visibility when authenticated', async () => {
        mockPostsAPI.getUser.mockResolvedValue({ data: mockAuthor } as any);

        await act(async () => {
            render(<PostCard post={mockPost} likedPosts={mockLikedPosts} />);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        const showCommentIcon = screen.getByTestId('show-comment-icon');
        expect(showCommentIcon).toHaveAttribute('data-visible', 'false');

        await act(async () => {
            fireEvent.click(showCommentIcon);
        });

        expect(showCommentIcon).toHaveAttribute('data-visible', 'true');
    });

    test('shows comments count for authenticated user', async () => {
        mockPostsAPI.getUser.mockResolvedValue({ data: mockAuthor } as any);

        await act(async () => {
            render(<PostCard post={mockPost} likedPosts={mockLikedPosts} />);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByText('4 comments')).toBeInTheDocument();
        expect(screen.getByTestId('message-icon')).toBeInTheDocument();
    });

    test('shows login message for unauthenticated user', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            refreshUser: jest.fn(),
            getCurrentUser: jest.fn(),
            isLoading: false,
        } as any);

        mockPostsAPI.getUser.mockResolvedValue({ data: mockAuthor } as any);

        await act(async () => {
            render(<PostCard post={mockPost} likedPosts={mockLikedPosts} />);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(
            screen.getByText('You have to login to see the comments')
        ).toBeInTheDocument();
        expect(
            screen.queryByTestId('show-comment-icon')
        ).not.toBeInTheDocument();
        expect(screen.queryByText('4 comments')).not.toBeInTheDocument();
    });

    test('does not render comments component for unauthenticated user', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            refreshUser: jest.fn(),
            getCurrentUser: jest.fn(),
            isLoading: false,
        } as any);

        mockPostsAPI.getUser.mockResolvedValue({ data: mockAuthor } as any);

        await act(async () => {
            render(<PostCard post={mockPost} likedPosts={mockLikedPosts} />);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(
            screen.queryByTestId('comments-component')
        ).not.toBeInTheDocument();
    });

    test('updates comments count when Comments component calls onChange', async () => {
        mockPostsAPI.getUser.mockResolvedValue({ data: mockAuthor } as any);

        await act(async () => {
            render(<PostCard post={mockPost} likedPosts={mockLikedPosts} />);
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByText('4 comments')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByText('Change Count'));
        });

        expect(screen.getByText('5 comments')).toBeInTheDocument();
    });

    test('handles author fetch error', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        mockPostsAPI.getUser.mockRejectedValue(
            new Error('Failed to fetch author')
        );

        await act(async () => {
            render(<PostCard post={mockPost} likedPosts={mockLikedPosts} />);
        });

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('section-item')).toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });
});
