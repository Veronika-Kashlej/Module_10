import { memo } from 'react';

export const PostDescription = memo(function PostDescription({
    content,
}: {
    content: string;
}) {
    return <p className="post-description">{content}</p>;
});
