import { Post } from "./types";

type Action =
  | { type: "LIKE_POST"; payload: { postId: number } }
  | { type: "ADD_COMMENT"; payload: { postId: number; commentText: string } }
  | {
      type: "DELETE_COMMENT";
      payload: { postId: number; commentId: number };
    }
  | { type: "ADD_POST"; payload: { description: string; imageUrl?: string } };

type State = Post[];

export function postsReducer(state: State, action: Action) {
  switch (action.type) {
    case "LIKE_POST": {
      const { postId } = action.payload;
      return state.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        };
      });
    }
    case "ADD_COMMENT": {
      const { postId, commentText } = action.payload;

      return state.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: post.comments.length + 1,
            text: commentText,
            author: "You",
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      });
    }
    case "DELETE_COMMENT": {
      const { postId, commentId } = action.payload;

      return state.map((post) => {
        if (post.id === postId) {
          const filteredComments = post.comments.filter(
            (comment) => comment.id !== commentId
          );
          const updatedComments = filteredComments.map((comment, index) => ({
            ...comment,
            id: index + 1,
          }));
          return {
            ...post,
            comments: updatedComments,
          };
        }
        return post;
      });
    }
    case "ADD_POST": {
      const { description, imageUrl } = action.payload;
      const newPost = {
        id: 1,
        username: "You",
        timeAgo: "3 min ago",
        description: description,
        likes: 0,
        comments: [],
        isLiked: false,
        imageUrl: imageUrl,
      };
      const updatedState = [newPost, ...state];
      return updatedState.map((post, index) => ({
        ...post,
        id: index,
      }));
    }
    default:
      return state;
  }
}
