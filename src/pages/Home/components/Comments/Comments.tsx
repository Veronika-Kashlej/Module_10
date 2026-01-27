import { useAuth } from '../../../../store/contexts/AuthContext';
import { useUser } from '../../../../store/contexts/UserContext';
import { Comment } from '../../../../store/types';
import { Forms } from '../../../../forms/Forms';
import { Icons } from '../../../../components/Icons/Icons';
import './Comments.css';
import { postsAPI } from '../../../../utils/api/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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
    const { isAuthenticated } = useAuth();
    const { user } = useUser();
    const queryClient = useQueryClient();

    const { data: comments = [] } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () => postsAPI.getComments(postId),
        select: (response) => response.data,
        enabled: isAuthenticated && areVisibleComments,
        staleTime: 2 * 60 * 1000,
    });

    useEffect(() => {
        if (comments.length > 0) {
            onChangeCommentsCount(comments.length);
        }
    }, [comments, onChangeCommentsCount]);

    const createCommentMutation = useMutation({
        mutationFn: (text: string) => postsAPI.createComment({ postId, text }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
        onError: (error) => {
            console.error('Failed to create comment:', error);
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => postsAPI.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
        onError: (error) => {
            console.error('Failed to delete comment:', error);
        },
    });

    const handleAddComment = async (text: string) => {
        if (!text.trim() || !user) return;
        await createCommentMutation.mutateAsync(text);
    };

    const handleDeleteComment = async (commentId: number) => {
        await deleteCommentMutation.mutateAsync(commentId);
    };

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
