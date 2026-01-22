import { Comment } from '../../../../../../../../store/types';
import { Icons } from '../../../../../../../../components/Icons/Icons';
import './CommentList.css';
import { useUser } from '../../../../../../../../store/contexts/UserContext';
interface CommentListProps {
    areVisibleComments: boolean;
    onDeleteComment: (commentId: number) => void;
    comments: Comment[];
}

export function CommentList({
    areVisibleComments,
    onDeleteComment,
    comments,
}: CommentListProps) {
    const { user } = useUser();

    return (
        <div className="comments-list">
            {comments.map((comment, index) => (
                <div
                    key={comment.id}
                    className="comment-item"
                    style={{ display: areVisibleComments ? 'flex' : 'none' }}
                >
                    <p>
                        #{index + 1}. {comment.text}
                    </p>
                    {user?.id === comment.authorId && (
                        <Icons.TrashIcon
                            onClick={() => onDeleteComment(comment.id)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
