import { useCallback, useState } from 'react';
import { Icons } from '../../../../../../components/Icons/Icons';
import { postsAPI } from '../../../../../../store/api';
import { LikedPost, Post } from '../../../../../../store/types';

interface LikesSectionProps {
    post: Post;
    likedPosts: LikedPost[];
}

export function LikesSection({ post, likedPosts }: LikesSectionProps) {
    const [isLiked, setIsLiked] = useState(
        likedPosts.some((item) => item.postId === post.id)
    );
    const [likesCount, setLikesCount] = useState(post.likedByUsers.length);

    const handleLikePost = useCallback(async () => {
        if (isLiked) {
            await postsAPI.dislikePost(post.id);
            setLikesCount(likesCount - 1);
        } else {
            await postsAPI.likePost(post.id);
            setLikesCount(likesCount + 1);
        }
        setIsLiked(!isLiked);
    }, [isLiked, likesCount, post.id]);
    return (
        <div className="likes-block">
            <Icons.LikeIcon onClick={handleLikePost} isLiked={isLiked} />
            <p>{likesCount} likes</p>
        </div>
    );
}
