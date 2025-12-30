import { useEffect, useState } from "react";
import { AddCommentForm } from "./components/AddCommentForm/AddCommentForm";
import { CommentList } from "./components/CommentList/CommentList";
import { useAuth } from "../../../../../../store/contexts/AuthContext";
import { postsAPI } from "../../../../../../store/api";
import { Comment } from "../../../../../../store/types";

interface CommentsProps {
  postId: number;
  areVisibleComments: boolean;
  onChangeCommentsCount: (count: number) => void;
}
export function Comments({
  postId,
  areVisibleComments,
  onChangeCommentsCount,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await postsAPI.getComments(postId);
        setComments(response.data);
        onChangeCommentsCount(response.data.length);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };
    fetchComments();
  }, [isAuthenticated, onChangeCommentsCount, postId]);

  const handleDeleteComment = async (commentId: number) => {
    await postsAPI.deleteComment(commentId);
    setComments([...comments.filter((comment) => comment.id !== commentId)]);
    onChangeCommentsCount(comments.length - 1);
  };

  const handleAddComment = async (text: string) => {
    if (!text.trim()) return;
    await postsAPI.createComment({ postId, text });
    const newComment = {
      authorId: user!.id,
      creationDate: Date.now().toString(),
      id: comments.length + 1,
      text,
      modifiedDate: "",
      postId: postId,
    };
    setComments([...comments, newComment]);
    onChangeCommentsCount(comments.length + 1);
  };

  return (
    <>
      <CommentList
        areVisibleComments={areVisibleComments}
        onDeleteComment={handleDeleteComment}
        comments={comments}
      />
      <AddCommentForm postId={postId} onAddComment={handleAddComment} />
    </>
  );
}
