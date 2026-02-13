import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import { postsAPI } from '../../utils/api/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../utils/hooks/useAuth';
import { Post } from '../../store/types';
import { AxiosResponse } from 'axios';

jest.mock('../../utils/api/api', () => ({
    postsAPI: {
        getPosts: jest.fn(),
        getCurrentUsersLikedPosts: jest.fn(),
    },
}));

jest.mock('../../utils/hooks/useAuth', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../../components/Header/Header', () => ({
    Header: () => <header data-testid="header">Header</header>,
}));

jest.mock('./components/CreatePostSection/CreatePostSection', () => ({
    CreatePostSection: ({ onAddPost }: { onAddPost: () => void }) => (
        <div data-testid="create-post-section">
            Create Post
            <button onClick={onAddPost} data-testid="add-post-btn">
                Add Post
            </button>
        </div>
    ),
}));

jest.mock('./components/PostCard/PostCard', () => ({
    PostCard: ({ post }: { post: { id: number; title: string } }) => (
        <div data-testid={`post-card-${post.id}`}>Post: {post.title}</div>
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

jest.mock(
    '../../components/ErrorBoundaryFallback/ErrorBoundaryFallback',
    () => ({
        ErrorBoundaryFallback: () => (
            <div data-testid="error-fallback">Error</div>
        ),
    })
);

const mockUseAuth = useAuth as jest.Mock;
const mockPostsAPI = postsAPI as jest.Mocked<typeof postsAPI>;

const mockWindowInnerWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
    });
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const createMockAxiosResponse = <T,>(data: T): AxiosResponse<T> => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
});

describe('Home Component', () => {
    const mockPosts: Post[] = [
        {
            id: 1,
            title: 'First Post',
            content: 'Content 1',
            likedByUsers: [],
            image: '',
            creationDate: '2024-01-01',
            authorId: 1,
            commentsCount: 0,
            authorPhoto: '',
            likesCount: 0,
            modifiedDate: '',
        },
        {
            id: 2,
            title: 'Second Post',
            content: 'Content 2',
            likedByUsers: [],
            image: '',
            creationDate: '2024-01-02',
            authorId: 2,
            commentsCount: 0,
            authorPhoto: '',
            likesCount: 0,
            modifiedDate: '',
        },
    ];

    const mockLikedPosts = [{ postId: 1, userId: 1, likedAt: '2024-01-01' }];

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();
        mockWindowInnerWidth(1200);

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });
    });

    test('renders header and loading skeletons initially for authenticated user', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockReturnValue(new Promise(() => {}));
        mockPostsAPI.getCurrentUsersLikedPosts.mockReturnValue(
            new Promise(() => {})
        );

        render(<Home />, { wrapper });

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getAllByTestId('post-skeleton')).toHaveLength(3);
    });

    test('renders posts after loading for authenticated user', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(
            createMockAxiosResponse(mockPosts)
        );
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue(
            createMockAxiosResponse(mockLikedPosts)
        );

        render(<Home />, { wrapper });

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
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(
            createMockAxiosResponse(mockPosts)
        );

        render(<Home />, { wrapper });

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
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(
            createMockAxiosResponse(mockPosts)
        );
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue(
            createMockAxiosResponse(mockLikedPosts)
        );

        render(<Home />, { wrapper });

        await waitFor(() => {
            expect(mockPostsAPI.getPosts).toHaveBeenCalled();
            expect(mockPostsAPI.getCurrentUsersLikedPosts).toHaveBeenCalled();
        });
    });

    test('does not fetch liked posts when unauthenticated', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(
            createMockAxiosResponse(mockPosts)
        );

        render(<Home />, { wrapper });

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
            .mockImplementation(() => {});

        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockRejectedValue(new Error('Failed to fetch'));
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue(
            createMockAxiosResponse([])
        );

        render(<Home />, { wrapper });

        await waitFor(() => {
            expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
        });

        consoleErrorSpy.mockRestore();
    });

    test('applies correct styles based on window width for authenticated user', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(createMockAxiosResponse([]));
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue(
            createMockAxiosResponse([])
        );

        mockWindowInnerWidth(1200);

        const { rerender } = render(<Home />, { wrapper });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        const mainElement = document.querySelector('.home-page');
        expect(mainElement).toHaveStyle('justify-content: flex-end');

        mockWindowInnerWidth(1000);

        rerender(<Home />);

        expect(mainElement).toHaveStyle('justify-content: center');
    });

    test('applies center style for unauthenticated user regardless of width', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(createMockAxiosResponse([]));

        mockWindowInnerWidth(1200);

        render(<Home />, { wrapper });

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
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(
            createMockAxiosResponse(mockPosts)
        );
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue(
            createMockAxiosResponse([])
        );

        render(<Home />, { wrapper });

        await waitFor(() => {
            expect(screen.getByTestId('post-card-1')).toBeInTheDocument();
        });

        expect(mockPostsAPI.getPosts).toHaveBeenCalledTimes(1);

        const addPostButton = screen.getByTestId('add-post-btn');
        addPostButton.click();

        await waitFor(() => {
            expect(mockPostsAPI.getPosts).toHaveBeenCalledTimes(2);
        });
    });

    test('renders empty state when no posts', async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            logout: jest.fn(),
        });

        mockPostsAPI.getPosts.mockResolvedValue(createMockAxiosResponse([]));
        mockPostsAPI.getCurrentUsersLikedPosts.mockResolvedValue(
            createMockAxiosResponse([])
        );

        render(<Home />, { wrapper });

        await waitFor(() => {
            expect(
                screen.queryByTestId('post-skeleton')
            ).not.toBeInTheDocument();
        });

        expect(screen.queryByTestId('post-card-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('post-card-2')).not.toBeInTheDocument();
    });
});
