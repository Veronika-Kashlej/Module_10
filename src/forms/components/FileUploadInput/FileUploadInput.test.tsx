import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadInput } from './FileUploadInput';

jest.mock('../../../Icons/Icons', () => ({
    Icons: { FileDownloadIcon: () => <div>Icon</div> },
}));

describe('FileUploadInput', () => {
    const mockOnFileSelect = jest.fn();

    beforeEach(() => {
        mockOnFileSelect.mockClear();
    });

    test('shows file upload instructions', () => {
        render(<FileUploadInput onFileSelect={mockOnFileSelect} />);

        expect(
            screen.getByText(/Select a file or drag and drop here/)
        ).toBeInTheDocument();
        expect(
            screen.getByText(/JPG, or PNG, no more than 10MB/)
        ).toBeInTheDocument();
    });

    test('shows error for invalid file type', () => {
        const { container } = render(
            <FileUploadInput onFileSelect={mockOnFileSelect} />
        );

        const invalidFile = new File(['test'], 'document.pdf', {
            type: 'application/pdf',
        });

        const fileInput = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        Object.defineProperty(fileInput, 'files', {
            value: [invalidFile],
        });

        fireEvent.change(fileInput);

        expect(screen.getByText(/Unsupported file format/)).toBeInTheDocument();
        expect(mockOnFileSelect).not.toHaveBeenCalled();
    });

    test('shows error for large file', () => {
        const { container } = render(
            <FileUploadInput onFileSelect={mockOnFileSelect} />
        );

        const largeFile = new File(
            ['x'.repeat(11 * 1024 * 1024)],
            'large.jpg',
            {
                type: 'image/jpeg',
            }
        );

        const fileInput = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        Object.defineProperty(fileInput, 'files', {
            value: [largeFile],
        });

        fireEvent.change(fileInput);

        expect(screen.getByText(/The file is too large/)).toBeInTheDocument();
        expect(mockOnFileSelect).not.toHaveBeenCalled();
    });

    test('accepts valid file and calls callback', () => {
        const { container } = render(
            <FileUploadInput onFileSelect={mockOnFileSelect} />
        );

        const validFile = new File(['test'], 'image.jpg', {
            type: 'image/jpeg',
        });

        const fileInput = container.querySelector(
            'input[type="file"]'
        ) as HTMLInputElement;

        Object.defineProperty(fileInput, 'files', {
            value: [validFile],
        });

        fireEvent.change(fileInput);

        expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
        expect(screen.getByText('image.jpg')).toBeInTheDocument();
    });
});
