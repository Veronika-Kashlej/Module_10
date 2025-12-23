import { useState } from "react";
import "./AddCommentForm.css";
import { Icons } from "../../../Icons/Icons";

interface AddCommentFormProps {
  postId: number;
  onAddComment: (comment: string) => void;
}

export function AddCommentForm({ postId, onAddComment }: AddCommentFormProps) {
  const [commentText, setCommentText] = useState("");

  const handleSubmitComment = () => {
    if (commentText.trim()) {
      onAddComment(commentText);
      setCommentText("");
    }
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentText(event.target.value);
  };

  return (
    <>
      <label htmlFor={`comment-${postId}`}>
        <Icons.PencilIcon />
        <span>Add a comment</span>
      </label>
      <textarea
        name="comment"
        id={`comment-${postId}`}
        value={commentText}
        onChange={handleCommentChange}
        placeholder="Write description here..."
      ></textarea>
      <button onClick={handleSubmitComment}>Add a comment</button>
    </>
  );
}
