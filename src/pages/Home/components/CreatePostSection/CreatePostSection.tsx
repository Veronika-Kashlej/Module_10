import { useState } from "react";
import "./CreatePostSection.css";
import { CreatePostModal } from "./components/CreatePostModal/CreatePostModal";
import { useAuth } from "../../../../store/contexts/AuthContext";

interface CreatePostSectionProps {
  onAddPost: () => void;
}

export function CreatePostSection({ onAddPost }: CreatePostSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const openCreatePostModal = () => {
    setIsModalOpen(true);
  };

  const closeCreatePostModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="create-post-section">
      <div className="create-post-info">
        <img
          src={user?.profileImage}
          className="create-post-image"
          alt="avatar"
        ></img>
        <p>What's happening?</p>
      </div>
      <button onClick={openCreatePostModal}>Tell everyone</button>
      {isModalOpen && (
        <CreatePostModal onClose={closeCreatePostModal} onAddPost={onAddPost} />
      )}
    </section>
  );
}
