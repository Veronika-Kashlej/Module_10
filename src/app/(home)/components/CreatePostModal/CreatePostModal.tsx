import { Portal } from '@/components/Portal/Portal';
import './CreatePostModal.css';
import { Icons } from '@/components/Icons/Icons';
import { Forms } from '@/forms/Forms';

interface CreatePostModalProps {
    onClose: () => void;
    onAddPost: () => void;
}

function CreatePostModal({ onClose, onAddPost }: CreatePostModalProps) {
    return (
        <Portal>
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <p className="modal-title">Create a new post</p>
                        <Icons.CrossIcon onClick={onClose} />
                    </div>
                    <Forms.CreatePostForm
                        onAddPost={onAddPost}
                        onClose={onClose}
                    />
                </div>
            </div>
        </Portal>
    );
}

export default CreatePostModal;
