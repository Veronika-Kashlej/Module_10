import { render, screen, fireEvent } from '@testing-library/react';
import { FileUploadInput } from './FileUploadInput';

jest.mock('../../../components/Icons/Icons', () => ({
    Icons: { FileDownloadIcon: () => <div>Icon</div> },
}));

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'forms.selectImage.label':
                    'Select a file or drag and drop here',
                'forms.selectImage.subtitle': 'JPG, or PNG, no more than 10MB',
                'forms.selectImage.validation.size': 'Unsupported file format',
            };
            return translations[key] || key;
        },
    }),
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

        expect(screen.getByText(/Unsupported file format/)).toBeInTheDocument();
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
