import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../store/contexts/AuthContext";
import { Icons } from "../Icons/Icons";
import { Input } from "./components/Input/Input";
import { Label } from "./components/Label/Label";
import { FileUploadInput } from "./components/FileUploadInput/FileUploadInput";
import { postsAPI } from "../../store/api";
import { TextArea } from "./components/TextArea/TextArea";
import { SectionItem } from "../SectionItem/SectionItem";

interface AuthFormProps {
  type: "signin" | "signup";
}

function AuthForm({ type }: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailInput.current || !passwordInput.current) return;

    const email = emailInput.current.value;
    const password = passwordInput.current.value;

    if (type === "signin") {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }

    navigate("/");
  };

  const buttonText = type === "signin" ? "Sign In" : "Sign Up";

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <Label htmlFor="email" title="Email" icon={<Icons.EmailIcon />} />
        <Input
          ref={emailInput}
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          required
        />
      </fieldset>
      <fieldset>
        <Label
          htmlFor="password"
          title="Password"
          icon={<Icons.PasswordIcon />}
        />
        <Input
          ref={passwordInput}
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          required
        />
      </fieldset>
      <button type="submit">{buttonText}</button>
    </form>
  );
}

interface CreatePostFormProps {
  onAddPost: () => void;
  onClose: () => void;
}

function CreatePostForm({ onAddPost, onClose }: CreatePostFormProps) {
  const titleInput = useRef<HTMLInputElement>(null);
  const descriptionTextArea = useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      let imageUrl: string | undefined = undefined;
      if (imagePreview) {
        imageUrl = imagePreview;
      }
      if (titleInput && descriptionTextArea) {
        await postsAPI.createPost({
          title: titleInput?.current!.value,
          content: descriptionTextArea?.current!.value,
          image: imageUrl,
        });
      }
      onAddPost();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form action="#">
      <fieldset>
        <Label
          htmlFor="post-title"
          title="Post Title"
          icon={<Icons.EmailIcon />}
        />
        <Input
          ref={titleInput}
          type="text"
          name="post-title"
          id="post-title"
          placeholder="Enter post title"
          required
        />
      </fieldset>
      <fieldset>
        <Label
          htmlFor="post-description"
          title="Description"
          icon={<Icons.PencilIcon />}
        />
        <TextArea
          ref={descriptionTextArea}
          name="post-description"
          id="post-description"
          placeholder="Write description here..."
          required
        />
      </fieldset>
      <FileUploadInput onFileSelect={handleFileSelect}></FileUploadInput>
      <button onClick={handleSubmit}>Create</button>
    </form>
  );
}

interface AddCommentFormProps {
  postId: number;
  onAddComment: (comment: string) => void;
}

function AddCommentForm({ postId, onAddComment }: AddCommentFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmitComment = () => {
    if (comment.trim()) {
      onAddComment(comment.trim());
      setComment("");
    }
  };

  return (
    <>
      <Label
        htmlFor={`comment-${postId}`}
        title="Add a comment"
        icon={<Icons.PencilIcon />}
      />
      <textarea
        name="comment"
        id={`comment-${postId}`}
        placeholder="Write description here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={handleSubmitComment}>Add a comment</button>
    </>
  );
}

function EditProfileForm() {
  const { user } = useAuth();

  return (
    <form action="#">
      <SectionItem
        title={`${user?.firstName} ${user?.secondName}`}
        subtitle="Change profile photo"
        image={user!.profileImage}
      ></SectionItem>
      <fieldset>
        <Label
          htmlFor="username"
          title="Username"
          icon={<Icons.UsernameIcon />}
        />
        <Input type="text" name="username" value={"@" + user?.username} />
      </fieldset>
      <fieldset>
        <Label htmlFor="email" title="Email" icon={<Icons.EmailIcon />} />
        <Input type="email" name="email" value={user?.email} />
      </fieldset>
      <fieldset>
        <Label
          htmlFor="description"
          title="Description"
          icon={<Icons.PencilIcon />}
        />
        <TextArea
          name="description"
          maxLength={200}
          value={user?.description}
        />
        <small>
          <Icons.InfoIcon />
          <p>Max 200 chars</p>
        </small>
      </fieldset>
      <button>Save Profile Changes</button>
    </form>
  );
}

export const Forms = {
  SignInForm: () => <AuthForm type="signin" />,
  SignUpForm: () => <AuthForm type="signup" />,
  CreatePostForm,
  AddCommentForm,
  EditProfileForm,
};
