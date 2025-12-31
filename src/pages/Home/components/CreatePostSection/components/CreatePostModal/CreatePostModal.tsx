import "./CreatePostModal.css";
import { FileUploadInput } from "../../../../../../components/FileUploadInput/FileUploadInput";
import { useEffect, useState } from "react";
import { Icons } from "../../../../../../components/Icons/Icons";
import { Portal } from "../../../../../../components/Portal/Portal";
import { postsAPI } from "../../../../../../store/api";

interface CreatePostModalProps {
  onClose: () => void;
  onAddPost: () => void;
}

export function CreatePostModal({ onClose, onAddPost }: CreatePostModalProps) {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
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

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let imageUrl: string | undefined = undefined;
      if (imagePreview) {
        imageUrl = imagePreview;
      }

      await postsAPI.createPost({
        title,
        content: description,
        image: imageUrl,
      });

      onAddPost();

      onClose();
      setDescription("");
      setSelectedFile(null);
      setImagePreview(null);
      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Portal>
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
                onChange={handleTitleChange}
                required
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
    </Portal>
  );
}
