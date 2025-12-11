import { SectionItem } from "../SectionItem/SectionItem";
import { LikeIcon } from "./LikeIcon/LikeIcon";
import commentIcon from "../../assets/icons/message-square.png";
import editCommentIcon from "../../assets/icons/fi-rr-pencil.png";
import ToggleCommentIcon from "../../assets/icons/toggle-comment-icon.png";
import "./PostCard.css";
import { useState } from "react";

interface Post {
  id: number;
  username: string;
  timeAgo: string;
  description: string;
  likes: number;
  comments: Comment[];
  isLiked: boolean;
}

interface Comment {
  id: number;
  text: string;
  author: string;
}

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onAddComment: (comment: string) => void;
}

export function PostCard({ post, onLike, onAddComment }: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [shouldShowComments, setShouldShowComments] = useState(false);

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
      <div className="post-image"></div>
      <p className="post-description">{post.description}</p>
      <div className="likes-and-comments-block">
        <div className="likes-block">
          <LikeIcon onClick={onLike} isLiked={post.isLiked} />
          <p>{post.likes} likes</p>
        </div>
        <div className="comments-block">
          <img src={commentIcon} alt="comment" />
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
        </div>
      </div>
      <div className="all-comments">
        {post.comments.map((comment) => (
          <p style={{ display: shouldShowComments ? "flex" : "none" }}>
            #{comment.id}. {comment.text}
          </p>
        ))}
      </div>
      <label htmlFor="comment">
        <img src={editCommentIcon} alt="edit comment" />
        Add a comment
      </label>
      <textarea
        name="comment"
        id="comment"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Write description here..."
      ></textarea>
      <button onClick={handleSubmitCommit}>Add a comment</button>
    </div>
  );
}
