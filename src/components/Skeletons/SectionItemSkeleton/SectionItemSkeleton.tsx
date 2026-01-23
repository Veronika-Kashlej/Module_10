import './SectionItemSkeleton.css';

export function SectionItemSkeleton() {
    return (
        <div className="section-item skeleton">
            <div className="section-item-image skeleton"></div>
            <div className="section-item-info skeleton">
                <div className="section-item-title skeleton"></div>
                <div className="section-item-subtitle skeleton"></div>
            </div>
        </div>
    );
}
