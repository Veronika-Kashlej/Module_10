import { useReducer, useState } from "react";
import { CommunitiesSection } from "../components/CommunitiesSection/CommunitiesSection";
import { CreatePostSection } from "../components/CreatePostSection/CreatePostSection";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { PostCard } from "../components/PostCard/PostCard";
import { SuggestedPeopleSection } from "../components/SuggestedPeopleSection/SuggestedPeopleSection";
import { postsReducer } from "../store/postsReducer";

const initialPosts = [
  {
    id: 1,
    username: "Helena",
    timeAgo: "3 min ago",
    description: "Post description 1",
    likes: 21,
    comments: [
      { id: 1, text: "Great post!", author: "User1" },
      { id: 2, text: "Nice!", author: "User2" },
    ],
    isLiked: false,
  },
  {
    id: 2,
    username: "John",
    timeAgo: "10 min ago",
    description: "Post description 2",
    likes: 15,
    comments: [{ id: 1, text: "Awesome!", author: "User3" }],
    showComments: false,
    isLiked: false,
  },
  {
    id: 3,
    username: "Sarah",
    timeAgo: "1 hour ago",
    description: "Post description 3",
    likes: 8,
    comments: [],
    showComments: false,
    isLiked: false,
  },
];

export function Home() {
  const [posts, dispatch] = useReducer(postsReducer, initialPosts);

  function handleLikePost(postId: number) {
    dispatch({
      type: "LIKE_POST",
      payload: { postId },
    });
  }

  function handleAddComment(postId: number, commentText: string) {
    if (!commentText.trim()) return;
    dispatch({
      type: "ADD_COMMENT",
      payload: { postId, commentText },
    });
  }

  function handleDeleteComment(postId: number, commentId: number) {
    dispatch({
      type: "DELETE_COMMENT",
      payload: { postId, commentId },
    });
  }

  return (
    <>
      <Header></Header>
      <main>
        <div className="main-content">
          <CreatePostSection></CreatePostSection>
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
        <div className="sections">
          <SuggestedPeopleSection></SuggestedPeopleSection>
          <CommunitiesSection></CommunitiesSection>
        </div>
      </main>
      <Footer></Footer>
    </>
  );
}
