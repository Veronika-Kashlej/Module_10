import { CommunitiesSection } from './components/CommunitiesSection/CommunitiesSection';
import { CreatePostSection } from './components/CreatePostSection/CreatePostSection';
import { PostCard } from './components/PostCard/PostCard';
import { SuggestedPeopleSection } from './components/SuggestedPeopleSection/SuggestedPeopleSection';
import { useAuth } from '../../store/contexts/AuthContext';
import './Home.css';
import { Header } from '../../components/Header/Header';
import { PostSkeleton } from 'components/Skeletons/PostSkeleton/PostSkeleton';
import { postsAPI } from '../../utils/api/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ErrorBoundaryFallback } from '../../components/ErrorBoundaryFallback/ErrorBoundaryFallback';

function Home() {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();

    const {
        data: postsData,
        isLoading: isPostsLoading,
        isError: isPostsError,
        error: postsError,
    } = useQuery({
        queryKey: ['posts'],
        queryFn: postsAPI.getPosts,
        select: (response) => response.data,
    });

    const {
        data: likedPostsData,
        isLoading: isLikedPostsLoading,
        isError: isLikedPostsError,
        error: likedPostsError,
    } = useQuery({
        queryKey: ['likedPosts'],
        queryFn: postsAPI.getCurrentUsersLikedPosts,
        select: (response) => response.data,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    const handleAddPost = () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
    };

    const posts = postsData || [];
    const likedPosts = likedPostsData || [];

    if (isPostsError || isLikedPostsError) {
        console.error('Fetching error:', postsError || likedPostsError);
        return <ErrorBoundaryFallback />;
    }

    const reversedPosts = [...posts].reverse();

    const isLoading =
        isPostsLoading || (isAuthenticated && isLikedPostsLoading);

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
                        <CreatePostSection onAddPost={handleAddPost} />
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
                                  />
                              ))}
                    </div>
                </div>
                {isAuthenticated && (
                    <div className="asides">
                        <SuggestedPeopleSection />
                        <CommunitiesSection />
                    </div>
                )}
            </main>
        </>
    );
}

export default Home;
