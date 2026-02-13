import { useCallback, useState } from 'react';
import { Icons } from '../../../../components/Icons/Icons';
import { LikedPost, Post } from '../../../../store/types';
import { postsAPI } from '../../../../utils/api/api';
import { IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';

interface LikesSectionProps {
    post: Post;
    likedPosts: LikedPost[];
}

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const heartBeatAnimation = keyframes`
  0% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.3); }
  70% { transform: scale(1); }
`;

export function LikesSection({ post, likedPosts }: LikesSectionProps) {
    const [isLiked, setIsLiked] = useState(
        likedPosts.some((item) => item.postId === post.id)
    );
    const [likesCount, setLikesCount] = useState(post.likedByUsers.length);
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLikePost = useCallback(async () => {
        if (isAnimating) return;

        setIsAnimating(true);

        try {
            if (isLiked) {
                await postsAPI.dislikePost(post.id);
                setLikesCount(likesCount - 1);
            } else {
                await postsAPI.likePost(post.id);
                setLikesCount(likesCount + 1);
            }
            setIsLiked(!isLiked);
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [isLiked, isAnimating, post.id, likesCount]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                handleLikePost();
            }
        },
        [handleLikePost]
    );

    return (
        <div className="likes-block">
            <IconButton
                onClick={handleLikePost}
                onKeyDown={handleKeyDown}
                disabled={isAnimating}
                aria-label={isLiked ? 'dislike post' : 'like post'}
                component="button"
                type="button"
                sx={{
                    padding: '4px',
                    animation: isAnimating
                        ? `${isLiked ? heartBeatAnimation : pulseAnimation} 0.8s ease`
                        : 'none',
                    '&:hover': {
                        backgroundColor: 'transparent',
                        animation: `${pulseAnimation} 0.5s ease`,
                    },
                    '&:hover svg': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease',
                    },
                }}
            >
                <Icons.LikeIcon isLiked={isLiked} />
            </IconButton>
            <p>{likesCount} likes</p>
        </div>
    );
}
