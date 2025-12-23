import { Comment } from "../../../../store/types";
import { Icons } from "../../../Icons/Icons";
import "./CommentList.css";
interface CommentListProps {
  comments: Comment[];
  shouldShowComments: boolean;
  onDeleteComment: (commentId: number) => void;
}

export function CommentList({
  comments,
  shouldShowComments,
  onDeleteComment,
}: CommentListProps) {
  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="comment-item"
          style={{ display: shouldShowComments ? "flex" : "none" }}
        >
          <p>
            #{comment.id}. {comment.text}
          </p>
          <Icons.TrashIcon onClick={() => onDeleteComment(comment.id)} />
        </div>
      ))}
    </div>
  );
}
