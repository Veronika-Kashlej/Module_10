import { useAuth } from '../../../../store/contexts/AuthContext';
import { useUser } from '../../../../store/contexts/UserContext';
import { Comment } from '../../../../store/types';
import { Forms } from '../../../../forms/Forms';
import { Icons } from '../../../../components/Icons/Icons';
import { postsAPI } from '../../../../utils/api/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import styled from 'styled-components';

const CommentsListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
`;

const CommentItem = styled.div<{ $areVisibleComments: boolean }>`
    display: ${(props) => (props.$areVisibleComments ? 'flex' : 'none')};
    justify-content: space-between;
    align-items: center;
    max-width: 100%;
    overflow: hidden;
`;

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
        <CommentsListContainer>
            {comments.map((comment, index) => (
                <CommentItem
                    key={comment.id}
                    $areVisibleComments={areVisibleComments}
                >
                    <p>
                        #{index + 1}. {comment.text}
                    </p>
                    {user?.id === comment.authorId && (
                        <Icons.TrashIcon
                            onClick={() => onDeleteComment(comment.id)}
                        />
                    )}
                </CommentItem>
            ))}
        </CommentsListContainer>
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
        onChangeCommentsCount(comments.length);
    }, [comments, onChangeCommentsCount]);

    const createCommentMutation = useMutation({
        mutationFn: (text: string) => postsAPI.createComment({ postId, text }),
        onSuccess: (newComment) => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            queryClient.setQueryData(['comments', postId], (old: any) => {
                const oldData = old?.data || [];
                return {
                    ...old,
                    data: [...oldData, newComment.data],
                };
            });
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
