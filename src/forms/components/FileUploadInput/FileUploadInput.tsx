import { useRef, useState } from 'react';
import './FileUploadInput.css';
import { Icons } from '../../../components/Icons/Icons';
import { useTranslation } from 'react-i18next';

interface FileUploadInputProps {
    onFileSelect: (file: File) => void;
}

export function FileUploadInput({ onFileSelect }: FileUploadInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const ACCEPTED_TYPES = ['.jpg', '.jpeg', '.png'];

    const handleClick = () => {
        setError(null);
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            validateAndSetFile(file);
        }
    };

    const validateAndSetFile = (file: File) => {
        setError(null);

        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!ACCEPTED_TYPES.includes(fileExtension)) {
            setError(t('forms.selectImage.validation.size'));
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError(t('forms.selectImage.validation.size'));
            return;
        }
        setSelectedFile(file);
        onFileSelect(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        setError(null);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            validateAndSetFile(file);

            if (fileInputRef.current) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInputRef.current.files = dataTransfer.files;
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    return (
        <div className="file-upload-container">
            <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            <div
                className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
                tabIndex={0}
                aria-label={
                    selectedFile
                        ? `Chosen file: ${selectedFile.name}. Click to change`
                        : 'Add image. JPG, PNG no more than 10MB'
                }
                aria-live="assertive"
            >
                <Icons.FileDownloadIcon />
                <div className="file-upload-text">
                    {selectedFile ? (
                        <p>{selectedFile.name}</p>
                    ) : (
                        <>
                            <p className="file-upload-text-title">
                                {t('forms.selectImage.label')}
                            </p>
                            <p className="file-upload-text-subtitle">
                                {error
                                    ? error
                                    : t('forms.selectImage.subtitle')}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
