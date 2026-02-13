import './CreatePostModal.css';
import { Icons } from '../../../../components/Icons/Icons';
import { Portal } from '../../../../components/Portal/Portal';
import { Forms } from '../../../../forms/Forms';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';

interface CreatePostModalProps {
    onClose: () => void;
    onAddPost: () => void;
}

function CreatePostModal({ onClose, onAddPost }: CreatePostModalProps) {
    const { t } = useTranslation();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    });

    return (
        <Portal>
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-header">
                        <p className="modal-title">
                            {t('pages.home.postModal.title')}
                        </p>
                        <button
                            className="close-modal-btn"
                            ref={closeButtonRef}
                            onClick={onClose}
                            aria-label="close modal"
                        >
                            <Icons.CrossIcon />
                        </button>
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
