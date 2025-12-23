import { useRef, useState } from "react";
import "./FileUploadInput.css";
import { Icons } from "../Icons/Icons";

interface FileUploadInputProps {
  onFileSelect: (file: File) => void;
}

export function FileUploadInput({ onFileSelect }: FileUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ACCEPTED_TYPES = [".jpg", ".jpeg", ".png"];

  function handleClick() {
    setError(null);
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  }

  function validateAndSetFile(file: File) {
    setError(null);

    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(fileExtension)) {
      setError(
        `Unsupported file format. Allowed: ${ACCEPTED_TYPES.join(", ")}`
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`The file is too large (${fileSizeMB} MB). Maximum size: 10MB`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
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
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  return (
    <div className="file-upload-container">
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <div
        className={`file-upload-dropzone ${isDragging ? "dragging" : ""} ${error ? "error" : ""}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <Icons.FileDownloadIcon />
        <div className="file-upload-text">
          {selectedFile ? (
            <p>{selectedFile.name}</p>
          ) : (
            <>
              <p className="file-upload-text-title">
                Select a file or drag and drop here
              </p>
              <p className="file-upload-text-subtitle">
                {error ? error : "JPG, or PNG, no more than 10MB"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
