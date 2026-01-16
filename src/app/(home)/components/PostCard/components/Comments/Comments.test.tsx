import {
    render,
    screen,
    fireEvent,
    waitFor,
    act,
} from '@testing-library/react';
import { Comments } from './Comments';
import { useAuth } from '../../../../../../store/contexts/AuthContext';
import { postsAPI } from '../../../../../../store/api/api';

jest.mock('../../../../../../store/contexts/AuthContext');
jest.mock('../../../../../../store/api/api');

jest.mock('./components/CommentList/CommentList', () => {
    const MockCommentList = ({
        areVisibleComments,
        onDeleteComment,
        comments,
    }: any) => (
        <div data-testid="comment-list">
            <div data-testid="are-visible">{areVisibleComments.toString()}</div>
            <div data-testid="comments-count">{comments.length}</div>
            <button
                data-testid="delete-comment-button"
                onClick={() => onDeleteComment(1)}
            >
                Delete Comment
            </button>
        </div>
    );
    return { CommentList: MockCommentList };
});

jest.mock('../../../../../../components/Forms/Forms', () => {
    const MockAddCommentForm = ({ onAddComment }: any) => (
        <div data-testid="add-comment-form">
            <button onClick={() => onAddComment('Test comment')}>
                Add Comment
            </button>
        </div>
    );
    return { Forms: { AddCommentForm: MockAddCommentForm } };
});

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockPostsAPI = postsAPI as jest.Mocked<typeof postsAPI>;

describe('Comments Component', () => {
    const mockOnChangeCommentsCount = jest.fn();
    const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
    };

    const createMockAxiosResponse = (data: any) => ({
        data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            user: mockUser,
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            refreshUser: jest.fn(),
            getCurrentUser: jest.fn(),
            isLoading: false,
        } as any);
    });

    test('fetches and displays comments on mount', async () => {
        mockPostsAPI.getComments.mockResolvedValue(createMockAxiosResponse([]));

        render(
            <Comments
                postId={1}
                areVisibleComments={true}
                onChangeCommentsCount={mockOnChangeCommentsCount}
            />
        );

        expect(mockPostsAPI.getComments).toHaveBeenCalledWith(1);
        await waitFor(() => {
            expect(mockOnChangeCommentsCount).toHaveBeenCalledWith(0);
        });
    });

    test('adds comment', async () => {
        mockPostsAPI.getComments.mockResolvedValue(createMockAxiosResponse([]));
        mockPostsAPI.createComment.mockResolvedValue(
            createMockAxiosResponse({})
        );

        render(
            <Comments
                postId={1}
                areVisibleComments={true}
                onChangeCommentsCount={mockOnChangeCommentsCount}
            />
        );

        await act(async () => {
            fireEvent.click(screen.getByText('Add Comment'));
        });

        expect(mockPostsAPI.createComment).toHaveBeenCalledWith({
            postId: 1,
            text: 'Test comment',
        });
    });

    test('deletes comment', async () => {
        const mockComments = [
            {
                id: 1,
                text: 'Test comment',
                authorId: 1,
                postId: 1,
                createdAt: '',
                author: { id: 1, username: 'user' },
            },
        ];

        mockPostsAPI.getComments.mockResolvedValue(
            createMockAxiosResponse(mockComments)
        );
        mockPostsAPI.deleteComment.mockResolvedValue(
            createMockAxiosResponse({})
        );

        render(
            <Comments
                postId={1}
                areVisibleComments={true}
                onChangeCommentsCount={mockOnChangeCommentsCount}
            />
        );

        await waitFor(() => {
            expect(screen.getByTestId('comments-count')).toHaveTextContent('1');
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId('delete-comment-button'));
        });

        expect(mockPostsAPI.deleteComment).toHaveBeenCalledWith(1);
    });

    test('handles API errors when fetching comments', async () => {
        const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => undefined);
        mockPostsAPI.getComments.mockRejectedValue(new Error('Fetch failed'));

        render(
            <Comments
                postId={1}
                areVisibleComments={true}
                onChangeCommentsCount={mockOnChangeCommentsCount}
            />
        );

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                'Failed to fetch comments:',
                expect.any(Error)
            );
        });

        consoleErrorSpy.mockRestore();
    });
});
