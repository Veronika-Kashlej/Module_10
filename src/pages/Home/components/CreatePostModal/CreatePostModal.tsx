import './CreatePostModal.css';
import { Icons } from '../../../../components/Icons/Icons';
import { Portal } from '../../../../components/Portal/Portal';
import { Forms } from '../../../../forms/Forms';
import { useTranslation } from 'react-i18next';

interface CreatePostModalProps {
    onClose: () => void;
    onAddPost: () => void;
}

function CreatePostModal({ onClose, onAddPost }: CreatePostModalProps) {
    const { t } = useTranslation();

    return (
        <Portal>
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <p className="modal-title">
                            {t('pages.home.postModal.title')}
                        </p>
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
