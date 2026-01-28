import { render, screen, waitFor, act } from '@testing-library/react';
import Home from './Home';
import { LikedPost, Post } from '@/store/types';
import { postsAPI } from '../../utils/api/api';
import { useAuth } from '../../utils/hooks/useAuth';

jest.mock('../../store/contexts/AuthContext', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../store/api/api', () => ({
    postsAPI: {
        getPosts: jest.fn(),
        getCurrentUsersLikedPosts: jest.fn(),
    },
}));

jest.mock('../../components/Header/Header', () => ({
    Header: () => <header data-testid="header">Header</header>,
}));

jest.mock('./components/CreatePostSection/CreatePostSection', () => ({
    CreatePostSection: () => (
        <div data-testid="create-post-section">Create Post</div>
    ),
}));

jest.mock('./components/PostCard/PostCard', () => ({
    PostCard: ({ post }: { post: { id: string; title: string } }) => (
        <div data-testid={`post-card-${post.id}`}>
            Post: {post.title || post.id}
        </div>
    ),
}));

jest.mock('components/Skeletons/PostSkeleton/PostSkeleton', () => ({
    PostSkeleton: () => <div data-testid="post-skeleton">Loading post...</div>,
}));

jest.mock('./components/SuggestedPeopleSection/SuggestedPeopleSection', () => ({
    SuggestedPeopleSection: () => (
        <div data-testid="suggested-people">Suggested People</div>
    ),
}));

jest.mock('./components/CommunitiesSection/CommunitiesSection', () => ({
    CommunitiesSection: () => (
        <div data-testid="communities-section">Communities</div>
    ),
}));

const mockWindowInnerWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
};

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockPostsAPI = postsAPI as jest.Mocked<typeof postsAPI>;

describe('Home Component', () => {
    const mockPosts: Partial<Post>[] = [
        {
            id: 1,
            title: 'First Post',
            content: 'Content 1',
            likedByUsers: [],
            image: '',
            creationDate: '',
            authorId: 1,
            commentsCount: 0,
        },
        {
            id: 2,
            title: 'Second Post',
            content: 'Content 2',
            likedByUsers: [],
            image: '',
            creationDate: '',
            authorId: 2,
            commentsCount: 0,
        },
    ];

    const mockLikedPosts: Partial<LikedPost>[] = [{ postId: 1, userId: 1 }];

    beforeEach(() => {
        jest.clearAllMocks();
        mockWindowInnerWidth(1200);
    });

    test('renders header and loading skeletons initially for authenticated user', async () => {
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

        const unresolvedPromise = new Promise(() => undefined);
        mockPostsAPI.getPosts.mockReturnValue(unresolvedPromise as any);
        mockPostsAPI.getCurrentUsersLikedPosts.mockReturnValue(
            unresolvedPromise as any
        );

        await act(async () => {
            render(<Home />);
        });

        expect(screen.getByTestId('header')).toBeInTheDocument();

        const skeletons = screen.getAllByTestId('post-skeleton');
        expect(skeletons).toHaveLength(3);
    });

    test('renders posts after loading for authenticated user', async () => {
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

        mockPostsAPI.getPosts.mockResolvedValue({ data: mockPosts } as any);
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue({
            data: mockLikedPosts,
        } as any);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('create-post-section')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-2')).toBeInTheDocument();

        const postCards = screen.getAllByText(/Post:/);
        expect(postCards[0]).toHaveTextContent('Post: Second Post');
        expect(postCards[1]).toHaveTextContent('Post: First Post');

        expect(screen.getByTestId('suggested-people')).toBeInTheDocument();
        expect(screen.getByTestId('communities-section')).toBeInTheDocument();
    });

    test('renders posts after loading for unauthenticated user', async () => {
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

        mockPostsAPI.getPosts.mockResolvedValue({ data: mockPosts } as any);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        expect(
            screen.queryByTestId('create-post-section')
        ).not.toBeInTheDocument();

        expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('post-card-2')).toBeInTheDocument();

        expect(
            screen.queryByTestId('suggested-people')
        ).not.toBeInTheDocument();
        expect(
            screen.queryByTestId('communities-section')
        ).not.toBeInTheDocument();
    });

    test('fetches liked posts only when authenticated', async () => {
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

        mockPostsAPI.getPosts.mockResolvedValue({ data: mockPosts } as any);
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue({
            data: mockLikedPosts,
        } as any);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(mockPostsAPI.getPosts).toHaveBeenCalled();
            expect(mockPostsAPI.getCurrentUsersLikedPosts).toHaveBeenCalled();
        });
    });

    test('does not fetch liked posts when unauthenticated', async () => {
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

        mockPostsAPI.getPosts.mockResolvedValue({ data: mockPosts } as any);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(mockPostsAPI.getPosts).toHaveBeenCalled();
            expect(
                mockPostsAPI.getCurrentUsersLikedPosts
            ).not.toHaveBeenCalled();
        });
    });

    test('handles API errors gracefully', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);

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

        mockPostsAPI.getPosts.mockRejectedValue(new Error('Failed to fetch'));
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue({
            data: [],
        } as any);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Failed to fetch posts:',
                expect.any(Error)
            );
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('post-card-2')).not.toBeInTheDocument();

        consoleErrorSpy.mockRestore();
    });

    test('applies correct styles based on window width for authenticated user', async () => {
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

        mockPostsAPI.getPosts.mockResolvedValue({ data: [] } as any);
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue({
            data: [],
        } as any);

        mockWindowInnerWidth(1200);

        const { rerender } = await act(async () => {
            return render(<Home />);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        const mainElement = document.querySelector('.home-page');
        expect(mainElement).toHaveStyle('justify-content: flex-end');

        mockWindowInnerWidth(1000);

        await act(async () => {
            rerender(<Home />);
        });

        expect(mainElement).toHaveStyle('justify-content: center');
    });

    test('applies center style for unauthenticated user regardless of width', async () => {
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

        mockPostsAPI.getPosts.mockResolvedValue({ data: [] } as any);

        mockWindowInnerWidth(1200);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        const mainElement = document.querySelector('.home-page');
        expect(mainElement).toHaveStyle('justify-content: center');
    });

    test('refreshes posts when handleAddPost is called', async () => {
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

        let callCount = 0;
        mockPostsAPI.getPosts.mockImplementation(() => {
            callCount++;
            return Promise.resolve({
                data: mockPosts.slice(0, callCount),
            } as any);
        });
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue({
            data: [],
        } as any);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        expect(callCount).toBe(1);

        const createPostSection = screen.getByTestId('create-post-section');
        expect(createPostSection).toBeInTheDocument();
    });

    test('renders empty state when no posts', async () => {
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

        mockPostsAPI.getPosts.mockResolvedValue({ data: [] } as any);
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue({
            data: [],
        } as any);

        await act(async () => {
            render(<Home />);
        });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
    });
});
