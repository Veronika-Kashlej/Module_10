import { SectionItemSkeleton } from '../SectionItemSkeleton/SectionItemSkeleton';

export function PostSkeleton() {
    return (
        <article className="post-card">
            <SectionItemSkeleton />
            <div className="post-image"></div>
        </article>
    );
}
