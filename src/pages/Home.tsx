import { useState } from "react";
import { CommunitiesSection } from "../components/CommunitiesSection/CommunitiesSection";
import { CreatePostSection } from "../components/CreatePostSection/CreatePostSection";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../components/Header/Header";
import { PostCard } from "../components/PostCard/PostCard";
import { SuggestedPeopleSection } from "../components/SuggestedPeopleSection/SuggestedPeopleSection";

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
  const [posts, setPosts] = useState(initialPosts);

  function handleLikePost(postId: number) {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const likesCount = post.isLiked ? --post.likes : ++post.likes;
          return { ...post, isLiked: !post.isLiked, likes: likesCount };
        }
        return post;
      })
    );
  }

  function handleAddComment(postId: number, commentText: string) {
    if (!commentText.trim()) return;

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: post.comments.length + 1,
            text: commentText,
            author: "You",
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
            showComments: true,
          };
        }
        return post;
      })
    );
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
