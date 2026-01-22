import { lazy, Suspense, useState } from 'react';
import './CreatePostSection.css';
import { useUser } from '../../../../store/contexts/UserContext';
import { Loader } from '../../../../components/Loader/Loader';

const CreatePostModal = lazy(
    () => import('../CreatePostModal/CreatePostModal')
);

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
                <img
                    src={user?.profileImage}
                    className="create-post-image"
                    alt="avatar"
                ></img>
                <p>What&apos;s happening?</p>
            </div>
            <button onClick={openCreatePostModal}>Tell everyone</button>
            {isModalOpen && (
                <Suspense fallback={<Loader />}>
                    <CreatePostModal
                        onClose={closeCreatePostModal}
                        onAddPost={onAddPost}
                    />
                </Suspense>
            )}
        </section>
    );
}
