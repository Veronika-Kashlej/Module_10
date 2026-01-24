import { useState } from 'react';
import './CreatePostSection.css';
import Image from 'next/image';
import { useUser } from '@/store/contexts/UserContext';
import CreatePostModal from '../CreatePostModal/CreatePostModal';

interface CreatePostSectionProps {
    onAddPost: () => void;
}

export function CreatePostSection({ onAddPost }: CreatePostSectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useUser();

    const openCreatePostModal = () => {
        setIsModalOpen(true);
    };

    const closeCreatePostModal = () => {
        setIsModalOpen(false);
    };

    return (
        <section className="create-post-section">
            <div className="create-post-info">
                {user && (
                    <Image
                        src={user.profileImage}
                        className="create-post-image"
                        width={64}
                        height={64}
                        alt="avatar"
                    ></Image>
                )}
                <p>What&apos;s happening?</p>
            </div>
            <button onClick={openCreatePostModal} aria-label="create post">
                Tell everyone
            </button>
            {isModalOpen && (
                <CreatePostModal
                    onClose={closeCreatePostModal}
                    onAddPost={onAddPost}
                />
            )}
        </section>
    );
}
