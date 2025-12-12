import { useState } from "react";
import "./CreatePostSection.css";
import { CreatePostModal } from "../CreatePostModal/CreatePostModal";

interface CreatePostSectionProps {
  onAddPost: (description: string, imageUrl?: string) => void;
}

export function CreatePostSection({ onAddPost }: CreatePostSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openCreatePostModal() {
    setIsModalOpen(true);
  }

  function closeCreatePostModal() {
    setIsModalOpen(false);
  }

  return (
    <article className="create-post-section">
      <div className="create-post-info">
        <div className="create-post-image"></div>
        <p>What's happening?</p>
      </div>
      <button onClick={openCreatePostModal}>Tell everyone</button>
      {isModalOpen && (
        <CreatePostModal onClose={closeCreatePostModal} onAddPost={onAddPost} />
      )}
    </article>
  );
}
