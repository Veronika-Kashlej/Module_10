import { SectionItem } from '../../../../components/SectionItem/SectionItem';
import './PostCard.css';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { LikedPost, Post, User } from '../../../../store/types';
import { Icons } from '../../../../components/Icons/Icons';
import { useAuth } from '../../../../store/contexts/AuthContext';
import { formatCreationDate } from '../../../../utils/formatCreationDate';
import { postsAPI } from '../../../../utils/api/api';
import Image from 'next/image';
import { SectionItemSkeleton } from '@/components/Skeletons/SectionItemSkeleton/SectionItemSkeleton';
import { LikesSection } from '../Likes/LikesSection';
import { Comments } from '../Comments/Comments';
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
    const [commentsCount, setCommentsCount] = useState(post.commentsCount + 1);
    const [author, setAuthor] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAuthor = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await postsAPI.getUser(post.authorId);
            setAuthor(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [post.authorId]);

    useEffect(() => {
        fetchAuthor();
    }, [fetchAuthor, post.authorId]);

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
                ></SectionItem>
            )}
            {post.image && (
                <Image
                    src={post.image}
                    className="post-image"
                    alt="post-image"
                    width={100}
                    height={100}
                ></Image>
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
                            <Icons.ShowCommentIcon
                                areVisibleComments={areVisibleComments}
                                onClick={handleToggleComments}
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
