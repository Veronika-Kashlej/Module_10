import {
    render,
    screen,
    fireEvent,
    act,
    waitFor,
} from '@testing-library/react';
import CreatePostModal from './CreatePostModal';

jest.mock('../../../../components/Portal/Portal', () => ({
    Portal: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="portal">{children}</div>
    ),
}));

jest.mock('../../../../components/Icons/Icons', () => ({
    Icons: {
        CrossIcon: () => <div data-testid="cross-icon">✕</div>,
    },
}));

jest.mock('../../../../forms/Forms', () => ({
    Forms: {
        CreatePostForm: ({
            onAddPost,
            onClose,
        }: {
            onAddPost: () => void;
            onClose: () => void;
        }) => (
            <div data-testid="create-post-form">
                <button data-testid="mock-add-post-btn" onClick={onAddPost}>
                    Mock Add Post
                </button>
                <button data-testid="mock-close-btn" onClick={onClose}>
                    Mock Close
                </button>
            </div>
        ),
    },
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string): string => {
            const translations: Record<string, string> = {
                'pages.home.postModal.title': 'Create a new post',
            };
            return translations[key] || key;
        },
    }),
}));

describe('CreatePostModal Component', () => {
    const mockOnClose = jest.fn();
    const mockOnAddPost = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockOnClose.mockClear();
        mockOnAddPost.mockClear();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('renders modal with portal', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        expect(screen.getByTestId('portal')).toBeInTheDocument();
        expect(screen.getByTestId('create-post-form')).toBeInTheDocument();
    });

    test('renders modal title correctly', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        expect(screen.getByText('Create a new post')).toBeInTheDocument();
        expect(screen.getByText('Create a new post')).toHaveClass(
            'modal-title'
        );
    });

    test('renders close button with cross icon', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const closeButton = screen.getByRole('button', { name: 'close modal' });
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveClass('close-modal-btn');
        expect(screen.getByTestId('cross-icon')).toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', async () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const closeButton = screen.getByRole('button', { name: 'close modal' });

        await act(async () => {
            fireEvent.click(closeButton);
        });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnAddPost).not.toHaveBeenCalled();
    });

    test('calls onAddPost when form submits', async () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const addPostButton = screen.getByTestId('mock-add-post-btn');

        await act(async () => {
            fireEvent.click(addPostButton);
        });

        expect(mockOnAddPost).toHaveBeenCalledTimes(1);
        expect(mockOnClose).not.toHaveBeenCalled();
    });

    test('calls onClose when form close button is clicked', async () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const closeFormButton = screen.getByTestId('mock-close-btn');

        await act(async () => {
            fireEvent.click(closeFormButton);
        });

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnAddPost).not.toHaveBeenCalled();
    });

    test('has correct structure with overlay and modal', () => {
        const { container } = render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const portalContent = screen.getByTestId('portal')
            .firstChild as HTMLElement;
        expect(portalContent).toHaveClass('modal-overlay');

        const modalDiv = portalContent.querySelector('.modal');
        expect(modalDiv).toBeInTheDocument();

        const modalHeader = modalDiv?.querySelector('.modal-header');
        expect(modalHeader).toBeInTheDocument();
    });

    test('sets focus on close button on mount', async () => {
        const focusSpy = jest.spyOn(HTMLElement.prototype, 'focus');

        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        await waitFor(() => {
            expect(focusSpy).toHaveBeenCalled();
        });

        const closeButton = screen.getByRole('button', { name: 'close modal' });
        expect(closeButton).toHaveFocus();

        focusSpy.mockRestore();
    });

    test('close button has correct aria-label', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const closeButton = screen.getByRole('button', { name: 'close modal' });
        expect(closeButton).toHaveAttribute('aria-label', 'close modal');
    });

    test('modal title uses translation key', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        expect(screen.getByText('Create a new post')).toBeInTheDocument();
    });

    test('passes correct props to CreatePostForm', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const form = screen.getByTestId('create-post-form');
        expect(form).toBeInTheDocument();

        const addPostButton = screen.getByTestId('mock-add-post-btn');
        fireEvent.click(addPostButton);
        expect(mockOnAddPost).toHaveBeenCalled();

        const closeButton = screen.getByTestId('mock-close-btn');
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
    });

    test('renders modal content inside Portal', () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const portal = screen.getByTestId('portal');
        expect(portal).toBeInTheDocument();

        const modalContent = portal.querySelector('.modal');
        expect(modalContent).toBeInTheDocument();
        expect(
            modalContent?.querySelector('.modal-header')
        ).toBeInTheDocument();
        expect(
            modalContent?.querySelector('[data-testid="create-post-form"]')
        ).toBeInTheDocument();
    });

    test('modal overlay covers full screen', () => {
        const { container } = render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const overlay = container.querySelector('.modal-overlay');
        expect(overlay).toBeInTheDocument();
    });

    test('modal has correct styling classes', () => {
        const { container } = render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        expect(container.querySelector('.modal')).toBeInTheDocument();
        expect(container.querySelector('.modal-header')).toBeInTheDocument();
        expect(container.querySelector('.modal-title')).toBeInTheDocument();
        expect(container.querySelector('.close-modal-btn')).toBeInTheDocument();
    });

    test('handles multiple close calls', async () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const closeButton = screen.getByRole('button', { name: 'close modal' });
        const formCloseButton = screen.getByTestId('mock-close-btn');

        await act(async () => {
            fireEvent.click(closeButton);
            fireEvent.click(formCloseButton);
        });

        expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    test('handles multiple add post calls', async () => {
        render(
            <CreatePostModal onClose={mockOnClose} onAddPost={mockOnAddPost} />
        );

        const addPostButton = screen.getByTestId('mock-add-post-btn');

        await act(async () => {
            fireEvent.click(addPostButton);
            fireEvent.click(addPostButton);
        });

        expect(mockOnAddPost).toHaveBeenCalledTimes(2);
    });
});
