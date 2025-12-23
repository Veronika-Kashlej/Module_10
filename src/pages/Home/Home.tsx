import { useReducer } from "react";
import { CommunitiesSection } from "../../components/CommunitiesSection/CommunitiesSection";
import { CreatePostSection } from "../../components/CreatePostSection/CreatePostSection";
import { PostCard } from "../../components/PostCard/PostCard";
import { SuggestedPeopleSection } from "../../components/SuggestedPeopleSection/SuggestedPeopleSection";
import { postsReducer } from "../../store/postsReducer";
import { useAuth } from "../../store/contexts/AuthContext";
import img1 from "../../assets/images/img-1.png";
import img2 from "../../assets/images/img-2.png";
import "./Home.css";

const initialPosts = [
  {
    id: 1,
    username: "Helena",
    timeAgo: "3 min ago",
    description: "Post description",
    imageUrl: img1,
    likes: 21,
    comments: [
      { id: 1, text: "Great post!", author: "User1" },
      { id: 2, text: "Nice!", author: "User2" },
    ],
    isLiked: false,
  },
  {
    id: 2,
    username: "Charlies",
    timeAgo: "3 hours ago",
    description:
      "Body text for a post. Since it’s a social app, sometimes it’s a hot take, and sometimes it’s a question.",
    likes: 6,
    comments: [{ id: 1, text: "Awesome!", author: "User3" }],
    isLiked: false,
  },
  {
    id: 3,
    username: "Oskar",
    timeAgo: "1 day ago",
    imageUrl: img2,
    description: "Pics from my most recent hike ✌️",
    likes: 58,
    comments: [],
    isLiked: false,
  },
  {
    id: 4,
    username: "Daniel Jay Park",
    timeAgo: "3 hrs ago",
    description:
      "Body text for a post. Since it’s a social app, sometimes it’s an observation, and sometimes it’s seeking recommendations.",
    likes: 4,
    comments: [],
    isLiked: false,
  },
  {
    id: 5,
    username: "Mark Rojas",
    timeAgo: "6 hrs ago",
    description:
      "Body text for a post. Since it’s a social app, sometimes it’s sharing tips, and sometimes it’s freeloading.",
    likes: 85,
    comments: [],
    isLiked: false,
  },
];

export function Home() {
  const [posts, dispatch] = useReducer(postsReducer, initialPosts);
  const { isAuthenticated } = useAuth();

  const handleLikePost = (postId: number) => {
    dispatch({
      type: "LIKE_POST",
      payload: { postId },
    });
  };

  const handleAddComment = (postId: number, commentText: string) => {
    if (!commentText.trim()) return;
    dispatch({
      type: "ADD_COMMENT",
      payload: { postId, commentText },
    });
  };

  const handleDeleteComment = (postId: number, commentId: number) => {
    dispatch({
      type: "DELETE_COMMENT",
      payload: { postId, commentId },
    });
  };

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
              onLike={() => handleLikePost(post.id)}
              onAddComment={(comment) => handleAddComment(post.id, comment)}
              onDeleteComment={(commentId) =>
                handleDeleteComment(post.id, commentId)
              }
            ></PostCard>
          ))}
        </div>
      </div>
      {isAuthenticated && (
        <div className="sections">
          <SuggestedPeopleSection></SuggestedPeopleSection>
          <CommunitiesSection></CommunitiesSection>
        </div>
      )}
    </main>
  );
}
