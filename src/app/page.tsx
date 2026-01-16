'use client';

import { Header } from '@/components/Header/Header';
import { PostSkeleton } from '@/components/Skeletons/PostSkeleton/PostSkeleton';
import { CommunitiesSection } from '@/app/(home)/components/CommunitiesSection/CommunitiesSection';
import { CreatePostSection } from '@/app/(home)/components/CreatePostSection/CreatePostSection';
import { PostCard } from '@/app/(home)/components/PostCard/PostCard';
import { SuggestedPeopleSection } from '@/app/(home)/components/SuggestedPeopleSection/SuggestedPeopleSection';
import { postsAPI } from '@/store/api/api';
import { useAuth } from '@/store/contexts/AuthContext';
import { LikedPost, Post } from '@/store/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './(home)/Home.css';

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);
    const { isAuthenticated } = useAuth();
    const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);

        try {
            const response = await postsAPI.getPosts();
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchLikedPosts = useCallback(async () => {
        if (!isAuthenticated) return;

        try {
            const response = await postsAPI.getCurrentUsersLikedPosts();
            setLikedPosts(response.data);
        } catch (err) {
            console.error('Failed to fetch liked posts:', err);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        fetchLikedPosts();
    }, [fetchLikedPosts]);

    const handleAddPost = useCallback(() => {
        fetchPosts();
    }, [fetchPosts]);

    const reversedPosts = useMemo(() => {
        return [...posts].reverse();
    }, [posts]);

    return (
        <>
            <Header />
            <main
                className="home-page"
                style={{
                    justifyContent:
                        isAuthenticated && window.innerWidth > 1175
                            ? 'flex-end'
                            : 'center',
                }}
            >
                <div className="main-content">
                    {isAuthenticated && (
                        <CreatePostSection
                            onAddPost={handleAddPost}
                        ></CreatePostSection>
                    )}
                    <div className="posts-list">
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, index) => (
                                  <PostSkeleton
                                      key={`post-skeleton-${index}`}
                                  />
                              ))
                            : reversedPosts.map((post) => (
                                  <PostCard
                                      key={post.id}
                                      post={post}
                                      likedPosts={likedPosts}
                                  ></PostCard>
                              ))}
                    </div>
                </div>
                {isAuthenticated && (
                    <div className="asides">
                        <SuggestedPeopleSection></SuggestedPeopleSection>
                        <CommunitiesSection></CommunitiesSection>
                    </div>
                )}
            </main>
        </>
    );
}

export default Home;
