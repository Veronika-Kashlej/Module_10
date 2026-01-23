import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../../store/contexts/AuthContext';
import { Comment } from '../../../../store/types';
import { Forms } from '../../../../forms/Forms';
import { Icons } from '../../../../components/Icons/Icons';
import './Comments.css';
import { postsAPI } from '../../../../utils/api/api';
import { useUser } from '@/store/contexts/UserContext';
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

interface CommentsProps {
    postId: number;
    areVisibleComments: boolean;
    onChangeCommentsCount: (count: number) => void;
}
export function Comments({
    postId,
    areVisibleComments,
    onChangeCommentsCount,
}: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const { isAuthenticated } = useAuth();
    const { user } = useUser();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await postsAPI.getComments(postId);
                setComments(response.data);
                onChangeCommentsCount(response.data.length);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };
        fetchComments();
    }, [isAuthenticated, onChangeCommentsCount, postId]);

    const handleDeleteComment = useCallback(
        async (commentId: number) => {
            await postsAPI.deleteComment(commentId);
            setComments([
                ...comments.filter((comment) => comment.id !== commentId),
            ]);
            onChangeCommentsCount(comments.length - 1);
        },
        [comments, onChangeCommentsCount]
    );

    const handleAddComment = useCallback(
        async (text: string) => {
            if (!text.trim()) return;
            await postsAPI.createComment({ postId, text });
            const newComment = {
                authorId: user!.id,
                creationDate: Date.now().toString(),
                id: comments.length + 1,
                text,
                modifiedDate: '',
                postId: postId,
            };
            setComments([...comments, newComment]);
            onChangeCommentsCount(comments.length + 1);
        },
        [comments, postId, user, onChangeCommentsCount]
    );

    return (
        <>
            <CommentList
                areVisibleComments={areVisibleComments}
                onDeleteComment={handleDeleteComment}
                comments={comments}
            />
            <Forms.AddCommentForm
                postId={postId}
                onAddComment={handleAddComment}
            />
        </>
    );
}
