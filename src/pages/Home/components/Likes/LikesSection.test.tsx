import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { LikesSection } from './LikesSection';
import { LikedPost } from '../../../../store/types';
import { postsAPI } from '../../../../utils/api/api';

jest.mock('../../../../../../store/api/api', () => ({
    postsAPI: {
        likePost: jest.fn(),
        dislikePost: jest.fn(),
    },
}));

jest.mock('../../../../../../components/Icons/Icons', () => ({
    Icons: {
        LikeIcon: ({
            onClick,
            isLiked,
        }: {
            onClick: () => void;
            isLiked: boolean;
        }) => (
            <button
                data-testid="like-icon"
                onClick={onClick}
                data-liked={isLiked}
            >
                {isLiked ? '❤️' : '🤍'}
            </button>
        ),
    },
}));

describe('LikesSection Component', () => {
    const mockPost = {
        id: 1,
        title: 'Test Post',
        content: 'Test content',
        likedByUsers: [{ id: 1, username: 'user1' }],
        comments: [],
        image: '',
        createdAt: '',
        updatedAt: '',
        authorId: 1,
        author: { id: 1, username: 'author' },
    } as any;

    const mockLikedPosts: LikedPost[] = [];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders like button and likes count', () => {
        render(<LikesSection post={mockPost} likedPosts={mockLikedPosts} />);

        expect(screen.getByTestId('like-icon')).toBeInTheDocument();
        expect(screen.getByText('1 likes')).toBeInTheDocument();
    });

    test('shows liked state when post is already liked', () => {
        const likedPost = { postId: 1, userId: 1, likedAt: '' } as any;
        render(<LikesSection post={mockPost} likedPosts={[likedPost]} />);

        const likeIcon = screen.getByTestId('like-icon');
        expect(likeIcon).toHaveAttribute('data-liked', 'true');
        expect(likeIcon).toHaveTextContent('❤️');
    });

    test('shows not liked state when post is not liked', () => {
        render(<LikesSection post={mockPost} likedPosts={[]} />);

        const likeIcon = screen.getByTestId('like-icon');
        expect(likeIcon).toHaveAttribute('data-liked', 'false');
        expect(likeIcon).toHaveTextContent('🤍');
    });

    test('likes post when not liked', async () => {
        (postsAPI.likePost as jest.Mock).mockResolvedValue({});

        render(<LikesSection post={mockPost} likedPosts={[]} />);

        const likeIcon = screen.getByTestId('like-icon');

        await act(async () => {
            fireEvent.click(likeIcon);
        });

        await waitFor(() => {
            expect(postsAPI.likePost).toHaveBeenCalledWith(1);
            expect(screen.getByText('2 likes')).toBeInTheDocument();
        });

        expect(screen.getByTestId('like-icon')).toHaveAttribute(
            'data-liked',
            'true'
        );
    });

    test('dislikes post when already liked', async () => {
        const likedPost = { postId: 1, userId: 1, likedAt: '' } as any;
        (postsAPI.dislikePost as jest.Mock).mockResolvedValue({});

        render(<LikesSection post={mockPost} likedPosts={[likedPost]} />);

        const likeIcon = screen.getByTestId('like-icon');

        await act(async () => {
            fireEvent.click(likeIcon);
        });

        await waitFor(() => {
            expect(postsAPI.dislikePost).toHaveBeenCalledWith(1);
            expect(screen.getByText('0 likes')).toBeInTheDocument();
        });

        expect(screen.getByTestId('like-icon')).toHaveAttribute(
            'data-liked',
            'false'
        );
    });

    test('updates likes count correctly from initial state', () => {
        const postWithLikes = {
            ...mockPost,
            likedByUsers: [
                { id: 1, username: 'user1' },
                { id: 2, username: 'user2' },
                { id: 3, username: 'user3' },
            ],
        };

        render(<LikesSection post={postWithLikes} likedPosts={[]} />);

        expect(screen.getByText('3 likes')).toBeInTheDocument();
    });
});
