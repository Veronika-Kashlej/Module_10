import { SectionItem } from "../SectionItem/SectionItem";
import { LikeIcon } from "./LikeIcon/LikeIcon";
import commentIcon from "../../assets/icons/message-square.png";
import editCommentIcon from "../../assets/icons/fi-rr-pencil.png";
import ToggleCommentIcon from "../../assets/icons/toggle-comment-icon.png";
import DeleteCommentIcon from "../../assets/icons/delete-comment-icon.png";
import "./PostCard.css";
import { useContext, useState } from "react";
import { Post } from "../../store/types";
import { AuthContext } from "../../store/contexts/AuthContext";

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
  const [commentText, setCommentText] = useState("");
  const [shouldShowComments, setShouldShowComments] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  function handleSubmitCommit() {
    onAddComment(commentText);
    setCommentText("");
  }

  function handleToggleComments() {
    setShouldShowComments(!shouldShowComments);
  }

  return (
    <div className="post-card">
      <SectionItem title={post.username} subtitle={post.timeAgo}></SectionItem>
      {post.imageUrl && <img src={post.imageUrl} className="post-image"></img>}
      <p className="post-description">{post.description}</p>
      <div className="likes-and-comments-block">
        <div className="likes-block">
          <LikeIcon onClick={onLike} isLiked={post.isLiked} />
          <p>{post.likes} likes</p>
        </div>
        <div className="comments-block">
          <img src={commentIcon} alt="comment" />
          {isAuthenticated ? (
            <>
              <p>{post.comments.length} comments</p>
              <img
                style={{
                  cursor: "pointer",
                  transform: shouldShowComments ? "none" : "rotate(180deg)",
                }}
                onClick={handleToggleComments}
                src={ToggleCommentIcon}
                alt="toggle comment"
              />
            </>
          ) : (
            <p>You have to login to see the comments</p>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <>
          <div className="comments-list">
            {post.comments.map((comment, index) => (
              <div
                key={index}
                className="comment-item"
                style={{ display: shouldShowComments ? "flex" : "none" }}
              >
                <p>
                  #{comment.id}. {comment.text}
                </p>
                <img
                  className="delete-comment-btn"
                  onClick={() => onDeleteComment(comment.id)}
                  src={DeleteCommentIcon}
                  alt="delete comment"
                />
              </div>
            ))}
          </div>
          <label htmlFor={`comment-${post.id}`}>
            <img src={editCommentIcon} alt="edit comment" />
            <span>Add a comment</span>
          </label>
          <textarea
            name="comment"
            id={`comment-${post.id}`}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write description here..."
          ></textarea>
          <button onClick={handleSubmitCommit}>Add a comment</button>
        </>
      )}
    </div>
  );
}
