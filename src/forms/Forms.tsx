import { useAuth } from '../store/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Label } from './components/Label/Label';
import { Icons } from '../components/Icons/Icons';
import { postsAPI, profileApi } from '../utils/api/api';
import { FileUploadInput } from './components/FileUploadInput/FileUploadInput';
import { useUser } from '../store/contexts/UserContext';
import { SectionItem } from '../components/SectionItem/SectionItem';
import { useForm } from 'react-hook-form';
import { useCustomNotification } from '../store/contexts/NotificationContext';
import { useShowError } from '../utils/hooks/useShowError';

interface AuthFormProps {
    type: 'signin' | 'signup';
}

interface AuthFormData {
    email: string;
    password: string;
}

function AuthForm({ type }: AuthFormProps) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors, isValid },
    } = useForm<AuthFormData>({ mode: 'onChange' });
    const { signIn, signUp } = useAuth();
    const { showCustomNotification } = useCustomNotification();
    const showError = useShowError();
    const navigate = useNavigate();

    const onSubmit = async ({ email, password }: AuthFormData) => {
        if (!email || !password) return;

        try {
            const authFunc = type === 'signin' ? signIn : signUp;
            await authFunc(email, password);

            const message = `You signed ${type === 'signin' ? 'in' : 'up'} successfully`;
            showCustomNotification(message, 'success');
            navigate('/');
        } catch (err) {
            showError(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
                <Label
                    htmlFor="email"
                    title="Email"
                    icon={<Icons.EmailIcon />}
                />
                <input
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                    type="email"
                    id="email"
                    placeholder="Enter email"
                    className={errors.email ? 'invalide' : ''}
                />
                {errors.email && (
                    <div className="error-message">
                        <Icons.InfoIcon isValid={false} />
                        <p>{errors.email.message}</p>
                    </div>
                )}
            </fieldset>
            <fieldset>
                <Label
                    htmlFor="password"
                    title="Password"
                    icon={<Icons.PasswordIcon />}
                />
                <input
                    {...register('password', {
                        required: 'Password is required',
                        validate: (value) => {
                            if (value && value.trim().length < 6) {
                                return 'Password must be at least 6 characters';
                            }
                            return true;
                        },
                    })}
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    className={errors.password ? 'invalide' : ''}
                />
                {errors.password && (
                    <div className="error-message">
                        <Icons.InfoIcon isValid={false} />
                        <p>{errors.password.message}</p>
                    </div>
                )}
            </fieldset>
            <button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting
                    ? 'Processing...'
                    : type === 'signin'
                      ? 'Sign In'
                      : 'Sign Up'}
            </button>
        </form>
    );
}

interface CreatePostFormProps {
    onAddPost: () => void;
    onClose: () => void;
}

interface CreatePostFormData {
    title: string;
    content: string;
    image?: string;
}

function CreatePostForm({ onAddPost, onClose }: CreatePostFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { isSubmitting, errors, isValid },
    } = useForm<CreatePostFormData>({ mode: 'onChange' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { showCustomNotification } = useCustomNotification();
    const showError = useShowError();

    useEffect(() => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setValue('image', base64);
            };
            reader.readAsDataURL(selectedFile);
        }
    }, [selectedFile, setValue]);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const onSubmit = async ({ title, content, image }: CreatePostFormData) => {
        try {
            await postsAPI.createPost({
                title,
                content,
                image,
            });
            onAddPost();
            onClose();
            showCustomNotification('Post created successfully', 'success');
        } catch (err) {
            showError(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
                <Label
                    htmlFor="post-title"
                    title="Post Title"
                    icon={<Icons.EmailIcon />}
                />
                <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    id="post-title"
                    placeholder="Enter post title"
                />
                {errors.title && (
                    <div className="error-message">
                        <Icons.InfoIcon isValid={false} />
                        <p>{errors.title.message}</p>
                    </div>
                )}
            </fieldset>
            <fieldset>
                <Label
                    htmlFor="post-description"
                    title="Description"
                    icon={<Icons.PencilIcon />}
                />
                <textarea
                    {...register('content', {
                        required: 'Description is required',
                    })}
                    id="post-description"
                    placeholder="Write description here..."
                    required
                ></textarea>
                {errors.content && (
                    <div className="error-message">
                        <Icons.InfoIcon isValid={false} />
                        <p>{errors.content.message}</p>
                    </div>
                )}
            </fieldset>
            <FileUploadInput onFileSelect={handleFileSelect}></FileUploadInput>
            <button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? 'Creating...' : 'Create'}
            </button>
        </form>
    );
}

interface AddCommentFormProps {
    postId: number;
    onAddComment: (comment: string) => void;
}

interface AddCommentFormData {
    comment: string;
}

function AddCommentForm({ postId, onAddComment }: AddCommentFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { isSubmitting },
    } = useForm<AddCommentFormData>();
    const commentValue = getValues('comment');
    const isCommentEmpty = !commentValue?.trim();

    const onSubmit = ({ comment }: AddCommentFormData) => {
        onAddComment(comment.trim());
        reset();
    };

    return (
        <form className="add-comment-form" onSubmit={handleSubmit(onSubmit)}>
            <Label
                htmlFor={`comment-${postId}`}
                title="Add a comment"
                icon={<Icons.PencilIcon />}
            />
            <textarea
                {...register('comment')}
                id={`comment-${postId}`}
                placeholder="Write description here..."
            />
            <button type="submit" disabled={isSubmitting || isCommentEmpty}>
                {isSubmitting ? 'Adding...' : 'Add a comment'}
            </button>
        </form>
    );
}

interface EditProfileFormData {
    username: string;
    email: string;
    description: string;
    profileImage: string;
}

function EditProfileForm() {
    const { user, refreshUser } = useUser();
    const [previewImage, setPreviewImage] = useState(user?.profileImage || '');
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { isSubmitting, isDirty, errors, isValid },
    } = useForm<EditProfileFormData>({
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            description: user?.description || '',
            profileImage: user?.profileImage || '',
        },
        mode: 'onChange',
    });
    const { showCustomNotification } = useCustomNotification();
    const showError = useShowError();

    const handleImageChange = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const previewUrl = reader.result as string;
                    setPreviewImage(previewUrl);
                    setValue('profileImage', previewUrl, {
                        shouldDirty: true,
                    });
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    };

    const onSubmit = async (data: EditProfileFormData) => {
        try {
            await profileApi.updateProfile(data);
            await refreshUser();
            reset({
                username: data.username,
                email: data.email,
                description: data.description,
                profileImage: data.profileImage,
            });
            showCustomNotification(
                'Profile changes saved successfully',
                'success'
            );
        } catch (err) {
            showError(err);
        }
    };

    return (
        <form className="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
            <SectionItem
                title={`${user?.firstName} ${user?.secondName}`}
                subtitle="Change profile photo"
                image={previewImage}
                onImageChange={handleImageChange}
            ></SectionItem>
            <fieldset>
                <Label
                    htmlFor="username"
                    title="Username"
                    icon={<Icons.UsernameIcon />}
                />
                <input
                    {...register('username', {
                        required: 'Username is required',
                        validate: (value) => {
                            if (value && value.trim().length < 3) {
                                return 'Username must be at least 3 characters';
                            }
                            return true;
                        },
                        maxLength: {
                            value: 30,
                            message: 'Username must be less than 30 characters',
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9_.-]+$/,
                            message:
                                'Username can only contain letters, numbers, underscores, dots, and hyphens',
                        },
                    })}
                    type="text"
                    id="username"
                />
                {errors.username && (
                    <div className="error-message">
                        <Icons.InfoIcon isValid={false} />
                        <p>{errors.username.message}</p>
                    </div>
                )}
            </fieldset>
            <fieldset>
                <Label
                    htmlFor="email"
                    title="Email"
                    icon={<Icons.EmailIcon />}
                />
                <input
                    {...register('email', {
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                        },
                    })}
                    type="email"
                    id="email"
                />
                {errors.email && (
                    <div className="error-message">
                        <Icons.InfoIcon isValid={false} />
                        <p>{errors.email.message}</p>
                    </div>
                )}
            </fieldset>
            <fieldset>
                <Label
                    htmlFor="description"
                    title="Description"
                    icon={<Icons.PencilIcon />}
                />
                <textarea
                    {...register('description', {
                        required: 'Description is required',
                        maxLength: {
                            value: 200,
                            message:
                                'Description must be less than 200 characters',
                        },
                        validate: (value) => {
                            if (value && value.trim().length < 10) {
                                return 'Description must be at least 10 characters if provided';
                            }
                            return true;
                        },
                    })}
                    maxLength={200}
                    id="description"
                ></textarea>
                <small className={isValid ? '' : 'error-message'}>
                    <Icons.InfoIcon isValid={isValid} />
                    <p>
                        {errors.description
                            ? errors.description.message
                            : 'Max 200 chars'}
                    </p>
                </small>
            </fieldset>
            <button
                type="submit"
                disabled={isSubmitting || !isDirty || !isValid}
            >
                {isSubmitting ? 'Saving...' : 'Save Profile Changes'}
            </button>
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
