import "./CreatePostModal.css";
import { FileUploadInput } from "../FileUploadInput/FileUploadInput";
import { useEffect, useState } from "react";
import { Icons } from "../Icons/Icons";

interface CreatePostModalProps {
  onClose: () => void;
  onAddPost: (description: string, imageUrl?: string) => void;
}

export function CreatePostModal({ onClose, onAddPost }: CreatePostModalProps) {
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSubmit = () => {
    if (!description.trim()) return;
    let imageUrl = null;
    if (selectedFile && imagePreview) {
      imageUrl = imagePreview;
      console.log(imageUrl);
    }

    if (imageUrl) {
      onAddPost(description, imageUrl);
    } else {
      onAddPost(description);
    }
    onClose();
    setDescription("");
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <p className="modal-title">Create a new post</p>
          <Icons.CrossIcon onClick={onClose} />
        </div>
        <form action="#">
          <fieldset>
            <label htmlFor="post-title">
              <Icons.EmailIcon />
              <span>Post Title</span>
            </label>
            <input
              type="text"
              name="post-title"
              id="post-title"
              placeholder="Enter post title"
            />
          </fieldset>
          <fieldset>
            <label htmlFor="post-description">
              <Icons.PencilIcon />
              <span>Description</span>
            </label>
            <textarea
              name="post-description"
              id="post-description"
              placeholder="Write description here..."
              value={description}
              onChange={handleDescriptionChange}
              required
            />
          </fieldset>
          <FileUploadInput onFileSelect={handleFileSelect}></FileUploadInput>
          <button onClick={handleSubmit}>Create</button>
        </form>
      </div>
    </div>
  );
}
