import { SectionItem } from "../../../../components/SectionItem/SectionItem";
import "./PostCard.css";
import { useEffect, useState } from "react";
import { LikedPost, Post, User } from "../../../../store/types";
import { Icons } from "../../../../components/Icons/Icons";
import { useAuth } from "../../../../store/contexts/AuthContext";
import { Comments } from "./components/Comments/Comments";
import { LikesSection } from "./components/Likes/LikesSection";
import { postsAPI } from "../../../../store/api";

interface PostCardProps {
  post: Post;
  likedPosts: LikedPost[];
}

export function PostCard({ post, likedPosts }: PostCardProps) {
  const [areVisibleComments, setAreVisibleComments] = useState(false);
  const { isAuthenticated } = useAuth();
  const [commentsCount, setCommentsCount] = useState(post.commentsCount + 1);
  const [author, setAuthor] = useState<User | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await postsAPI.getUser(post.authorId);
        setAuthor(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthor();
  }, []);

  const handleToggleComments = () => {
    setAreVisibleComments(!areVisibleComments);
  };

  const handleCommentsCountChange = (newCount: number) => {
    setCommentsCount(newCount);
  };

  const formatCreationDate = (date: string) => {
    const now = Date.now();
    const creationDate = new Date(date).getTime();
    const difference = now - creationDate;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (isNaN(creationDate) || seconds === 0) {
      return "Just now";
    }
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (days < 7) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (weeks < 4) {
      return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
    } else if (months < 12) {
      return `${months} month${months !== 1 ? "s" : ""} ago`;
    } else {
      return `${years} year${years !== 1 ? "s" : ""} ago`;
    }
  };

  return (
    <article className="post-card">
      <SectionItem
        title={`${author?.firstName} ${author?.secondName}`}
        subtitle={formatCreationDate(post.creationDate)}
        image={author?.profileImage || "assets/user-helena.png"}
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
