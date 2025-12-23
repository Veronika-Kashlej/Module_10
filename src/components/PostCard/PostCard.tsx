import { SectionItem } from "../SectionItem/SectionItem";
import "./PostCard.css";
import { useContext, useState } from "react";
import { Post } from "../../store/types";
import { AuthContext } from "../../store/contexts/AuthContext";
import { AddCommentForm } from "./components/AddCommentForm/AddCommentForm";
import { CommentList } from "./components/CommentList/CommentList";
import { Icons } from "../Icons/Icons";

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onAddComment: (comment: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export function PostCard({
  post,
  onLike,
  onAddComment,
  onDeleteComment,
}: PostCardProps) {
  const [shouldShowComments, setShouldShowComments] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  function handleToggleComments() {
    setShouldShowComments(!shouldShowComments);
  }

  return (
    <div className="post-card">
      <SectionItem title={post.username} subtitle={post.timeAgo}></SectionItem>
      {post.imageUrl && (
        <img src={post.imageUrl} className="post-image" alt="post-image"></img>
      )}
      <p className="post-description">{post.description}</p>
      <div
        className="likes-and-comments-block"
        style={{ marginBottom: shouldShowComments ? "" : "-12px" }}
      >
        <div className="likes-block">
          <Icons.LikeIcon onClick={onLike} isLiked={post.isLiked} />
          <p>{post.likes} likes</p>
        </div>
        <div className="comments-block">
          <Icons.MessageIcon />
          {isAuthenticated ? (
            <>
              <p>{post.comments.length} comments</p>
              <Icons.ShowCommentIcon
                shouldShowComments={shouldShowComments}
                onClick={handleToggleComments}
              />
            </>
          ) : (
            <p>You have to login to see the comments</p>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <>
          <CommentList
            comments={post.comments}
            shouldShowComments={shouldShowComments}
            onDeleteComment={onDeleteComment}
          />
          <AddCommentForm postId={post.id} onAddComment={onAddComment} />
        </>
      )}
    </div>
  );
}
