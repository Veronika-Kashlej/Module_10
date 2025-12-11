import { SectionItem } from "../SectionItem/SectionItem";
import likeIcon from "../../assets/icons/heart.png";
import commentIcon from "../../assets/icons/message-square.png";
import editCommentIcon from "../../assets/icons/fi-rr-pencil.png";
import "./PostCard.css";

export function PostCard() {
  return (
    <div className="post-card">
      <SectionItem title="Helena" subtitle="3 min ago"></SectionItem>
      <div className="post-image"></div>
      <p className="post-description">Post description</p>
      <div className="likes-and-comments-block">
        <div className="likes-block">
          <img src={likeIcon} alt="like" />
          <p>21 likes</p>
        </div>
        <div className="comments-block">
          <img src={commentIcon} alt="comment" />
          <p>2 comments</p>
        </div>
      </div>
      <label htmlFor="comment">
        <img src={editCommentIcon} alt="edit comment" />
        Add a comment
      </label>
      <textarea
        name="comment"
        id="comment"
        placeholder="Write description here..."
      ></textarea>
      <button>Add a comment</button>
    </div>
  );
}
