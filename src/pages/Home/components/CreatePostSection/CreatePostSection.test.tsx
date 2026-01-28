import { render, screen, fireEvent, act } from '@testing-library/react';
import { CreatePostSection } from './CreatePostSection';
import { useAuth } from '../../../../utils/hooks/useAuth';
import { createMockAuth } from '../../../../utils/api/api.test';

jest.mock('../../../../store/contexts/AuthContext');
jest.mock('../../../../components/Loader/Loader', () => ({
    Loader: () => <div data-testid="loader">Loading...</div>,
}));

const mockCreatePostModal = ({ onClose, onAddPost }: any) => (
    <div data-testid="create-post-modal">
        <button onClick={onClose}>Close Modal</button>
        <button onClick={onAddPost}>Submit Post</button>
    </div>
);

jest.mock('./components/CreatePostModal/CreatePostModal', () => ({
    __esModule: true,
    default: mockCreatePostModal,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('CreatePostSection Component', () => {
    const mockOnAddPost = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue(createMockAuth({ isAuthenticated: true }));
    });

    test('renders user profile image and prompt text', () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        const profileImage = screen.getByAltText('avatar');
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

        await act(async () => {
            fireEvent.click(screen.getByText('Tell everyone'));
        });

        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();
    });

    test('closes modal when close function is called', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        await act(async () => {
            fireEvent.click(screen.getByText('Tell everyone'));
        });
        expect(screen.getByTestId('create-post-modal')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByText('Close Modal'));
        });

        expect(
            screen.queryByTestId('create-post-modal')
        ).not.toBeInTheDocument();
    });

    test('calls onAddPost when post is submitted', async () => {
        render(<CreatePostSection onAddPost={mockOnAddPost} />);

        await act(async () => {
            fireEvent.click(screen.getByText('Tell everyone'));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Submit Post'));
        });

        expect(mockOnAddPost).toHaveBeenCalledTimes(1);
    });
});
