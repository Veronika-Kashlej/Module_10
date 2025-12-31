import { SectionItem } from "../../../../components/SectionItem/SectionItem";
import "./PostCard.css";
import { useState } from "react";
import { LikedPost, Post } from "../../../../store/types";
import { Icons } from "../../../../components/Icons/Icons";
import { useAuth } from "../../../../store/contexts/AuthContext";
import { Comments } from "./components/Comments/Comments";
import { LikesSection } from "./components/Likes/LikesSection";

interface PostCardProps {
  post: Post;
  likedPosts: LikedPost[];
}

export function PostCard({ post, likedPosts }: PostCardProps) {
  const [areVisibleComments, setAreVisibleComments] = useState(false);
  const { isAuthenticated } = useAuth();
  const [commentsCount, setCommentsCount] = useState(post.commentsCount + 1);

  const handleToggleComments = () => {
    setAreVisibleComments(!areVisibleComments);
  };

  const handleCommentsCountChange = (newCount: number) => {
    setCommentsCount(newCount);
  };

  return (
    <article className="post-card">
      <SectionItem
        title={"Helena"}
        subtitle={"3 min ago"}
        image={post.authorPhoto}
      ></SectionItem>
      {post.image && (
        <img src={post.image} className="post-image" alt="post-image"></img>
      )}
      <p className="post-description">{post.content}</p>
      <div
        className="likes-and-comments-block"
        style={{ marginBottom: areVisibleComments ? "" : "-12px" }}
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
}
