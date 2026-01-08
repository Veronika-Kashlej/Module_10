import { useCallback, useEffect, useState } from 'react';
import { CommentList } from './components/CommentList/CommentList';
import { useAuth } from '../../../../../../store/contexts/AuthContext';
import { postsAPI } from '../../../../../../store/api';
import { Comment } from '../../../../../../store/types';
import { Forms } from '../../../../../../components/Forms/Forms';

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
    const { isAuthenticated, user } = useAuth();

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
