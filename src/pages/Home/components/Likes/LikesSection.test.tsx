import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { LikesSection } from './LikesSection';
import { Post, LikedPost, User } from '../../../../store/types';
import { postsAPI } from '../../../../utils/api/api';

jest.mock('../../../../utils/api/api', () => ({
    postsAPI: {
        likePost: jest.fn(),
        dislikePost: jest.fn(),
    },
}));

jest.mock('../../../../components/Icons/Icons', () => ({
    Icons: {
        LikeIcon: ({
            onClick,
            isLiked,
        }: {
            onClick: () => void;
            isLiked: boolean;
        }) => (
            <div
                data-testid="like-icon"
                onClick={onClick}
                data-liked={isLiked}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
            >
                {isLiked ? 'red' : 'white'}
            </div>
        ),
    },
}));

jest.mock('@mui/material', () => ({
    IconButton: ({
        children,
        onClick,
        'aria-label': ariaLabel,
    }: {
        children: React.ReactNode;
        onClick: () => void;
        'aria-label': string;
    }) => (
        <button
            data-testid="icon-button"
            onClick={onClick}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    ),
}));

describe('LikesSection Component', () => {
    const mockAuthor: User = {
        id: 1,
        firstName: 'John',
        secondName: 'Doe',
        username: 'johndoe',
        email: 'john@example.com',
        profileImage: 'profile.jpg',
        description: 'Test user',
        creationDate: '2023-01-01T00:00:00.000Z',
        modifiedDate: '',
        lastLogin: '',
    };

    const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        likedByUsers: [mockAuthor, mockAuthor],
        image: 'test-image.jpg',
        creationDate: '2023-01-01T00:00:00.000Z',
        authorId: 1,
        commentsCount: 0,
        authorPhoto: '',
        modifiedDate: '',
        likesCount: 0,
    };

    const mockLikedPosts: LikedPost[] = [];

    beforeEach(() => {
        jest.clearAllMocks();

        (postsAPI.likePost as jest.Mock).mockResolvedValue({
            data: { success: true },
        });

        (postsAPI.dislikePost as jest.Mock).mockResolvedValue({
            data: { success: true },
        });
    });

    test('renders like button and likes count', () => {
        render(<LikesSection post={mockPost} likedPosts={mockLikedPosts} />);

        expect(screen.getByTestId('like-icon')).toBeInTheDocument();
        expect(screen.getByText('2 likes')).toBeInTheDocument();
    });

    test('shows liked state when post is already liked', () => {
        const likedPost: LikedPost = {
            postId: 1,
            userId: 1,
            id: 1,
            creationDate: '',
        };

        render(<LikesSection post={mockPost} likedPosts={[likedPost]} />);

        const likeIcon = screen.getByTestId('like-icon');
        expect(likeIcon).toHaveAttribute('data-liked', 'true');
        expect(likeIcon).toHaveTextContent('red');
    });

    test('shows not liked state when post is not liked', () => {
        render(<LikesSection post={mockPost} likedPosts={[]} />);

        const likeIcon = screen.getByTestId('like-icon');
        expect(likeIcon).toHaveAttribute('data-liked', 'false');
        expect(likeIcon).toHaveTextContent('white');
    });

    test('likes post when not liked', async () => {
        render(<LikesSection post={mockPost} likedPosts={[]} />);

        const likeIcon = screen.getByTestId('like-icon');

        await act(async () => {
            fireEvent.click(likeIcon);
        });

        await waitFor(() => {
            expect(postsAPI.likePost).toHaveBeenCalledWith(1);
            expect(screen.getByText('3 likes')).toBeInTheDocument();
        });

        expect(screen.getByTestId('like-icon')).toHaveAttribute(
            'data-liked',
            'true'
        );
    });

    test('dislikes post when already liked', async () => {
        const likedPost: LikedPost = {
            postId: 1,
            userId: 1,
            id: 1,
            creationDate: '',
        };

        render(<LikesSection post={mockPost} likedPosts={[likedPost]} />);

        const likeIcon = screen.getByTestId('like-icon');

        await act(async () => {
            fireEvent.click(likeIcon);
        });

        await waitFor(() => {
            expect(postsAPI.dislikePost).toHaveBeenCalledWith(1);
            expect(screen.getByText('1 likes')).toBeInTheDocument();
        });

        expect(screen.getByTestId('like-icon')).toHaveAttribute(
            'data-liked',
            'false'
        );
    });

    test('updates likes count correctly from initial state', () => {
        const postWithManyLikes: Post = {
            ...mockPost,
            likedByUsers: [
                mockAuthor,
                mockAuthor,
                mockAuthor,
                mockAuthor,
                mockAuthor,
            ],
        };

        render(<LikesSection post={postWithManyLikes} likedPosts={[]} />);

        expect(screen.getByText('5 likes')).toBeInTheDocument();
    });

    test('handles like API error gracefully', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        (postsAPI.likePost as jest.Mock).mockRejectedValue(
            new Error('Failed to like post')
        );

        render(<LikesSection post={mockPost} likedPosts={[]} />);

        const likeIcon = screen.getByTestId('like-icon');

        expect(screen.getByText('2 likes')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(likeIcon);
        });

        expect(screen.getByText('2 likes')).toBeInTheDocument();
        expect(likeIcon).toHaveAttribute('data-liked', 'false');
        expect(postsAPI.likePost).toHaveBeenCalledWith(1);

        consoleErrorSpy.mockRestore();
    });

    test('handles dislike API error gracefully', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        const likedPost: LikedPost = {
            postId: 1,
            userId: 1,
            id: 1,
            creationDate: '',
        };

        (postsAPI.dislikePost as jest.Mock).mockRejectedValue(
            new Error('Failed to dislike post')
        );

        render(<LikesSection post={mockPost} likedPosts={[likedPost]} />);

        const likeIcon = screen.getByTestId('like-icon');

        expect(screen.getByText('2 likes')).toBeInTheDocument();
        expect(likeIcon).toHaveAttribute('data-liked', 'true');

        await act(async () => {
            fireEvent.click(likeIcon);
        });

        expect(screen.getByText('2 likes')).toBeInTheDocument();
        expect(likeIcon).toHaveAttribute('data-liked', 'true');
        expect(postsAPI.dislikePost).toHaveBeenCalledWith(1);

        consoleErrorSpy.mockRestore();
    });

    test('displays correct likes count when post has no likes', () => {
        const postWithoutLikes: Post = {
            ...mockPost,
            likedByUsers: [],
        };

        render(<LikesSection post={postWithoutLikes} likedPosts={[]} />);

        expect(screen.getByText('0 likes')).toBeInTheDocument();
    });

    test('displays correct likes count when post has one like', () => {
        const postWithOneLike: Post = {
            ...mockPost,
            likedByUsers: [mockAuthor],
        };

        render(<LikesSection post={postWithOneLike} likedPosts={[]} />);

        expect(screen.getByText('1 likes')).toBeInTheDocument();
    });

    test('IconButton receives correct aria-label', () => {
        render(<LikesSection post={mockPost} likedPosts={[]} />);

        const iconButton = screen.getByTestId('icon-button');
        expect(iconButton).toHaveAttribute('aria-label', 'like post');
    });
});
