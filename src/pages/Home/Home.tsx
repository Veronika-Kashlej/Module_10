import { useEffect, useReducer, useState } from "react";
import { CommunitiesSection } from "./components/CommunitiesSection/CommunitiesSection";
import { CreatePostSection } from "./components/CreatePostSection/CreatePostSection";
import { PostCard } from "./components/PostCard/PostCard";
import { SuggestedPeopleSection } from "./components/SuggestedPeopleSection/SuggestedPeopleSection";
import { postsReducer } from "../../store/postsReducer";
import { useAuth } from "../../store/contexts/AuthContext";
import "./Home.css";
import { postsAPI } from "../../store/api";
import { LikedPost } from "../../store/types";

export function Home() {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const { isAuthenticated } = useAuth();
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsAPI.getPosts();
        dispatch({ type: "SET_POSTS", payload: { posts: response.data } });
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

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

  const handleAddPost = (description: string, imageUrl?: string) => {
    dispatch({
      type: "ADD_POST",
      payload: { description: description, imageUrl: imageUrl },
    });
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
          {posts.map((post) => (
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
