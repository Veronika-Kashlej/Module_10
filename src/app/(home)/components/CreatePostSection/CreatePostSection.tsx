import { lazy, Suspense, useState } from 'react';
import './CreatePostSection.css';
import { useAuth } from '../../../../store/contexts/AuthContext';
import { Loader } from '../../../../components/Loader/Loader';
import Image from 'next/image';
const CreatePostModal = lazy(
    () => import('./components/CreatePostModal/CreatePostModal')
);

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
                <Image
                    src={user!.profileImage}
                    className="create-post-image"
                    width={64}
                    height={64}
                    alt="avatar"
                ></Image>
                <p>What&apos;s happening?</p>
            </div>
            <button onClick={openCreatePostModal} aria-label="create post">
                Tell everyone
            </button>
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
