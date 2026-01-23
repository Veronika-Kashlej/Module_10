import { memo } from 'react';
import './SectionItem.css';
import Image from 'next/image';
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
            {image && (
                <Image
                    src={image}
                    className="section-item-image"
                    width={48}
                    height={48}
                    alt="profile"
                ></Image>
            )}
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
