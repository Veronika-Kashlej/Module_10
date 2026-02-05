import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Icons } from './Icons';

const mockUseTheme = jest.fn();

jest.mock('../../store/contexts/ThemeContext', () => ({
    useTheme: () => mockUseTheme(),
}));

describe('Icons', () => {
    describe('LikeIcon', () => {
        test('renders with light theme stroke color', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.LikeIcon isLiked={false} />);

            const svg = container.querySelector('svg');
            const path = svg?.querySelector('path');

            expect(path).toHaveAttribute('stroke', '#151A2D');
            expect(svg).toHaveAttribute('fill', 'none');
        });

        test('renders with dark theme stroke color', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.LikeIcon isLiked={false} />);

            const svg = container.querySelector('svg');
            const path = svg?.querySelector('path');

            expect(path).toHaveAttribute('stroke', 'white');
            expect(svg).toHaveAttribute('fill', 'none');
        });

        test('has correct fill color when liked', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.LikeIcon isLiked={true} />);

            const svg = container.querySelector('svg');

            expect(svg).toHaveAttribute('fill', '#ff8811');

            const path = svg?.querySelector('path');
            expect(path).toHaveAttribute('stroke', '#151A2D');
        });
    });

    describe('CrossIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(
                <Icons.CrossIcon onClick={() => undefined} />
            );

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(
                <Icons.CrossIcon onClick={() => undefined} />
            );

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });
    });

    describe('EmailIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.EmailIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.EmailIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });
    });

    describe('MessageIcon', () => {
        test('has correct stroke color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.MessageIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('stroke', '#151A2D');
        });

        test('has correct stroke color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.MessageIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('stroke', 'white');
        });
    });

    describe('PasswordIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.PasswordIcon />);

            const paths = container.querySelectorAll('path');
            paths.forEach((path) => {
                expect(path).toHaveAttribute('fill', '#151A2D');
            });
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.PasswordIcon />);

            const paths = container.querySelectorAll('path');
            paths.forEach((path) => {
                expect(path).toHaveAttribute('fill', 'white');
            });
        });
    });

    describe('PencilIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.PencilIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.PencilIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });
    });

    describe('ShowCommentIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(
                <Icons.ShowCommentIcon areVisibleComments={false} />
            );

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(
                <Icons.ShowCommentIcon areVisibleComments={false} />
            );

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });

        test('has rotation when comments are not visible', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(
                <Icons.ShowCommentIcon areVisibleComments={false} />
            );

            const svg = container.querySelector('svg');
            expect(svg).toHaveStyle('transform: rotate(180deg)');
        });

        test('has no rotation when comments are visible', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(
                <Icons.ShowCommentIcon areVisibleComments={true} />
            );

            const svg = container.querySelector('svg');
            expect(svg).toHaveStyle('transform: none');
        });
    });

    describe('TrashIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.TrashIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.TrashIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });
    });

    describe('FileDownloadIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.FileDownloadIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.FileDownloadIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });
    });

    describe('SidekickLogo', () => {
        test('has correct fill colors for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.SidekickLogo />);

            const paths = container.querySelectorAll('path');

            const regularPaths = Array.from(paths).slice(0, -1);
            regularPaths.forEach((path) => {
                expect(path).toHaveAttribute('fill', '#151A2D');
            });

            const lastPath = paths[paths.length - 1];
            expect(lastPath).toHaveAttribute('fill', '#FF8811');
        });

        test('has correct fill colors for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.SidekickLogo />);

            const paths = container.querySelectorAll('path');

            const regularPaths = Array.from(paths).slice(0, -1);
            regularPaths.forEach((path) => {
                expect(path).toHaveAttribute('fill', 'white');
            });

            const lastPath = paths[paths.length - 1];
            expect(lastPath).toHaveAttribute('fill', '#FF8811');
        });
    });

    describe('UsernameIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.UsernameIcon />);

            const paths = container.querySelectorAll('path');
            paths.forEach((path) => {
                expect(path).toHaveAttribute('fill', '#151A2D');
            });
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.UsernameIcon />);

            const paths = container.querySelectorAll('path');
            paths.forEach((path) => {
                expect(path).toHaveAttribute('fill', 'white');
            });
        });
    });

    describe('InfoIcon', () => {
        test('always has #6A749C fill color regardless of theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.InfoIcon isValid={true} />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#6A749C');
        });
    });

    describe('NotFoundIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.NotFoundIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.NotFoundIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });
    });

    describe('ErrorIcon', () => {
        test('has correct fill color for light theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'light' });

            const { container } = render(<Icons.ErrorIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', '#151A2D');
        });

        test('has correct fill color for dark theme', () => {
            mockUseTheme.mockReturnValue({ theme: 'dark' });

            const { container } = render(<Icons.ErrorIcon />);

            const path = container.querySelector('path');
            expect(path).toHaveAttribute('fill', 'white');
        });
    });
});
