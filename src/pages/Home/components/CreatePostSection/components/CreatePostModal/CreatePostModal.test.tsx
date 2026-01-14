import { render, screen, fireEvent } from '@testing-library/react';
import CreatePostModal from './CreatePostModal';

jest.mock('../../../../../../components/Icons/Icons', () => ({
    Icons: {
        CrossIcon: ({ onClick }: { onClick: () => void }) => (
            <button data-testid="cross-icon" onClick={onClick}>
                X
            </button>
        ),
    },
}));

jest.mock('../../../../../../components/Portal/Portal', () => ({
    Portal: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="portal">{children}</div>
    ),
}));

jest.mock('../../../../../../components/Forms/Forms', () => ({
    Forms: {
        CreatePostForm: ({ onAddPost, onClose }: any) => (
            <form data-testid="create-post-form">
                <button type="button" onClick={onAddPost}>
                    Add Post
                </button>
                <button type="button" onClick={onClose}>
                    Close Form
                </button>
            </form>
        ),
    },
}));

describe('CreatePostModal', () => {
    const mockOnClose = jest.fn();
    const mockOnAddPost = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders modal with title and close icon', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        expect(screen.getByText('Create a new post')).toBeInTheDocument();
        expect(screen.getByTestId('cross-icon')).toBeInTheDocument();
        expect(screen.getByTestId('create-post-form')).toBeInTheDocument();
        expect(screen.getByTestId('portal')).toBeInTheDocument();
    });

    test('calls onClose when cross icon is clicked', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const crossIcon = screen.getByTestId('cross-icon');
        fireEvent.click(crossIcon);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('passes onClose and onAddPost to CreatePostForm', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const addPostButton = screen.getByText('Add Post');
        const closeFormButton = screen.getByText('Close Form');

        fireEvent.click(addPostButton);
        expect(mockOnAddPost).toHaveBeenCalledTimes(1);

        fireEvent.click(closeFormButton);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});
