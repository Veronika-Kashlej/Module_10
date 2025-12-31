import { useEffect, useState } from "react";
import { CommunitiesSection } from "./components/CommunitiesSection/CommunitiesSection";
import { CreatePostSection } from "./components/CreatePostSection/CreatePostSection";
import { PostCard } from "./components/PostCard/PostCard";
import { SuggestedPeopleSection } from "./components/SuggestedPeopleSection/SuggestedPeopleSection";
import { useAuth } from "../../store/contexts/AuthContext";
import "./Home.css";
import { postsAPI } from "../../store/api";
import { LikedPost, Post } from "../../store/types";

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isAuthenticated } = useAuth();
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);

  useEffect(() => {
    fetchPosts();

    const fetchLikedPosts = async () => {
      try {
        const response = await postsAPI.getCurrentUsersLikedPosts();
        setLikedPosts(response.data);
      } catch (err) {
        console.error("Failed to fetch liked posts:", err);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
      fetchLikedPosts();
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      const response = await postsAPI.getPosts();
      setPosts(response.data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleAddPost = () => {
    fetchPosts();
  };

  return (
    <main
      className="home-page"
      style={{
        justifyContent:
          isAuthenticated && window.innerWidth > 1175 ? "flex-end" : "center",
      }}
    >
      <div className="main-content">
        {isAuthenticated && (
          <CreatePostSection onAddPost={handleAddPost}></CreatePostSection>
        )}
        <div className="posts-list">
          {[...posts].reverse().map((post) => (
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
  );
}
