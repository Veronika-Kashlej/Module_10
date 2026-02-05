import { SectionItem } from '../../../../components/SectionItem/SectionItem';
import './PostCard.css';
import { memo, useCallback, useMemo, useState } from 'react';
import { LikedPost, Post } from '../../../../store/types';
import { Icons } from '../../../../components/Icons/Icons';
import { Comments } from '../Comments/Comments';
import { LikesSection } from '../Likes/LikesSection';
import { SectionItemSkeleton } from 'components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';
import { formatCreationDate } from '../../../../utils/formatCreationDate';
import { postsAPI } from '../../../../utils/api/api';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../utils/hooks/useAuth';

interface PostCardProps {
    post: Post;
    likedPosts: LikedPost[];
}

export const PostCard = memo(function PostCard({
    post,
    likedPosts,
}: PostCardProps) {
    const [areVisibleComments, setAreVisibleComments] = useState(false);
    const { isAuthenticated } = useAuth();
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);

    const { data: author, isLoading } = useQuery({
        queryKey: ['user', post.authorId],
        queryFn: () => postsAPI.getUser(post.authorId),
        select: (response) => response.data,
        staleTime: 5 * 60 * 1000,
        enabled: !!post.authorId,
    });

    const handleToggleComments = useCallback(() => {
        setAreVisibleComments(!areVisibleComments);
    }, [areVisibleComments]);

    const handleCommentsCountChange = useCallback((newCount: number) => {
        setCommentsCount(newCount);
    }, []);

    const authorName = useMemo(() => {
        if (!author) return '';
        return `${author.firstName}`;
    }, [author]);

    return (
        <article className="post-card">
            {isLoading ? (
                <SectionItemSkeleton />
            ) : (
                <SectionItem
                    title={authorName}
                    subtitle={formatCreationDate(post.creationDate)}
                    image={author?.profileImage || 'assets/user-helena.png'}
                />
            )}
            {post.image && (
                <img src={post.image} className="post-image" alt="post-image" />
            )}
            <p className="post-description">{post.content}</p>
            <div
                className="likes-and-comments-block"
                style={{ marginBottom: areVisibleComments ? '' : '-12px' }}
            >
                <LikesSection post={post} likedPosts={likedPosts} />
                <div className="comments-block">
                    <Icons.MessageIcon />
                    {isAuthenticated ? (
                        <>
                            <p>{commentsCount} comments</p>
                            <button
                                onClick={handleToggleComments}
                                className="toggle-comments-btn"
                                aria-label={
                                    areVisibleComments
                                        ? 'hide comments'
                                        : 'show comments'
                                }
                            ></button>
                            <Icons.ShowCommentIcon
                                areVisibleComments={areVisibleComments}
                            />
                        </>
                    ) : (
                        <p>You have to login to see the comments</p>
                    )}
                </div>
            </div>
            {isAuthenticated && (
                <Comments
                    onChangeCommentsCount={handleCommentsCountChange}
                    postId={post.id}
                    areVisibleComments={areVisibleComments}
                />
            )}
        </article>
    );
});
