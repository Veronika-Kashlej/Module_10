import { render, screen, fireEvent } from '@testing-library/react';
import { CommentList } from './CommentList';
import { useAuth } from '../../../../../../../../store/contexts/AuthContext';

jest.mock('../../../../../../../../store/contexts/AuthContext');
jest.mock('../../../../../../../../components/Icons/Icons', () => ({
    Icons: {
        TrashIcon: ({ onClick }: { onClick: () => void }) => (
            <button data-testid="trash-icon" onClick={onClick}>
                x
            </button>
        ),
    },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('CommentList Component', () => {
    const mockComments = [
        {
            id: 1,
            text: 'First comment',
            authorId: 1,
            postId: 1,
            createdAt: '2023-01-01',
            author: { id: 1, username: 'user1' },
        },
        {
            id: 2,
            text: 'Second comment',
            authorId: 2,
            postId: 1,
            createdAt: '2023-01-02',
            author: { id: 2, username: 'user2' },
        },
        {
            id: 3,
            text: 'Third comment',
            authorId: 1,
            postId: 1,
            createdAt: '2023-01-03',
            author: { id: 1, username: 'user1' },
        },
    ] as any;

    const mockOnDeleteComment = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });
    });

    test('renders all comments when visible', () => {
        render(
            <CommentList
                areVisibleComments={true}
                onDeleteComment={mockOnDeleteComment}
                comments={mockComments}
            />
        );

        expect(screen.getByText('#1. First comment')).toBeInTheDocument();
        expect(screen.getByText('#2. Second comment')).toBeInTheDocument();
        expect(screen.getByText('#3. Third comment')).toBeInTheDocument();
    });

    test('hides comments when not visible', () => {
        render(
            <CommentList
                areVisibleComments={false}
                onDeleteComment={mockOnDeleteComment}
                comments={mockComments}
            />
        );

        const commentItems = document.querySelectorAll('.comment-item');
        expect(commentItems).toHaveLength(3);

        commentItems.forEach((item) => {
            expect(item).toHaveStyle('display: none');
        });
    });

    test("shows delete icon only for user's own comments", () => {
        render(
            <CommentList
                areVisibleComments={true}
                onDeleteComment={mockOnDeleteComment}
                comments={mockComments}
            />
        );

        const trashIcons = screen.getAllByTestId('trash-icon');
        expect(trashIcons).toHaveLength(2);

        const comment1 = screen
            .getByText('#1. First comment')
            .closest('.comment-item');
        expect(comment1).toContainElement(trashIcons[0]);

        const comment2 = screen
            .getByText('#2. Second comment')
            .closest('.comment-item');
        expect(comment2).not.toContainElement(trashIcons[0]);
        expect(comment2).not.toContainElement(trashIcons[1]);

        const comment3 = screen
            .getByText('#3. Third comment')
            .closest('.comment-item');
        expect(comment3).toContainElement(trashIcons[1]);
    });

    test('does not show delete icon when user is not logged in', () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            signIn: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            isLoading: false,
        });

        render(
            <CommentList
                areVisibleComments={true}
                onDeleteComment={mockOnDeleteComment}
                comments={mockComments}
            />
        );

        expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
    });

    test('calls onDeleteComment with correct comment id when trash icon is clicked', () => {
        render(
            <CommentList
                areVisibleComments={true}
                onDeleteComment={mockOnDeleteComment}
                comments={mockComments}
            />
        );

        const trashIcons = screen.getAllByTestId('trash-icon');
        fireEvent.click(trashIcons[0]);

        expect(mockOnDeleteComment).toHaveBeenCalledWith(1);
        expect(mockOnDeleteComment).toHaveBeenCalledTimes(1);
    });

    test('has correct CSS classes', () => {
        render(
            <CommentList
                areVisibleComments={true}
                onDeleteComment={mockOnDeleteComment}
                comments={mockComments}
            />
        );

        expect(document.querySelector('.comments-list')).toBeInTheDocument();
        expect(document.querySelectorAll('.comment-item')).toHaveLength(3);
    });

    test('renders empty list when no comments', () => {
        render(
            <CommentList
                areVisibleComments={true}
                onDeleteComment={mockOnDeleteComment}
                comments={[]}
            />
        );

        expect(document.querySelector('.comments-list')).toBeInTheDocument();
        expect(document.querySelectorAll('.comment-item')).toHaveLength(0);
    });

    test('displays comments with correct numbering', () => {
        render(
            <CommentList
                areVisibleComments={true}
                onDeleteComment={mockOnDeleteComment}
                comments={mockComments}
            />
        );

        expect(screen.getByText('#1. First comment')).toBeInTheDocument();
        expect(screen.getByText('#2. Second comment')).toBeInTheDocument();
        expect(screen.getByText('#3. Third comment')).toBeInTheDocument();
    });
});
