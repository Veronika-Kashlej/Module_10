import "./CreatePostModal.css";
import { FileUploadInput } from "../FileUploadInput/FileUploadInput";
import { useEffect, useState } from "react";
import { EmailIcon } from "../../assets/icons/email-icon";
import { CrossIcon } from "../../assets/icons/cross-icon";
import { PencilIcon } from "../../assets/icons/pencil-icon";

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

  function handleSubmit() {
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
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <p className="modal-title">Create a new post</p>
          <CrossIcon onClick={onClose} />
        </div>
        <form action="#">
          <fieldset>
            <label htmlFor="post-title">
              <EmailIcon />
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
              <PencilIcon />
              <span>Description</span>
            </label>
            <textarea
              name="post-description"
              id="post-description"
              placeholder="Write description here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </fieldset>
          <FileUploadInput onFileSelect={handleFileSelect}></FileUploadInput>
        </form>
        <button onClick={handleSubmit}>Create</button>
      </div>
    </div>
  );
}
