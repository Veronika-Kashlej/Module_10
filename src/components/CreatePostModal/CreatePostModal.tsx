import MailIcon from "../../assets/icons/mail-icon.png";
import PencilIcon from "../../assets/icons/fi-rr-pencil.png";
import CrossIcon from "../../assets/icons/cross-icon.png";
import "./CreatePostModal.css";
import { FileUploadInput } from "../FileUploadInput/FileUploadInput";

interface CreatePostModalProps {
  onClose: () => void;
}

export function CreatePostModal({ onClose }: CreatePostModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <p className="modal-title">Create a new post</p>
          <img
            src={CrossIcon}
            alt="close modal icon"
            className="close-modal-btn"
            onClick={onClose}
          />
        </div>
        <form action="#">
          <fieldset>
            <label htmlFor="post-title">
              <img src={MailIcon} alt="mail icon" />
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
              <img src={PencilIcon} alt="pencil icon" />
              <span>Description</span>
            </label>
            <textarea
              name="post-description"
              id="post-description"
              placeholder="Write description here..."
            />
          </fieldset>
          <FileUploadInput></FileUploadInput>
        </form>
        <button>Create</button>
      </div>
    </div>
  );
}
