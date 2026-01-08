import { memo } from 'react';
import './SectionItem.css';

type SectionItemParams = {
    title: string;
    subtitle: string;
    image: string;
    onImageChange?: () => void;
};

export const SectionItem = memo(function SectionItem({
    title,
    subtitle,
    image,
    onImageChange,
}: SectionItemParams) {
    return (
        <div className="section-item">
            <img className="section-item-image" src={image} alt="profile"></img>
            <div className="section-item-info">
                <p className="section-item-title">{title}</p>
                <p
                    className="section-item-subtitle"
                    onClick={onImageChange}
                    style={{ cursor: onImageChange ? 'pointer' : 'default' }}
                >
                    {subtitle}
                </p>
            </div>
        </div>
    );
});
